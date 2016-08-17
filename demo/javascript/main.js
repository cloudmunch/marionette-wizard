define ( function( require ) {
	"use strict";
	require( "templates" );
	var DemoWrapperView = require( "demo-wrapper-view" );
	var Marionette = require( "backbone.marionette" );

	var Application = new Marionette.Application( {
        container: "#backboneContainer"
    } );
    Application.on( "start", function( options ) {
		$( "#backboneContainer" ).append ( ( new DemoWrapperView() ).render().el );
    } );
    Application.start();
} );
