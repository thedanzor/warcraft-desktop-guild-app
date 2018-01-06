const Datastore = require('nedb');
const electron = require('electron').remote;
const db = new Datastore({ filename: './build/data/app.db', autoload: true });

// Routes
const routes = require('./routes');

// Bnet oAuth
const bnet = require('./bnet/bnet');

// Application Utils
const { getState, setState } = require('./utils/application_state');
const { on, emit } = require('./utils/application_events');

// Start the application.
const application_start = () => {
	// Get the wrappers.
	const app = document.querySelector('.application');
	const comp = document.querySelector('.component_wrapper');

	// Build the application state.
	const appState = {
		id: 'app',
		app,
		comp,
		activeComponent: 'none'
	}

	// Set the application state.
	setState(appState);

	// Initialize the battle.net oAuth component.
	bnet();

	// Check in the database to see if we have already setup the app.
	// Otherwise send the user to the login component.
	db.find({ 'desktop_app_setup': 'yes' }, (error, data) => {
		if (data.length === 0) {
			routes('login/init');
		} else {
			setState(data[0]);
			routes('login');
		}
	});

	// When we get verified_credentials we want to store them in the database.
	on('verified_credentials', (data) => {
		data.id = 'credentials';
		data.desktop_app_setup = 'yes';
		data.token = '';
		setState(data);

		// Write to the database to store the credentials for later.
		db.insert(data, (error, newDocs) => {});
	});


	on('authenticated', (token) => {
		const appState = getState();
		const credentials = appState.credentials;

		credentials.token = token;
		setState(credentials);

		// Write to the database to store the credentials for later.
		db.update({ 'desktop_app_setup': 'yes' }, credentials, {}, (error, numberReplaced) => {});
	});

	// Allow users to close the application.
	document.querySelector('.close_app').addEventListener('click', () => {
		const currentWindow = electron.getCurrentWindow();
		currentWindow.close();
	});
};
application_start();
