define ( function( require ) {
	"use strict";
	var Backbone = require( "backbone" );
	require( "backbone.advice" );
	var Marionette = require( "backbone.marionette" );
	var MarionetteWizard = require( "marionette-wizard" );

	Backbone.Advice.addMixin( Marionette.LayoutView );
	return Marionette.LayoutView.extend( {
		getTemplate: function() {
			return "simple-wizard-view";
		}
	} ).mixin( [ MarionetteWizard ] );
} );
