---
layout: post
title: "Better, faster, more: recent improvements to our dailygraphics rig"
description: "A week of hacking on the daily graphics rig allow us to work faster and with more flexible components."
author: Christopher Groskopf
email: cgroskopf@npr.org
twitter: onyxfish
---

In the past couple weeks the Visuals team has consciously shifted resources to focus on the parts of our work that have the highest impact. As part of this reorganization the graphics team has grown from one (Graphics Editor [Alyson Hurt](https://twitter.com/alykat)) to two&mdash;the second being me! Having a dedicated engineer working on daily graphics means we are doubling down both the amount of content we can create and on the tools we use to create it. For the last week I've been sprinting on a slew of improvements to our [dailygraphics](https://github.com/nprapps/dailygraphics) rig. Most of these are small changes, but collectively they represent the biggest iteration we've made to dailygraphics since creating it over a year ago.

## OAuth

Amongst a group of features we've ported over from the [app-template](https://github.com/nprapps/app-template) is the addition of an OAuth support for access to our ["copytext"](https://github.com/nprapps/dailygraphics#connecting-to-a-google-spreadsheet) Google spreadsheets. This means Google credentials no longer need to be stored in environment variables, which increases to security and portability. (Hat tip to [David Eads](https://twitter.com/eads) for untangling OAuth for all of our projects.)

This change also allowed us to implement a more significant feature: automatically creating copytext spreadsheets. Each time you add a graphic a spreadsheet will be automatically created. (You can opt out of this by not specifying a ``COPY_GOOGLE_DOC_KEY`` in your base graphic template or by deleting ``graphic_config.py`` entirely.)

Rewriting the copytext workflow has also allowed as to add a "refresh flag" to the preview. Now anytime you pass ``?refresh=1`` with your graphic preview url, the preview app will automatically re-download the latest copytext before rendering. This can tremendously accelerate editing time for text-heavy graphics.

## Advanced graphic templates

As our graphics pipeline has matured we've started to run into many of the same limitations that prompted development of the app-template. As a result, we've reincorporated features such as template inheritance, asset compression and LESS support.

### The base template

All graphic templates now "inherit" from a base template, which is found in ``graphic_templates/_base``. When a new graphic is created, this folder is copied to the new graphic's path *before* the normal graphic template (e.g. ``graphic_templates/bar_chart``). This base template can house files common to all templates for easy updates. (The individual graphic templates can copy over any or all of them.)

The base template also includes a ``base_template.html`` which the original ``child_template.html`` now inherits from using [Jinja2](http://jinja.pocoo.org/docs/dev/) template inheritance. This change means you can now make a change to the header or footer of your graphics and have it instantly incorporated in all your graphic templates. (Not retroactively though, every graphic is still a copy of all assets and templates.)

### LESS and asset compression

All CSS files in graphic templates can now be LESS files, which will be automatically compiled during preview and deployment. The resulting CSS assets will be automatically compiled into a single file and compressed by using this code in the base template:

```
{% raw %}
<!-- CSS + LESS -->
{{ CSS.push('css/base.less') }}
{{ CSS.push('css/graphic.less') }}
{{ CSS.render('css/graphic-header.css') }}
{% endraw %}
```

Mirroring the app-template, this same pattern is followed for compressing Javascript assets:

```
{% raw %}
{{ JS.push('js/lib/jquery.js') }}
{{ JS.push('js/lib/d3.min.js') }}
{{ JS.push('js/lib/modernizr.svg.min.js') }}
{{ JS.push('js/lib/pym.js') }}
{{ JS.push('js/base.js') }}
{{ JS.push('js/graphic.js') }}
{{ JS.render('js/graphic-footer.js') }}
{% endraw %}
```

### Google Analytics support

Our new base template also now includes code for embedding Google Analytics with your graphics. We've long wanted to be able to track detailed analytics for our graphics, but putting analytics inside in the iframe would have resulted in impressions being counted twice&mdash;once for the parent page and once for the child page. To avoid this we've recently begun tracking our project analytics on a separate Google property from that used for NPR.org. This allows us to put our custom analytics tag inside the iframe while our traditional pageviews are captured by the parent analytics tags.

## Improvements to the graphic viewer (parent.html)

<img src="/img/posts/dailygraphics-parent.png">

Perhaps the most obvious changes to the dailygraphics rig are our suite of improvements to the graphic preview template (a.k.a. ``parent.html``). These changes are aimed at making it easier to see how the final graphic will work and making it faster to test. They include:

* Resize buttons for quickly testing mobile and column layouts.
* Border around the graphic so you can see how much margin you've included.
* An obvious label so you know which environment you're working in (local, staging, production).
* One-click links to other environments and to the copytext spreadsheet (if configured).
* Easy-to-copy Core Publisher embed code (for NPR member stations).

## Other improvements

In addition to these larger improvements we've also made a couple of smaller improvements that are worth noting:

* A [stacked bar chart template](https://github.com/nprapps/dailygraphics/tree/master/graphic_templates/stacked_bar_chart).
* Upgrading to [pym](http://blog.apps.npr.org/pym.js/) 0.4.3, which includes shortcuts for [scrolling and navigating](http://blog.apps.npr.org/pym.js/#example-navigation) the parent frame from within the graphic.

## Upgrading

If you're a user of the dailygraphics rig we strongly encourage you to upgrade and incorporate these new improvements into your process. I think they'll make your graphics workflow smoother and much more flexible. After pulling the latest code you'll need to install new requirements. [Node.js](https://nodejs.org/) is now a dependency, so if you don't have that you'll need to install it first:

```
brew install node
curl https://npmjs.org/install.sh | sh
```

Then you can update your Node and Python dependencies by running the following commands:

```
pip install -Ur requirements.txt
npm install
```

Please remember that everything in the dailygraphics rig still works on *copies*, so upgrading will not retroactively change anything about your existing graphics.

If you're using the improved dailygraphics rig, [let us know](mailto:nprapps@npr.org)!
