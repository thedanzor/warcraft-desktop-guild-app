// Application components / utils.
const { getState, setState } = require('../utils/application_state');
const { on, emit } = require('../utils/application_events');
const template = require('../views/login');

// Set component id.
const component_id = 'login';

// @public - Login component
const login = component_wrapper => {
	// Handle State Change
	on('stateChange', (change) => {
		console.log(change);
	});

	// We are Initializing so we setup our initial state.
	setState({
		id: component_id,
		set: true
	})

	// Render view;
	component_wrapper.innerHTML = template;

	// Component logic starts here.
}

module.exports = login;
