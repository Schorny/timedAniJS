# Events

We created objects and animations. But until now we called `start()` on our objects and used the complete Callback to chain the animations. This is not really different to how `jQuery.animate` works. But *TA* is much more. It provides you with Events to simplify the handling. So let's start with a simple fadeIn/fadeOut object.

```javascript
var fadeIn = new TA.JQueryAnimation({opacity:1},{duration:500});
var fadeOut = new TA.JQueryAnimation({opacity:0},{duration:500});
var o = TA.createObjectFromId('mydiv', {
  in: fadeIn, out: fadeOut
});
```
Every Object has a name. Our object here is named `mydiv`. We can now use `TA.App` to do some magic.
```javascript
TA.App.start('mydiv:in');
```
`TA.App.start` triggers the start event for `mydiv:in`, which he defined as a fadeIn animation on our div. We can also listen for events to react on them:
```javascript
TA.App.on('mydiv:in', function() {
  TA.App.start('mydiv:out');
});

TA.App.on('mydiv:out', function() {
  TA.App.start('mydiv:in');
});

TA.App.start('mydiv:in');
```
We now created a loop.