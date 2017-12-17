// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const message = require('../components/message/');
const getData = require('../../utils/request');

// @public - Fetch Guild
const fetchGuild = () => {
	on('fetch_guild', (token) => {
		message('Checking Warcraft database for guild');

		// Set Token
		const currentState = getState();
		const appState = currentState.app;

		appState.token = token;
		setState(appState);

		// Assume its an EU guild for now
		const api_url = 'https://eu.api.battle.net';
		const url = api_url +
			'/wow/guild/' +
			server + '/' + guild +
			'?fields=members&locale=en_GB&apikey=' + client_id;

		// Try to fetch the data
		getData(url).then( (response) => {
			// Update state and users with response.
			emit('Initialized', response);
			message('Guild found!');

			// Inserting data into guild database.
			db.insert(response, (error, newDocs) => {
				if (!error) {
					message('Guild Added to database!');
				}
			});

			// Set new application state.
			const currentState = getState();
			const appState = currentState.app;

			appState.guild = guild;
			appState.server = server;

			setState(appState);

		}, (error) => {
			message('Error: no guild found with these details');
		})
	})
}

module.exports = fetchGuild;
