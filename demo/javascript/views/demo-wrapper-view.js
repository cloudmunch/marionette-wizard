define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	var ChildView = require( "views/individual-example-view" );
	var Backbone = require( "backbone" );

	var Model = Backbone.Model;
	var Collection = Backbone.Collection.extend( {
		model: Model
	} );

	return Marionette.CompositeView.extend( {
		el: "#backboneContainer",
		template: "demo-wrapper",
		childView: ChildView,
		childViewContainer: ".childViewContainer",
		initialize: function( options ) {
			var thisView = this;
			var thisCollection = thisView.collection = new Collection();
			$.ajax( {
				url: "jsons/wizard-examples.json"
			} ).then( function( response ) {
				thisCollection.add( response );
				thisView.examples = response;
				thisView.render();
			} );
		},
		events: {
			"change select.exampleSelector": "filterExamples"
		},
		filterExamples: function() {
			var home = this.$el;
			var chosenExample = home.find( "select.exampleSelector" ).val();
			if ( chosenExample === "all" ) {
				home.find( ".individualExampleDiv" ).show();
				return;
			}
			var examples = home.find( ".individualExampleDiv" );
			examples.not( "['data-id'=" + chosenExample + "]" ).hide();
			examples.is( "['data-id'=" + chosenExample + "]" ).show();
		},
		serializeData: function() {
			return { examples: this.examples };
		}
	} );
} );
