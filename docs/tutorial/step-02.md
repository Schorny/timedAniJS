# Objects Objects Objects

We took a look on how animations work. But we only used a simple, basic `TA.Object` as target. *TA* provides much more functionality than just wrapping a `jQuery.animate` call. Let's create an object that gets faded in and out. First we create a fadeIn and fadeOut animation.

```javascript
var fadeIn = new TA.JQueryAnimation({opacity:1},{duration:500});
var fadeOut = new TA.JQueryAnimation({opacity:0},{duration:500});
```
And let's use them in our object.
```javascript
var o = TA.createObjectFromId('mydiv', {
  in: fadeIn, out: fadeOut
});
```

The second parameter in `TA.createObjectFromId` is our anis-object. It describes what animations the object is capable of performing. We defined two: in and out. We can use any name we want, but in and out are handled a little bit special. More on that later. For now, we can use any name we like. To start an animation we tell the object to perform it.

```javascript
o.start('in', function() { o.start('out'); });
```
We are now using the complete Callback to trigger the next animation. *TA* hides this complexity from us as well, once we start using Timelines. For now, the complete Callback suffices. The `start()` function allows us to tell our object to perform any animation it knows.