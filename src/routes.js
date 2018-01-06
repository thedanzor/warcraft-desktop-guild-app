// Appication Components
const login_component = require('./components/login/');
const setup_component = require('./components/login/setup');
const login_account_component = require('./components/login/account');
const login_guild_component = require('./components/login/guild');
const fetch_members = require('./components/fetchers/fetch_members');

// Application Utils
const { getState } = require('./utils/application_state');
const { on, emit } = require('./utils/application_events');
const state = getState('app');

// Router and data
const routes = (path, data) => {
  if (!path) {
    return;
  }

  // Paths and the components to load
  if (path === 'login') {
    login_component(state.app.comp);
  }

  if (path === 'login/init') {
    setup_component(state.app.comp);
  }

  if (path === 'login/account') {
    login_account_component(state.app.comp, data);
  }

  if (path === 'login/guild') {
    login_guild_component(state.app.comp, data);
  }
};

// Listen to route changes.
on('route', (path, data) => {
  routes(path, data);
});

module.exports = routes;
