const getData = require('./request');
const { on, emit } = require('../utils/application_events');
const { getState, setState } = require('../utils/application_state');
const message = require('../components/message');

// @public - Validate
const validate = ({api, server, guild}) => {
	if (!api || !server || !guild) {
		return;
	}

	message('Checking Warcraft database for guild');

	// Assume its an EU guild for now
	const api_url = 'https://eu.api.battle.net';
	const url = api_url +
		'/wow/guild/' +
		server + '/' + guild +
		'?fields=members&locale=en_GB&apikey=' + api;

	// Try to fetch the data
	getData(url).then( (response) => {
		emit('Initialized', response);
		message('Guild found!');

		const currentState = getState();
		const appState = currentState.app;

		appState.api = api;
		appState.guild = guild;
		appState.server = server;

		setState(appState);

	}, (error) => {
		message('Error: no guild found with these details');
	})
}

module.exports = validate;
