# TA.Animation

*TA.Animation* Objects are descriptions on **how** to animate an object. They can use [jQuery.animate](http://api.jquery.com/animate/), [velocity.js](http://julian.com/research/velocity/), [GSAP](http://greensock.com/gsap) or the other libraries for that purpose.

*TA.Animation* Objects have optionally own *TA.Settings* objects to apply before and/or after the animation is finished.

There are 2 types of animations in TA: Concrete-Animations and [Decorator](https://en.wikipedia.org/wiki/Decorator_pattern)-Animations.
There are currently the following concrete Animation classes available:

- TA.JQueryAnimation
- TA.VelocityAnimation
- TA.FunctionAnimation
- TA.DummyAnimation
 
These classes implement a concrete animation like a fade-in or move animation.

There are currently the following decorator Animation classes available:

- TA.RepeatWhileAnimation
- TA.RepeatAnimation
- TA.BackgroundAnimation
- TA.DelayedAnimation
- TA.ParallelAnimation
- TA.ChainedAnimation

These classes are just decorators for concrete Animations and add functionality without altering the concrete Animation.

## TA.JQueryAnimation ([JSDoc](/external/doc/TA.JQueryAnimation.html))
It uses `jQuery.animate` to do the animation. The first and second parameters are the two objects `jQuery.animate` takes. The optional third parameter is a *TA.Settings* object.

```javascript
var fadeIn = new TA.JQueryAnimation(
  {opacity:1},
  {duration:1000},
  new TA.CssSettings({display:inline, opacity:0})
);
```

## TA.VelocityAnimation ([JSDoc](/external/doc/TA.VelocityAnimation.html))
It uses *velocity.js* to do the animation. The first and second parameters are the two objects `jQuery.velocity` takes. The optional third parameter is a *TA.Settings* object.

```javascript
var fadeIn = new TA.VelocityAnimation(
  {opacity:1},
  {duration:1000},
  new TA.CssSettings({display:inline, opacity:0})
);
```

## TA.DummyAnimation ([JSDoc](/external/doc/TA.DummyAnimation.html))
*TA.DummyAnimation* is a class that you probably will never use. It does nothing but confirms to the *TA.Animation* interface. It can be used as `noop` in situations where a *TA.Animation* object is needed but no animation should be played.

## TA.RepeatWhileAnimation ([JSDoc](/external/doc/TA.RepeatWhileAnimation.html))
This is a decorator for an animation. It takes a *predicate* as first parameter, which is a function that returns true or false. As long as the *predicate* returns *true* the *animation* (second parameter) gets started again after it finishes.
```javascript
var pulseAnimation = new TA.RepeatWhileAnimation(function() {
  return !TA.StatusHandler.check('something:in');
}, someAnimation);
```

## TA.RepeatAnimation ([JSDoc](/external/doc/TA.RepeatAnimation.html))
This is a decorator for an animation. It takes the number of times to repeat the animation as first parameter and the animation itself as second.
```javascript
var loopAnimation = new TA.RepeatAnimation(10, someAnimation);
```

## TA.BackgroundAnimation ([JSDoc](/external/doc/TA.BackgroundAnimation.html))
This is a decorator for an animation. It pretends the animation finishes instantly making the animation run in the background.
```javascript
var bgAnimation = new TA.BackgroundAnimation(someAnimation);
```

## TA.DelayedAnimation ([JSDoc](/external/doc/TA.DelayedAnimation.html))
This is a decorator for an animation. It delays the execution of the animation by *delay* milliseconds.
```javascript
var delayedAnimation = new TA.DelayedAnimation(someAnimation, 2000);
```

## TA.ParallelAnimation ([JSDoc](/external/doc/TA.ParallelAnimation.html))
This is a decorator for an animation. It takes an array of *TA.Animation*s and executes them in parallel, meaning at the same time. It finishes once the last animation is finished.
```javascript
var multipleAnimation = new TA.ParallelAnimation([
  fadeIn, moveLeft, incSize
]);
```
## TA.ChainedAnimation ([JSDoc](/external/doc/TA.ChainedAnimation.html))
This is a decorator for an animation. It takes an array of *TA.Animation*s and executes them one after the other. It finishes once the last animation is finished.
```javascript
var multipleAnimation = new TA.ParallelAnimation([
  fadeIn, moveLeft, incSize
]);
```
