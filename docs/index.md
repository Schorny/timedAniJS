# timedAniJS (TA) Documentation

## What is it
TA is a JavaScript Library for creating timelines for animations. It does not itself provide you with the means of animation, you can and should use awesome Libraries like [jQuery.animate](http://api.jquery.com/animate/), [velocity.js](http://julian.com/research/velocity/), [GSAP](http://greensock.com/gsap) or the others.

TA provides you with the means to clue different animations together using a simple timeline. Imagine you want to create an animation like the end credits in a movie: you have different logos, headlines and sublines that all appear after each other or simultaneously. It can be a real pain to write these animations in a way that changes can easily be done and tested. In TA you describe your animations, your objects you want to use and then clue them together in a timeline.

## Example

```javascript
var tl = new TA.Timeline('timeline');
var d = tl.getDescriber();
tl.add([
  d.startAndWaitFor('headline:in'),
  d.startAndWaitFor('subline1:in'),
  d.delay(2000),
  d.start('subline1:out'),
  d.startAndWaitFor('subline2:in'),
  d.delay(2000),
  d.start('subline2:out'),
  d.delay(500),
  d.start('headline:out')
]);
tl.play();
```
We created a *TA.Timeline* and started and waited for completion of different animations. What these animations are and how they look like are of no concern to our timeline. The 'headline:in' animation might look like this:
```javascript
var fadeIn = new TA.JQueryAnimation(
  {opacity:1}, {duration:1000}
);
```
We are using a simple *jQuery.animate* call to do the animation to animate opacity to 1 over the duration of 1000 milliseconds.

Of course we are still missing the object to animate. Imagine we have a &lt;div&gt; with the id 'headline' that contains our text.
```javascript
var headline = new TA.Object(
  'headline',
  $('#headline'),
  { in: fadeIn }
);
```
We now have an object that knows how to fade itself 'in'.