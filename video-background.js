(function () {
	'use strict';

	/* -----------------------------------------
	 Page Hero Video Backgrounds
	 ----------------------------------------- */
	const videoBg = document.querySelector('.page-hero-video-background');
	const videoWrap = videoBg.closest('.page-hero-video-wrap');
	const body = document.querySelector('body');

	// YouTube videos
	function onYouTubeAPIReady(videoBg) {
		if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
			return setTimeout(onYouTubeAPIReady.bind(null, videoBg), 333);
		}

		const video = videoBg.querySelector('div');
		const ytPlayer = new YT.Player(video, {
			videoId: videoBg.dataset.videoId,
			playerVars: {
				autoplay: 1,
				controls: 0,
				showinfo: 0,
				modestbranding: 1,
				loop: 1,
				playlist: videoBg.dataset.videoId,
				fs: 0,
				cc_load_policy: 0,
				iv_load_policy: 3,
				autohide: 0,
				start: parseInt(videoBg.dataset.videoStart, 10) || undefined,
			},
			events: {
				onReady: function (event) {
					event.target.mute();
					event.target.playVideo();
				},
				onStateChange: function (event) {
					if (event.data === YT.PlayerState.PLAYING) {
						videoWrap.classList.add('visible');
						adjustVideoSize();
					}
				}
			}
		});
	}

	// Vimeo videos
	function onVimeoAPIReady(videoBg) {
		if (typeof Vimeo === 'undefined' || typeof Vimeo.Player === 'undefined') {
			return setTimeout(onVimeoAPIReady.bind(null, videoBg), 333);
		}

		const startTime = parseInt(videoBg.dataset.videoStart, 10) || undefined;

		const player = new Vimeo.Player(videoBg, {
			id: videoBg.dataset.videoId,
			loop: true,
			autoplay: true,
			byline: false,
			title: false,
			autopause: false,
			muted: true,
		});

		player.setVolume(0);

		if (startTime) {
			player.setCurrentTime(startTime);
		}

		player.on('play', function () {
			videoWrap.classList.add('visible');
			adjustVideoSize();
		});
	}

	function onSelfHostedVideo() {
		const source = videoBg.dataset.videoId;
		const nativeVideo = document.createElement('video');
		nativeVideo.src = source;

		const selfHostedVideoAttributes = ['autoplay', 'muted', 'loop', 'playsinline'];

		selfHostedVideoAttributes.forEach(function (attr) {
			nativeVideo[attr] = true;
		})

		nativeVideo.addEventListener('playing', function () {
			videoWrap.classList.add('visible');
		});

		videoBg.append(nativeVideo);
		window.removeEventListener('resize', handleVideoResize);
	}

	let videoResizeTimer;

	function handleVideoResize() {
		clearTimeout(videoResizeTimer);
		videoResizeTimer = setTimeout( function () {
			adjustVideoSize();
		}, 350 );
	}

	window.addEventListener( 'resize', handleVideoResize);

	function getVideoSize() {
		const containerWidth = videoWrap.offsetWidth;
		const containerHeight = videoWrap.offsetHeight;
		const aspectRatio = 16/9;
		const ratioWidth = containerWidth / aspectRatio;
		const ratioHeight = containerHeight * aspectRatio;
		const isWidthFixed = (containerWidth / containerHeight) > aspectRatio;

		return {
			width: isWidthFixed ? containerWidth : ratioHeight,
			height: isWidthFixed ? ratioWidth : containerHeight,
		}
	}

	function adjustVideoSize() {
		const size = getVideoSize();
		const iframe = videoBg.querySelector('iframe');

		iframe.style.width = `${size.width}px`;
		iframe.style.height = `${size.height}px`;
	}

	if (videoBg && window.innerWidth > 1080) {
			const firstScript = body.querySelector('script');
			const videoType = videoBg.dataset.videoType;

			if (videoType === 'youtube') {
				if (!document.querySelector('#youtube-api-script')) {
					const tag = document.createElement('script');
					tag.setAttribute('id', 'youtube-api-script');
					tag.setAttribute('src', 'https://www.youtube.com/player_api');
					firstScript.parentNode.prepend(tag);
				}
				onYouTubeAPIReady(videoBg);
			} else if (videoType === 'vimeo') {
				if (!document.querySelector('#vimeo-api-script')) {
					const tag = document.createElement('script');
					tag.setAttribute('id', 'vimeo-api-script');
					tag.setAttribute('src', 'https://player.vimeo.com/api/player.js');
					firstScript.parentNode.prepend(tag);
				}
				onVimeoAPIReady(videoBg);
			} else if (videoType === 'self') {
				onSelfHostedVideo();
			}
	}
})();
