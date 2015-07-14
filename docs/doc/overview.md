# Overview

TA uses different layers to implement its functionality.

## Settings
*TA.Settings* Objects are there to allow you or animations to set certain settings on the DOM node before or after an animation. For example you might want to set `display:none;` after the element faded out.

## Animations
*TA.Animation* Objects are descriptions on **how** to animate an object. They can use [jQuery.animate](http://api.jquery.com/animate/), [velocity.js](http://julian.com/research/velocity/), [GSAP](http://greensock.com/gsap) or the other libraries for that purpose.

## Objects
*TA.Objects* are descriptions on **what** to animate. They can own multiple *TA.Animation* objects and know which DOM node they represent.

## Compositions
*TA.Composition* objects are a collection of *TA.Objects* to enable you to animate multiple objects at once.

## Timelines
*TA.Timeline* objects clue all this together and are the core of what TA actually is.