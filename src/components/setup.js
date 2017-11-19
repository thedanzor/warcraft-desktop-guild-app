// Application components / utils.
const { getState, setState } = require('../utils/application_state');
const { on, emit } = require('../utils/application_events');
const message = require('../components/message');
const template = require('../views/setup');
const getData = require('../utils/request');
const validateDetails = require('../utils/init_validate');

// Set component id.
const component_id = 'setup';

// @public - Login component
const setup = component_wrapper => {
	// Handle State Change
	on('stateChange', (change) => {
		// DO SOMETHING.
	});

	const componentState = {
		api: '',
		guild: '',
		server: ''
	};

	// We do not want to brute-force the DOM with innerHTML
	// So we do it in memory.
	const templateWrapper = document.createElement('div');
	templateWrapper.className += 'setup_wrapper';
	templateWrapper.innerHTML = template;

	// Render view;
	component_wrapper.querySelector('.login_panel').append(templateWrapper);
	message('Initializing App...');

	// Fade in component
	setTimeout(() => {
		component_wrapper.querySelector('.setup_inner').className += ' display';
	}, 2000);

	// Validate commponent is ready
	const apiField = component_wrapper.querySelector('.api_field');
	const guildField = component_wrapper.querySelector('.guild_field');
	const serverField = component_wrapper.querySelector('.server_field');
	const submitButton = component_wrapper.querySelector('.submit_button');

	if (!apiField || !guildField || !serverField || !submitButton) {
		message('Error Initializing App');
		return;
	}

	// Add event listeners
	apiField.addEventListener('input', ({ target }) => {
		if (target) {
			const { value } = target;

			componentState.api = value;
		}
	});
	guildField.addEventListener('input', ({ target }) => {
		if (target) {
			const { value } = target;

			componentState.guild = value;
		}
	});
	serverField.addEventListener('input', ({ target }) => {
		if (target) {
			const { value } = target;

			componentState.server = value;
		}
	});

	submitButton.addEventListener('click', () => {
		validateDetails(componentState);
	});

	// On Success
	on('Initialized', (data) => {
		// Show loading
		component_wrapper.querySelector('.loading_panel').className += ' active';

		// Get state and update initial loading state.
		const state = getState();
		const appState = state.app;
		const current = component_wrapper.querySelector('.num_in');
		const outOf = component_wrapper.querySelector('.num_of');
		outOf.innerHTML = data.members.length;

		// Helper function for building url for characters.
		const buildCharacterUrl = function (character) {
			// Build API URL for the member
			const url = 'https://eu.api.battle.net' + '/wow/character/' +
				character.realm + '/' +
				character.name + '?fields=items&locale=en_GB&apikey=' +
				appState.key;
			return url;
		};

		// We look through the members in a way we can output the data.
		let iterations = 0;
		function processMember ({character}) {
			console.log(character);
			iterations++
			current.innerHTML = iterations;

			if (!character) {
				message('Successfully grabbed all max-level characters');
			} else {
				if (character.level !== 110) {
					processMember(data.members[iterations]);
					message('Skipping none max-level character');
				} else {
					const memberUrl = buildCharacterUrl(character);

					message('Processing Character' + character.name);

					getData(memberUrl).then( (response) => {
						processMember(data.members[iterations]);
					}, (error) => {
						message('ERROR! Processing Character' + character.name);
						processMember(data.members[iterations]);
					});

				}
			}
		};

		processMember(data.members[iterations])
	})

}

module.exports = setup;
