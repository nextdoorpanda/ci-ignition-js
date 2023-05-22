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
		return $body.hasClass('sidebar-drawer-visible');
	}

	function dismissFilters(event) {
		if (event) {
			event.preventDefault();
		}
		$body.removeClass('sidebar-drawer-visible');
	}

	function displayFilters(event) {
		if (event) {
			event.preventDefault();
		}
		$body.addClass('sidebar-drawer-visible')
	}

	$filtersToggle.on('click', displayFilters);
	$filtersDismiss.on('click', dismissFilters);

	/* Event propagations */
	$(document).on('keydown', function (event) {
		if (event.keyCode === 27) {
			dismissFilters(event);
		}
	});

	$body
		.on('click', function (event) {
			if (!$filtersWrap.length) {
				return;
			}

			// Instead of event.stopPropagation inside the sidebar
			// which can break functionality from 3rd party plugins
			// we check if the element is part of the sidebar
			// and prevent the sidebar from closing if true.
			if ($(event.target).parents('.sidebar-drawer').length > 0) {
				return;
			}

			if (isFiltersVisible()) {
				dismissFilters();
			}
		})
		.find('.shop-filter-toggle, ' +
			'.category-search-input ',
			'.category-search-select')
		.on('click', function (event) {
			event.stopPropagation();
		});
})();
