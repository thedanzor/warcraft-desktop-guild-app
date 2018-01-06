module.exports = ({name, level, realm, thumbnail}) => {
  const view = `
    <div class="character_image" data-id="${name}">
      <img data-id="${name}" src="https://render-api-eu.worldofwarcraft.com/static-render/eu/${thumbnail}" />
    </div>
    <h3 data-id="${name}"> ${name} </h3>
    <div class="character_level" data-id="${name}"> ${level} </div>
    <div class="character_realm" data-id="${name}"> ${realm} </div>
  `;

  return view;
}
