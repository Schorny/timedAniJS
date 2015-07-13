
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        root.TA = factory(window.jQuery);
    }
}(this, function($) {
    "use strict";

    var TA = {};
    /**
     * The central TA.App object
     *
     * This object cannot be instantiated, it is just a global object
     * @constructor TA.App
     */

    /**
     * Registers an event handler
     *
     * @method TA.App.on
     * @param {String} event
     * @param {Function} callback
     */
    /**
     * Unregisters an event handler
     *
     * @method TA.App.off
     * @param {String} event
     * @param {Function} callback
     */
    /**
     * Registers a regex event handler
     *
     * @method TA.App.onRegex
     * @param {String} regex
     * @param {Function} callback
     */
    /**
     * Unregisters a regex event handler
     *
     * @method TA.App.offRegex
     * @param {String} regex
     * @param {Function} callback
     */

    /**
     * Triggers an event
     *
     * @method TA.App.trigger
     * @param {String} event
     */
    /**
     * Triggers a start event
     *
     * @method TA.App.start
     * @param {String} event
     */
    TA.App = (function() {

        var $app = $('#taapp');
        
        var regex = [];

        function ensureNodeExists() {
            if(!$app.length) {
                $('<div id="taapp"></div>').appendTo($('body'));
                $app = $('#taapp');
            }
        }
        
        function matchRegex(evt) {
            $.each(regex, function(idx, e) {
                var matches= evt.match(e.regex);
                if(matches) {
                    e.handler(evt, matches);
                }
            });
            return this;
        }

        //TODO: check if own event bus might be better
        function trigger(evt) {
            ensureNodeExists();
			TA.StatusHandler.notify(evt);
            matchRegex(evt);
            $app.triggerHandler(evt);
            return this;
        }

        function start(evt) {
            trigger(evt+":start");
            return this;
        }

        function on(evt, func) {
            ensureNodeExists();
            $app.on(evt, func);
            return this;
        }

        function off(evt, func) {
            ensureNodeExists();
            $app.off(evt, func);
            return this;
        }
        
        function onRegex(evt, func) {
            ensureNodeExists();
            regex.push({regex: evt, handler: func});
            return this;
        }
        
        function offRegex(evt, func) {
            for(var i=0, c=regex.length; i<c; ++i) {
                if(regex[i].regex==evt && regex[i].handler==func) {
                    regex.splice(i, 1);
                }
            }
            return this;
        }

        return {
            on: on,
            off: off,
            onRegex: onRegex,
            offRegex: offRegex,
            trigger: trigger,
            start: start,
        };
    })();


    //Errorhandling code copied from handlebars
    //https://github.com/wycats/handlebars.js/blob/4bed826d0e210c336fb9e500835b1c1926562da5/lib/handlebars/exception.js
    TA.Error = {};

    var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];
    TA.Error.Exception = function(name, message) {
        var tmp = Error.prototype.constructor.call(this, message);

        for(var i=0,c=errorProps.length; i<c; ++i) {
            this[errorProps[i]] = tmp[errorProps[i]];
        }

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, TA.Error.Exception);
        }

        this.name = name;

        return this;
    };
    TA.Error.Exception.prototype = new Error();

    TA.Error.ArgumentException = function(arg, expected, got) {
        return new TA.Error.Exception('TA.Error.ArgumentException', 'Unexpected Argument "'+arg+'", Expected: "'+expected+'", Got: "'+got+'"');
    };

    TA.Error.DOMNodeNotFoundException = function(msg, node) {
        return new TA.Error.Exception('TA.Error.DOMNodeNotFoundException', msg+' ('+node+')');
    };
	
    TA.Error.StateException = function(unit, msg) {
        return new TA.Error.Exception('TA.Error.StateException', 'Unexpected State in "'+unit+'": '+msg);
    };
    
    TA.Error.InvalidNameException = function(unit, val) {
        return new TA.Error.Exception('TA.Error.InvalidNameException', 'Invalid Name: '+unit+': "'+val+'"');
    };

    var forbiddenAnimNames = [
        "in", "out", "start", "stop", "finish", "pause", "break", "unknown"
    ];
    TA.checkAnimName = function(name) {
        $.each(forbiddenAnimNames, function(idx, o) {
            if(o===name) {
                throw new TA.Error.InvalidNameException("Animation Name", name);
            }
        });
    };
    
    var createCallNFunction = function(times, func) {
        var callN = function() {
            ++callN.count;
            if(callN.count >= times) {
                func();
            }
        };
        callN.count=0;
        return callN;
    };
    
    /**
     * StatusHandler knows all about in which status which object currently is
     *
     * This object cannot be instantiated, it is just a global object
     * @constructor TA.StatusHandler
     */

    /**
     * Notifies the object of a status change, do not call it yourself
     *
     * @method TA.StatusHandler.notify
     * @param {String} event
     */
    /**
     * Checks if the status is currently active
     *
     * @method TA.StatusHandler.check
     * @param {String} event - like "text:in"
     * @return {Boolean}
     */
    /**
     * Returns the current status of the object
     *
     * @method TA.StatusHandler.getStatus
     * @return {String} The status or "unknown"
     */

	TA.StatusHandler = (function() {
		var statuses = {};
		var defaultStatus = 'unknown';
		
		function splitEvent(evt) {
			//split text:in
			var parts = evt.split(':');
			if(parts.length<2) return null;
            var state=null;
            if(parts.length==3) {
                state = parts[1]+':'+parts[2];
            } else {
                state = parts[1];
            }
			var name = trimObjectName(parts[0]);
			
			return {
				name: name,
				state: state
			};
		}
		
		function trimObjectName(name) {
			//split composition/object
			var parts = name.split('/');
			return parts[parts.length-1];
		}
		
		function notify(evt) {
			var state = splitEvent(evt);
			if(!state) return;
			statuses[state.name]=state.state;
            return this;
		}
        
        function check(name) {
            var evt = splitEvent(name);
            if(!evt) return false;
            
            return getStatus(evt.name) === evt.state;
        }
		
		function getStatus(name) {
			name = trimObjectName(name);
			
			if(!statuses[name]) return defaultStatus;
			
			return statuses[name];
		}
		
		return {
			getStatus: getStatus,
			notify: notify,
            check: check
		};
	})();

    /**
     * Interface for Animation objects
     *
     * @interface TA.Animation
     */

    /**
     * Starts the animation
     *
     * @function
     * @name TA.Animation#start
     * @param {TA.Object} obj - the TA.Object to apply the Animation to
     * @param {Function} [complete] - function to be called when the animation is finished
     */

    /**
     * Interface for general TA.Objects
     *
     * @interface TA.BaseObject
     */
    /**
     * Clones this TA.Object and overrides some settings
     *
     * @function
     * @name TA.Object#clone
     * @param {Object} [overrideSettings] - settings object containing name and optionally $e, anis and settings
     * @return {TAObject}
     */
    /**
     * Returns the name of the object
     *
     * @function
     * @name TA.BaseObject#getName
     * @return {String}
     */
    /**
     * Returns the DOM object
     *
     * @function
     * @name TA.BaseObject#getElement
     * @return {Object}
     */
    /**
     * Starts the "in" Animation
     *
     * @function
     * @name TA.BaseObject#startIn
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the "out" Animation
     *
     * @function
     * @name TA.BaseObject#startOut
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the name Animation
     *
     * @function
     * @name TA.BaseObject#start
     * @param {String} name - name of animation to start
     * @param {Function} [complete] - function to be called once all animations are finished
     */


    /**
     * Interface for general TA.Compositions
     *
     * @interface TA.BaseComposition
     */
    /**
     * Returns the name of the object
     *
     * @function
     * @name TA.BaseComposition#getName
     * @return {String}
     */
    /**
     * Register a TA.BaseObject in this composition
     *
     * @function
     * @name TA.BaseComposition#register
     * @param {TA.BaseObject} obj
     */
    /**
     * Starts the "in" Animation
     *
     * @function
     * @name TA.BaseComposition#startIn
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the "out" Animation
     *
     * @function
     * @name TA.BaseComposition#startOut
     * @param {Function} [complete] - function to be called once all animations are finished
     */



    /**
     * Interface for TA.ObjectSettings
     *
     * @interface TA.ObjectSettings
     */
    /**
     * Applys the initializing Setting to an object
     *
     * @function
     * @name TA.ObjectSettings#applyInit
     * @param {Object} e - DOM Element to apply Settings to
     */
    /**
     * Applys the deinitializing Setting to an object
     *
     * @function
     * @name TA.ObjectSettings#applyDeinit
     * @param {Object} e - DOM Element to apply Settings to
     */


    /**
     * Interface for TA.TimelineActions
     *
     * @interface TA.TimelineAction
     */
    /**
     * Runs the action
     *
     * @function
     * @name TA.TimelineAction#run
     * @param {TA.Timeline} tl - the current timeline object
     */
    /**
     * Gets the description
     *
     * @function
     * @name TA.TimelineAction#getDescription
     * @returns {String}
     */



    /**
     * TA.EventConverter listens for multiple events and once all where triggered triggers a new one
     *
     * @constructor TA.EventConverter
     * @param {String[]} sources - Array of events to listen for
     * @param {String} target - event to trigger
     */
    TA.EventConverter = function(sources, target) {

        this.events = [];
        var that = this;
        function listen(evt) {
            if(!$.inArray(that.events, evt)) {
                return;
            }

            that.events.push(evt);
            if(that.events.length === sources.length) {
                that.events = [];
                TA.App.trigger(target);
            }
            return this;
        }

        /**
         * activates the converter (done implicitly by the constructor)
         *
         * @method TA.EventConverter#activate
         */
        this.activate = function() {
            $.each(sources, function(idx, s) {
                TA.App.on(s,listen);
            });
            return this;
        };

        /**
         * deactivates the converter
         *
         * @method TA.EventConverter#deactivate
         */
        this.deactivate = function() {
            $.each(sources, function(idx, s) {
                TA.App.off(s,listen);
            });
            return this;
        };

        this.activate();
        
        return this;
    };

    /**
     * Settings class to apply multiple Settings to an object
     *
     * @implements TA.Settings
     * @param {TA.Settings[]} [settings] - Array of settings objects
     * @constructor TA.CombinedSettings
     */
    TA.CombinedSettings = function(settings) {

        this.list = [];

        /**
         * add a settings object
         *
         * @method TA.CombinedSettings#addSettings
         * @param {TA.Settings|TA.Settings[]} [settings]
         */
        this.addSettings = function(settings) {
            if(settings) {
                if($.isArray(settings)) {
                    var that = this;
                    $.each(settings, function(idx, o) {
                        that.addSettings(o);
                    });
                } else {
                    if(!settings.applyInit || !settings.applyDeinit) {
                        throw TA.Error.ArgumentException('settings', 'TA.Settings[]|TA.Settings', 'settings.applyInit and/or settings.applyDeinit not callable in ' + typeof settings);
                    }
                    this.list.push(settings);
                }
            }
            return this;
        };

        /**
         * @method TA.CombinedSettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            $.each(this.list, function(idx, o) {
                o.applyInit($e);
            });
            return this;
        };

        /**
         * @method TA.CombinedSettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            $.each(this.list, function(idx, o) {
                o.applyDeinit($e);
            });
            return this;
        };

        this.addSettings(settings);

        return this;
    };

    /**
     * Settings class to apply CSS Settings to an object
     *
     * @implements TA.ObjectSettings
     * @param {Object} [init] - CSS settings
     * @param {Object} [deinit] - CSS settings
     * @constructor TA.CssSettings
     */
    TA.CssSettings = function(init, deinit) {

        this.init = init || {};
        this.deinit = deinit || {};

        if($.type(this.init) !== 'object') {
            throw new TA.Error.ArgumentException('init', 'Object', typeof this.init);
        }
        if($.type(this.deinit) !== 'object') {
            throw new TA.Error.ArgumentException('deinit', 'Object', typeof this.deinit);
        }

        /**
         * @method TA.CssSettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            if(!$.isFunction($e.css)) {
                throw new TA.Error.ArgumentException('$e', 'jQuery object', '$e.css not callable in  in ' + typeof $e);
            }
            $e.css(this.init);
            return this;
        };

        /**
         * @method TA.CssSettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            if(!$.isFunction($e.css)) {
                throw new TA.Error.ArgumentException('$e', 'jQuery object', '$e.css not callable in ' + typeof $e);
            }
            $e.css(this.deinit);
            return this;
        };
        
        return this;
    };

    /**
     * Settings class to apply velocity Settings to an object
     *
     * @implements TA.ObjectSettings
     * @param {Object} [init] - CSS settings
     * @param {Object} [deinit] - CSS settings
     * @constructor TA.VelocitySettings
     */
    TA.VelocitySettings = function(init, deinit) {

        this.init = init || {};
        this.deinit = deinit || {};

        if($.type(this.init) !== 'object') {
            throw new TA.Error.ArgumentException('init', 'Object', typeof this.init);
        }
        if($.type(this.deinit) !== 'object') {
            throw new TA.Error.ArgumentException('deinit', 'Object', typeof this.deinit);
        }

        /**
         * @method TA.VelocitySettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            if(!$.isFunction($e.velocity)) {
                throw new TA.Error.ArgumentException('$e', 'jQuery Object', '$e.velocity not callable in ' + typeof $e);
            }
            $e.velocity(this.init);
            return this;
        };

        /**
         * @method TA.VelocitySettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            if(!$.isFunction($e.velocity)) {
                throw new TA.Error.ArgumentException('$e', 'jQuery Object', '$e.velocity not callable in ' + typeof $e);
            }
            $e.velocity(this.deinit);
            return this;
        };
        
        return this;
    };

    /**
     * A TA.ObjectSettings object that does nothing
     *
     * @implements TA.ObjectSettings
     * @constructor TA.DummySettings
     */
    TA.DummySettings = function() {

        this.applyInit = this.applyDeinit = function(e) { return this; };
        
        return this;
    };


    /**
     * A TA.Animation object that does nothing
     *
     * @implements TA.Animation
     * @constructor TA.DummyAnimation
     */
    TA.DummyAnimation = function() {
        this.start = function(obj, complete) { if(complete)complete(this); return this; };
        
        return this;
    };

    /**
     * A TA.Animation object that just defers the start call to the supplied user defined function
     *
     * @implements TA.Animation
     * @param {Function} func - user defined function that gets the start() call forwarded (it needs to call complete after it's finished)
     * @constructor TA.FunctionAnimation
     */
    TA.FunctionAnimation = function(func) {

        if(!$.isFunction(func)) {
            throw new TA.Error.ArgumentException('func', 'function', typeof func);
        }
        
        /**
         * @method TA.FunctionAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            func(obj, complete);
            return this;
        };
        
        return this;
    };

    /**
     * A TA.Animation object that chains multiple animations sequentially
     *
     * @implements TA.Animation
     * @param {TA.Animation[]} animations - array of TA.Animation objects
     * @constructor TA.ChainedAnimation
     */
    TA.ChainedAnimation = function(animations) {

        this.animations = animations || [];
        if(!$.isArray(this.animations)) {
            throw new TA.Error.ArgumentException('animations', 'TA.Animation[]', typeof this.animations);
        }

        $.each(this.animations, function(idx, e) {
            if(!$.isFunction(e.start)) {
                throw new TA.Error.ArgumentException('animations[i]', 'TA.Animation', 'animations[i].start not callable in ' + typeof e);
            }
        });

        /**
         * adds another animation to the queue
         *
         * @method TA.ChainedAnimation#addAnimation
         * @param {TA.Animation} animation - the animation to add
         */
        this.addAnimation = function(animation) {
            if(!$.isFunction(animation.start)) {
                throw new TA.Error.ArgumentException('animation', 'TA.Animation', 'animation.start not callable in ' + typeof animation);
            }
            this.animations.push(animation);
            
            return this;
        };

        /**
         * @method TA.ChainedAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var idx = -1;
            var count = this.animations.length;
            var that = this;

            var func = function() {
                ++idx;
                if(idx >= count) {
                    if(complete) complete(that);
                    return;
                }

                that.animations[idx].start(obj, func);
            };
            func();
            return this;
        };
        
        return this;
    };

    /**
     * A TA.Animation object that executes multiple animations in parallel
     *
     * Keep in mind that some animation libraries need extra parameter to allow parallel animation execution
     *
     * @param {TA.Animation[]} animations - array of TA.Animation objects
     * @constructor TA.ParallelAnimation
     */
    TA.ParallelAnimation = function(animations) {

        this.animations = animations || [];
        if(!$.isArray(this.animations)) {
            throw new TA.Error.ArgumentException('animations', 'TA.Animation[]', typeof this.animations);
        }

        $.each(this.animations, function(idx, e) {
            if(!$.isFunction(e.start)) {
                throw new TA.Error.ArgumentException('animations[i]', 'TA.Animation', 'animations[i].start not callable in ' + typeof e);
            }
        });

        /**
         * adds another animation to the queue
         *
         * @method TA.ParallelAnimation#addAnimation
         * @param {TA.Animation} animation - the animation to add
         */
        this.addAnimation = function(animation) {
            if(!$.isFunction(animation.start)) {
                throw new TA.Error.ArgumentException('animation', 'TA.Animation', 'animation.start not callable in ' + typeof animation);
            }
            this.animations.push(animation);
            return this;
        };

        /**
         * @method TA.ParallelAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var animCount = this.animations.length;
            var that = this;
            var subComplete = createCallNFunction(animCount, function() {
                if(complete)complete(that);
            });
            $.each(this.animations, function(idx, o) {
                o.start(obj, subComplete);
            });
            return this;
        };
        
        return this;
    };

    /**
     * TA.Animation object that delays the animation
     *
     * @implements TA.Animation
     * @param {TA.Animation} animation - animation to execute
     * @param {Integer} delay - delay in milliseconds
     * @constructor TA.DelayedAnimation
     */
    TA.DelayedAnimation = function(animation, delay) {

        if(!$.isFunction(animation.start)) {
            throw new TA.Error.ArgumentException('animation', 'TA.Animation', 'animation.start not callable in ' + typeof animation);
        }

        /**
         * @method TA.DelayedAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            setTimeout(
                function() {
                    animation.start(obj, complete);
                }, delay
            );
            return this;
        };
        
        return this;
    };

    /**
     * TA.Animation object that starts the animation in the background and completes instantly
     *
     * @implements TA.Animation
     * @param {TA.Animation} animation - the animation to start in the background
     * @constructor TA.BackgroundAnimation
     */
    TA.BackgroundAnimation = function(animation) {

        /**
         * @method TA.BackgroundAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            complete(this);
            animation.start(obj, function(){});
            return this;
        };
        
        return this;
    };

    /**
     * TA.Animation object that repeats the animation count number times
     *
     * @implements TA.Animation
     * @param {Integer} count - number of times to repeat the animation
     * @param {TA.Animation} animation - the animation to repeat
     * @constructor TA.RepeatAnimation
     */
    TA.RepeatAnimation = function(count, animation) {

        if(!$.isFunction(animation.start)) {
            throw new TA.Error.ArgumentException('animation', 'TA.Animation', 'animation.start not callable in ' + typeof animation);
        }

        /**
         * @method TA.RepeatAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var idx = 0;
            var that = this;
            var subComplete = function() {
                if(idx >= count) {
                    if(complete)complete(that);
                    return;
                }
                ++idx;
                animation.start(obj, subComplete);
            };
            subComplete();
            return this;
        };
        
        return this;
    };

    /**
     * TA.Animation object that repeats the animation while the predicate returns true
     *
     * @implements TA.Animation
     * @param {Function} predicate - function that returns true to repeat the animation or false to complete it
     * @param {TA.Animation} animation - the animation to repeat
     * @constructor TA.RepeatAnimation
     */
    TA.RepeatWhileAnimation = function(predicate, animation) {

        if(!$.isFunction(predicate)) {
            throw new TA.Error.ArgumentException('predicate', 'Function', typeof predicate);
        }
        if(!$.isFunction(animation.start)) {
            throw new TA.Error.ArgumentException('animation', 'TA.Animation', 'animation.start not callable in ' + typeof animation);
        }

        /**
         * @method TA.RepeatAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var that = this;
            var subComplete = function() {
                if(!predicate()) {
                    complete(that);
                    return;
                }
                animation.start(obj, subComplete);
            };
            subComplete();
            return this;
        };
        
        return this;
    };

    /**
     * TA.Animation object that uses jQuery.animate to do the animation
     *
     * @param {Object} properties - jQuery.animate animation properties
     * @param {Object} [options] - jQuery.animate animation options
     * @param {TA.Settings|TA.Settings[]} [settings] - TA.Settings to apply before and/or after the animation
     * @constructor TA.JQueryAnimation
     */
    TA.JQueryAnimation = function(properties, options, settings) {
        this.properties = properties || {};
        this.options = options || {};
        this.settings = settings ? new TA.CombinedSettings([settings]) : new TA.DummySettings();

        if($.type(this.properties) !== 'object') {
            throw new TA.Error.ArgumentException('properties', 'Object', typeof this.properties);
        }
        if($.type(this.options) !== 'object') {
            throw new TA.Error.ArgumentException('options', 'Object', typeof this.options);
        }

        /**
         * @method TA.JQueryAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var tempOptions = this.options;
            var that = this;
            
            this.settings.applyInit(obj);
            //TODO: chaining with current complete, dont overwrite user data
            tempOptions.complete = function() {
                that.settings.applyDeinit(obj);
                if(complete) complete(that);

            };
            obj.getElement().animate(this.properties, tempOptions);
            return this;
        };
        
        return this;
    };
    
    /**
     * TA.Animation object that uses velocity.js to do the animation
     *
     * @param {Object} properties - velocity.js animation properties
     * @param {Object} [options] - velocity.js animation options
     * @param {TA.Settings|TA.Settings[]} [settings] - TA.Settings to apply before and/or after the animation
     * @constructor TA.VelocityAnimation
     */
    TA.VelocityAnimation = function(properties, options, settings) {
        this.properties = properties || {};
        this.options = options || {};
        this.settings = settings ? new TA.CombinedSettings([settings]) : new TA.DummySettings();

        if($.type(this.properties) !== 'object') {
            throw new TA.Error.ArgumentException('properties', 'Object', typeof this.properties);
        }
        if($.type(this.options) !== 'object') {
            throw new TA.Error.ArgumentException('options', 'Object', typeof this.options);
        }

        /**
         * @method TA.VelocityAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var tempOptions = this.options;
            var that = this;
            
            this.settings.applyInit(obj);
            //TODO: chaining with current complete, dont overwrite user data
            tempOptions.complete = function() {
                that.settings.applyDeinit(obj);
                if(complete) complete(that);

            };
            obj.getElement().velocity(this.properties, tempOptions);
            return this;
        };
        
        return this;
    };

    /**
     * TA.BaseObject that represents a real object
     *
     * @implements TA.BaseObject
     * @param {String} name - name of the object
     * @param {Object} $e - DOM element of the object
     * @param {Object} anis - object that contains TA.Animation (anis.in and anis.out - both are options)
     * @param {TA.ObjectSettings|TA.ObjectSettings[]} settings - object settings
     * @constructor TA.Object
     */
    TA.Object = function(name, $e, anis, settings) {
        this.name = name;
        this.anis = anis || {};
        this.$e = $e;
        this.settings = new TA.CombinedSettings([settings]);

        if(!this.anis.in) {
            this.anis.in = new TA.DummyAnimation();
        }
        if(!this.anis.out) {
            this.anis.out = new TA.DummyAnimation();
        }

        if(name === "") {
            throw new TA.Error.ArgumentException('name', 'String', 'empty value');
        }
        //TODO: check if $e is jQuery Object
        if(!$.isFunction(this.anis.in.start)) {
            throw new TA.Error.ArgumentException('anis.in', 'TA.Animation', 'anis.in.start not callable in ' + typeof this.anis.in);
        }
        if(!$.isFunction(this.anis.out.start)) {
            throw new TA.Error.ArgumentException('anis.out', 'TA.Animation', 'anis.out.start not callable in ' + typeof this.anis.out);
        }

        /**
         * @method TA.Object#clone
         * @inheritdoc
         */
        this.clone = function(overrideSettings) {
            var s = {
                name: overrideSettings.name,
                anis: $.extend({}, this.anis, overrideSettings.anis),
                $e: overrideSettings.$e || $('#'+overrideSettings.name),
                settings: overrideSettings.settings || settings
            };
            return new TA.Object(s.name, s.$e, s.anis, s.settings);
        };

        /**
         * @method TA.Object#getName
         * @inheritdoc
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * @method TA.Object#getElement
         * @inheritdoc
         */
        this.getElement = function() {
            return this.$e;
        };

        /**
         * @method TA.Object#addSettings
         * @param {TA.Settings} [settings] - settings object to add
         */
        this.addSettings = function(settings) {
            this.settings.addSettings(settings);
        };

        var that = this;

        function startAni(obj, ani, name) {
            return function(complete) {
                ani.start(obj, function() {
                    TA.App.trigger(obj.getName() + ":" + name);
                    if(complete) complete(obj);
                });
                return that;
            };
        }

 
        /**
         * @method TA.Object#startIn
         * @inheritdoc
         */
        this.startIn = function(complete) {
            this.settings.applyInit(this.getElement());
            startAni(this, this.anis.in, "in")(complete);
            return this;
        };

        /**
         * @method TA.Object#startOut
         * @inheritdoc
         */
        this.startOut = function(complete) {

            startAni(this, this.anis.out, "out")(function(obj) {
                that.settings.applyDeinit(that.getElement());
                if(complete)complete(obj);
            });
            return this;
        };

        /**
         * @method TA.Object#start
         * @inheritdoc
         */
        this.start = function(name, complete) {
            if(!this.anis[name]) return;
            if(name === 'in') {
                this.startIn(complete);
                return;
            } else if (name === 'out') {
                this.startOut(complete);
                return;
            }
            
            this.startAni(this, this.anis[name], name)(complete);
            return this;
        };

        TA.App.on(this.name+":in:start", function() { that.startIn(); });
        TA.App.on(this.name+":out:start", function() { that.startOut(); });
        
        for(var key in this.anis) {
            if(key === 'in' || key === 'out') continue;
            if(!this.anis.hasOwnProperty(key)) continue;
            TA.checkAnimName(key);
            TA.App.on(this.name+":"+key+":start", function() {
                that.start(key);
            });
        }
        
        return this;
    };

    /**
     * Creates a TA.Object and uses its name as ID selector
     *
     * @method TA.createObjectFromId
     * @param {String} id - name of the object (also used as ID selector for the DOM element of the object)
     * @param {Object} anis - object that contains TA.Animation (anis.in and anis.out - both are options)
     * @param {TA.ObjectSettings|TA.ObjectSettings[]} settings - object settings
     * @return TA.Object
     */

    TA.createObjectFromId = function(id, anis, settings) {
        var $e = $('#'+id);
        if($e.length===0) {
            throw new TA.Error.ArgumentException('id', 'existing DOM Node ID', 'DOM Node not found');
        }
        return new TA.Object(id, $e, anis, settings);
    };

    /**
     * TA.BaseObject that delays animation execution
     *
     * @implements TA.BaseObject
     * @param {String} name - the object name
     * @param {TA.BaseObject} obj - the object to delay
     * @param {Object} delays - object with delays in milliseconds (delays.in and delays.out)
     * @constructor TA.DelayedObject
     */
    TA.DelayedObject = function(name, obj, delays) {
        this.obj = obj;
        this.name = name;
        this.delays = delays || {};

        if(name === "") {
            throw new TA.Error.ArgumentException('name', 'String', 'empty value');
        }
        if(!$.isFunction(this.obj.getName)) {
            throw new TA.Error.ArgumentException('obj', 'TA.Object', 'obj.getName not callable in ' + typeof this.obj);
        }
        if($.type(this.delays) !== 'object') {
            throw new TA.Error.ArgumentException('delays', 'Object', typeof this.delays);
        }
        
        /**
         * @method TA.DelayedObject#startIn
         * @inheritdoc
         */
        this.startIn = function(complete) {
            this.start("in", complete);
            return this;
        };

        /**
         * @method TA.DelayedObject#startOut
         * @inheritdoc
         */
        this.startOut = function(complete) {
            this.start("out", complete);
            return this;
        };
        
        /**
         * @method TA.DelayedObject#start
         * @inheritdoc
         */
        this.start = function(name, complete) {
            var delay = this.delays[name] || 0;
            var that = this;
            if(name=='in') {
                this.obj.settings.applyInit(this.obj.getElement());
            }
            setTimeout(function() {
                that.obj.start(name, complete);
            }, delay);
            return this;
        };
        
        var that = this;
        TA.App.onRegex(new RegExp('^'+this.name+':(.*?):start$'), function(evt, matches) {
            that.start(matches[1]);
        });

        /**
         * @method TA.DelayedObject#getName
         * @inheritdoc
         */
        this.getName = function() {
            return this.obj.getName();
        };

        /**
         * @method TA.DelayedObject#getElement
         * @inheritdoc
         */
        this.getElement = function() {
            return this.obj.getElement();
        };
        
        return this;
    };

    /**
     * TA.BaseComposition object that handles basic composition
     *
     * @implements TA.BaseComposition
     * @param {String} name - name of this composition
     * @constructor TA.Composition
     */
    TA.Composition = function(name) {
        this.name = name;
        this.objects = [];

        if(name === "") {
            throw new TA.Error.ArgumentException('name', 'String', 'empty value');
        }

        /**
         * @method TA.Composition#register
         * @inheritdoc
         */
        this.register = function(obj) {
            //TODO: check if obj is TA.Object
            this.objects.push(obj);
            return this;
        };

        /**
         * @method TA.Composition#getName
         * @inheritdoc
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * @method TA.Composition#startIn
         * @inheritdoc
         */
        this.startIn = function(complete) {
            this.start("in", complete);
            return this;
        };
        
        /**
         * @method TA.Composition#startOut
         * @inheritdoc
         */
        this.startOut = function(complete) {
            this.start("out", complete);
            return this;
        };
        
        this.start = function(name, complete) {
            var objCount = this.objects.length;
            var that = this;
            var subComplete = createCallNFunction(objCount, function() {
                TA.App.trigger(that.getName()+":"+name);
                if(complete)complete(that);               
            });
                
            $.each(that.objects, function(idx, o) {
                o.start(name, subComplete);
            });
            return this;            
        };

        var that = this;
        
        TA.App.onRegex(new RegExp('^'+this.name+':(.*?):start$'), function(evt, matches) {
            that.start(matches[1]);
        });
        
        return this;
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_start
     */
    TA.TimelineAction_start = function(action) {

        this.getDescription = function() {
            return "start("+action+")";
        };

        this.run = function(tl) {
            TA.App.start(action);
            tl.next();
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_trigger
     */
    TA.TimelineAction_trigger = function(action) {

        this.getDescription = function() {
            return "start("+action+")";
        };

        this.run = function(tl) {
            TA.App.trigger(action);
            tl.next();
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_waitFor
     */
    TA.TimelineAction_waitFor = function(action) {

        this.getDescription = function() {
            return "waitFor("+action+")";
        };

        this.run = function(tl) {
            var func = function() {
                TA.App.off(action, func);
                tl.next();
            };
            TA.App.on(action, func);
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_delay
     */
    TA.TimelineAction_delay = function(msecs) {

        this.getDescription = function() {
            return "delay("+msecs+")";
        };

        this.run = function(tl) {
            setTimeout(function() {
                tl.next();
            }, msecs);
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_loop
     */
    TA.TimelineAction_loop = function() {

        this.getDescription = function() {
            return "loop()";
        };

        this.run = function(tl) {
            tl.rewind();
            tl.execute();
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_loopN
     */
    TA.TimelineAction_loopN = function(times) {

        this.count = 0;

        this.getDescription = function() {
            return "loopN("+times+")";
        };

        this.run = function(tl) {
            ++this.count;
            if(this.count < times) {
                tl.rewind();
                tl.execute();
            } else {
                tl.next();
            }
        };
    };
    
    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_step
     */
    TA.TimelineAction_step = function(steps) {

        this.getDescription = function() {
            return "step("+steps+")";
        };

        this.run = function(tl) {
            tl.step(steps);
            tl.execute();
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_label
     */
    TA.TimelineAction_label = function(name) {

        this.getDescription = function() {
            return "label("+name+")";
        };

        this.getLabel = function() {
            return name;
        };

        this.run = function(tl) {
            tl.next();
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_jumpTo
     */
    TA.TimelineAction_jumpTo = function(label) {

        this.getDescription = function() {
            return "jumpTo("+label+")";
        };

        this.run = function(tl) {
            tl.jumpToLabel(label);
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_startAndWaitFor
     */
    TA.TimelineAction_startAndWaitFor = function(action) {

        this.getDescription = function() {
            return "startAndWaitFor("+action+")";
        };

        this.run = function(tl) {
            var func = function() {
                TA.App.off(action, func);
                tl.next();
            };
            TA.App.on(action, func);
            TA.App.start(action);
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_execute
     */
    TA.TimelineAction_execute = function(func) {

        this.getDescription = function() {
            return "execute(userFunc)";
        };

        this.run = function(tl) {
            func(tl);
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_if
     */
    TA.TimelineAction_if = function(func, action) {

        this.getDescription = function() {
            return "if("+action.getDescription()+")";
        };

        this.run = function(tl) {
            if(func()) {
                action.run(tl);
            } else {
                tl.next();
            }
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_stop
     */
    TA.TimelineAction_stop = function() {

        this.getDescription = function() {
            return "stop()";
        };

        this.run = function(tl) {
        };
    };
    
    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_finish
     */
    TA.TimelineAction_finish = function() {

        this.getDescription = function() {
            return "finish()";
        };

        this.run = function(tl) {
            TA.App.trigger(tl.getName()+":finish");
        };
    };
    
    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_playTimeline
     */
    TA.TimelineAction_playTimeline = function(name) {

        this.getDescription = function() {
            return "playTimeline("+name+")";
        };

        this.run = function(tl) {
            var f = function() {
                TA.App.off(name+":finish", f);
                tl.next();
            };
            
            TA.App.on(name+":finish", f);
            TA.App.start(name);
        };
    };

    /**
     * @implements TA.TimelineAction
     * @constructor TA.TimelineAction_playTimelineAsync
     */
    TA.TimelineAction_playTimelineAsync = function(name) {

        this.getDescription = function() {
            return "playTimelineAsync("+name+")";
        };

        this.run = function(tl) {
            TA.App.start(name);
            tl.next();
        };
    };

    /**
     * Describer for a TA.Timeline actions
     *
     * This is for convenience. It create TA.TimelineAction objects for ease of use
     *
     * @constructor TA.TimelineDescriber
     */
    TA.TimelineDescriber = function() {

        /**
         * Triggers a start event
         *
         * @method TA.TimelineDescriber#start
         * @param {String} action - event name
         * @returns {TA.TimelineAction}
         */
        this.start = function(action) {
            return new TA.TimelineAction_start(action);
        };

        /**
         * Triggers an event
         *
         * @method TA.TimelineDescriber#trigger
         * @param {String} action - event name
         * @returns {TA.TimelineAction}
         */
        this.trigger = function(action) {
            return new TA.TimelineAction_trigger(action);
        };

        /**
         * Waits for an event to be triggered
         *
         * @method TA.TimelineDescriber#waitFor
         * @param {String} action - event name
         * @returns {TA.TimelineAction}
         */
        this.waitFor = function(action) {
            return new TA.TimelineAction_waitFor(action);
        };

        /**
         * Triggers a start event and waits for it to complete
         *
         * @method TA.TimelineDescriber#startAndWaitFor
         * @param {String} action - event name
         * @returns {TA.TimelineAction}
         */
        this.startAndWaitFor = function(action) {
            return new TA.TimelineAction_startAndWaitFor(action);
        };

        /**
         * Delays the next action
         *
         * @method TA.TimelineDescriber#delay
         * @param {Integer} msecs - time in milliseconds
         * @returns {TA.TimelineAction}
         */
        this.delay = function(msecs) {
            return new TA.TimelineAction_delay(msecs);
        };

        /**
         * Steps to another event in the timeline
         *
         * @method TA.TimelineDescriber#step
         * @param {Integer} steps - positive or negative amount of steps to take
         * @returns {TA.TimelineAction}
         */
        this.step = function(steps) {
            return new TA.TimelineAction_step(steps);
        };

        /**
         * Defines a label
         *
         * @method TA.TimelineDescriber#label
         * @param {String} name - label name
         * @returns {TA.TimelineAction}
         */
        this.label = function(name) {
            return new TA.TimelineAction_label(name);
        };

        /**
         * Jumps to a label (skipping all other steps)
         *
         * @method TA.TimelineDescriber#jumpTo
         * @param {String} label - label name
         * @returns {TA.TimelineAction}
         */
        this.jumpTo = function(label) {
            return new TA.TimelineAction_jumpTo(label);
        };

        /**
         * Executes a user defined function
         *
         * this function gets the current TA.Timeline object as only parameter and needs to call tl.next() on it (otherwise the execution will halt)
         * @method TA.TimelineDescriber#execute
         * @param {Function} func - a user defined function
         * @returns {TA.TimelineAction}
         */
        this.execute = function(func) {
            return new TA.TimelineAction_execute(func);
        };

        /**
         * Rewinds the timeline to the start and continues from there
         *
         * @method TA.TimelineDescriber#loop
         * @returns {TA.TimelineAction}
         */
        this.loop = function() {
            return new TA.TimelineAction_loop();
        };
        
        /**
         * Rewinds the timeline to the start and continues from there, but only times times
         *
         * @method TA.TimelineDescriber#loopN
         * @returns {TA.TimelineAction}
         */
        this.loopN = function(times) {
            return new TA.TimelineAction_loopN(times);
        };

        /**
         * Stops the timeline
         *
         * @method TA.TimelineDescriber#stop
         * @returns {TA.TimelineAction}
         */
        this.stop = function() {
            return new TA.TimelineAction_stop();
        };

        /**
         * Stops the timeline and triggers the finish event
         *
         * @method TA.TimelineDescriber#finish
         * @returns {TA.TimelineAction}
         */
        this.finish = function() {
            return new TA.TimelineAction_finish();
        };
        
        /**
          * Plays a timeline
          *
          * @method TA.TimelineDescriber#playTimeline
          * @param {String} name - name of timeline
          * @returns {TA.TimelineAction}
          */
        this.playTimeline = function(name) {
            return new TA.TimelineAction_playTimeline(name);
        };

        /**
          * Plays a timeline
          *
          * @method TA.TimelineDescriber#playTimelineAsync
          * @param {String} name - name of timeline
          * @returns {TA.TimelineAction}
          */
        this.playTimelineAsync = function(name) {
            return new TA.TimelineAction_playTimelineAsync(name);
        };

        /**
         * Executes an event if a user defined function returns true
         *
         * @method TA.TimelineDescriber#executeIf
         * @param {Function} func - a user defined predicate
         * @param {TA.TimelineAction} action - a TA.TimelineAction to execute of the predicate returns true
         * @returns {TA.TimelineAction}
         */
        this.executeIf = function(func, action) {
            return new TA.TimelineAction_if(func, action);
        };
    };

    /**
     * A basic Timeline object
     *
     * @param {String} name - name of the timeline
     * @constructor TA.Timeline
     */
    TA.Timeline = function(name) {
        //TODO: refactor so we don't expose everything to the user

        this.name = name;
        this.steps = [];
        this.curPos = 0;

        this.debug = false;
        this.honorReqs = false;
        this.breakOnExecute = false;
        this.singleStepMode = false;

        this.requires = [];
        
        this.setReqs = function(reqs) {
            if(!$.isArray(reqs)) {
                throw new TA.Error.ArgumentException('reqs', 'Array', typeof reqs);
            }
            this.requires = reqs;
            return this;
        };
        
        this.addReq = function(req) {
            this.requires.push(req);
            return this;
        };
        
        this.reqsMet = function() {
            for(var i=0,c=this.requires.length; i<c; ++i) {
                if(!TA.StatusHandler.check(this.requires[i])) {
                    return false;
                }
            }
            return true;
        };
        
        this.forceReqs = function(complete) {
            var missing = [];
            
            $.each(this.requires, function(idx, o) {
                if(!TA.StatusHandler.check(o)) {
                    missing.push(o);
                }
            });
            
            var that=this;
            var subComplete = createCallNFunction(missing.length, function() {
                if(complete)complete(that);
            });
            
            $.each(missing, function(idx, o) {
                var f=function() {
                    TA.App.off(o, f);
                    subComplete();
                };
                TA.App.on(o, f);
                TA.App.start(o);
            });
            return this;
        };
        
        this.forceReqsAndGo = function() {
            this.forceReqs(function(tl) {
                tl.go();
            });
        };
        
        this.setHonorReqs = function(honor) {
            this.honorReqs = honor;
            return this;
        };
        /**
         * Sets the debug value
         *
         * @method TA.Timeline#setDebug
         * @param {Boolean} dbg
         */
        this.setDebug = function(dbg) {
            this.debug = dbg;
            return this;
        };

        /**
         * Sets the single step value
         *
         * @method TA.Timeline#setSingleStep
         * @param {Boolean} singleStepValue
         */
        this.setSingleStep = function(singleStepValue) {
            this.singleStepMode = singleStepValue;
            return this;
        };

        /**
         * Returns a TA.TimelineDescriber object for convenience
         *
         * @method TA.Timeline#getDescriber
         * @returns {TA.TimelineDescriber}
         */
        this.getDescriber = function() {
            return new TA.TimelineDescriber();
        };

        /**
         * Returns the timeline name
         *
         * @method TA.Timeline#getName
         * @returns {String}
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * Starts the execution
         *
         * @method TA.Timeline#go
         */
        /**
         * Starts the execution
         *
         * @method TA.Timeline#play
         */

        this.go = this.play = function() {
            if(this.honorReqs && !this.reqsMet()) {
                throw new TA.Error.StateException('Timeline', 'Requirements are not met');
            }
            var that = this;
            setTimeout(function() {
                that.execute();
            }, 0);
            return this;
        };

        /**
         * Halts the execution
         *
         * @method TA.Timeline#pause
         */
        this.pause = function() {
            this.breakOnExecute = true;
            return this;
        };

        /**
         * Jumps to a label and starts the execution from there
         *
         * @method TA.Timeline#jumpToLabel
         * @param {String} label
         */
        this.jumpToLabel = function(label) {
            var that = this;
            setTimeout(function() {
                for (var i = 0, c = that.steps.length; i < c; ++i) {
                    var action = that.steps[i];
                    if (action.getLabel && action.getLabel() == label) {
                        that.curPos = i;
                        that.execute();
                        return;
                    }
                }
                throw new TA.Error.ArgumentException("label", "correct label name", "Unknown Label '"+label+"'");
            },0);
            return this;
        };

        this.step = function(offset) {
            this.curPos += offset;
            return this;
        };

        this.getCurPos = function() {
            return this.curPos;
        };

        this.getLength = function() {
            return this.steps.length;
        };

        /**
         * Rewinds the timeline
         *
         * @method TA.Timeline#rewind
         */
        this.rewind = function() {
            this.curPos = 0;
            return this;
        };

        this.next = function() {
            this.step(1);
            this.execute();
        };

        this.execute = function() {
            if(this.curPos >= this.steps.length) {
                TA.App.trigger(this.name+":finish");
                return;
            }

            if(this.breakOnExecute) {
                this.breakOnExecute = false;
                TA.App.trigger(this.name+":break");
                return;
            }

            if(this.singleStepMode) {
                this.breakOnExecute = true;
            }

            var action = this.steps[this.curPos];
            if(this.debug) console.log(this.name+": "+action.getDescription());
            TA.App.trigger(this.name+":step");
            action.run(this);
        };

        /**
         * Adds Actions to the Timeline
         *
         * @method TA.Timeline#add
         * @param {TA.TimelineAction[]|TA.TimelineAction} action - either a TA.TimelineAction or an array of TA.TimelineActions
         */
        this.add = function(action) {
            if($.isArray(action)) {
                var that = this;
                $.each(action, function(idx, e) {
                    that.add(e);
                });
            } else {
                if(!$.isFunction(action.run)) {
                    throw new TA.Error.ArgumentException('action', 'TA.TimelineAction', 'action.run not callable in ' + typeof action);
                }
                this.steps.push(action);
            }
            return this;
        };
                
        /**
         * Displays controls to control this timeline in your Webpage
         * 
         * @method TA.Timeline#displayControls
         * @param [jQuery|String] $e - either a jQuery Node object or an ID. The Element gets created if it does not exist.
         * @return {jQuery} the jQuery Node the controls reside in
         */
        
        this.displayControls = function($e) {
            if(!$e) {
                $e = this.name+'_controls';
            }
            if($.type($e) === 'string') {
                if($($e).length===0) {
                    $e = $('<div id="'+$e+'"></div>').appendTo('body');
                } else {
                    $e = $($e);
                }
            }
            
            $e.append('<button href="#" class="tapause">Pause</button>');
            $e.append('<button href="#" class="tastep">Step</button>');
            $e.append('<button href="#" class="taskip">Skip</button>');
            $e.append('<button href="#" class="taplay">Play</button>');
            
            var that = this;
            $e.on('click', '.tapause', function(evt) {
                that.pause();
            }).on('click', '.tastep', function(evt) {
                that.setSingleStep(true);
                that.play();
            }).on('click', '.taskip', function(evt) {
                that.step(1);
                that.setSingleStep(true);
                that.play();
            }).on('click', '.taplay', function(evt) {
                that.setSingleStep(false);
                that.breakOnExecute = false;
                that.play();
            });
            
            
            return $e;
        };
        
        var that=this;
        TA.App.on(this.name+":pause", function() {
            that.breakOnExecute = true;
        });
        TA.App.on(this.name+":start", function() {
            that.go();
        });
        
        return this;
    };

    //expose
    return TA;
}));


