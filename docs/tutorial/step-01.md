# Let's Start

There are 3 basic elements to a *TA* app. Animations, Objects and Timelines. Let us create a very basic `TA.Object`. Imagine we have a div in our DOM with the id 'mydiv'. We can create a `TA.Object` that represents this div very easily:
```javascript
var o = TA.createObjectFromId('mydiv');
```

Object can be more complex and provide certain functionality, but for now let's stay with this simple example.

Animations are the description on **what** happens. On how the animation should look like. The animation itself does not know what it animates, just how the animation is supposed to look like.

The most basic animation is a `TA.FunctionAnimation`. Let's write one that just prints some text to the console:
```javascript
var anim = new TA.FunctionAnimation(function(obj, complete) {
  console.log('animation is running');
  if(complete)complete();
});
```

Our function takes two parameters. The first, `obj` is a `TA.Object` that describes **what** DOM element we want to animate.

The second parameter, the complete Callback is very important. It tells us when our animation is finished. We need to know this, so we can start the next animation. In general you don't have to deal with complete Callbacks, because *TA* hides all this from you. Let's run our animation:
```javascript
anim.start(o);
```
We omitted the complete Callback, because in this example it is not necessary. But let's do a `jQuery.animate` animation.

```javascript
var anim = new TA.FunctionAnimation(function(obj, complete) {
  obj.getElement().animate(
    {marginLeft: '20px'},
    {duration: 500, complete: complete}
  );
});

anim.start(o);
```
We now make use of the `obj` parameter. It is a `TA.Object` and all `TA.Object`s provide the function `getElement()` which returns a `jQuery` object representing the objects DOM node(s). While in general a `TA.Object` represents one DOM node, *TA* works with complex selectors as well.

We can call `jQuery.animate` on our `jQuery` object. This is cumbersome to do, so *TA* provides an animation object for this case: `TA.JQueryAnimation`.

```javascript
var anim = new TA.JQueryAnimation(
  {marginLeft: '20px'}, {duration: 500}
);

anim.start(o);
```
This is much easier to write and we can see how *TA* hides the complete Callback complexity from us.
