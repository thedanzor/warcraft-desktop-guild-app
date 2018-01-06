// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const getData = require('../../utils/request');
const message = require('../message/');
const fetch_members = require('../fetchers/fetch_members');

// Template
const template = require('./view_login_guild');

// Set component id.
const component_id = 'login_guild';

const account = (component_wrapper, data) => {
  // We are Initializing so we setup our initial state.
  setState({
    id: component_id,
    set: true
  });

  console.log(component_wrapper, data);

  if (!component_wrapper || !data) {
    message('An error has accured in the application');
    return;
  }

  component_wrapper.innerHTML = template;
  fetch_members(component_wrapper, data);
};

module.exports = account;
