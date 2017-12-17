// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const message = require('../message/');
const template = require('./view_setup');

// Set component id.
const component_id = 'setup';

// @public - Login component
const setup = component_wrapper => {
	const componentState = {
		client_id: '',
		client_secret: '',
	};

	// We do not want to brute-force the DOM with innerHTML
	// So we do it in memory.
	const templateWrapper = document.createElement('div');
	templateWrapper.className += 'setup_wrapper';
	templateWrapper.innerHTML = template;

	// Render view;
	component_wrapper.querySelector('.login_panel').append(templateWrapper);
	message('Initializing App...');

	// Validate commponent is ready
	const apiField = component_wrapper.querySelector('.api_field');
	const secretField = component_wrapper.querySelector('.secret_field');
	const submitButton = component_wrapper.querySelector('.submit_button');

	if (!apiField || !secretField) {
		message('Error Initializing App');
		return;
	}

	// Add event listeners
	apiField.addEventListener('input', ({ target }) => {
		if (target) {
			const { value } = target;

			componentState.client_id = value;
		}
	});
	secretField.addEventListener('input', ({ target }) => {
		if (target) {
			const { value } = target;

			componentState.client_secret = value;
		}
	});

	submitButton.addEventListener('click', () => {
		message('Signing in to battle.net to authenticate');

		emit('authenticate', {
			client_id: componentState.client_id,
			client_secret: componentState.client_secret
		});

		on('authenticated', () => {
			message('You can now login using your battle.net account');
			templateWrapper.setAttribute('style', 'display: none;');
		})
	});
}

module.exports = setup;
