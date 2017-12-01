// Main dependencies
const bnetAuth = require('./bnet_electron');

// App utils
const { on, emit } = require('../utils/application_events');
const message = require('../components/message');

// Login and Authenticate with Bnet
const battleNet = () => {
	// Build config.
	var config = {
		redirect_uri: 'https://localhost',
		callbackURL: 'https://localhost',
		response_type: 'code',
		scope: 'wow.profile',
		authorizationUrl: 'https://eu.battle.net/oauth/authorize',
		tokenUrl: 'https://eu.battle.net/oauth/token',
	};

	// Build a new window.
	const windowParams = {
		alwaysOnTop: true,
		autoHideMenuBar: true,
		webPreferences: {
				nodeIntegration: false
		}
	}

	// We have been asked to authenticate a user.
	on('authenticate', ({client_id, client_secret}) => {
		config.client_id = client_id;
		config.client_secret = client_secret;

		bnetAuth.init(config, windowParams);
		bnetAuth.getAuthorizationCode()
			.then(response => {
				bnetAuth.getAccessToken()
					.then(response => {
						emit('verified_credentials', config);
						emit('authenticated', response);
					}, function(reason) {
						message('ERROR: could not secure an access token');
					});
			}, function(reason) {
				message('ERROR: Invalid client_id and client_secret');
			});
	});
};

module.exports = battleNet;
