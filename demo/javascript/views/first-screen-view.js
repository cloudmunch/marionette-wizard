define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );

	return Marionette.ItemView.extend( {
		template: "first-screen",
		events:{
			"click .next": "goAhead"
		},
		goAhead: function() {
			this.options.viewPromise.resolve();
		}
	} );
} );
