/* Generic behavior to load steps from process JSON */
define( function( require ) {
	"use strict";
	var MarionetteWizard = require( "marionette-wizard" );
	var Behavior = MarionetteWizard.behavior;

	return Behavior.extend( {
		execute: function() {
			var thisBehavior = this;
			var data = thisBehavior.options.data || {};
			$.ajax( {
                url: data.json
            } ).then( function( jsonContent ) {
				thisBehavior.loadJSON( jsonContent );
            }, console.error );
		}
	} );

} );
