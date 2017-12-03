const electron = require('electron').remote;
const Datastore = require('nedb');
const db = new Datastore({ filename: './data/app.db', autoload: true });

// Appication Components
const login_component = require('./components/login');
const setup_component = require('./components/setup');
const fetch_members = require('./components/fetch_members');

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

	// Set the application state
	setState(appState);

	// Initialize the components.
	login_component(comp);
	fetch_members(comp);
	bnet();

	// Look in the database to see if we have already setup the app.
	// Otherwise we load the setup component.
	db.find({ 'desktop_app_setup': 'yes' }, (error, data) => {
		if (data.length === 0) {
			setup_component(comp);
		} else {
			setState(data[0]);
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

	document.querySelector('.close_app').addEventListener('click', () => {
		const currentWindow = electron.getCurrentWindow();
		currentWindow.close();
	})
};
application_start();
