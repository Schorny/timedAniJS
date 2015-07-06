# Synopsis

timedAni.js (or TA) is a library to make it easier to run predefined or non-interactive animations on a site by defining a simple Timeline. All animations and state changes in TA trigger events on which you can listen or let TA do the automagic itself.

# Explanation

A *TA* application consists of the following layers:

### Animations
The basic unit in *TA* is a *TA.Animation* Object. This be implemented using different libararies like *velocity.js* or *jQuery.animate*. A *TA.Animation* Object knows nothing about the *TA* structure, it just knows how to animate an object and what settings are necessary to make the animation work.

### Objects
Objects are of the Type *TA.Object*. They own multiple *TA.Animation* Objects. Two *TA.Animation* Objects are very important: the "in" animation and the "out" animation. They also know which DOM Element they represent.

### Compositions
A *TA.Composition* is a collection of *TA.Object*s. *TA.Objects* get registered into the Composition and once a Composition starts an Animation, all *TAObject*s get animated. A Composition is kind of like a fancy array of *TA.Objects*s.

### Settings
A *TA.Settings* Object is useful to keep your DOM or CSS-Files clean. It allows to set properties on DOM Elements right before or after an animation starts/finishes.

### Timeline
The *TA.Timeline* Object clues all compositions and objects together by providing a simple Timeline in which you can define your desired actions and events.

### Events
Each *TA.Object*, *TA.Composition* and *TA.Timeline* has a unique name. Based on these names, events get triggered and listened for. This allows a simple work flow when executing different animations.

When an object or composition finished its animation, it triggers the "name:in" or "name:out" event. You can listen to those or even start one on your own 
```Javascript
TA.App.on("name:in", function() {
	console.log("name:in just finished");
});

TA.App.start("name:in");
```

# Example

First we create 2 Animation objects, one to fade in and one to fade out.
```Javascript
var appear = new TA.VelocityAnimation(
    {opacity: 1},{duration: 1000}
);
var disappear = new TA.VelocityAnimation(
    {opacity: 0},{duration: 1000}
);
```
This is a simple *TA.VelocityAnimation* that uses *velocity.js* to do the actual work. The first Argument of *TA.VelocityAnimation* is the animation property that gets passed to *velocity.js*, the second are the options parameter that also get passed to *velocity.js*.

Next we need an Object
```Javascript
var obj = new TA.Object(
    "object",
    $("#id"),
    { in: appear, out: disappear }
);
```

The Object has a name, a jQuery element and an animation object with the two magic animations: in and out.

We can now make our object appear and disappear:
```Javascript
obj.startIn(function() {
    obj.startOut();
});
```
This is not really fun though. So we create a Composition. Normally a composition contains multiple objects with multiple animations.
```Javascript
var comp = new TA.Composition("composition");
comp.register(obj);
```
We have created a composition object and registered one object into it. We can now do the same animation from above:
```Javascript
comp.startIn(function() {
    comp.startOut();
});
```
Now it is time to glue this together with a *TA.Timeline* object.
```Javascript
var tl = new TA.Timeline("timeline");
var d = tl.getDescriber();
tl.add([
  d.startAndWaitFor("composition:in"),
  d.startAndWaitFor("composition:out"),
  d.loop(),
]);
```
And now the magic begins. We created a *TA.Timeline* object and used a *TA.TimelineDescriber* to set the actions. Now the names we set in the code above come into play. Each object and each composition has a name. This name is used to trigger and listen for certain events. With *startAndWaitFor* we can start an event and wait for it to finish. Our animation loops now endlessly.

We could get the same result using *TA.App* and its event handling directly. This comes in handy if you need to do more complex stuff than *TA.Timeline* allows you to do.
```Javascript
var app = TA.App; //for ease of use
app.on("composition:in", function() {
    app.start("composition:out");
});
app.on("composition:out", function() {
    app.start("composition:in");
});
app.start("composition:in");
```
We can see how *TA.Timeline* works internally. It listens for events and starts events at certain times.

See *test.html* or *test2.html* or *test3.html* for more complex examples.