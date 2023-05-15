(function () {
	'use strict';

	const body = document.body;

	/* -----------------------------------------
	 Responsive Menu Init
	 ----------------------------------------- */
	const navWrap = document.querySelector('.nav');
	const navSubmenus = navWrap ? navWrap.querySelectorAll('ul') : null;
	// const navSubmenus = navWrap.querySelectorAll( 'ul' );
	const mainNav = document.querySelectorAll('.navigation-main');
	// const mainNav = document.querySelector('.navigation-main');
	const mobileNav = document.querySelector('.navigation-mobile-wrap');
	const mobileNavTriggerElement = document.querySelector('.mobile-nav-trigger');
	const mobileNavDismissElement = document.querySelector('.navigation-mobile-dismiss');

	mainNav.forEach(function (item) {
		const itemClass = item.classList.contains('navigation-mobile') ? '.navigation-mobile' : '.navigation-main';
		const listItems = item.cloneNode(true).querySelectorAll(itemClass + ' > li');

		listItems.forEach(function (item) {
			item.removeAttribute('id');
			mobileNav.querySelector('.navigation-mobile').append(item);
		});
	});

	mobileNav.querySelectorAll('li').forEach(function (item) {
		if (item.querySelector('.sub-menu')) {
			const btn = document.createElement('button');
			btn.classList.add('menu-item-sub-menu-toggle');
			item.appendChild(btn);
		}
	});

	const mobileToggle = mobileNav.querySelectorAll('.menu-item-sub-menu-toggle');

	mobileToggle.forEach(function (item) {
		item.addEventListener('click', function (event) {
			event.preventDefault();
			item.parentNode.classList.toggle('menu-item-expanded');
		})
	});

	mobileNavTriggerElement.addEventListener('click', function (event) {
		event.preventDefault();
		mobileNavTrigger();
	});

	mobileNavDismissElement.addEventListener('click', function (event) {
		event.preventDefault();
		mobileNavDismiss();
	});

	function mobileNavDismiss() {
		body.classList.remove('mobile-nav-open');
		mobileNavTriggerElement.focus();
	}

	function mobileNavTrigger() {
		body.classList.add('mobile-nav-open');
		mobileNavDismissElement.focus();
	}


	/* -----------------------------------------
	Menu classes based on available free space
	----------------------------------------- */
	function setMenuClasses() {
		if (navWrap.offsetParent === null || navSubmenus === null) {
			return;
		}

		const windowWidth = window.innerWidth;

		navSubmenus.forEach(function (el) {
			const parent = el.parentNode;
			parent.classList.remove('nav-open-left');

			const rect = el.getBoundingClientRect();
			const leftOffset = rect.left + window.scrollX + el.offsetWidth;

			if (leftOffset > windowWidth) {
				parent.classList.add('nav-open-left');
			}
		});
	}

	setMenuClasses();

	let resizeTimer;

	window.addEventListener('resize', function () {
		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(function () {
			setMenuClasses();
		}, 350)
	});


	/* -----------------------------------------
	Main nav smooth scrolling
	----------------------------------------- */
	(function () {
		let mainMenuNavs;
		let mainNavContainsSmoothScroll;

		mainNav.forEach(function (item) {
			mainMenuNavs = item.querySelectorAll('a[href*="#"]');

			if (item.classList.contains('nav-smooth-scroll')){
				mainNavContainsSmoothScroll = true;
			}
		});

		const mobileMenuNavs = mobileNav.querySelectorAll('a[href*="#"]');

		const filteredMobileLinks = Array.from(mobileMenuNavs).filter(function (item) {
			const rejectedHrefs = ['#', 'http://#', 'https://#', '#mobilemenu', '#nav-dismiss'];
			return !rejectedHrefs.includes(item.getAttribute('href'))
		});

		const navs = [...mainMenuNavs, ...filteredMobileLinks];

		if (!navs.length || !mainNavContainsSmoothScroll) {
			return;
		}

		const offset = 85;

		navs.forEach(function (el) {
			el.addEventListener('click', function (e) {
				// Check if the element exists on page before continuing
				const target = document.querySelector(el.hash);

				if (!target) {
					return;
				}

				e.preventDefault();

				if (target && !target.classList.contains('elementor-menu-anchor')) {
					mobileNavDismiss();

					const targetPosition = target.getBoundingClientRect();

					window.scrollTo({
						top: targetPosition.top - offset,
						behavior: 'smooth',
					});
				}
			});
		});


		// Mark nav items active on scroll
		let scrollTimer;

		window.addEventListener('scroll', function () {
			clearTimeout(scrollTimer);

			scrollTimer = setTimeout(function () {
				// Assign active class to nav links while scrolling
				navs.forEach(function (el) {
					const section = document.querySelector(el.hash);

					if (!section) {
						return;
					}

					const sectionTop = section.getBoundingClientRect().top;

					if (sectionTop > 0 && sectionTop < window.innerHeight / 2) {
						section.parentNode.classList.add('current-scroll-menu-item', 'current-menu-item');
					} else {
						section.dispatchEvent(new Event('blur'));
						section.parentNode.classList.remove('current-scroll-menu-item', 'current-menu-item', 'current_page_item');
					}

				});
			}, 150);
		});
	}());

	/* -----------------------------------------
	Focus trapping
	----------------------------------------- */
	document.querySelectorAll('[data-set-focus]').forEach(function (item) {
		const selector = item.getAttribute('data-set-focus');
		const element = document.querySelector(selector);

		item.addEventListener('blur', function () {
			if (element) {
				element.focus();
			}
		})
	});


	/* -----------------------------------------
	 Back to top button
	 ----------------------------------------- */
	const btnTop = document.querySelector('.btn-to-top');

	if (btnTop !== null) {
		btnTop.addEventListener('click', function (e) {
			e.preventDefault();

			//TODO: fix scrolling speed (.animate 'fast' === 200ms)
			window.scrollTo({top: 0, behavior: 'smooth'});
		});


		let scrollTimer;

		window.addEventListener('scroll', function () {
			clearTimeout(scrollTimer);

			scrollTimer = setTimeout(function () {
				if (window.scrollY > 400) {
					btnTop.classList.add('btn-to-top-visible');
				} else {
					btnTop.classList.remove('btn-to-top-visible');
				}
			}, 250);
		});
	}

	/* -----------------------------------------
	 Header Search Toggle
	 ----------------------------------------- */
	(function () {
		const headSearchForm = document.querySelector('.global-search-form');

		if(!headSearchForm) {
			return;
		}

		const searchTrigger = document.querySelector('.global-search-form-trigger');
		const searchDismiss = document.querySelector('.global-search-form-dismiss');

		function dismissHeadSearch(e) {
			if (e) {
				e.preventDefault();
			}

			headSearchForm.classList.remove('global-search-form-expanded');
			body.focus();
		}

		function displayHeadSearch(e) {
			if (e) {
				e.preventDefault();
			}

			headSearchForm.classList.add('global-search-form-expanded');
			headSearchForm.querySelector('input').focus();
		}

		function isHeadSearchVisible() {
			return headSearchForm.classList.contains('global-search-form-expanded');
		}

		if (searchTrigger) {
			searchTrigger.addEventListener('click', displayHeadSearch);
			searchDismiss.addEventListener('click', dismissHeadSearch);
		}

		/* Event propagations */
		document.addEventListener('keydown', function (e) {
			e = e || window.e;
			if (e.keyCode === 27 && isHeadSearchVisible()) {
				dismissHeadSearch(e);
			}
		});

		body.addEventListener('click', function () {
			if (isHeadSearchVisible()) {
				dismissHeadSearch();
			}

			const searchFormElements = document.querySelectorAll('.global-search-form, .global-search-form-trigger');

			searchFormElements.forEach(function (elem) {
				elem.addEventListener('click', function (e) {
					e.stopPropagation();
				})
			});
		});
	}());


	/* -----------------------------------------
	 Category Filters
	 ----------------------------------------- */
	const filtersWrap = document.querySelectorAll('.ci-item-filters');

	filtersWrap.forEach(function (item) {
		const filters = item.querySelectorAll('.ci-item-filter');
		const row = item.parentNode.querySelector('.row-items');
		const allItems = row.querySelectorAll('[class*="col"]');

		function removeActiveClass() {
			filters.forEach(function (el) {
				el.classList.remove('filter-active');
			});
		}

		filters.forEach(function (el) {
			el.addEventListener('click', function (e) {
				e.preventDefault();
				removeActiveClass();
				el.classList.add('filter-active');

				const classes = el.getAttribute('data-filter');
				const items = row.querySelectorAll(classes);

				//TODO: Refactor following code (too much repetition)

				if (classes === '*') {
					allItems.forEach(function (item) {
						item.style.transition = 'opacity 500ms';
						item.style.opacity = 0;

						setTimeout(function () {
							item.style.opacity = 1;
							item.style.display = 'block';
						}, 200);

					});
					return;
				}

				Array.from(allItems).forEach(item => {
					if (!Array.from(items).includes(item)) {
						item.style.transition = 'opacity 500ms';
						item.style.opacity = 0;
					}

					setTimeout(function () {
						Array.from(allItems).forEach(function (item) {
							item.style.transition = 'opacity 500ms';
							if (!Array.from(items).includes(item)) {
								item.style.display = 'none';
								item.style.opacity = 0;
							} else {
								item.style.display = 'block';
								item.style.opacity = 1;
							}
						});
					}, 200);
				});

			});
		});
	});
})();

jQuery(function ($) {
	'use strict';

	var $body = $('body');
	var isRTL = $body.hasClass('rtl');

	/* -----------------------------------------
	Instagram Widget
	----------------------------------------- */
	var $instagramWrap = $('.footer-widget-area');
	var $instagramWidget = $instagramWrap.find('.zoom-instagram-widget__items');

	if ( $instagramWidget.length ) {
		var auto  = $instagramWrap.data('auto');
		var speed = $instagramWrap.data('speed');

		$instagramWidget.slick({
			slidesToShow: 8,
			slidesToScroll: 3,
			arrows: false,
			autoplay: auto == 1,
			speed: speed,
			rtl: isRTL,
			responsive: [
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 4
					}
				}
			]
		});
	}
}());
