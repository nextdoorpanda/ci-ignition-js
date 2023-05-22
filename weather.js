(function () {
	'use strict';

	/* -----------------------------------------
	 Weather
	 ----------------------------------------- */
	function ignitionShowWeather( container, weather_data ) {
		if ( weather_data.error ) {
			return;
		}

		const temp = container.querySelector('.theme-weather-temperature-value');
		const unit = container.querySelector('.theme-weather-temperature-unit');
		const location = container.querySelector('.theme-weather-location');

		temp.innerHTML = Math.round(weather_data.temperature);
		unit.innerHTML = weather_data.units_symbol;
		location.innerHTML = weather_data.location_formatted;
	}

	const weather = document.querySelectorAll('.theme-weather');

	weather.forEach(function (item) {
		const locationId = item.dataset.locationId;
		const units = item.dataset.units;

		const weather_key = `ignition-weather-data-${units}-${locationId}`;
		const weather_fetch_time_key = `${weather_key}-fetch-time`;

		const apiHitRate = 1000 * 60 * 5;
		const runTime = Date.now();
		const fetchTime = localStorage.getItem(weather_fetch_time_key);

		const response = JSON.parse( localStorage.getItem(weather_key) );
		if (response) {
			ignitionShowWeather(item, response);
		}

		if (!fetchTime || (runTime - parseInt(fetchTime)) > apiHitRate) {

			async function getWeatherData() {
				try {
					const url = `${ignition_weather_vars.ajaxurl}?action=ignition_get_weather_conditions&weather_nonce=${ignition_weather_vars.weather_nonce}&location_id=${locationId}&units=${units}`;
					const response = await fetch(url, {cache: 'no-cache'});
					const data = await response.json();

					if(response.ok && !data.error) {
						localStorage.setItem(weather_fetch_time_key, Date.now());
						localStorage.setItem(weather_key, JSON.stringify(data));
						ignitionShowWeather(item, data);
					} else {
						console.log('Error fetching data: ', data.errors[0])
					}

				} catch (error) {
					console.error('Ignition weather module :: ', error);
				}
			}

			getWeatherData();
		}
	});

})();
