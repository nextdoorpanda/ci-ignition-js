(function () {
	'use strict';

	const body = document.body;

	/* -----------------------------------------
	Shop filters toggle && Mini Cart visibility
	----------------------------------------- */
	const miniCartTrigger = document.querySelector( '.header-mini-cart-trigger' );
	const miniCart = document.querySelector( '.header-mini-cart-contents' );

	//TODO: Maybe also check for display/visibility properties?
	function isMiniCartVisible() {
		const rect = miniCart.getBoundingClientRect();
		return (
			rect.width > 0 &&
			rect.height > 0 &&
			rect.top < window.innerHeight &&
			rect.left < window.innerWidth
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

	miniCartTrigger.addEventListener('click', function (e) {
		e.preventDefault();

		if (isMiniCartVisible()) {
			dismissMiniCart();
		} else {
			displayMiniCart();
		}
	});


	/* Event propagations */
	document.addEventListener('keydown', function (e) {
		e = e || window.e;
		if (e.keyCode === 27 && isMiniCartVisible()) {
			dismissMiniCart(e);
		}
	});


	$body
		.on( 'click', function ( event ) {
			if ( $(event.target).parents('.head-mini-cart-wrap').length === 0 && isMiniCartVisible() ) {
				dismissMiniCart();
			}
		} );
})();
