---
layout: post
title: "The Pympocalypse"
description: "A News Nerd Horror Story"

author: Christopher Groskopf
email: cgroskopf@npr.org
twitter: onyxfish
---

Everything was going so well. We finally had a solution for embedding responsive charts inside our CMS. We called it [pym.js](https://source.opennews.org/en-US/articles/introducing-pym/). We had built a framework around it, the [dailygraphics rig](https://source.opennews.org/en-US/articles/all-about-dailygraphics/), and when that worked for us [we shared it](http://blog.apps.npr.org/2015/07/17/daily-graphics-label-positioning.html) with the world. [It even worked for member stations.](http://blog.apps.npr.org/2014/12/19/pym-core-publisher.html)

Then there came unexpected implication was something was *very wrong*. It first manifested in a ticket numbered [97](https://github.com/nprapps/pym.js/issues/97). We took it as nothing important at first. But soon that number was appearing everywhere. Every day. In every inbox. *It's the user*, we said. But the evidence of a real problem was looming larger and larger. Something was very wrong with *pym*.

At first we thought it was a just member station issue; a singular problem brought on by their implementation of [PJAX](http://pjax.herokuapp.com/). They wanted the audio to work on every page &mdash; and across pages! What were they thinking? They had broken our elegant solution by creating pages that *never refresh*!

What I didn't know then is that we had not yet begun to suffer. Just when it had started to hurt, I received an unexpected email from an engineer on the [NPR.org](http://www.npr.org/) CMS team. They were going to PJAX our site too! *Bow down to persistence!* he said. *No browser upon these lands shall ever be refreshed!* (Or something to that effect.)

It was a dark day in August. The closer we looked, the more problems we found. jQuery wasn't on the page anymore. Our script tags didn't work right. Nothing worked when you changed pages. Event handlers stayed bound to their pages like ghosts. We looked to our source code &mdash; so simple! How could it all have gone so wrong?

```html
<div id="responsive-embed-homeless-vets-budget">
</div>
<script src="http://apps.npr.org/dailygraphics/graphics/homeless-vets-budget/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
$(function() {
    var pymParent = new pym.Parent(
        'responsive-embed-homeless-vets-budget',
        'http://apps.npr.org/dailygraphics/graphics/homeless-vets-budget/child.html',
        {}
    );
});
</script>
```

The dark times began. We plucked at our keyboards morning to night. Dark shapes coalesced and spoke, offering shadowy pacts from godforsaken corners of the abyss. *You can get that event handler back,* said one. *You only have to override window.addEventListener. No harm in it.* And so I did. I wrote a wrapper around the default event binding so I could capture anonymous callbacks bound *in our own library*.

Our assets were independent of the require.js context that was being used to load the core site assets, so we had had to write our own require.js context onto the page and asynchronously load our Javascript libraries into that context. And, for those that depended on jQuery, we had to load that first.

The problems compounded. We had several versions of pym in use on the site. Each had its own specific edge-cases we had to support. All of our solutions also had to work with both the old version of the CMS and the new version, so that we could rollover gracefully.

**BEHOLD!** This is the horrible contraption we have created!

```html


<div id="responsive-embed-homeless-vets-budget"></div>
<script type="text/javascript">
    // Require.js is on the page (new Seamus)
    if (typeof requirejs !== 'undefined') {
        // Create a local require.js namespace
        var require_homeless_vets_budget = requirejs.config({
            context: 'homeless-vets-budget',
            paths: {
                'pym': 'http://apps.npr.org/dailygraphics/graphics/homeless-vets-budget/js/lib/pym'
            },
    		shim: {
    			'pym': { exports: 'pym' }
    		}
        });

        // Load pym into locale namespace
        require_homeless_vets_budget(['require', 'pym'], function (require, Pym) {
            var messageHandler = null;
            var resizeHandler = null;

            // Cache window event binding method
            window.realAddEventListener = window.addEventListener;

            // Monkey patch window event binding method
            window.addEventListener = function(type, listener, capture) {
                // Fire default behavior
                this.realAddEventListener(type, listener, capture);

                // Catch events that pym binds anonymously
                // In pym 0.4.2 these were given explicit names, but
                // this solution works for all versions.
                if (type == 'resize') {
                    resizeHandler = listener;
                } else if (type == 'message') {
                    messageHandler = listener;
                }
            };

            // Create pym parent
            var pymParent = new Pym.Parent(
                'responsive-embed-homeless-vets-budget',
                'http://apps.npr.org/dailygraphics/graphics/homeless-vets-budget/child.html',
                {}
            );

            // Reattach original window event binding method
            window.addEventListener = window.realAddEventListener;

            // Unbind events when the page changes
            document.addEventListener('npr:pageUnload', function(e) {
                // Unbind *this* event once its run once
                e.target.removeEventListener(e.type, arguments.callee);

                window.removeEventListener('message', messageHandler);
                window.removeEventListener('resize', resizeHandler);

                // Explicitly unload pym library
                require_homeless_vets_budget.undef('pym');
                require_homeless_vets_budget = null;
            });
        });
    // Require.js is not on the page, but jQuery is (old Seamus)
    } else if (typeof $ !== 'undefined' && typeof $.getScript === 'function') {
        // Load pym
        $.getScript('http://apps.npr.org/dailygraphics/graphics/homeless-vets-budget/js/lib/pym.js').done(function () {
            // Wait for page load
            $(function () {
                // Create pym parent
                var pymParent = new pym.Parent(
                    'responsive-embed-homeless-vets-budget',
                    'http://apps.npr.org/dailygraphics/graphics/homeless-vets-budget/child.html',
                    {}
                );
            });
        });
    // Neither require.js nor jQuery are on the page
    } else {
        console.error('Could not load homeless-vets-budget! Neither require.js nor jQuery are on the page.');
    }
</script>
```

I don't even know what to say about this except that [it works](http://www.npr.org/2015/08/04/427419718/the-u-s-declared-war-on-veteran-homelessness-and-it-actually-could-win). It successfully handles every edge case in every browser *for modern versions of pym*. There is an entirely different script for older versions of pym. There are also very old graphics that never used pym. Those have to be individually retrofitted.

And then there is the member stations CMS, where the problem was first identified.

We still haven't fixed that. (But we're working on it.)

Happy Halloween.

**TL;DR:** If you PJAX a big website everything you assumed about how the internet works is going to break. In particular, it broke all our responsive embeds. We spent eight weeks figuring out how to fix it and our embed codes went from being 13 lines to being 79.

*Many thanks to our friends at the member stations and on the CMS team at NPR for their aid and understanding during our dark times.*
