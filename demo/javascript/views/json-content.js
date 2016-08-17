define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	require( "json-viewer" );

	return Marionette.ItemView.extend( {
		template: "json-content",
		onAttach: function() {
			var thisView = this;
			var values = this.options.jsonContent;
			thisView.$el.jsonViewer( values, { collapsed: true } );
		}
	} );
} );
