// This util will help communicate internal changes.

// Our events object.
let events = {};

// @public - Listeners
const on = (type, handler) => {
		if ( !handler ) {
				throw new ReferenceError( 'handler not defined.' );
		}

		if (!events[type]) {
				events[type] = [];
		}

		events[type].push( handler );
		return this;
};

// @public - Publishers
const emit = (type, ...args) => {
	if ( events[type] ) {
		const handlers = events[type];

		for (let handler of handlers) {
				handler.apply( this, args );
		}
	}
}

module.exports = {
	on,
	emit
};
