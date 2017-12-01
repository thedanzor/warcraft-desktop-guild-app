const Datastore = require('nedb');
const db = new Datastore({ filename: './data/guilds.db', autoload: true });

// App dependencies
const getData = require('./request');
const { on, emit } = require('../utils/application_events');
const { getState, setState } = require('../utils/application_state');
const message = require('../components/message');

// @public - Validate
const validate = ({client_id, client_secret, server, guild}) => {
	if (!client_id || !client_secret || !server || !guild) {
		message('All fields are needed to continue...');
		return;
	}

	message('Signing in to battle.net to authenticate');

	emit('authenticate', {
		client_id: client_id,
		client_secret: client_secret
	});

	on('authenticated', (token) => {
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

module.exports = validate;
