# TA.Settings

*TA.Settings* Objects are there to allow you or animations to set certain settings on the DOM node before or after an animation. For example you might want to set `display:none;` after the element faded out.

There are currently the following *TA.Settings* classes available:

- TA.CssSettings
- TA.VelocitySettings
- TA.CombinedSettings
- TA.DummySettings

Each *TA.Settings* class has 2 basic properties: the Init-Settings and the Deinit-Settings. Either one can be `null` or `{}`. Init-Settings are applied before the in-Animation is started and Deinit-Settings are applied after the out-Animation is finished.

This allows you to set DOM settings inside your animation code and outside of your CSS. For example you might have an invisible object in your DOM with a `display:none;` set to make it invisible. Now you want to fade it in using `opacity`. You can set `display:block;` in your Init-Settings and `display:none;` in your Deinit-Settings.

## TA.CssSettings ([JSDoc](/external/doc/TA.CssSettings.html))
*TA.CssSettings* uses `jQuery.css` to apply the settings to a DOM node.
```javascript
var settings = new TA.CssSettings(
  {display:block},{display:none}
);
```

## TA.VelocitySettings ([JSDoc](/external/doc/TA.VelocitySettings.html))
*TA.VelocitySettings* uses `jQuery.velocity` to apply the settings to a DOM node. This is needed for some velocity animations that can't be reset/changed by `jQuery.css`.
```javascript
var settings = new TA.VelocitySettings(
  {rotateZ:'90deg'},{rotateZ:'0deg'}
);
```

## TA.CombinedSettings ([JSDoc](/external/doc/TA.CombinedSettings.html))
*TA.CombinedSettings* is a meta class that enables you to treat multiple *TA.Settings* object as one.
```javascript
var settings = new TA.CombinedSettings([
  new TA.CssSettings({display:block},{display:none}),
  new TA.VelocitySettings({rotateZ:'90deg'},{rotateZ:'0deg'})
]);
```
In most cases you can use a simple array of *TA.Settings* objects and let TA do the autoboxing.
```javascript
var obj2 = obj.clone({
  settings: [setting1, setting2, settings3]
});
```
## TA.DummySettings ([JSDoc](/external/doc/TA.DummySettings.html))
*TA.DummySettings* is a class that you probably will never use. It does nothing but confirms to the *TA.Settings* interface. It can be used as `noop` in situations where a *TA.Settings* object is needed but no settings are there to be applied.