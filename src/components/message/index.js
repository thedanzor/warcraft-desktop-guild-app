// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');

// Set component id.
const component_id = 'message';
const wrapper = document.querySelector('.application_message');

// @public - Login component
const message = (message) => {
	// Display the message
	if (message) {
		wrapper.innerHTML = message;
	}
}

module.exports = message;
