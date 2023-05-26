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

	document.querySelector('.ignition-wc-login-wrapper .woocommerce-form-login').addEventListener('submit', function (event) {
		event.preventDefault();

		const form = event.target;
		const notices = form.parentNode.querySelectorAll('.ignition-wc-login-notices');
		const username = form.querySelector('#username');
		const password   = form.querySelector('#password');
		const rememberme = form.querySelector('#rememberme');
		let error;

		notices.forEach(function (notice) {
			notice.innerHTML = '';
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
			notice.querySelectorAll('.msg').forEach(function (msg) {
				msg.remove();
			});
		});

		fetch(ignition_wc_popup.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'ignition_wc_popup_ajax_login',
				username: username.value,
				password: password.value,
				rememberme: rememberme.checked,
				nonce: form.querySelector('#woocommerce-login-nonce').value
			})
		})
			.then(function(response) {
				if (response.ok) {
					return response.json();
				} else {
					console.log(error);
				}
			})
			.then(function(response) {
				notices.forEach(function(notice) {
					notice.querySelectorAll('.loading').forEach(function(loading) {
						loading.remove();
					});
					if (response.success) {
						const msgDiv = document.createElement('div');
						msgDiv.classList.add('loading');
						msgDiv.textContent = response.data.message;
						notice.appendChild(msgDiv);

						if (response.data.redirect !== false) {
							window.location = response.data.redirect;
						} else {
							window.location.reload();
						}
					} else {
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
						const msgDiv = document.createElement('div');
						msgDiv.classList.add('msg', 'failure');
						msgDiv.textContent = response.data.message;
						notice.appendChild(msgDiv);
					}
				});
			})
			.catch(function(error) {
				notices.forEach(function(notice) {
					const msgDiv = document.createElement('div');
					msgDiv.classList.add('msg', 'failure');
					msgDiv.textContent = ignition_wc_popup.ajax_error;
					notice.appendChild(msgDiv);
				});
			});
	});

	function ignitionWCLoginPopupShowError(element) {
		element.classList.add('error');
	}

	function ignitionWCLoginPopupHideError(element) {
		element.classList.remove('error');
	}

})();
