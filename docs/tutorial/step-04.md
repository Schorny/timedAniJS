# Timelines

We created an object and triggered some events. Now it is time to glue this all together with a `TA.Timeline`.

Let's first create two objects.
```javascript
var fadeIn = new TA.JQueryAnimation({opacity:1},{duration:500});
var fadeOut = new TA.JQueryAnimation({opacity:0},{duration:500});

var o1 = TA.createObjectFromId('mydiv1', {
  in: fadeIn, out: fadeOut
});
var o2 = TA.createObjectFromId('mydiv2', {
  in: fadeIn, out: fadeOut
});
```
We use the same animations on both objects, because we can (and it is easier to reuse animations than to create new ones all the time). Now let's write a timeline.
```javascript
var tl = new TA.Timeline('timeline');
```
A timeline has a name, like any other object. But now we need a `TA.TimelineDescriber` to describe what our timeline looks like.
```javascript
var d = tl.getDescriber();

tl.add([
  d.startAndWaitFor('mydiv1:in'),
  d.startAndWaitFor('mydiv2:in'),
  d.delay(1000),
  d.startAndWaitFor('mydiv2:out'),
  d.startAndWaitFor('mydiv1:out')
]);

tl.play();
```
The describer helps us create `TA.TimelineAction` objects to describe our timeline. `startAndWaitFor()` is the most important action. It starts an event and waits for it to finish before advancing the timeline to the next action. `delay()` just waits the number of milliseconds you stated. Last but not least, we `play()` our timeline.