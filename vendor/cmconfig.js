/* jshint ignore:start */
/* jshint devel: true */

// Going to be very important to have layered Modal Functionality in this application.
// Using vanilla boostrap it isn't possible, but here is a suggestion on getting them
// to work. http://miles-by-motorcycle.com/static/bootstrap-modal/index.html

requirejs.config( {
  waitSeconds: 200,
  "baseUrl": "vendor",
  "paths":
  {
    "jquery": "../vendor/jquery.min",

    "bootstrap": "../vendor/bootstrap.min",
    "backbone": "../vendor/backbone",
    "underscore": "../vendor/underscore",
    "backbone.marionette": "../vendor/backbone.marionette",
    "dust": "../vendor/dust-full",
    "dusthelpers": "../vendor/dust-helpers",
    "marionette-wizard": "../vendor/marionette-wizard"
  },
  "shim":
  {
    "jquery": {
      exports: "$"
    },
    "backbone": {
      deps: [ "underscore", "jquery", "bootstrap" ],
      exports: "Backbone"
    },
    "backbone.marionette": {
      deps: [ "backbone", "backbone.advice" ]
    },
    "marionette-wizard": {
      deps: [ "backbone", "backbone.marionette" ]
    },
    "underscore": {
      exports: "_"
    },
    "dusthelpers": {
      deps: [ "dust" ]
    }
  }
} );

// Load the main app module to start the app
requirejs( [ "main" ] );
/* jshint ignore:end */
