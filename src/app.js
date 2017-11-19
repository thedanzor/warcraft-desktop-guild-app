// Appication Components
const login_component = require('./components/login');
const setup_component = require('./components/setup');

// Application Utils
const { getState, setState } = require('./utils/application_state');
const { on, emit } = require('./utils/application_events');

// Start the application.
const application_start = () => {
	on('application_change', (change) => {
		console.log(change);
	});

	// Get the wrappers.
	const app = document.querySelector('.application');
	const comp = document.querySelector('.component_wrapper');

	// Build the application state.
	const appState = {
		id: 'app',
		app,
		comp,
		activeComponent: 'none'
	}

	// TODO: check local storage if the application has a valid API key.
	if (true) {
		appState.init = false;
	}

	// Set the application state
	setState(appState);

	// Initialize the components.
	login_component(comp);

	// If the app is not setup, display the setup component.
	if (!appState.init) {
		setup_component(comp);
	}
};
application_start();
