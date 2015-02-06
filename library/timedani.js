(function(root, taapp) {
    "use strict";

    /**
     * The central TAApp object
     *
     * This object cannot be instantiated, it is just a global object
     * @constructor TAApp
     */

    /**
     * Registers an event handler
     *
     * @method TAApp.on
     * @param {String} event
     * @param {Function} callback
     */
    /**
     * Unregisters an event handler
     *
     * @method TAApp.off
     * @param {String} event
     * @param {Function} callback
     */
    /**
     * Triggers an event
     *
     * @method TAApp.trigger
     * @param {String} event
     */
    /**
     * Triggers a start event
     *
     * @method TAApp.start
     * @param {String} event
     */
    /**
     * Returns whether an event has been fired in the past
     *
     * @method TAApp.hasFired
     * @param {String} event
     * @returns {Boolean}
     */
    /**
     * Clears the whole event history
     *
     * use this to clear events you already checked using hasFired
     *
     * @method TAApp.clearEventHistory
     */

    var TAApp = function() {

        var $taapp = $('#taapp');
        $(function() {
            //this might be broken!
            //look at facebook how they inject fb-root
            if(!$('#taapp')) {
                $('<div id="taapp"></div>').appendTo($('body'));
            }
            $taapp=$('#taapp');
        });

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
            $taapp.triggerHandler(evt);
        }

        function start(evt) {
            trigger(evt+":start");
        }

        function on(evt, func) {
            $taapp.on(evt, func);
        }

        function off(evt, func) {
            $taapp.off(evt, func);
        }

        return {
            on: on,
            off: off,
            trigger: trigger,
            start: start
        };
    }();
    /**
     * Interface for Animation objects
     *
     * @interface TAAnimation
     */

    /**
     * Starts the animation
     *
     * @function
     * @name TAAnimation#start
     * @param {TAObject} obj - the TAObject to apply the Animation to
     * @param {Function} [complete] - function to be called when the animation is finished
     */



    /**
     * Interface for general TAObjects
     *
     * @interface TABaseObject
     */
    /**
     * Returns the name of the object
     *
     * @function
     * @name TABaseObject#getName
     * @return {String}
     */
    /**
     * Returns the DOM object
     *
     * @function
     * @name TABaseObject#getElement
     * @return {Object}
     */
    /**
     * Applys the Init Settings
     *
     * @function
     * @name TABaseObject#applyInitSettings
     */
    /**
     * Applys the Deinit Settings
     *
     * @function
     * @name TABaseObject#applyDeinitSettings
     */
    /**
     * Starts the "in" Animation
     *
     * @function
     * @name TABaseObject#startInAni
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the "out" Animation
     *
     * @function
     * @name TABaseObject#startOutAni
     * @param {Function} [complete] - function to be called once all animations are finished
     */


    /**
     * Interface for general TACompositions
     *
     * @interface TABaseComposition
     */
    /**
     * Returns the name of the object
     *
     * @function
     * @name TABaseComposition#getName
     * @return {String}
     */
    /**
     * Register a TABaseObject in this composition
     *
     * @function
     * @name TABaseComposition#register
     * @param {TABaseObject} obj
     */
    /**
     * Starts the "in" Animation
     *
     * @function
     * @name TABaseComposition#startInAni
     * @param {Function} [complete] - function to be called once all animations are finished
     */
    /**
     * Starts the "out" Animation
     *
     * @function
     * @name TABaseComposition#startOutAni
     * @param {Function} [complete] - function to be called once all animations are finished
     */



    /**
     * Interface for TAObjectSettings
     *
     * @interface TAObjectSettings
     */
    /**
     * Applys the initializing Setting to an object
     *
     * @function
     * @name TAObjectSettings#applyInit
     * @param {Object} e - DOM Element to apply Settings to
     */
    /**
     * Applys the deinitializing Setting to an object
     *
     * @function
     * @name TAObjectSettings#applyDeinit
     * @param {Object} e - DOM Element to apply Settings to
     */


    /**
     * Interface for TATimelineActions
     *
     * @interface TATimelineAction
     */
    /**
     * Runs the action
     *
     * @function
     * @name TATimelineAction#run
     * @param {TATimeline} tl - the current timeline object
     */
    /**
     * Gets the description
     *
     * @function
     * @name TATimelineAction#getDescription
     * @returns {String}
     */



    /**
     * TAEventConverter listens for multiple events and once all where triggered triggers a new one
     *
     * @constructor TAEventConverter
     * @param {String[]} sources - Array of events to listen for
     * @param {String} target - event to trigger
     */
    function TAEventConverter(sources, target) {

        this.events = [];
        var that = this;
        function listen(evt) {
            if(that.events.indexOf(evt) !== -1) {
                return;
            }

            that.events.push(evt);
            if(that.events.length === sources.length) {
                that.events = [];
                TAApp.trigger(target);
            }
        }

        /**
         * activates the converter (done implicitly by the constructor)
         *
         * @method TAEventConverter#activate
         */
        this.activate = function() {
            sources.forEach(function(s) {
                TAApp.on(s,listen);
            });
        };

        /**
         * deactivates the converter
         *
         * @method TAEventConverter#deactivate
         */
        this.deactivate = function() {
            sources.forEach(function(s) {
                TAApp.off(s,listen);
            });
        };

        this.activate();
    }

    /**
     * Settings class to apply multiple Settings to an object
     *
     * @implements TASettings
     * @param {TASettings[]} [settings] - Array of settings objects
     * @constructor TACombinedSettings
     */
    function TACombinedSettings(settings) {

        this.list = settings || [];

        /**
         * add a settings object
         *
         * @method TACombinedSettings#addSettings
         * @param {TASettings} [settings]
         */
        this.addSettings = function(settings) {
            if(settings)
                this.list.push(settings);
        };

        /**
         * @method TACombinedSettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            this.list.forEach(function(o) {
                o.applyInit($e);
            });
        };

        /**
         * @method TACombinedSettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            this.list.forEach(function(o) {
                o.applyDeinit($e);
            });
        }
    }

    /**
     * Settings class to apply CSS Settings to an object
     *
     * @implements TAObjectSettings
     * @param {Object} [init] - CSS settings
     * @param {Object} [deinit] - CSS settings
     * @constructor TACssSettings
     */
    function TACssSettings(init, deinit) {

        this.init = init || {};
        this.deinit = deinit || {};

        /**
         * @method TACssSettings#applyInit
         * @inheritdoc
         */
        this.applyInit = function($e) {
            if(this.init) $e.css(this.init);
        };

        /**
         * @method TACssSettings#applyDeinit
         * @inheritdoc
         */
        this.applyDeinit = function($e) {
            if(this.deinit) $e.css(this.deinit);
        };
    }

    /**
     * A TAObjectSettings object that does nothing
     *
     * @implements TAObjectSettings
     * @constructor TADummySettings
     */
    function TADummySettings() {

        this.applyInit = this.applyDeinit = function(e) {};
    }


    /**
     * A TAAnimation object that does nothing
     *
     * @implements TAAnimation
     * @constructor TADummyAnimation
     */
    function TADummyAnimation() {
        this.start = function(obj, complete) { if(complete)complete(this); };
    }

    /**
     * A TAAnimation object that just defers the start call to the supplied user defined function
     *
     * @implements TAAnimation
     * @param {Function} func - user defined function that gets the start() call forwarded (it needs to call complete after it's finished)
     * @constructor TAFunctionAnimation
     */
    function TAFunctionAnimation(func) {

        /**
         * @method TAFunctionAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            func(obj, complete);
        }
    }

    /**
     * A TAAnimation object that chains multiple animations sequentially
     *
     * @implements TAAnimation
     * @param {TAAnimation[]} animations - array of TAAnimation objects
     * @constructor TAChainedAnimation
     */
    function TAChainedAnimation(animations) {

        this.animations = animations || [];

        /**
         * adds another animation to the queue
         *
         * @method TAChainedAnimation#addAnimation
         * @param {TAAnimation} animation - the animation to add
         */
        this.addAnimation = function(animation) {
            this.animations.push(animation);
        };

        /**
         * @method TAChainedAnimation#start
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
     * A TAAnimation object that executes multiple animations in parallel
     *
     * Keep in mind that some animation libraries need extra parameter to allow parallel animation execution
     *
     * @param {TAAnimation[]} animations - array of TAAnimation objects
     * @constructor TAParallelAnimation
     */
    function TAParallelAnimation(animations) {

        this.animations = animations || [];

        /**
         * adds another animation to the queue
         *
         * @method TAParallelAnimation#addAnimation
         * @param {TAAnimation} animation - the animation to add
         */
        this.addAnimation = function(animation) {
            this.animations.push(animation);
        };

        /**
         * @method TAParallelAnimation#start
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
            this.animations.forEach(function(o) {
                o.start(obj, subComplete);
            });
        };
    }

    /**
     * TAAnimation object that delays the animation
     *
     * @implements TAAnimation
     * @param {TAAnimation} animation - animation to execute
     * @param {Integer} delay - delay in milliseconds
     * @constructor TADelayedAnimation
     */
    function TADelayedAnimation(animation, delay) {

        /**
         * @method TADelayedAnimation#start
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
     * TAAnimation object that starts the animation in the background and completes instantly
     *
     * @implements TAAnimation
     * @param {TAAnimation} animation - the animation to start in the background
     * @constructor TABackgroundAnimation
     */
    function TABackgroundAnimation(animation) {

        /**
         * @method TABackgroundAnimation#start
         * @inheritdoc
         */
        this.start = function(obj, complete) {
            complete(this);
            animation.start(obj, function(){});
        }
    }

    /**
     * TAAnimation object that repeats the animation count number times
     *
     * @implements TAAnimation
     * @param {Integer} count - number of times to repeat the animation
     * @param {TAAnimation} animation - the animation to repeat
     * @constructor TARepeatAnimation
     */
    function TARepeatAnimation(count, animation) {

        /**
         * @method TARepeatAnimation#start
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
     * TAAnimation object that repeats the animation while the predicate returns true
     *
     * @implements TAAnimation
     * @param {Function} predicate - function that returns true to repeat the animation or false to complete it
     * @param {TAAnimation} animation - the animation to repeat
     * @constructor TARepeatAnimation
     */
    function TARepeatWhileAnimation(predicate, animation) {

        /**
         * @method TARepeatAnimation#start
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
     * TAAnimation object that uses velocity.js to do the animation
     *
     * @param {Object} properties - velocity.js animation properties
     * @param {Object} [options] - velocity.js animation options
     * @constructor TAVelocityAnimation
     */
    function TAVelocityAnimation(properties, options) {
        this.properties = properties || {};
        this.options = options || {};

        /**
         * @method TAVelocityAnimation#start
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
     * TABaseObject that represents a real object
     *
     * @implements TABaseObject
     * @param {String} name - name of the object
     * @param {Object} $e - DOM element of the object
     * @param {Object} anis - object that contains TAAnimation (anis.inAni and anis.outAni - both are options)
     * @param {TAObjectSettings} settings - object settings
     * @constructor TAObject
     */
    function TAObject(name, $e, anis, settings) {
        this.name = name;
        this.anis = anis || {};
        this.$e = $e;
        this.settings = new TACombinedSettings([settings]);

        if(!this.anis.inAni) {
            this.anis.inAni = new TADummyAnimation();
        }
        if(!this.anis.outAni) {
            this.anis.outAni = new TADummyAnimation();
        }

        /**
         * @method TAObject#getName
         * @inheritdoc
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * @method TAObject#getElement
         * @inheritdoc
         */
        this.getElement = function() {
            return this.$e;
        };

        /**
         * @method TAObject#addSettings
         * @param {TASettings} [settings] - settings object to add
         */
        this.addSettings = function(settings) {
            this.settings.addSettings(settings);
        };

        /**
         * @method TAObject#applyInitSettings
         * @inheritdoc
         */
        this.applyInitSettings = function() {
            this.settings.applyInit(this.getElement());
        };

        /**
         * @method TAObject#applyDeinitSettings
         * @inheritdoc
         */
        this.applyDeinitSettings = function() {
            this.settings.applyDeinit(that.getElement());
        };

        function startAni(obj, ani, name) {
            return function(complete) {
                ani.start(obj, function () {
                    TAApp.trigger(obj.getName() + ":" + name);
                    if(complete) complete(obj);
                });
            };
        }

        var that = this;

        /**
         * @method TAObject#startInAni
         * @inheritdoc
         */
        this.startInAni = function(complete) {
            this.applyInitSettings();
            startAni(this, this.anis.inAni, "in")(complete);
        };

        /**
         * @method TAObject#startOutAni
         * @inheritdoc
         */
        this.startOutAni = function(complete) {

            startAni(this, this.anis.outAni, "out")(function(obj) {
                that.applyDeinitSettings();
                if(complete)complete(obj);
            });
        };

        TAApp.on(this.name+":in:start", function() { that.startInAni(); });
        TAApp.on(this.name+":out:start", function() { that.startOutAni(); });
    }


    /**
     * TABaseObject that delays animation execution
     *
     * @implements TABaseObject
     * @param {TABaseObject} obj - the object to delay
     * @param {Object} delays - object with delays in milliseconds (delays.inAni and delays.outAni)
     * @constructor TADelayedObject
     */
    function TADelayedObject(obj, delays) {
        this.obj = obj;
        this.delays = delays || {};

        /**
         * @method TADelayedObject#startInAni
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
         * @method TADelayedObject#startOutAni
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
         * @method TADelayedObject#applyInitSettings
         * @inheritdoc
         */
        this.applyInitSettings = function() {
            this.obj.applyInitSettings();
        };

        /**
         * @method TADelayedObject#applyDeinitSettings
         * @inheritdoc
         */
        this.applyDeinitSettings = function() {
            this.obj.applyDeinitSettings();
        };

        /**
         * @method TADelayedObject#getName
         * @inheritdoc
         */
        this.getName = function() {
            return this.obj.getName();
        };

        /**
         * @method TADelayedObject#getElement
         * @inheritdoc
         */
        this.getElement = function() {
            return this.obj.getElement();
        };
    }

    /**
     * TABaseComposition object that handles basic composition
     *
     * @implements TABaseComposition
     * @param {String} name - name of this composition
     * @constructor TAComposition
     */
    function TAComposition(name) {
        this.name = name;
        this.objects = [];

        /**
         * @method TAComposition#register
         * @inheritdoc
         */
        this.register = function(obj) {
            this.objects.push(obj);
        };

        /**
         * @method TAComposition#getName
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
                        TAApp.trigger(obj.getName()+":"+name);
                        if(complete) complete(obj);
                    }
                };
                subComplete.count=0;
                obj.objects.forEach(function(o) {
                    o[ani](subComplete);
                });
            };
        }

        /**
         * @method TAComposition#startInAni
         * @inheritdoc
         */
        this.startInAni = startAni(this, "startInAni", "in");

        /**
         * @method TAComposition#startOutAni
         * @inheritdoc
         */
        this.startOutAni = startAni(this, "startOutAni", "out");

        var that = this;
        TAApp.on(this.name+":in:start", function() { that.startInAni(); });
        TAApp.on(this.name+":out:start", function() { that.startOutAni(); });
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_start
     */
    function TATimelineAction_start(action) {

        this.getDescription = function() {
            return "start("+action+")";
        };

        this.run = function(tl) {
            TAApp.start(action);
            tl.next();
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_trigger
     */
    function TATimelineAction_trigger(action) {

        this.getDescription = function() {
            return "start("+action+")";
        };

        this.run = function(tl) {
            TAApp.trigger(action);
            tl.next();
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_waitFor
     */
    function TATimelineAction_waitFor(action) {

        this.getDescription = function() {
            return "waitFor("+action+")";
        };

        this.run = function(tl) {
            var func = function() {
                TAApp.off(action, func);
                tl.next();
            };
            TAApp.on(action, func);
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_delay
     */
    function TATimelineAction_delay(msecs) {

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
     * @implements TATimelineAction
     * @constructor TATimelineAction_loop
     */
    function TATimelineAction_loop() {

        this.getDescription = function() {
            return "loop()";
        };

        this.run = function(tl) {
            tl.rewind();
            tl.execute();
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_step
     */
    function TATimelineAction_step(steps) {

        this.getDescription = function() {
            return "step("+steps+")";
        };

        this.run = function(tl) {
            tl.step(steps);
            tl.execute();
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_label
     */
    function TATimelineAction_label(name) {

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
     * @implements TATimelineAction
     * @constructor TATimelineAction_jumpTo
     */
    function TATimelineAction_jumpTo(label) {

        this.getDescription = function() {
            return "jumpTo("+label+")";
        };

        this.run = function(tl) {
            tl.jumpToLabel(label);
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_startAndWaitFor
     */
    function TATimelineAction_startAndWaitFor(action) {

        this.getDescription = function() {
            return "startAndWaitFor("+action+")";
        };

        this.run = function(tl) {
            var func = function() {
                TAApp.off(action, func);
                tl.next();
            };
            TAApp.on(action, func);
            TAApp.start(action);
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_execute
     */
    function TATimelineAction_execute(func) {

        this.getDescription = function() {
            return "execute(userFunc)";
        };

        this.run = function(tl) {
            func(tl);
        };
    }

    /**
     * @implements TATimelineAction
     * @constructor TATimelineAction_if
     */
    function TATimelineAction_if(func, action) {

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
     * @implements TATimelineAction
     * @constructor TATimelineAction_stop
     */
    function TATimelineAction_stop() {

        this.getDescription = function() {
            return "stop()";
        };

        this.run = function(tl) {
        };
    }

    /**
     * Describer for a TATimeline actions
     *
     * This is for convenience. It create TATimelineAction objects for ease of use
     *
     * @constructor TATimelineDescriber
     */
    function TATimelineDescriber() {

        /**
         * Triggers a start event
         *
         * @method TATimelineDescriber#start
         * @param {String} action - event name
         * @returns {TATimelineAction}
         */
        this.start = function(action) {
            return new TATimelineAction_start(action);
        };

        /**
         * Triggers an event
         *
         * @method TATimelineDescriber#trigger
         * @param {String} action - event name
         * @returns {TATimelineAction}
         */
        this.trigger = function(action) {
            return new TATimelineAction_trigger(action);
        };

        /**
         * Waits for an event to be triggered
         *
         * @method TATimelineDescriber#waitFor
         * @param {String} action - event name
         * @returns {TATimelineAction}
         */
        this.waitFor = function(action) {
            return new TATimelineAction_waitFor(action);
        };

        /**
         * Triggers a start event and waits for it to complete
         *
         * @method TATimelineDescriber#startAndWaitFor
         * @param {String} action - event name
         * @returns {TATimelineAction}
         */
        this.startAndWaitFor = function(action) {
            return new TATimelineAction_startAndWaitFor(action);
        };

        /**
         * Delays the next action
         *
         * @method TATimelineDescriber#delay
         * @param {Integer} msecs - time in milliseconds
         * @returns {TATimelineAction}
         */
        this.delay = function(msecs) {
            return new TATimelineAction_delay(msecs);
        };

        /**
         * Steps to another event in the timeline
         *
         * @method TATimelineDescriber#step
         * @param {Integer} steps - positive or negative amount of steps to take
         * @returns {TATimelineAction}
         */
        this.step = function(steps) {
            return new TATimelineAction_step(steps);
        };

        /**
         * Defines a label
         *
         * @method TATimelineDescriber#label
         * @param {String} name - label name
         * @returns {TATimelineAction}
         */
        this.label = function(name) {
            return new TATimelineAction_label(name);
        };

        /**
         * Jumps to a label (skipping all other steps)
         *
         * @method TATimelineDescriber#jumpTo
         * @param {String} label - label name
         * @returns {TATimelineAction}
         */
        this.jumpTo = function(label) {
            return new TATimelineAction_jumpTo(label);
        };

        /**
         * Executes a user defined function
         *
         * this function gets the current TATimeline object as only parameter and needs to call tl.next() on it (otherwise the execution will halt)
         * @method TATimelineDescriber#execute
         * @param {Function} func - a user defined function
         * @returns {TATimelineAction}
         */
        this.execute = function(func) {
            return new TATimelineAction_execute(func);
        };

        /**
         * Rewinds the timeline to the start and continues from there
         *
         * @method TATimelineDescriber#loop
         * @returns {TATimelineAction}
         */
        this.loop = function() {
            return new TATimelineAction_loop();
        };

        /**
         * Stops the timeline
         *
         * @method TATimelineDescriber#stop
         * @returns {TATimelineAction}
         */
        this.stop = function() {
            return new TATimelineAction_stop();
        };

        /**
         * Executes an event if a user defined function returns true
         *
         * @method TATimelineDescriber#executeIf
         * @param {Function} func - a user defined predicate
         * @param {TATimelineAction} action - a TATimelineAction to execute of the predicate returns true
         * @returns {TATimelineAction}
         */
        this.executeIf = function(func, action) {
            return new TATimelineAction_if(func, action);
        };
    }

    /**
     * A basic Timeline object
     *
     * @param {String} name - name of the timeline
     * @constructor TATimeline
     */
    function TATimeline(name) {
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
         * @method TATimeline#setDebug
         * @param {Boolean} dbg
         */
        this.setDebug = function(dbg) {
            this.debug = dbg;
        };

        /**
         * Sets the single step value
         *
         * @method TATimeline#setSingleStep
         * @param {Boolean} singleStepValue
         */
        this.setSingleStep = function(singleStepValue) {
            this.singleStepMode = singleStepValue;
        };

        /**
         * Returns a TATimelineDescriber object for convenience
         *
         * @method TATimeline#getDescriber
         * @returns {TATimelineDescriber}
         */
        this.getDescriber = function() {
            return new TATimelineDescriber();
        };

        /**
         * Returns the timeline name
         *
         * @method TATimeline#getName
         * @returns {String}
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * Starts the execution
         *
         * @method TATimeline#go
         */
        /**
         * Starts the execution
         *
         * @method TATimeline#play
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
         * @method TATimeline#pause
         */
        this.pause = function() {
            this.breakOnExecute = true;
        };

        /**
         * Jumps to a label and starts the execution from there
         *
         * @method TATimeline#jumpToLabel
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
         * @method TATimeline#rewind
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
         * @method TATimeline#add
         * @param {TATimelineAction[]|TATimelineAction} action - either a TATimelineAction or an array of TATimelineActions
         */
        this.add = function(action) {
            if($.isArray(action)) {
                var that = this;
                action.forEach(function(e) {
                    that.add(e);
                });
            } else {
                this.steps.push(action);
            }
        };
    }


    //expose
    root[taapp] = {};
    root[taapp].TAApp = TAApp;
    root[taapp].TAObject = TAObject;
    root[taapp].TADelayedObject = TADelayedObject;
    root[taapp].TAFunctionAnimation = TAFunctionAnimation;
    root[taapp].TABackgroundAnimation = TABackgroundAnimation;
    root[taapp].TARepeatAnimation = TARepeatAnimation;
    root[taapp].TARepeatWhileAnimation = TARepeatWhileAnimation;
    root[taapp].TAVelocityAnimation = TAVelocityAnimation;
    root[taapp].TAParallelAnimation = TAParallelAnimation;
    root[taapp].TAChainedAnimation = TAChainedAnimation;
    root[taapp].TADelayedAnimation = TADelayedAnimation;
    root[taapp].TATimeline = TATimeline;
    root[taapp].TAComposition = TAComposition;
    root[taapp].TAEventConverter = TAEventConverter;
    root[taapp].TACssSettings = TACssSettings;
    root[taapp].TACombinedSettings = TACombinedSettings;
})(window, 'TAApp');


