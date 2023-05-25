jQuery( function ( $ ) {
	'use strict';

	$('.open-ignition-wc-login-popup').magnificPopup({
		type: 'inline',
		mainClass: 'ignition-wc-login-popup',
		midClick: true
	});
});

(function () {
	'use strict';

	const wcLoginWrapper = document.querySelector('.ignition-wc-login-wrapper');
	const wcLoginForm = wcLoginWrapper.querySelector('.woocommerce-form-login');

	wcLoginForm.addEventListener('submit', function (event) {

		const form = event.target;
		const notices = form.parentNode.querySelectorAll('.ignition-wc-login-notices');
		const username = form.querySelector('#username');
		const password   = form.querySelector('#password');
		const rememberme = form.querySelector('#rememberme');
		let error;

		notices.forEach(function (notice) {
			notice.querySelector('div').remove();
		});

		if (username.value === '' ) {
			ignitionWCLoginPopupShowError(username);
			error = true;
		} else {
			ignitionWCLoginPopupHideError(username);
		}

		if (password.value === '' ) {
			ignitionWCLoginPopupShowError(password);
			error = true;
		} else {
			ignitionWCLoginPopupHideError(password);
		}

		if (error) {
			notices.forEach(function (notice) {
				const msgDiv = document.createElement('div');
				msgDiv.classList.add('msg', 'failure');
				msgDiv.textContent = ignition_wc_popup.fields_required;
				notice.appendChild(msgDiv);
			});
			return false;
		}

		notices.forEach(function (notice) {
			const msgDiv = document.createElement('div');
			msgDiv.classList.add('loading');
			msgDiv.textContent = ignition_wc_popup.loading_message;
			notice.appendChild(msgDiv);
		});

		notices.forEach(function (notice) {
			notice.querySelector('.msg').remove();
		});

		async function loginRequest() {
			try {
				const response = await fetch(ignition_wc_popup.ajax_url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						action: 'ignition_wc_popup_ajax_login',
						username: username.value,
						password: password.value,
						rememberme: rememberme.checked,
						nonce: form.querySelector('#woocommerce-login-nonce').value,
					})
				});

				const data = await response.json();
				// return data;

				if (data.success) {
					await handleSuccess(data);
				} else {
					await handleReject(data);
				}

			} catch (error) {
				await handleError(error);
			}
		}

		loginRequest();

		async function handleSuccess(response) {
			notices.forEach(function (notice) {
				notice.querySelector('.loading').remove();

				const msgDiv = document.createElement('div');
				msgDiv.classList.add('loading');
				msgDiv.textContent = response.data.message;
				notice.appendChild(msgDiv);
			});

			if ( response.data.redirect !== false ) {
				window.location = response.data.redirect;
			} else {
				window.location.reload();
			}
		}

		async function handleReject(response) {
			if (response.data.invalid_username) {
				ignitionWCLoginPopupShowError(username);
			} else {
				ignitionWCLoginPopupHideError(username);
			}
			if (response.data.incorrect_password) {
				ignitionWCLoginPopupShowError(password);
			} else {
				ignitionWCLoginPopupHideError(password);
			}

			notices.forEach(function (notice) {
				const msgDiv = document.createElement('div');
				msgDiv.classList.add('msg', 'failure');
				msgDiv.textContent = response.data.message;
				notice.appendChild(msgDiv);
			})

		}

		async function handleError(error) {
			notices.forEach(function (notice) {
				const msgDiv = document.createElement('div');
				msgDiv.classList.add('msg', 'failure');
				msgDiv.textContent = ignition_wc_popup.ajax_error;
				notice.appendChild(msgDiv);
			});
		}

		event.preventDefault();
	});

	function ignitionWCLoginPopupShowError(element) {
		element.classList.add('error');
	}

	function ignitionWCLoginPopupHideError(element) {
		element.classList.remove( 'error' );
	}

})();
