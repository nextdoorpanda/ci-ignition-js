(function () {
	'use strict';

	// const windowObj = window;
	const body = document.body;
	const isRTL = body.classList.contains('rtl');

	/* -----------------------------------------
	 Responsive Menu Init
	 ----------------------------------------- */
	const navWrap = document.querySelector('.nav');
	const navSubmenus = navWrap ? navWrap.querySelectorAll('ul') : null;
	// const navSubmenus = navWrap.querySelectorAll( 'ul' );
	const mainNav = document.querySelectorAll('.navigation-main');
	// const mainNav = document.querySelector('.navigation-main');
	const mobileNav = document.querySelector('.navigation-mobile-wrap');
	const mobileNavTrigger = document.querySelector('.mobile-nav-trigger');
	const mobileNavDismiss = document.querySelector('.navigation-mobile-dismiss');

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

	mobileNavTrigger.addEventListener('click', function (event) {
		event.preventDefault();
		body.classList.add('mobile-nav-open');
		mobileNavDismiss.focus();
	});

	mobileNavDismiss.addEventListener('click', function (event) {
		event.preventDefault();
		body.classList.remove('mobile-nav-open');
		mobileNavTrigger.focus();
	});


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

	window.addEventListener('resize', function (e) {
		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(function () {
			setMenuClasses();
		}, 350)
	});


	/* -----------------------------------------
	Main nav smooth scrolling
	----------------------------------------- */
	// (function () {
	// 	const mainMenuNavs = mainNav.forEach(function (item) {
	// 		item.querySelectorAll('a[href*="#"]');
	// 	});
	//
	// 	// console.log('main', mainMenuNavs);
	// 	const mobileMenuNavs = mobileNav.querySelectorAll('a[href*="#"]');
	// 	// console.log('mob', mobileMenuNavs);
	// })();
	// // const mainMenuNavs = mainNav[0].querySelectorAll('a[href*="#"]');
	// // console.log(mainNav)
	// // console.log(mainMenuNavs);
	//
	// (function () {
	// 	var $mainMenuNavs = $mainNav.find('a[href*="#"]');
	// 	var $mobileMenuNavs = $mobileNav.find('a[href*="#"]');
	// 	var $navs = $mainMenuNavs.add($mobileMenuNavs).filter(function () {
	// 		var href = $(this).attr('href');
	// 		return href !== '#' &&
	// 			href !== 'http://#' &&
	// 			href !== 'https://#' &&
	// 			href !== '#mobilemenu' &&
	// 			href !== '#nav-dismiss'
	// 	});
	//
	// 	if (!$navs.length || !$mainNav.hasClass('nav-smooth-scroll')) {
	// 		return;
	// 	}
	//
	// 	var offset = 85;
	//
	// 	$navs.on('click', function (event) {
	// 		// Check if the element exists on page before continuing
	// 		var $target = $(this.hash);
	//
	// 		if ($target.length === 0) {
	// 			return;
	// 		}
	//
	// 		event.preventDefault();
	//
	// 		if ($target.length && ! $target.hasClass('elementor-menu-anchor')) {
	// 			mobileNavDismiss();
	//
	// 			$('html, body').animate({
	// 				scrollTop: $target.offset().top - offset,
	// 			}, 500);
	// 		}
	// 	});
	//
	// 	// Mark nav items active on scroll
	// 	var scrollTimer;
	//
	// 	$window.on('scroll', (function () {
	// 		clearTimeout(scrollTimer);
	//
	// 		scrollTimer = setTimeout(function () {
	// 			// Assign active class to nav links while scolling
	// 			$navs.each(function () {
	// 				var $this = $(this);
	// 				var hash = $this.prop('hash');
	// 				var section = $(hash).get(0);
	//
	// 				if (!section) {
	// 					return;
	// 				}
	//
	// 				var sectionTop = section.getBoundingClientRect().top;
	//
	// 				if (sectionTop > 0 && sectionTop < window.innerHeight / 2) {
	// 					$this.parent().addClass('current-scroll-menu-item current-menu-item');
	// 				} else {
	// 					$this.trigger('blur');
	// 					$this.parent().removeClass('current-scroll-menu-item current-menu-item current_page_item');
	// 				}
	// 			});
	// 		}, 150);
	// 	})).scroll();
	// }());

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

		window.addEventListener('scroll', function (e) {
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
	const searchTrigger = document.querySelector('.global-search-form-trigger');
	const searchDismiss = document.querySelector('.global-search-form-dismiss');
	const headSearchForm = document.querySelector('.global-search-form');

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

	body.addEventListener('click', function (e) {
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
});
