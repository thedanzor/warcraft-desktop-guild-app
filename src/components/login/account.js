// Application components / utils.
const { getState, setState } = require('../../utils/application_state');
const { on, emit } = require('../../utils/application_events');
const getData = require('../../utils/request');
const message = require('../message/');
const fetch_guild = require('../fetchers/fetch_guild');

// Template
const template = require('./view_login_account');
const template_char = require('./view_login_character');

// Set component id.
const component_id = 'login_account';

const account = (component_wrapper, data) => {
  // We are Initializing so we setup our initial state.
  setState({
    id: component_id,
    set: true
  });

  if (!component_wrapper || !data) {
    message('An error has accured in the application');
    return;
  }

  component_wrapper.innerHTML = template;

  let characters = [];
  data.characters.forEach( character => {
    if (character.level >= 100) {
      characters.push(character);
    }
  });

  var container = component_wrapper.querySelector('.character_list');
  if (container && characters.length) {
    characters.forEach( char => {
      var wrap = document.createElement('div');
      wrap.className = 'character_wrapper';
      wrap.innerHTML = template_char(char);
      container.appendChild(wrap);
    });
  }

  let selected_user = null;
  container.addEventListener('click', ({target}) => {
    if (target) {
      selected_user = target.dataset.id;
    }

    selected_user = characters.find(char => {
      if (char.name === selected_user) {
        return char;
      }
    });

    const guild = selected_user.guild;
    const guild_realm = selected_user.guildRealm;

    if (!guild || !guild_realm) {
      message('Character is not in a guild');
      return;
    }

    fetch_guild(guild, guild_realm);
    on('fetched_guild', guild => {
      emit('route', 'login/guild', guild);
    });
  });
};

module.exports = account;
