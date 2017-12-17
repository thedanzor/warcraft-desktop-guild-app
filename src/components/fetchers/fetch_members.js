// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const getData = require('../../utils/request');
const message = require('../message/');

const template = require('../../views/loading');

// When done we want to close the component.
const clearcomponent = () => {
	component_wrapper.querySelector('.loading_panel').className = 'loading_panel';
};

// @public - Fetch Members
const fetchMembers = component_wrapper => {
	// Build the template.
	const view = document.createElement('div');
	view.className = 'loading_wrapper';
	view.innerHTML = template;

	// Append the view.
	component_wrapper.append(view);

	// When the action is dispatched to fetch the latest roster.
	on('fetch_members', (data) => {
		// Show loading
		component_wrapper.querySelector('.loading_panel').className += ' active';

		// Get state and update initial loading state.
		const state = getState();
		const credentials = state.credentials;
		const current = component_wrapper.querySelector('.num_in');
		const outOf = component_wrapper.querySelector('.num_of');
		outOf.innerHTML = data.members.length;

		// Helper function for building url for characters.
		const buildCharacterUrl = function (character) {
			// Build API URL for the member
			const url = 'https://eu.api.battle.net' + '/wow/character/' +
				character.realm + '/' +
				character.name + '?fields=items&locale=en_GB&apikey=' +
				credentials.client_id;
			return url;
		};

		// We look through the members in a way we can output the data.
		let iterations = 0;
		let characters = [];
		function processMember ({character}) {
			iterations++
			current.innerHTML = iterations;

			if (!character) {
				message('Successfully grabbed all max-level characters');
			} else {
				if (character.level !== 110) {
					processMember(data.members[iterations]);
					message('Skipping none max-level character');
					clearcomponent();
				} else {
					const memberUrl = buildCharacterUrl(character);
					message('Processing Character: ' + character.name);

					getData(memberUrl).then( (response) => {
						characters.push(response);
						processMember(data.members[iterations]);
					}, (error) => {
						processMember(data.members[iterations]);
					});

				}
			}
		};
		processMember(data.members[iterations])
	})
};

module.exports = fetchMembers;
