const { on, emit } = require('./application_events');

let state = {};

// This will ensure the main wrapper has the correct class set.
const updateDom = (componentId) => {
	if (componentId) {
		state['app'].app.className = 'application ' + componentId;
		state['app'].comp.innerHTML = '';
	}
};

// Set the correct new state
const setCorrectApp = (newState) => {
	// Unset old state.
	if (state[state.app.activeComponent]) {
		state[state.app.activeComponent].set = false;
	}

	// Set new state
	state.app.activeComponent = newState.id;
	updateDom(newState.id);

	emit('state_change', {
		setComponent: newState.id
	})
};

// @public - Set the application state.
const setState = (newState) => {
	state[newState.id] = newState;

	// If we are updating a different component than the app
	// we want to see if a new component has been set.
	if (newState.id !== 'app' && newState.set) {
		setCorrectApp(newState);
	} else {
		emit('application_change', newState);
	}
}

// @public - Get the application state.
const getState = () => {
	return state;
}

module.exports = {
	setState,
	getState
};
