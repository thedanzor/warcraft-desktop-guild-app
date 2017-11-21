const Promise = require('pinkie-promise');
const queryString = require('querystring');
const fetch = require('node-fetch');
const objectAssign = require('object-assign');
const nodeUrl = require('url');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

// We are going to store the credentials here.
let CONFIG = {};
let windowParams;

// We want the user to pass along the API key and other info.
const init = (options, windowParams) => {
	CONFIG = options;
	windowParams = windowParams;
};

// Get the Authentication code we need to grab tokens.
const getAuthorizationCode = () => {

	const options = {
		client_id: CONFIG.client_id,
		client_secret: CONFIG.client_secret,
		redirect_uri: CONFIG.redirect_uri,
		response_type: 'code',
		scope: CONFIG.scope
	}

	const url = CONFIG.authorizationUrl + '?' + queryString.stringify(options);

	return new Promise(function (resolve, reject) {
		const authWindow = new BrowserWindow(windowParams || {'use-content-size': true});
		authWindow.loadURL(url);
		authWindow.show();

		authWindow.on('closed', () => {
			reject(new Error('window was closed by user'));
		});

		function onCallback(url) {
			const url_parts = nodeUrl.parse(url, true);
			const query = url_parts.query;
			const code = query.code;
			const error = query.error;

			if (error !== undefined) {
				// Return error
				reject(error);

				authWindow.removeAllListeners('closed');
				setImmediate(function () {
					authWindow.close();
				});

			} else if (code) {
				CONFIG.code = code;

				// Return resolved
				resolve(code);

				authWindow.removeAllListeners('closed');
				setImmediate(function () {
					authWindow.close();
				});

			}
		}

		authWindow.webContents.on('will-navigate', (event, url) => {
			onCallback(url);
		});

		authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
			onCallback(newUrl);
		});
	});
};

// Get access tokens in the background.
const getAccessToken = () => {
	const header = {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded'
	};

	const data = {
		code: CONFIG.code,
		client_id: CONFIG.client_id,
		client_secret: CONFIG.client_secret,
		grant_type: 'authorization_code',
		scope: CONFIG.scope,
		redirect_uri: CONFIG.redirect_uri
	}

	const url = CONFIG.tokenUrl + '?' + queryString.stringify(data);

	return fetch(url, {
		method: 'POST',
		headers: header
	}).then(res => {
		return res.json();
	});
}

module.exports = {
	init,
	getAuthorizationCode,
	getAccessToken
};
