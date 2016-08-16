define( function( require ) {
	"use strict";
	var Backbone = require( "backbone" );
	var Marionette = require( "backbone.marionette" );

	var PROGRESS_COMPLETED = 100;
    var PROGRESS_BEGUN = 50;
    var PROGRESS_NOT_BEGUN = 0;

    var ItemView = Marionette.ItemView;
    var Model = Backbone.Model;
    var Collection = Backbone.Collection;

    var GenericBehavior = function() {
		this.initialize.apply( this, arguments );
	};
	_.extend( GenericBehavior.prototype,  {
		initialize:  function( options ) {
			this.options = options;
		},
		loadJSON: function( jsonContent ) {
			var thisBehavior = this;
			var options = thisBehavior.options;
			var data = thisBehavior.options.data || {};
			var stepsInJSON = jsonContent.steps || jsonContent;
			var keysObject = privateMethods.makeKeysUnique( options, stepsInJSON );
			var steps = privateMethods.convertObjectNodeToArray( privateMethods.replaceContent( stepsInJSON, keysObject ) );
			privateMethods.updateLastStep( steps, data );
			privateMethods.updateStage( steps, options );
			steps = privateMethods.replaceRunTimeValues( data, steps, jsonContent );
			options.inputs.steps.push( steps );
			privateMethods.updateFirstStep( options, steps );
			thisBehavior.done();
        },
		execute: function( options ) {
			this.options.behaviorPromise.resolve( this.options );
		},
		done: function() {
			this.options.behaviorPromise.resolve( this.options );
		},
		fail: function( message ) {
			this.options.behaviorPromise.reject( message );
		}
	} );

	GenericBehavior.extend = Backbone.Model.extend;

	var privateMethods = {
		getOneUpID: function( inputs ) {
	        var prefix = inputs.prefix;
	        var tempValue = inputs.tempValue || inputs.prefix;
	        var currentValues = inputs.currentValues || [];

	        var newID = tempValue;
	        if ( !_.contains( currentValues, tempValue ) ) {
	            return newID;
	        }
	        var numberValue = ( typeof inputs.numberValue === "undefined" )  ? 0 : inputs.numberValue;

	        return privateMethods.getOneUpID(
	            _.extend( inputs, { tempValue: prefix + numberValue, numberValue: numberValue + 1 } )
	        );
	      },
		makeKeysUnique: function( options, stepsInJSON ) {
			var stepsKeys = Object.keys( stepsInJSON );
			var keysObject = {};
			var existingKeys = _.pluck( options.inputs.steps.toJSON(), "id" );
			_.forEach( stepsKeys, function( key ) {
				if ( _.contains( existingKeys, key ) ) {
					keysObject[ key ] = privateMethods.getOneUpID( {
			          prefix: key,
			          currentValues: existingKeys
			        } );
				}
			} );
			return keysObject;
		},

		/* Utility method that the next step configured in the parent is plugged in after the last step in this json has completed*/
		updateLastStep: function( steps, data ) {
			var lastStep = _.findWhere( steps, { "last-step":"yes" } );
			if ( lastStep && data.next ) {
				lastStep.next = data.next;
			}
		},

		/* Utility method that when these steps are being executed, the correct stage is displayed */
		updateStage: function( steps, options ) {
			_.forEach( steps, function( step ) {
				if ( !step.stage ) {
					step.stage = options.progressModel.get( "stage" );
				}
			} );
		},

		/* This replaces runtime values in the included json with passed in data */
		replaceRunTimeValues: function( data, steps, jsonContent ) {
			data.replace = data.replace || {};
			_.forEach( jsonContent.replace, function( key ) {
				data.replace[ key ] = data.replace[ key ] || "";
			} );
			if ( jsonContent.replace && Object.keys( data.replace ).length > 0 ) {
				steps = privateMethods.replaceContent( steps, data.replace );
			}
			return steps;
		},

		/* Utility method that the first step in the included JSON is set as the next in the parent */
		updateFirstStep: function( options, steps ) {
			options.progressModel.set( "next", {
				id: _.findWhere( steps, { "first-step":"yes" } ).id
			} );
		},
		replaceContent: function( target, contentToReplace ) {
	        var targetString = JSON.stringify( target );
	        for ( var key in contentToReplace ) {
	            if ( contentToReplace.hasOwnProperty( key ) ) {
	                var regExp = new RegExp( "(" + key + ")", "g" );
	                targetString = targetString.replace( regExp, contentToReplace[ key ] );
	            }
	        }
	        return JSON.parse( targetString );
	    },
		extendOriginalObject: function( sourceObject, outputArray ) {
	         _.each( sourceObject, function( value, id ) {
	            if ( _.isString( value ) || _.isNumber( value ) || _.isBoolean( value ) ) {
	                outputArray.push( { id: id, value: value } );
	            } else if ( _.isObject( value ) ) {
	                outputArray.push( $.extend( true, { id: id }, value ) );
	            }
	        } );
	    },
		convertObjectNodeToArray: function( ) {
	        if ( arguments.length < 1 ) {
	            console.error( "Invalid invocation" );
	            return;
	        }
	        var source = arguments[ 0 ];
	        if ( !arguments [ 1 ] ) {
	            var dummyObject = {};
	            dummyObject.nodeToConvert = source;
	            privateMethods.convertObjectNodeToArray( dummyObject, "nodeToConvert" );
	            return dummyObject.nodeToConvert;
	        }
	        for ( var i = 1; i < arguments.length; i++ ) {
	            var nodeName = arguments[ i ];
	            var outputArray = [];
	            var sourceObject = source[ nodeName ] || {};
	            if ( typeof sourceObject !== "object" ) {
	                sourceObject = {};
	            }
	            privateMethods.extendOriginalObject( sourceObject, outputArray );
	            source[ nodeName ] = outputArray;
	        }
	    },
		clone: function( inputObject ) {
		    /*
		    	Use this method only for deep cloning
	    		See http://jsperf.com/cloning-an-object/2
	    	*/
	        if ( inputObject ) {
	            if ( typeof inputObject === "object" ) {
	                return JSON.parse( JSON.stringify( inputObject ) );
	            }else if ( typeof inputObject === "string" ) {
	                return inputObject;
	            }
	        }else {
	            return false;
	        }
	    },
		dependencyMap: {
	        "==": function( dependency, actualValue ) {
	                return dependency.value === actualValue;
	            },
	        "!=": function( dependency, actualValue ) {
	                return dependency.value !== actualValue;
	            },
	        "isNot": function( dependency, actualValue, elementToValidate ) {
	                return !elementToValidate.is( dependency.value );
	            },
	        "is": function( dependency, actualValue, elementToValidate ) {
	                return elementToValidate.is( dependency.value );
	            },
	        "available": function( dependency, actualValue ) {
	                return !!actualValue;
	            },
	        "unAvailable": function( dependency, actualValue ) {
	                return !actualValue;
	            },
	        "has": function( dependency, actualValue ) {
	            return _.contains( actualValue, dependency.value );
	        }
	    },
		resolveObject: function( actualValue, criteria ) {
	        if ( criteria.indexOf( "." ) > -1 ) {
	            /* ex - criteria = "jenkinsIntegration.configuration.scope" */
	            var objectNodes = criteria.split( "." );
	            _.forEach( objectNodes, function( node ) {
	                /* Keep traversing actualValue object till the last/desired node */
	                actualValue = actualValue[ node ];
	            } );
	        }else {
	            /* ex - criteria = "appID" */
	            actualValue = actualValue[ criteria ];
	        }
	        return actualValue;
	    },
		checkDependency: function( dependency, actualValue, elementToValidate ) {
	        if ( typeof dependency.criteria === "object" ) {
	            var compoundCriteria = [];
	            _.forEach( dependency.criteria, function( criteriaDetails ) {
	                compoundCriteria.push(
						privateMethods.checkDependency( criteriaDetails, actualValue, elementToValidate ) );
	            } );
	            return _.all( compoundCriteria, function( value ) { return value; } );
	        }
	        if ( typeof actualValue === "object" ) {
	            actualValue = privateMethods.resolveObject( actualValue, dependency.criteria );
	        }else {
	            actualValue = actualValue;
	        }
	        return privateMethods.dependencyMap[ dependency.condition ](  dependency, actualValue, elementToValidate );
	    },
		doWhenAvailable: function( elementSelector, callBack, iterator ) {
	        if ( !elementSelector || !callBack ) {
	            console.error( "Incorrect invocation of doWhenAvailable" );
	            return;
	        }
	        iterator = iterator || 0;
	        if ( iterator === 10 ) {
	            return;
	        }
	        var element;
	        if ( typeof elementSelector === "function" ) {
	            element = elementSelector();
	        } else if ( typeof elementSelector === "string" ) {
	            element = $( elementSelector );
	        } else {
	            element = elementSelector;
	        }

	        /*http://stackoverflow.com/questions/3086068/how-do-i-check-whether-a-jquery-element-is-in-the-dom*/
	        if ( element[ 0 ] && $.contains( document.documentElement, element[ 0 ] ) ) {
	            callBack && callBack( element );
	        } else {
	            setTimeout( function() {
	                privateMethods.doWhenAvailable( elementSelector, callBack, iterator + 1 );
	            }, 200 );
	        }
	    },
		popUntilExecutingStep: function( step, executedSteps ) {
	        if ( !executedSteps || executedSteps.length === 0 ) {
	            return;
	        }
	        if ( _.first( executedSteps ).id === step.get( "id" ) ) {
	            return;
	        }
	        executedSteps.shift();
	        return privateMethods.popUntilExecutingStep( step, executedSteps );
	    },

	    repeatedStepUtility: function(  View, callBack, params, step ) {
	        var repeatKey = step.get( "forEach" );
	        var originalValue = privateMethods.clone( params[ repeatKey ] );
	        if ( typeof originalValue === "string" ) {
	            var obj = {};
	            if ( originalValue.indexOf( "," ) > -1 ) {
	                var inputs = originalValue.split( "," );
	                _.forEach( inputs, function( input ) {
	                    obj[ input ] = input;
	                } );
	            }else {
	                obj[ "0" ] = originalValue;
	            }
	            originalValue = obj;
	        }
	        var outputOfStep = {};
	        var keysList = Object.keys( originalValue );
	        var repeatingViewPromise = $.Deferred();
	        var outputKey = _.isArray( step.get( "store" ) ) && step.get( "store" )[ 0 ];
	        if ( outputKey && typeof outputKey === "object" && Object.keys( outputKey ).length > 0 ) {
	            outputKey = Object.keys( outputKey )[ 0 ];
	        }
	        var processSequentially = function( View, params, keysList ) {
	            if ( keysList.length === 0 ) {
	                params [ repeatKey ] = originalValue;
	                params [ outputKey ] = outputOfStep;
	                repeatingViewPromise.resolve();
	                return;
	            }
	            var key = keysList.shift();
	            var tempValue = originalValue[ key ];
	            params [ repeatKey ] = tempValue;
	            callBack( View, params, keysList ).then( function() {
	                if ( outputKey )  {
	                    outputOfStep [ key ] = privateMethods.clone( params[ outputKey ] );
	                }
	                processSequentially( View, params, keysList );
	            }, repeatingViewPromise.reject );
	        };
	        processSequentially( View, params, keysList );
	        return repeatingViewPromise;
	    },

	    stepExecutionUtility: function( View, callBack, params, step, dynamicPagePromise ) {
	        var repeatKey = step.get( "forEach" );
	        var stepExecutionPromise;
	        if ( !repeatKey ) {
	            stepExecutionPromise = callBack( View, params );
	        } else {
	            stepExecutionPromise = privateMethods.repeatedStepUtility(  View, callBack, params, step );
	        }
	        stepExecutionPromise.then( function() {
	            dynamicPagePromise.resolve( params );
	        }, function( message ) {
	            dynamicPagePromise.reject( message );
	        } );
	    },
		mixinMethods: {
	        keyAction: function( evt ) {
	            var code = evt.keyCode || evt.which;
	            if ( code === 13 ) {
	                evt.preventDefault();
	                this.$el.find( ".next:visible" ).click();
	            }
	        },
	        goBack: function( evt ) {
	            var thisView = this;
	            var wizardTemplate = thisView.getWizardTemplate();
	            var lastStep = new Model( wizardTemplate.meta.executedSteps.pop() );
	            if ( !lastStep ) {
	                return;
	            }
	            var lastStepID = lastStep.get( "id" );
	            var stepBeingExecuted = thisView.stepBeingExecuted;
	            var stageBeingExecuted = stepBeingExecuted.get( "stage" );
	            var currentStage = lastStep.get( "stage" );
	            if ( stageBeingExecuted ) {
	                var completedStageModel = thisView.progressStages.get( stageBeingExecuted );
	                if ( stageBeingExecuted === currentStage ) {
	                    completedStageModel.set( "status", PROGRESS_BEGUN );
	                } else {
	                    completedStageModel.set( "status", PROGRESS_NOT_BEGUN );
	                    thisView.currentStage = currentStage;
	                }
	            }
	            wizardTemplate.meta.currentStep = lastStepID ;
	            thisView.stepBeingExecuted = lastStep;
	            thisView.updateTemplate( wizardTemplate );
	            if ( lastStep.get( "restartable" ) !== "yes" ) {
	                thisView.goBack();
	                return;
	            }
	            thisView.beginProcess();
	        },
	        createStageCollection: function() {
	            var thisView = this;
	            var stages = _.each( thisView.options.process.stages || [], function( stage ) {
	                    _.extend( stage, { status: stage.status || PROGRESS_NOT_BEGUN }  );
	                }
	            );
	            return new Collection( stages );
	        },
	        __showStage: function( step, progress ) {
				var thisView = this;
				if ( typeof thisView.showStage === "function" ) {
					thisView.showStage( step, progress );
				}
	        },
	        __showStepAdditionalInfo: function( step ) {
				var thisView = this;
				if ( typeof thisView.showStepAdditionalInfo === "function" ) {
					thisView.showStepAdditionalInfo( step );
				}
	        },
	        dummyProcessing: function( inputs, step, currentStep, executedSteps ) {
	            var thisView = this;
	            inputs.dummyProcessingPromise = inputs.dummyProcessingPromise || $.Deferred();
	            var wizardTemplate = thisView.getWizardTemplate();
	            executedSteps = executedSteps || privateMethods.clone( wizardTemplate.meta.executedSteps || [] );
	            privateMethods.popUntilExecutingStep( step, executedSteps );
	            thisView.__showStage( step );
	            thisView.__showStepAdditionalInfo( step );
	            var canExecuteNextStep = $.Deferred();
	            if ( step.get( "dont_skip_on_replay" )  === "yes" ) {
	                    inputs.deferred = $.Deferred();
	                    canExecuteNextStep = thisView.processSteps( inputs, step, "yes" );
	            } else {
	                canExecuteNextStep.resolve();
	            }
	            canExecuteNextStep.then( function() {
	                executedSteps.shift();
	                var nextStepID = executedSteps.length > 0 ? _.first( executedSteps ).id : currentStep;
	                var nextStep = inputs.steps.get( nextStepID );
	                if ( nextStep.get( "id" ) === currentStep ) {
	                    inputs.dummyProcessingPromise.resolve();
	                    return;
	                }
	                thisView.dummyProcessing( inputs, nextStep, currentStep, executedSteps );
	            } );
	            return inputs.dummyProcessingPromise;
	        },

	        showStaticPage: function( params, step ) {
	            var staticPagePromise = $.Deferred();
	            var thisView = this;
	            var options = _.extend( {
	                model: new Model( params ),
	                template: step.get( "template" )
	            }, step.get( "options" ) );
	            var innerViewPromise = $.Deferred();
	            var StaticView = ItemView.extend( {
	                events: {
	                    "click .next": function() {
	                        innerViewPromise.resolve( params );
	                    }
	                },
	                className: "h100",
	                serializeData: function() {
	                    return this.options.data;
	                }
	            } );
	            var view = new StaticView( options );
	            thisView.__showChildView( "content", view  );
	            innerViewPromise.then( function( params ) {
	                view.destroy();
	                view.remove();
	                return staticPagePromise.resolve( params );
	            } );
	            return staticPagePromise;
	        },

	        processBehavior: function( params, step, inputs ) {
	            var processBehaviorPromise = $.Deferred();
	            var thisView = this;
	            thisView.$el.find( ".contentDiv" ).html( "" );
	            /*
	                params has been made a parameter to the method.
	                DO NOT change to use a closure. The params passed
	                to the method will be specific to the iteration
	            */
	            var behaviorPromise = $.Deferred();
	            var executeBehavior = function( Behavior, params ) {
	                var behaviorExecutionPromise = $.Deferred();
	                var options = _.extend( {
	                    params: params,
	                    behaviorPromise: behaviorPromise,
	                    progressModel: step,
	                    inputs: inputs
	                }, step.get( "options" ) );
	                var behavior = new Behavior( options );
	                behavior.execute();
	                behaviorPromise.then( function() {
	                    behaviorPromise = null;/*Checking if this helps*/
	                    behavior = null;
	                    behaviorExecutionPromise.resolve( params );
	                }, function( message ) {
	                    behaviorExecutionPromise.reject( message );
	                } );
	                return behaviorExecutionPromise;
	            };
	            if ( step.get( "behavior" ) === "pass_through" ) {
					privateMethods.
							stepExecutionUtility( GenericBehavior, executeBehavior, params, step, processBehaviorPromise );
	            } else {
		            require( [ step.get( "behavior" ) ], function( Behavior ) {
		                privateMethods.
							stepExecutionUtility( Behavior, executeBehavior, params, step, processBehaviorPromise );
		            } );
	            }
	            return processBehaviorPromise;
	        },

	        showDynamicPage: function( params, step ) {
	            var dynamicPagePromise = $.Deferred();
	            var thisView = this;
	            thisView.$el.find( ".contentDiv" ).html( "" );
	            /*
	                params has been made a parameter to the method.
	                DO NOT change to use a closure. The params passed
	                to the method will be specific to the iteration
	            */
	            var executeStep = function( View, params ) {
	                var stepExecutionPromise = $.Deferred();
	                var viewPromise = $.Deferred();
	                var options = _.extend( {
	                    params: params,
	                    viewPromise: viewPromise,
	                    progressModel: step
	                }, step.get( "options" ) );
	                var view = new View( options );
	                thisView.showChildView( "content", view );
	                viewPromise.then( function() {
	                    viewPromise = null;/*Checking if this helps*/
	                    view.destroy();
	                    stepExecutionPromise.resolve( params );
	                }, function( message ) {
	                    view.destroy();
	                    stepExecutionPromise.reject( message );
	                } );
	                return stepExecutionPromise;
	            };
	            require( [ step.get( "view" ) ], function( View ) {
	                privateMethods.stepExecutionUtility( View, executeStep, params, step, dynamicPagePromise );
	            } );
	            return dynamicPagePromise;
	        },
	        getNextStep: function( inputs, step ) {
	            var params = inputs.params;
	            var wizardTemplate = this.getWizardTemplate();
	            wizardTemplate.meta = wizardTemplate.meta || {};
	            wizardTemplate.meta.executedSteps = wizardTemplate.meta.executedSteps || [];
	            var notStackable = step.get( "do_not_stack" ) || "no";
	            if ( notStackable === "no" ) {
	                wizardTemplate.meta.executedSteps.push( step );
	            }
	            this.updateTemplate( wizardTemplate );

	            var nextStepTag = step.get( "next" );
	            if ( !nextStepTag ) {
	                inputs.deferred.resolve( params );
	                return;
	            }
	            var validRule = nextStepTag.id ? nextStepTag : ( function( dependencies ) {
	                /* Important: Takes the first condition which passes */
	                return _.filter( dependencies, function( dependency ) {
	                    return privateMethods.checkDependency( dependency, params );
	                } ) [ 0 ];
	            } )( nextStepTag.dependency );

	            if ( !validRule ) {
	                inputs.deferred.resolve( params );
	                return;
	            }

	            var nextStep = inputs.steps.get( validRule.id );
	            if ( !nextStep ) {
	                console.error( "No next step for", step );
	                inputs.deferred.reject( "Something went wrong in the wizard" );
	                return;
	            }
	            return nextStep;
	        },
	        showHideButtons: function( step ) {
	            var thisView = this;
	            privateMethods.doWhenAvailable( function() {
	                return $( thisView.wizardActions.el );
	            }, function( target ) {
	                var reversible = step.get( "reversible" ) === "yes";
	                var wizardTemplate = thisView.getWizardTemplate();
	                var previousSteps = wizardTemplate.meta.executedSteps &&
	                    _.filter( wizardTemplate.meta.executedSteps || [], function( stepDetails ) {
	                       return !stepDetails.behavior;
	                    } );
	                if ( reversible && previousSteps && previousSteps.length ) {
	                    target.find( ".previousButton" ).show();
	                } else {
	                    target.find( ".previousButton" ).hide();
	                }
	                var doNotShowExit = step.get( "doNotShowExit" ) === "yes";
	                if ( doNotShowExit ) {
	                    target.find( ".exitButton" ).hide();
	                } else {
	                    target.find( ".exitButton" ).show();
	                }
	                /* If there are no more steps. Don't ask for confirmation if the user clicks on Exit */
	                if ( !step.get( "next" ) ) {
	                    target.find( ".exitButton" ).toggleClass( "exitButton exitFinal" );
	                } else {
	                    target.find( ".exitFinal" ).toggleClass( "exitButton exitFinal" );
	                }
	            } );
	        },
	        storeData: function( step, params ) {
	            var thisView = this;
	            var store = step.get( "store" );
	            var wizardTemplate = thisView.getWizardTemplate();
	            var data = wizardTemplate.data = wizardTemplate.data || {};
	            _.forEach( store || [], function( key ) {
	                if ( typeof key === "string" && params [ key ] ) {
	                    data[ key ] = params [ key ];
	                } else {
	                    var keyString = _.keys( key )[ 0 ];
	                    data[ key [ keyString ] ]  = params [ key [ keyString ] ] = params [ keyString ];
	                }
	            } );
	            thisView.updateTemplate( wizardTemplate );
	        },
	        processSteps: function( inputs, step, dummyProcessing ) {
	            var thisView = this;
	            var params = inputs.params;
	            inputs.deferred = inputs.deferred || $.Deferred();
	            var processStepsPromise = inputs.deferred;
	            thisView.stepBeingExecuted = step;
	            var wizardTemplate = thisView.getWizardTemplate();
	            console.debug( "Wizard processing step: ", step.get( "id" ) );
	            if ( step.get( "restartable" ) === "yes" ) {
	                wizardTemplate.meta.currentStep = step.get( "id" );
	            }
	            thisView.updateTemplate( wizardTemplate );
	            thisView.__showStage( step );
	            thisView.__showStepAdditionalInfo( step );
	            thisView.showHideButtons( step );

	            thisView.beforeEachStep()
	            .then( function() {
		            var processFunction =  ( step.get( "type" ) === "static_view" ) ?
		                "showStaticPage" : ( ( step.get( "type" ) === "dynamic_view" ) ?
		                    "showDynamicPage" : "processBehavior" ) ;

		            var stepPromise = thisView[ processFunction ]( params, step, inputs );
		            stepPromise.then( function() {
		                stepPromise = null;
		                thisView.storeData( step, params );
		                if ( dummyProcessing ) {
		                    processStepsPromise.resolve();
		                    return;
		                }
		                var nextStep = thisView.getNextStep( inputs, step );
		                if ( nextStep ) {
		                    setTimeout( function() {
		                        thisView.processSteps( inputs, nextStep );
		                    }, 20 );
		                } else if ( thisView.progressStages ) {
		                    var completedStage =  thisView.progressStages.get( thisView.currentStage );
		                    completedStage.set( "status", PROGRESS_COMPLETED );
		                }
		            }, function( message ) {
		                stepPromise = null;
		                processStepsPromise.reject( message );
		            } );
	            } );

	            return processStepsPromise;
	        },
	        getWizardTemplate: function() {
	            var thisView = this;
	            var templates = JSON.parse( window.sessionStorage.getItem( "templates" ) || "{}" );
	            var templateName = thisView.options.wizardTemplate;
	            var wizardTemplate = thisView.wizardTemplate = templates[ templateName ] = templates[ templateName ] || {};
	            wizardTemplate.data = wizardTemplate.data  || {};
	            wizardTemplate.meta = wizardTemplate.meta  || {};
	            window.sessionStorage.setItem( "templates", JSON.stringify( templates ) );
	            return wizardTemplate;
	        },
	        updateTemplate: function( template ) {
	            var thisView = this;
	            var templates = JSON.parse( window.sessionStorage.getItem( "templates" ) || "{}" );
	            templates[ thisView.options.wizardTemplate ] = template;
	            window.sessionStorage.setItem( "templates", JSON.stringify( templates ) );
	        },
	        exitFinalWizard:function() {
	            var thisView = this;
	            var wizardTemplate = thisView.getWizardTemplate();
	            var params = wizardTemplate.data;
	            thisView.options.success( params );
	            thisView.__clearState();
	        },
	        exitWizard: function() {
	            var thisView = this;
	            thisView.beforeExit = ( typeof thisView.beforeExit === "function" ) ? thisView.beforeExit : function() {
					return $.Deferred().resolve();
	            };
	            thisView.afterExit = ( typeof thisView.afterExit === "function" ) ? thisView.afterExit : function() {
					return $.Deferred().resolve();
	            };
	            thisView.beforeExit()
	            .then( function() {
					thisView.__clearState();
					setTimeout( function() {
						!thisView.isDestroyed && thisView.destroy();
					}, 20 );
					return thisView.afterExit();
	            } );
	        },
	        resetWizard: function() {
	            var thisView = this;
	            thisView.beforeReset = ( typeof thisView.beforeReset === "function" ) ? thisView.beforeReset : function() {
					return $.Deferred().resolve();
	            };
	            thisView.beforeReset().then( function() {
                    thisView.__clearState();
                    thisView.beginProcess();
	            } );
	        },
	        __clearIntermediateState: function() {
	            var thisView = this;
	            thisView.clearIntermediateState = ( typeof thisView.clearIntermediateState === "function" ) ?
					thisView.clearIntermediateState : function() {
						return $.Deferred().resolve();
					};
	            thisView.clearIntermediateState()
	            .then( function() {
		            var templates = JSON.parse( window.sessionStorage.getItem( "templates" ) || "{}" );
		            templates [ thisView.options.wizardTemplate ] &&
		                templates [ thisView.options.wizardTemplate ].meta.currentStep &&
		                    delete templates [ thisView.options.wizardTemplate ].meta.currentStep;
		            window.sessionStorage.setItem( "templates", JSON.stringify( templates ) );
	            } );
	        },
	        __clearState: function() {
	            var thisView = this;
	            /* Cleaning up all instance level variables */
	            thisView.__clearIntermediateState();
	            var templates = JSON.parse( window.sessionStorage.getItem( "templates" ) || "{}" );
	            delete templates [ thisView.options.wizardTemplate ];
	            window.sessionStorage.setItem( "templates", JSON.stringify( templates ) );
	        },
	        showWizardExecutionError: function( message ) {
	            if ( message ) {
	                this.__clearState();
	                ( typeof this.showError === "function" ) && this.showError( message );
	            }
	        },
	        beginProcess: function() {
	            var thisView = this;
	            var process = thisView.options.process;
	            var steps = privateMethods.convertObjectNodeToArray( process.steps );
	            var progressSteps = thisView.progressSteps ||  new Collection( steps );
	            thisView.progressSteps = progressSteps;
	            var wizardTemplate = thisView.getWizardTemplate();
	            wizardTemplate.meta.currentStep = wizardTemplate.meta.currentStep  || process.start;
	            var startStep = wizardTemplate.meta.currentStep;
	            var params = wizardTemplate.data;
	            var canProcessSteps = $.Deferred();
	            if ( startStep === process.start ) {
	                thisView.beforeStart = ( typeof thisView.beforeStart === "function" ) ?
						thisView.beforeStart : function() {
							return $.Deferred().resolve();
						};
		            thisView.beforeStart()
		            .then( canProcessSteps.resolve );
	            } else {
	                try {
	                    thisView.dummyProcessing( {
	                        params: params,
	                        steps:progressSteps
	                    }, progressSteps.get( process.start ), startStep ).then( canProcessSteps.resolve );
	                } catch ( e ) {
	                    canProcessSteps.reject( "Could not determine current step. Please restart the wizard" );
	                }
	            }
	            var inputsToProcessSteps =  {
	                params: params,
	                steps: progressSteps
	            };
	            canProcessSteps.then( function() {
	                thisView.processSteps( inputsToProcessSteps, progressSteps.get( startStep )  )
	                .then( function() {
	                    ( thisView.options.process.do_not_clear )  ?
	                        thisView.__clearIntermediateState() : thisView.__clearState();
	                    thisView.destroy();
	                    thisView.options.success( params );
	                }, function( message ) {
	                    thisView.showWizardExecutionError( message );
	                } );
	            }, function( message ) {
	                thisView.showWizardExecutionError( message );
	            } );
	        },
	        onRender: function() {
	            var thisView = this;
	            privateMethods.doWhenAvailable( function() {
	                return thisView.$el.closest( "body" );
	            }, function( target ) {
	                target.addClass( "wizardBody" );
	            } );
	            thisView.$el.addClass( thisView.options.process.styling );
	            this.beginProcess();
	        }
		}
	};

	var WizardMixin = function( options ) {
		var thisMixin = this;
		this.addToObj( {
			events:  {
                "click .previous":"goBack",
                "click .resetWizard": "resetWizard",
                "click .exitButton": "exitWizard",
                "click .exitFinal": "exitFinalWizard",
                "keydown": "keyAction"
            },
			regions: {
	            "content":".contentDiv",
	            "importProgress":".importProgress",
	            "importStageProgress":".importStageProgress",
	            "contentDivTitle": ".contentDivTitle",
	            "wizardActions": ".wizardActions"
	        }
		} );
		thisMixin.clobber( privateMethods.mixinMethods );
	};

	return {
		mixin: WizardMixin,
		behavior: GenericBehavior,
		resetWizard: function( wizardName ) {
		    var templates = JSON.parse( window.sessionStorage.getItem( "templates" ) || "{}" );
			delete templates [ wizardName ];
			window.sessionStorage.setItem( "templates", JSON.stringify( templates ) );
		}
	};
} );
