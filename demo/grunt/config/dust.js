module.exports = {
	defaults: {
		files: {
			"javascript/templates.js":[ "javascript/**/*.dust" ]
		}
	},
	options: {
		runtime: false,
		relative: false,
		useBaseName: true,
		optimizers: {
            format: function( ctx, node ) {
                return node;
            }
        },

        wrapperOptions: {
            packageName: null,
            deps: {
                dust: "dust",
                dust_helpers: "dusthelpers"
            }
        }
	}
};
