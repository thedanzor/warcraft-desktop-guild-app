// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const message = require('../message/');
const getData = require('../../utils/request');

// @public - Fetch Guild
const fetchGuild = (guild, realm) => {
	message('Checking Warcraft database for guild');

	// Collect client id.
	const state = getState();
	const client_id = state.credentials.client_id;

	// Assume its an EU guild for now
	const api_url = 'https://eu.api.battle.net';
	const url = api_url +
		'/wow/guild/' +
		realm + '/' + guild +
		'?fields=members&locale=en_GB&apikey=' + client_id;

	// Try to fetch the data
	getData(url).then( response => {
		// Update state and users with response.
		message('Guild found!');
		emit('fetched_guild', response)
	}, (error) => {
		message('No guild found!');
		return null;
	})
}

module.exports = fetchGuild;
