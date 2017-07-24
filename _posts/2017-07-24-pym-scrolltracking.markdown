---
layout: post
title: "Pym.js v1.3.0 release - Scroll&nbsp;Tracking"
description: "Pym.js has a new release that includes an optional throttled scroll tracking"

author: Juan Elosua
email: jelosua@npr.org
twitter: jjelosua
---

The NPR Visuals Team is happy to announce the release of `Pym.js v1.3.0`. We want to share with all of you the goals that we hope to achieve with it and the design process that led us to the new release.

But wait, what is Pym.js for?
--------------------------------

`Pym.js` embeds and resizes an iframe responsively (width and height) within its parent container while bypassing the usual cross-domain related issues.

But responsiveness is not the only issue when we are dealing with iframed content. Additionally, you do not have access to the iframe position from the child page due to the same-origin policy imposed by browsers for security reasons.

Our `Pym.js v1.3.0` version allows you the option to tackle that if it makes sense in your use case.

Pym.js v1.3.0 Goals
-------------------

* Add an optional throttled scroll tracking natively on `Pym.js` so that the child can get all the information it needs to check the visibility of its elements.

### Why track scroll on Pym.js?

`Pym.js v1.3.0` development has been driven by the need to extend the ability to use Pym in some of our more complex projects where the visibility of child elements on the viewport was needed to trigger some special behavior:

* Lazyloading images on appearance.
* Animating some content when it appeared on the users screen.
* Fire custom analytics events when an element is visible.
* Fire costly services like geoIP only when needed, i.e., when the user reaches that content instead that on page load.

Scroll track breakdown
----------------------

The components added to `Pym.js` in order to make the scroll tracking possible are:

* Two new configuration options:
    * `trackscroll` &mdash; if present it will instruct pym to start tracking scroll events.
    * `scrollwait` &mdash; determines the throttle wait in order to send messages to the child once a scroll has happened. Default 100ms.
* Scroll listener if enabled by the above mentioned configuration.
* Throttle utility function: To avoid performance degradation when listening to scroll events borrowed from [underscore.js](http://underscorejs.org/).
* New `viewport-iframe-position` message sent to the child.
* Changes in resize: If there's a resize and you've opted in the scroll tracking `Pym.js` will fire the new message as well since the information needs to be updated.

### Code on the parent page

```
<p id="example">Loading...</p>
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
    var pymParent = new pym.Parent('example', 'child.html', {trackscroll: true, scrollwait: 40});
</script>
```

### Code on the child page

```
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
var pymChild = new pym.Child();

pymChild.onMessage('viewport-iframe-position', onScroll);

function onScroll(parentInfo) {
    console.log(parentInfo) // would display for example: 874 776 1091 8 1673 866
    // Add desired triggered functionality here.
}
</script>
```

[pymchild-scroll-visibility](https://github.com/nprapps/pymchild-scroll-visibility) utility library
------------------------------------------

### Visibility calculations on the child

`pymchild-scroll-visibility` is a small [opensourced](https://github.com/nprapps/pymchild-scroll-visibility) utility library to make visibility calculations on elements of the child page.

Each tracker instance receives:

* `id` &mdash; unique id of the element on the child to track visibility on.
* `visible_callback` &mdash; callback function to call once the above element is visible on the users viewport.
* `read_callback` &mdash; callback function to call once an element has been visible for a certain configurable amount of time. (**Optional**)
* `configuration` &mdash; overrides default configuration options. (**Optional**)
    * `partial` &mdash; track partial or complete visibility. Defaults to partial.
    * `read_time` &mdash; amount of time needed to invoke the read_callback. Defaults to 500ms.


### Code on the child page to use the library

```
var tracker = new PymChildScrollVisibility.Tracker('example-child-id', onVisible,
                                                   onRead, {read_time: 1000});
var onVisible = function(id) {
    console.log(id, 'visible');
};
var onRead = function(id) {
    console.log(id, 'read');
};
```

Also on the child, we need to check the visibility each time we receive a `viewport-iframe-position` message from the parent.

```
pymChild.onMessage('viewport-iframe-position', function(parentInfo) {
        tracker.checkIfVisible(parentInfo);
});
```

Examples
--------

For a basic example, take a look at the [trackscroll example](http://blog.apps.npr.org/pym.js/examples/trackscroll/) in the pym.js documentation.

For a more complx example of lazyloading images on a child pym embed, look at this example of the [refugee comic](http://www.npr.org/sections/goatsandsoda/2017/07/11/526777542/web-comic-the-scientist-who-escaped-aleppo) on NPR.


Summary
-------

We hope that this release of `Pym.js` will extend its ability to be used by NPR member stations and other customers thanks to the new optional scroll tracking functionality.

Interested in using `Pym.js`? Please refer to the [user documentation](http://blog.apps.npr.org/pym.js/) and [API documentation](http://blog.apps.npr.org/pym.js/api/pym.js/1.3.0/).

