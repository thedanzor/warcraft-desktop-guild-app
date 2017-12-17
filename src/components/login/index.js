// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const getData = require('../../utils/request');
const message = require('../message/');

// Template
const template = require('./view_login');

// Set component id.
const component_id = 'login';

// @public - Login component
const login = component_wrapper => {
	// We are Initializing so we setup our initial state.
	setState({
		id: component_id,
		set: true
	})

	// Render view;
	component_wrapper.innerHTML = template;

	const loginButton = document.querySelector('.login-bnet');

	// Component logic starts here
	loginButton.addEventListener('click', () => {
		const body = document.querySelector('body');
		// Setup login state.
		message('Signing in to battle.net to authenticate');
		component_wrapper.querySelector('.app_login').setAttribute('style', 'opacity: 0.6;');
		body.className += 'loading';

		// Get the token ready for login.
		const appState = getState();
		const accessToken = appState.credentials.token;

		const tokenUrl = 'https://eu.api.battle.net/wow/user/characters?access_token=';
		const requestUrl = tokenUrl + accessToken.access_token;

		// Try logging in.
		getData(requestUrl).then( (response) => {
			console.log(response);
			body.className = '';
			message('Success, processing your account');
		}, (error) => {
			on('re_authenticated', (response) => {
				const newRequestUrl = tokenUrl + response.access_token;

				getData(newRequestUrl).then( (response) => {
					console.log(response);
					body.className = '';
					message('Success, processing your account');
				}, (error) => {
					message('There is an error with your account');
				})
			})

			emit('re_authenticate', appState.credentials);
		})
	});
}

module.exports = login;
