// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const getData = require('../../utils/request');
const message = require('../message/');

const template = require('../../views/loading');

// @public - Fetch Members
const fetchMembers = (component_wrapper, data) => {
	// Show loading
	component_wrapper.querySelector('.loading_panel').className += ' active';

	// Get state and update initial loading state.
	const current = component_wrapper.querySelector('.num_in');
	component_wrapper.querySelector('.num_of').innerHTML = data.members.length;

	if (!current) {
		message('Error loadin the roster');
		return;
	}

	const state = getState();
	const client_id = state.credentials.client_id;

	// Helper function for building url for characters.
	const buildCharacterUrl = function (character) {
		// Build API URL for the member
		const url = 'https://eu.api.battle.net' + '/wow/character/' +
			character.realm + '/' +
			character.name + '?fields=items&locale=en_GB&apikey=' +
			client_id;
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
			console.log(characters);
		} else {
			if (character.level !== 110) {
				processMember(data.members[iterations]);
				message('Skipping none max-level character');
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
	processMember(data.members[iterations]);
};

module.exports = fetchMembers;
