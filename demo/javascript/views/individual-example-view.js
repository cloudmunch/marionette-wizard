define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	var JSONContentView = require( "views/json-content" );
	var WizardView = require( "views/wizard-view" );

	return Marionette.LayoutView.extend( {
		template: "individual-example",
		className: "individualExampleDiv",
		regions:  {
			"jsonContent": ".jsonContent",
			"wizardView":".wizardView"
		},
		onRender: function() {
			var thisView = this;
			$.ajax( {
				url: "jsons/" + thisView.model.get( "id" )
			} ).then( function( response ) {
				thisView.showChildView( "jsonContent", new JSONContentView( {
					jsonContent: response
				} ) );
				thisView.showChildView( "wizardView", new WizardView( {
					process: response
				} ) );
			} );
		}
	} );
} );
