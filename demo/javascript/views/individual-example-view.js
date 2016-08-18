define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	var JSONContentView = require( "views/json-content" );
	var WizardView = require( "views/wizard-view" );
	var marked = require( "marked" );

	return Marionette.LayoutView.extend( {
		template: "individual-example",
		className: "individualExampleDiv",
		attributes: function() {
			return {
				"data-id": this.model.get( "id" )
			};
		},
		regions:  {
			"jsonContent": ".jsonContent",
			"wizardView":".wizardView"
		},
		events: {
			"click .reloadWizard":"showWizard"
		},
		showJSONContent: function() {
			var thisView = this;
			thisView.showChildView( "jsonContent", new JSONContentView( {
				jsonContent: thisView.jsonContent
			} ) );
		},
		showWizard: function() {
			var thisView = this;
			thisView.showChildView( "wizardView", new WizardView( {
				wizardTemplate: thisView.model.get( "id" ),
				process: thisView.jsonContent
			} ) );
		},
		onRender: function() {
			var thisView = this;
			marked( thisView.model.get( "description" ), function( err, out ) {
				if ( err ) {
					return;
				}
				thisView.$el.find( ".description" ).html( out );
			} );
			$.ajax( {
				url: "jsons/" + thisView.model.get( "id" ) + ".json"
			} ).then( function( response ) {
				thisView.jsonContent = response;
				thisView.showWizard();
				thisView.showJSONContent();
			} );
		}
	} );
} );
