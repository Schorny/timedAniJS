/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function($, document) {
    var origTimeline = TA.Timeline;

    TA.Timeline = function() {
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
                if($($e).length === 0) {
                    $e = $('<div></div>').attr('id', $e);
                } else {
                    $e = $($e);
                }
            }

            var $btn = $('<button></button>'),
                btns = [
                    $btn.clone().addClass('tapause').text('Pause'),
                    $btn.clone().addClass('tastep').text('Step'),
                    $btn.clone().addClass('taskip').text('Skip'),
                    $btn.clone().addClass('taplay').text('Play')
                ]
            ;
            $e.append(btns);

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

            if (!$.contains(document.documentElement, $e[0])) {
                $e.appendTo('body');
            }

            return $e;
        };

        return origTimeline.apply(this, arguments);
    };
})(jQuery, document);
