"use strict";

module.exports = function( grunt ) {
	var path = require( "path" );
	console.log("Path",process.cwd());
	require( "load-grunt-config" )( grunt, {
		configPath: path.join( process.cwd(), "grunt/config" ),
		jitGrunt: {
			customTasksDir: "grunt/tasks"
		}
	} );

	grunt.loadNpmTasks( "grunt-npm-install" );
};