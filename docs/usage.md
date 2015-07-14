# Usage

TA is [AMD](http://requirejs.org/docs/whyamd.html) compatible. You can easily `require('timedAni');` if you are using [require.js](http://requirejs.org/). If not, TA automatically detects this and writes itself into `window.TA`.

You can move TA from `window.TA` to whatever other object you want, TA itself does not refer to `window.TA`.

## Dependencies

TAs only dependency is [jQuery](https://jquery.com/). It is developed using jQuery 2.1.3, but nearly all halfway recent jQuery version should work fine. jQuery needs to be loaded before TA is loaded.

If you want to use *TA.VelocitySetting* and/or *TA.VelocityAnimation* you need [velocity.js](http://julian.com/research/velocity/) as well. TA is developed using velocity.js 1.2.1 but nearly all halfway recent velocity.js version should work fine.

## Browser Support

*Warning*: this is not yet fully tested.
TA should work on:

- Chrome 19+
- Firefox 19+
- Safari 6.1+
- IE 9+

probably on older versions as well. **This is subject to change.**
