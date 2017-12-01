const Datastore = require('nedb');
const db = new Datastore({ filename: './data/app.db', autoload: true });

// Appication Components
const login_component = require('./components/login');
const setup_component = require('./components/setup');

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

	// oAuth
	bnet();
	// Set the application state
	setState(appState);
	// Initialize the components.
	login_component(comp);

	// Look in the database to see we have have already setup.
	db.find({ 'desktop_app_setup': 'yes' }, (error, data) => {
		if (data.length === 0) {
			setup_component(comp);
		} else {
			setState(data);
		}
	});

	// When we get verified_credentials we want to store them in the database.
	on('verified_credentials', (data) => {
		data.id = 'credentials';
		data.desktop_app_setup = 'yes';
		setState(data);

		// Write to the database to store the credentials for later.
		db.insert(data, (err, newDocs) => {});
	});
};
application_start();
