// Main Dependencies
const electron = require('electron');
const path = require('path');
const url = require('url');

// App Dependencies
const { on, emit } = require('./utils/application_events');

// Application variables
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object,
// to not cause buggy behaviour.
let mainWindow;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		autoHideMenuBar: true
	});

	mainWindow.setFullScreen(true);

	// and load the index.html of the app.
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'scaffold.html'),
			protocol: 'file:',
			slashes: true
		}
	));

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null
	});

	mainWindow.webContents.openDevTools();
};

// When application is ready we create a new window.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})

// Custom event - Closing the application
on('closeApp', () => {
	app.quit();
});
