# Synopsis

timedAni.js (or TA) is a library to make it easier to run predefined or non-interactive animations on a site.

# Explanation

A *TA* application consists of the following layers:

### Animations
The basic unit in *TA* is a *TAAnimation* Object. This be implemented using different libararies like *velocity.js* or *jQuery.animate*. A *TAAnimation* Object knows nothing about the *TA* structure, it just knows how to animate an object.

### Objects
Objects are of the Type *TAObject*. They own up to 2 *TAAnimation* Objects, one for the "in" animation and one for the "out" animation. They also know which DOM Element they represent.

### Compositions
A *TAComposition* is a collection of *TAObject*s. They get registered into the Composition and once a Composition starts an Animation, all *TAObject*s get animated.

### Events
Each *TAObject* and *TAComposition* has a unique name. Based on these names, events get triggered and listened for. This allows a simple work flow when executing different animations.

When an object or composition finished it's animation, it triggers the "name:in" or "name:out" event. You can listen to those or even start one on your own 
```Javascript
TAApp.start("name:in");
```
### Timeline
The *TATimeline* Object clues all compositions and objects together

# Example

First we create 2 Animation objects, one to fade in and one to fade out.
```Javascript
var appear = new TAApp.TAVelocityAnimation(
    {opacity: 1},{duration: 1000}
);
var disappear = new TAApp.TAVelocityAnimation(
    {opacity: 0},{duration: 1000}
);
```
This is a simple *TAVelocityAnimation* that uses *velocity.js* to do the actual work.

Now we need an Object
```Javascript
var obj = new TAApp.TAObject(
    "object",
    $("#id"),
    { inAni: appear, outAni: disappear }
);
```
We can now make our object appear and disappear:
```Javascript
obj.startInAni(function() {
    obj.startOutAni();
});
```
This is not really fun though. So we create a Composition. Normally a composition contains multiple objects with multiple animations.
```Javascript
var comp = new TAApp.TAComposition("composition");
comp.register(obj);
```
We have created a composition object and registered one object into it. We can now do the same animation from above:
```Javascript
comp.startInAni(function() {
    comp.startOutAni();
});
```
Now it is time to glue this together with a *TATimeline* object.
```Javascript
var tl = new TAApp.TATimeline("timeline");
var desc = tl.getDescriber();
tl.add([
  desc.startAndWaitFor("composition:in"),
  desc.startAndWaitFor("composition:out"),
  desc.loop(),
]);
```
And now the magic begins. We created a *TATimeline* object and used a *TATimelineDescriber* to set the actions. Now the names we set in the code above come into play. Each object and each composition has a name. This name is used to trigger and listen for certain events. With *startAndWaitFor* we can start an event and wait for it to finish. Our animation loops now endlessly.

We could get the same result using *TAApp* and its event handling directly:
```Javascript
var app = TAApp.TAApp; //for ease of use
app.on("composition:in", function() {
    app.start("composition:out");
});
app.on("composition:out", function() {
    app.start("composition:in");
});
app.start("composition:in");
```
We can see how *TATimeline* works internally. It listens for events and starts events at certain times.

See *test.html* or *test2.html* for more complex examples.