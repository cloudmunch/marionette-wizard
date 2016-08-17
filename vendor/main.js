define ( function( require ) {
	"use strict";
	var Marionette = require( "backbone.marionette" );
	var Application = new Marionette.Application( {
        container: "#backboneContainer"
    } );
    Application.on( "start", function( options ) {
		console.log( "hello world" );
    } );
} );
