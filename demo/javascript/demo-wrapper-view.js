define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	var JSONContentView = require( "views/json-content" );

	return Marionette.LayoutView.extend( {
		template: "demo-wrapper",
		regions:  {
			"jsonContent": ".jsonContent",
			"wizardView":".wizardView"
		},
		onRender: function() {
			this.showChildView( "jsonContent", new JSONContentView( {
				jsonContent: {
					"id":"someID",
					"value":"someValue"
				}
			} ) );
		}
	} );
} );
