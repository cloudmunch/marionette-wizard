define ( function( require ) {
	"use strict";

	var Marionette = require( "backbone.marionette" );
	var ChildView = require( "individual-example-view" );
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
				debugger;
				thisCollection.add( response );
				thisView.render();
			} );
		}
	} );
} );
