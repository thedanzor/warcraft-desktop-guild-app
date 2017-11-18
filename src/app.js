// Appication Components
const login_component = require('./components/login');

// Application Utils
const { getState, setState } = require('./utils/application_state');
const { on, emit } = require('./utils/application_events');

// Start the application.
const application_start = () => {
	on('application_change', (change) => {
		console.log(change);
	});

	// get the wrappers.
	const app = document.querySelector('.application');
	const comp = document.querySelector('.component_wrapper');

	// Set the application state
	setState({
		id: 'app',
		app,
		comp,
		activeComponent: 'none'
	});

	// Initialize the components.
	login_component(comp);
};
application_start();
