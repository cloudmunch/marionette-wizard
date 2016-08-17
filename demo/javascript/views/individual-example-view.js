define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	var JSONContentView = require( "views/json-content" );

	return Marionette.LayoutView.extend( {
		template: "individual-example",
		className: "individualExampleDiv",
		regions:  {
			"jsonContent": ".jsonContent",
			"wizardView":".wizardView"
		},
		onRender: function() {
			var model = this.model;
			$.ajax( {
				url: "jsons/" + model.get( "id" )
			} ).then( function( response ) {
				this.showChildView( "jsonContent", new JSONContentView( {
					jsonContent: response
				} ) );
			} );
		}
	} );
} );
