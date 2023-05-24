/**
 * Ajax Product Search
 *
 * @since 1.5.0
 */

(function () {
	'use strict';

	const body = document.body;

	const searchFormWrap = document.querySelector('.ignition-wc-search-form-wrap');
	const searchForm = document.querySelector('.ignition-wc-search-form');

	/* -----------------------------------------
	 Ajax Product Search Toggle
	 ----------------------------------------- */
	const searchTrigger = document.querySelector('.ignition-wc-search-form-trigger');
	const searchDismiss = document.querySelector('.ignition-wc-search-form-dismiss');

	function dismissWCSearch(event) {
		event.preventDefault();
		searchFormWrap.classList.remove('ignition-wc-search-form-expanded');
		body.focus();
	}

	function displayWCSearch(event) {
		event.preventDefault();
		searchFormWrap.classList.add('ignition-wc-search-form-expanded');
		searchFormWrap.querySelector('input').focus();
		event.stopPropagation();
	}

	function isWCSearchVisible() {
		return searchFormWrap.classList.contains('ignition-wc-search-form-expanded');
	}

	if (searchTrigger) {
		searchTrigger.addEventListener('click', displayWCSearch);
		searchDismiss.addEventListener('click', dismissWCSearch);
	}


	/* Event propagations */
	document.addEventListener('keydown', function (event) {
		if (event.keyCode === 27 && isWCSearchVisible()) {
			dismissWCSearch(event);
		}
	});

	body.addEventListener('click', function (event) {
		if (isWCSearchVisible()) {
			dismissWCSearch(event);
		}

		const searchFormElements = document.querySelectorAll('.ignition-wc-search-form, .ignition-wc-search-form-trigger');

		searchFormElements.forEach(function (elem) {
			elem.addEventListener('click', function (event) {
				event.stopPropagation();
			});
		});
	});


	/* -----------------------------------------
	 Ajax Product Search
	 ----------------------------------------- */
	const categoriesSelect = document.querySelector('.ignition-wc-search-select');
	const searchInput = document.querySelector('.ignition-wc-search-input');
	const categoryResults = document.querySelector('.ignition-wc-search-results');
	const categoryResultsTemplate = document.querySelector('.ignition-wc-search-results-item');
	const spinner = document.querySelector('.ignition-wc-search-spinner');

	function dismissSearchResults() {
		categoryResults.style.display = 'none';
	}

	async function queryProducts(category, string) {
		try {
			const response = await fetch(ignition_wc_search.ajax_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'ignition_wc_search_products',
					product_cat: category,
					s: string,
				})
			});

			const data = await response.json();
			return data;

		} catch (error) {
			console.log(error);
		}
	}

	async function queryProductsAndPopulateResults(category, string) {
		if (string.trim().length < 3) {
			dismissSearchResults();
			return;
		}

		searchFormWrap.classList.add('is-loading');

		try{
			const response = await queryProducts(category, string);
			searchFormWrap.classList.remove('is-loading');
			categoryResults.innerHTML = '';

			if (response.error) {
				const errorMessage = categoryResultsTemplate.cloneNode(true);
				const errorString = response.errors.join(', ');

				errorMessage.querySelector('.ignition-wc-search-results-item-thumb').remove();
				errorMessage.querySelector('.ignition-wc-search-results-item-excerpt').remove();
				errorMessage.querySelector('.ignition-wc-search-results-item-price').remove();

				errorMessage.classList.add('error');
				errorMessage.querySelector('.ignition-wc-search-results-item-title').textContent = errorString;
				categoryResults.append(errorMessage);
				categoryResults.style.display = 'block';

				return;
			}

			const products = response.data;

			if (!products) {
				const notFoundMessage = categoryResultsTemplate.cloneNode(true);
				notFoundMessage.querySelector('.ignition-wc-search-results-item-thumb').remove();
				notFoundMessage.querySelector('.ignition-wc-search-results-item-excerpt').remove();
				notFoundMessage.querySelector('.ignition-wc-search-results-item-price').remove();
				notFoundMessage.querySelector('.ignition-wc-search-results-item-title').textContent = ignition_wc_search.search_no_products;
				categoryResults.append(notFoundMessage)
				categoryResults.style.display = 'block';

				return;
			}

			const items = products.map(function (product) {
				categoryResults.innerHTML = '';
				const template = categoryResultsTemplate.cloneNode(true);
				template.querySelector('a').setAttribute('href', product.url);

				if (!product.image) {
					template.querySelector('.ignition-wc-search-results-item-thumb').remove();
				} else {
					template.querySelector('.ignition-wc-search-results-item-thumb').innerHTML = product.image;
				}
				template.querySelector('.ignition-wc-search-results-item-title').textContent = product.title;
				template.querySelector('.ignition-wc-search-results-item-excerpt').textContent = product.excerpt;
				template.querySelector('.ignition-wc-search-results-item-price').innerHTML = product.price;

				return template;
			});

			items.forEach(function (item) {
				categoryResults.append(item);
			});

			categoryResults.style.display = 'block';

		} catch (error) {
			console.log(error);
		}

	}

	const debouncedQuery = debounce(queryProductsAndPopulateResults, 500);

	if (searchForm.classList.contains('form-ajax-enabled')) {
		const searchInputEvents = ['change', 'keyup', 'focus'];
		[...searchInputEvents].forEach(function (event) {
			searchInput.addEventListener(event, async function (event) {
				// Do nothing on arrow up / down as we're using them for navigation
				// Also ignore left/right.
				const ignoreKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Escape'];

				if (ignoreKeys.includes(event.key)) {
					return;
				}

				const string = event.target.value;

				if (string.trim().length < 3) {
					dismissSearchResults();
					return;
				}

				debouncedQuery(categoriesSelect.value, string);

			});
		});

		// Bind up / down arrow navigation on search results
		searchInput.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				dismissSearchResults();
			}

			if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
				return;
			}

			const items = [...categoryResults.children];
			const highlighted = categoryResults.querySelector('.highlighted');
			const currentIndex = items.indexOf(highlighted);

			if (!items) {
				return;
			}

			if (event.key === 'ArrowDown') {
				const next = items[currentIndex + 1];

				if (next) {
					items.forEach(function (item) {
						item.classList.remove('highlighted');
					});
					next.classList.add('highlighted');
				}
				event.preventDefault();
			}

			if (event.key === 'ArrowUp') {
				const prev = items[currentIndex - 1];

				if (prev) {
					items.forEach(function (item) {
						item.classList.remove('highlighted');
					});
					prev.classList.add('highlighted');
				}
				event.preventDefault();
			}
		});

		// Bind form submit to go the highlighted item on submit
		// instead of normal search
		searchForm.addEventListener('submit', function (event) {
			const highlighted = categoryResults.querySelector('.highlighted');

			if (highlighted) {
				event.preventDefault();
				window.location = highlighted.querySelector('a').getAttribute('href');
			}
		});
	}

	body.addEventListener('click', function (event) {
		if (isWCSearchVisible()) {
			dismissSearchResults(event);
		}

		const searchResultsElements = document.querySelectorAll('.ignition-wc-search-input, .ignition-wc-search-select');

		searchResultsElements.forEach(function (elem) {
			elem.addEventListener('click', function (event) {
				event.stopPropagation();
			});
		});
	});


	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	function debounce(func, wait, immediate) {
		let timeout;
		return function (...args) {
			if (immediate && !timeout) {
				func(...args);
			}
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				func(...args);
			}, wait);
		}
	}

})();
