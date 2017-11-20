// Main dependencies
const bnetAuth = require('./bnet_electron');

// Login and Authenticate with Bnet
const bNetAuth = () => {
	// Build config.
	var config = {
		client_id: '',
		client_secret: '',
		redirect_uri: 'https://localhost',
		callbackURL: 'https://localhost',
		response_type: 'code',
		scope: 'wow.profile'
	};

	var urls = {
		authorizationUrl: 'https://eu.battle.net/oauth/authorize',
		tokenUrl: 'https://eu.battle.net/oauth/token',
	}

	const windowParams = {
		alwaysOnTop: true,
		autoHideMenuBar: true,
		webPreferences: {
				nodeIntegration: false
		}
	}

	const myApiOauth = bnetAuth(urls, config, windowParams);
	myApiOauth.getAuthorizationCode(config)
		.then(response => {
			console.log('I WORKED', response);
		}, function(reason) {
			console.log(reason);
		});

	// const options = {
	// 	scope: 'wow.profile',
	// 	grant_type: 'authorization_code',
	// 	redirectUri: 'http://localhost'
	// };

	// myApiOauth.getAccessToken(options)
	// 	.then(token => {
	// 		console.log('I WORKED 2', token);
	//
	// 		myApiOauth.refreshToken(token.refresh_token)
	// 			.then(newToken => {
	// 				//use your new token
	// 			});
	// 	});
}

module.exports = bNetAuth;
