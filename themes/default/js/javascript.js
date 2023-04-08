
// Custom vars
var DEBUG = 5;
var TIMEOUT = 30000;
var LONGTIMEOUT = 600000;
var STATUSINTERVAL = 5000;

// Global vars
var EMAIL;
var FOLDER;
var LAB;
var LANG;
var NAME;
var ROLE;
var TENANT;
var USERNAME;
var ATTACHMENTS;
var UPDATEID;
var HTML5;
var LOCK = 0;
var isIE = getInternetExplorerVersion() > -1;
var FOLLOW_WRAPPER_IMG_STATE = 'resized'
var EVE_VERSION = "PNET";

$(document).ready(function () {
	if ($.cookie('privacy') != 'true') {
		// Cookie is not set, show a modal with privacy policy
		console.log('DEBUG: need to accept privacy.');
		$.cookie('privacy', 'true', {
			expires: 90,
			path: '/'
		});
		if ($.cookie('privacy') == 'true') {
			window.location.reload();
		}
	} else {
		// Privacy policy already been accepted, check if user is already authenticated
		$.when(getUserInfo()).done(function () {
			postLogin();
		}).fail(function (data) {
			location.href = "/";
		});
	}
	var timer;
	$(document).on('click', '#alert_container', function (e) {
		if (timer) {
			clearTimeout(timer);
		}

		var container = $(this).next().first();
		container.slideToggle(300);
		setTimeout(function () {
			container.slideUp(300);
		}, 2700);

	});
});


$.ajaxPrefilter("json", function (options, originalOptions) {

	if (originalOptions.type.toLowerCase() == 'post') {
		if (typeof (originalOptions.contentType) == 'undefined') {
			options.data = JSON.stringify(originalOptions.data || null);
			options.contentType = "application/json"
		}
	}

});


