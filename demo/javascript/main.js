define ( function( require ) {
	"use strict";
	require( "templates" );
	var DemoWrapperView = require( "views/demo-wrapper-view" );
	var Marionette = require( "backbone.marionette" );
	var dust = require( "dust" );

	Marionette.Renderer.render = function( template, data ) {
        var html;

        // Template must be compiled and in the dust cache. Recommend pre-compiling
        // and loading the templates as scripts at app start.
        dust.render( template, data, function( err, out ) {
            html = out;
        } );

        return html;
    };

	var Application = new Marionette.Application( {
        container: "#backboneContainer"
    } );
    Application.on( "start", function( options ) {
		new DemoWrapperView();
    } );
    Application.start();
} );
