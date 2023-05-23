(function () {
	'use strict';

	const body = document.body;

	/* -----------------------------------------
	 WooCommerce plus minus
	 ----------------------------------------- */
	const quantityButtons = body.querySelectorAll('.qty-btn');

	quantityButtons.forEach(function (btn) {
		btn.addEventListener('click', function (event) {
			event.preventDefault();

			const input = event.target.parentNode.querySelector('input[type="number"]');
			const placeholder = parseInt(input.getAttribute('placeholder')) || 0;
			const min = parseInt(input.getAttribute('min') || 0, 10);
			const max = parseInt(input.getAttribute('max') || 99999, 10);
			const currentVal = parseInt(input.value, 10) || placeholder;
			const isMinus = event.target.classList.contains('qty-minus');

			if (isMinus) {
				input.value = Math.max(currentVal - 1, min);
			} else {
				input.value = Math.min(currentVal + 1, max);
			}

			const changeEvent = new Event('change');
			input.dispatchEvent(changeEvent);
		});
	});


	/* -----------------------------------------
	Shop filters toggle
	----------------------------------------- */
	const filtersWrap = document.querySelector('.sidebar-drawer');
	const filtersToggle = document.querySelector('.shop-filter-toggle');
	const filtersDismiss = document.querySelector('.sidebar-dismiss');

	function isFiltersVisible() {
		return body.classList.contains('sidebar-drawer-visible');
	}

	function dismissFilters(event) {
		event.preventDefault();
		body.classList.remove('sidebar-drawer-visible');
		body.focus();
	}

	function displayFilters(event) {
		event.preventDefault();
		body.classList.add('sidebar-drawer-visible');
		filtersWrap.focus();
		event.stopPropagation();
	}

	filtersToggle.addEventListener('click', displayFilters);
	filtersDismiss.addEventListener('click', dismissFilters);

	/* Event propagations */
	document.addEventListener('keydown', function (event) {
		if (event.keyCode === 27 && isFiltersVisible()) {
			dismissFilters(event);
		}
	});

	body.addEventListener('click', function (event) {
			if (!filtersWrap) {
				return;
			}

			// Instead of event.stopPropagation inside the sidebar
			// which can break functionality from 3rd party plugins
			// we check if the element is part of the sidebar
			// and prevent the sidebar from closing if true.
			if (event.target.closest('.sidebar-drawer')) {
				return;
			}

			if (isFiltersVisible()) {
				dismissFilters(event);
			}

			const targetElements = document.querySelectorAll('.shop-filter-toggle, .category-search-input, .category-search-select');

			targetElements.forEach(function (elem) {
				elem.addEventListener('click', function (event) {
					event.stopPropagation();
				})
			});
		});
})();
