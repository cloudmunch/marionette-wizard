define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );

	return Marionette.ItemView.extend( {
		template: "simple-decider",
		events:{
			"change input":"decide"
		},
		decide: function() {
			this.options.params.nextScreen = this.$el.find( "input:checked" ).val();
			this.options.viewPromise.resolve();
		}
	} );
} );
