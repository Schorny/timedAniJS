(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.TA = factory();
    }
}(this, function() {
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
    /**
     * Returns whether an event has been fired in the past
     *
     * @method TA.App.hasFired
     * @param {String} event
     * @returns {Boolean}
     */
    /**
     * Clears the whole event history
     *
     * use this to clear events you already checked using hasFired
     *
     * @method TA.App.clearEventHistory
     */

    TA.App = (function() {

        var $app = $('#taapp');

        function ensureNodeExists() {
            if(!$app.length) {
                $('<div id="taapp"></div>').appendTo($('body'));
                $app = $('#taapp');
            }
        }

        //TODO: check if own event bus might be better
        var eventHistory = [];

        function hasFired(evt) {
            return eventHistory.indexOf(evt) !== -1;
        }

        function clearEventHistory() {
            eventHistory = [];
        }

        function trigger(evt) {
            eventHistory.push(evt);
            ensureNodeExists();
            $app.triggerHandler(evt);
        }

        function start(evt) {
            trigger(evt+":start");
        }

        function on(evt, func) {
            ensureNodeExists();
            $app.on(evt, func);
        }

        function off(evt, func) {
            ensureNodeExists();
            $app.off(evt, func);
        }

        return {
            on: on,
            off: off,
            trigger: trigger,
            start: start,
            hasFired: hasFired,
            clearEventHistory: clearEventHistory
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
     * Applys the Init Settings
     *
     * @function
     * @name TA.BaseObject#applyInitSettings
     */
    /**
     * Applys the Deinit Settings
     *
     * @function
     * @name TA.BaseObject#applyDeinitSettings
     */
    /**
     * Starts the "in" Animation
     *
     * @function
     * @name TA.BaseObject#startInAni
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the "out" Animation
     *
     * @function
     * @name TA.BaseObject#startOutAni
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
     * @name TA.BaseComposition#startInAni
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the "out" Animation
     *
     * @function
     * @name TA.BaseComposition#startOutAni
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
            if(that.events.indexOf(evt) !== -1) {
                return;
            }

            that.events.push(evt);
            if(that.events.length === sources.length) {
                that.events = [];
                TA.App.trigger(target);
            }
        }

        /**
         * activates the converter (done implicitly by the constructor)
         *
         * @method TA.EventConverter#activate
         */
        this.activate = function() {
            $.each(sources, function(s) {
                TA.App.on(s,listen);
            });
        };

        /**
         * deactivates the converter
         *
         * @method TA.EventConverter#deactivate
         */
        this.deactivate = function() {
            $.each(sources, function(s) {
                TA.App.off(s,listen);
            });
        };

        this.activate();
    }

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
         * @param {TA.Settings} [settings]
         */
        this.addSettings = function(settings) {
            if(settings) {
                if($.isArray(settings)) {
                    var that = this;
                    $.each(settings, function(o) {
                        that.addSettings(o);
                    });
                } else {
                    this.list.push(settings);
                }
            }
        };

        /**
         * @method TA.CombinedSettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            $.each(this.list, function(o) {
                o.applyInit($e);
            });
        };

        /**
         * @method TA.CombinedSettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            $.each(this.list, function(o) {
                o.applyDeinit($e);
            });
        }

        this.addSettings(settings);
    }

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

        /**
         * @method TA.CssSettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            if(this.init) $e.css(this.init);
        };

        /**
         * @method TA.CssSettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            if(this.deinit) $e.css(this.deinit);
        };
    }

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

        /**
         * @method TA.VelocitySettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            if(this.init) $e.velocity(this.init);
        };

        /**
         * @method TA.VelocitySettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            if(this.deinit) $e.velocity(this.deinit);
        };
    }

    /**
     * A TA.ObjectSettings object that does nothing
     *
     * @implements TA.ObjectSettings
     * @constructor TA.DummySettings
     */
    TA.DummySettings = function() {

        this.applyInit = this.applyDeinit = function(e) {};
    }


    /**
     * A TA.Animation object that does nothing
     *
     * @implements TA.Animation
     * @constructor TA.DummyAnimation
     */
    TA.DummyAnimation = function() {
        this.start = function(obj, complete) { if(complete)complete(this); };
    }

    /**
     * A TA.Animation object that just defers the start call to the supplied user defined function
     *
     * @implements TA.Animation
     * @param {Function} func - user defined function that gets the start() call forwarded (it needs to call complete after it's finished)
     * @constructor TA.FunctionAnimation
     */
    TA.FunctionAnimation = function(func) {

        /**
         * @method TA.FunctionAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            func(obj, complete);
        }
    }

    /**
     * A TA.Animation object that chains multiple animations sequentially
     *
     * @implements TA.Animation
     * @param {TA.Animation[]} animations - array of TA.Animation objects
     * @constructor TA.ChainedAnimation
     */
    TA.ChainedAnimation = function(animations) {

        this.animations = animations || [];

        /**
         * adds another animation to the queue
         *
         * @method TA.ChainedAnimation#addAnimation
         * @param {TA.Animation} animation - the animation to add
         */
        this.addAnimation = function(animation) {
            this.animations.push(animation);
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
        };
    }

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

        /**
         * adds another animation to the queue
         *
         * @method TA.ParallelAnimation#addAnimation
         * @param {TA.Animation} animation - the animation to add
         */
        this.addAnimation = function(animation) {
            this.animations.push(animation);
        };

        /**
         * @method TA.ParallelAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var animCount = this.animations.length;
            var that = this;
            var subComplete = function() {
                ++subComplete.count;
                if(subComplete.count == animCount) {
                    if(complete) complete(that);
                }
            };
            subComplete.count = 0;
            $.each(this.animations, function(o) {
                o.start(obj, subComplete);
            });
        };
    }

    /**
     * TA.Animation object that delays the animation
     *
     * @implements TA.Animation
     * @param {TA.Animation} animation - animation to execute
     * @param {Integer} delay - delay in milliseconds
     * @constructor TA.DelayedAnimation
     */
    TA.DelayedAnimation = function(animation, delay) {

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
        };
    }

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
        }
    }

    /**
     * TA.Animation object that repeats the animation count number times
     *
     * @implements TA.Animation
     * @param {Integer} count - number of times to repeat the animation
     * @param {TA.Animation} animation - the animation to repeat
     * @constructor TA.RepeatAnimation
     */
    TA.RepeatAnimation = function(count, animation) {

        /**
         * @method TA.RepeatAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var idx = 0;
            var that = this;
            var subComplete = function() {
                if(idx >= count) {
                    complete(that);
                    return;
                }
                ++idx;
                animation.start(obj, subComplete);
            };
            subComplete();
        }
    }

    /**
     * TA.Animation object that repeats the animation while the predicate returns true
     *
     * @implements TA.Animation
     * @param {Function} predicate - function that returns true to repeat the animation or false to complete it
     * @param {TA.Animation} animation - the animation to repeat
     * @constructor TA.RepeatAnimation
     */
    TA.RepeatWhileAnimation = function(predicate, animation) {

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
        }
    }




    /**
     * TA.Animation object that uses velocity.js to do the animation
     *
     * @param {Object} properties - velocity.js animation properties
     * @param {Object} [options] - velocity.js animation options
     * @constructor TA.VelocityAnimation
     */
    TA.VelocityAnimation = function(properties, options) {
        this.properties = properties || {};
        this.options = options || {};

        /**
         * @method TA.VelocityAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            var tempOptions = this.options;
            var that = this;

            //TODO: chaining with current complete, dont overwrite user data

            tempOptions.complete = function() {
                if(complete) complete(that);

            };
            obj.getElement().velocity(this.properties, tempOptions);
        };
    }

    /**
     * TA.BaseObject that represents a real object
     *
     * @implements TA.BaseObject
     * @param {String} name - name of the object
     * @param {Object} $e - DOM element of the object
     * @param {Object} anis - object that contains TA.Animation (anis.inAni and anis.outAni - both are options)
     * @param {TA.ObjectSettings} settings - object settings
     * @constructor TA.Object
     */
    TA.Object = function(name, $e, anis, settings) {
        this.name = name;
        this.anis = anis || {};
        this.$e = $e;
        this.settings = new TA.CombinedSettings([settings]);

        if(!this.anis.inAni) {
            this.anis.inAni = new TA.DummyAnimation();
        }
        if(!this.anis.outAni) {
            this.anis.outAni = new TA.DummyAnimation();
        }

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

        /**
         * @method TA.Object#applyInitSettings
         * @inheritdoc
         */
        this.applyInitSettings = function() {
            this.settings.applyInit(this.getElement());
        };

        /**
         * @method TA.Object#applyDeinitSettings
         * @inheritdoc
         */
        this.applyDeinitSettings = function() {
            this.settings.applyDeinit(that.getElement());
        };

        function startAni(obj, ani, name) {
            return function(complete) {
                ani.start(obj, function () {
                    TA.App.trigger(obj.getName() + ":" + name);
                    if(complete) complete(obj);
                });
            };
        }

        var that = this;

        /**
         * @method TA.Object#startInAni
         * @inheritdoc
         */
        this.startInAni = function(complete) {
            this.applyInitSettings();
            startAni(this, this.anis.inAni, "in")(complete);
        };

        /**
         * @method TA.Object#startOutAni
         * @inheritdoc
         */
        this.startOutAni = function(complete) {

            startAni(this, this.anis.outAni, "out")(function(obj) {
                that.applyDeinitSettings();
                if(complete)complete(obj);
            });
        };

        TA.App.on(this.name+":in:start", function() { that.startInAni(); });
        TA.App.on(this.name+":out:start", function() { that.startOutAni(); });
    }


    /**
     * TA.BaseObject that delays animation execution
     *
     * @implements TA.BaseObject
     * @param {TA.BaseObject} obj - the object to delay
     * @param {Object} delays - object with delays in milliseconds (delays.inAni and delays.outAni)
     * @constructor TA.DelayedObject
     */
    TA.DelayedObject = function(obj, delays) {
        this.obj = obj;
        this.delays = delays || {};

        /**
         * @method TA.DelayedObject#startInAni
         * @inheritdoc
         */
        this.startInAni = function(complete) {
            var delay = this.delays.inAni || 0;
            var that = this;
            this.obj.applyInitSettings();
            setTimeout(function() {
                that.obj.startInAni(complete);
            }, delay);
        };

        /**
         * @method TA.DelayedObject#startOutAni
         * @inheritdoc
         */
        this.startOutAni = function(complete) {
            var delay = this.delays.outAni || 0;
            var that = this;
            setTimeout(function() {
                that.obj.startOutAni(complete);
            }, delay);
        };

        /**
         * @method TA.DelayedObject#applyInitSettings
         * @inheritdoc
         */
        this.applyInitSettings = function() {
            this.obj.applyInitSettings();
        };

        /**
         * @method TA.DelayedObject#applyDeinitSettings
         * @inheritdoc
         */
        this.applyDeinitSettings = function() {
            this.obj.applyDeinitSettings();
        };

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
    }

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

        /**
         * @method TA.Composition#register
         * @inheritdoc
         */
        this.register = function(obj) {
            this.objects.push(obj);
        };

        /**
         * @method TA.Composition#getName
         * @inheritdoc
         */
        this.getName = function() {
            return this.name;
        };

        function startAni(obj, ani, name) {
            return function(complete) {
                var objCount = obj.objects.length;
                var subComplete = function() {
                    ++subComplete.count;
                    if(subComplete.count == objCount) {
                        TA.App.trigger(obj.getName()+":"+name);
                        if(complete) complete(obj);
                    }
                };
                subComplete.count=0;
                $.each(obj.objects, function(o) {
                    o[ani](subComplete);
                });
            };
        }

        /**
         * @method TA.Composition#startInAni
         * @inheritdoc
         */
        this.startInAni = startAni(this, "startInAni", "in");

        /**
         * @method TA.Composition#startOutAni
         * @inheritdoc
         */
        this.startOutAni = startAni(this, "startOutAni", "out");

        var that = this;
        TA.App.on(this.name+":in:start", function() { that.startInAni(); });
        TA.App.on(this.name+":out:start", function() { that.startOutAni(); });
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
         * Stops the timeline
         *
         * @method TA.TimelineDescriber#stop
         * @returns {TA.TimelineAction}
         */
        this.stop = function() {
            return new TA.TimelineAction_stop();
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
    }

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
        this.breakOnExecute = false;
        this.singleStepMode = false;

        /**
         * Sets the debug value
         *
         * @method TA.Timeline#setDebug
         * @param {Boolean} dbg
         */
        this.setDebug = function(dbg) {
            this.debug = dbg;
        };

        /**
         * Sets the single step value
         *
         * @method TA.Timeline#setSingleStep
         * @param {Boolean} singleStepValue
         */
        this.setSingleStep = function(singleStepValue) {
            this.singleStepMode = singleStepValue;
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
            var that = this;
            setTimeout(function() {
                that.execute();
            }, 0);
        };

        /**
         * Halts the execution
         *
         * @method TA.Timeline#pause
         */
        this.pause = function() {
            this.breakOnExecute = true;
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
                throw "Unknown Label '" + label + "'";
            },0);
        };

        this.step = function(offset) {
            this.curPos += offset;
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
        };

        this.next = function() {
            this.step(1);
            this.execute();
        };

        this.execute = function() {
            if(this.curPos >= this.steps.length) {
                return;
            }

            if(this.breakOnExecute) {
                this.breakOnExecute = false;
                return;
            }

            if(this.singleStepMode) {
                this.breakOnExecute = true;
            }

            var action = this.steps[this.curPos];
            if(this.debug) console.log(this.name+": "+action.getDescription());
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
                $.each(action, function(e) {
                    console.log(e);
                    that.add(e);
                });
            } else {
                this.steps.push(action);
            }
        };
    }


    //expose
    return TA;

}));


