(function () {
	'use strict';

	const body = document.body;

	/* -----------------------------------------
	Shop filters toggle && Mini Cart visibility
	----------------------------------------- */
	const miniCartTrigger = document.querySelector( '.header-mini-cart-trigger' );
	const miniCart = document.querySelector( '.header-mini-cart-contents' );

	function isMiniCartVisible() {
		const rect = miniCart.getBoundingClientRect();

		return (
			rect.width > 0 &&
			rect.height > 0 &&
			rect.top < window.innerHeight &&
			rect.left < window.innerWidth &&
			miniCart.style.display !== 'none' &&
			miniCart.style.visibility !== 'hidden'
		);
	}

	function dismissMiniCart() {
		miniCart.classList.remove('visible');

		miniCart.style.transition = 'opacity 500ms ease-in-out';
		miniCart.style.opacity = 0;

		setTimeout(function () {
			miniCart.style.opacity = 0;
			miniCart.style.display = 'none';
		}, 200);
	}

	function displayMiniCart() {
		miniCart.classList.add('visible');

		miniCart.style.opacity = 0;
		miniCart.style.display = 'block';
		miniCart.style.transition = 'opacity 500ms ease-in-out';

		setTimeout(function () {
			miniCart.style.opacity = 1;
		}, 200);

	}

	miniCartTrigger.addEventListener('click', function (event) {
		event.preventDefault();

		if (isMiniCartVisible()) {
			dismissMiniCart();
		} else {
			displayMiniCart();
		}
	});


	/* Event propagations */
	document.addEventListener('keydown', function (event) {
		if (event.keyCode === 27 && isMiniCartVisible()) {
			dismissMiniCart(event);
		}
	});


	body.addEventListener('click', function (event) {
		if(!event.target.closest('.head-mini-cart-wrap') && isMiniCartVisible()) {
			dismissMiniCart();
		}
	});
})();
