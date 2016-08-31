---
layout: post
title: "Responsive Graphics In Core Publisher With Pym.js"
description: "For NPR member stations: A workaround to use Pym.js responsive iframes in Core Publisher posts."

author: Jim Hill/KUNC
email: jim.hill@kunc.org
twitter: ejimbo_com
---

**Note: This post is out of date. NPR Visuals recommends using the new [pym-loader.js](http://blog.apps.npr.org/pym.js/#loader) to load iframed content on Core Publisher pages.**


_Editor&rsquo;s Note: [Core Publisher](http://digitalservices.npr.org/topic/core-publisher) is a content management system that staff at many NPR member stations use to maintain their websites. This post is written for that audience, but may be useful for users of other CMSes._

Over time, many member stations have created maps, graphics and other projects for their websites that were sized to fit Core Publisher&rsquo;s fixed-width layout.  But with the responsive mobile-only sites, and Core Publisher going to a fully responsive design, these elements either don&rsquo;t work or won&rsquo;t resize correctly to the screen.

Now you can use [Pym.js](http://blog.apps.npr.org/pym.js/) to iframe responsively-built projects  within Core Publisher stories.

<blockquote class="twitter-tweet" lang="en"><p>Achievement unlocked: I think I just got pym.js working on my CorePub mobile site <a href="https://t.co/AiP59h1UME">https://t.co/AiP59h1UME</a></p>&mdash; Jim Hill (@ejimbo_com) <a href="https://twitter.com/ejimbo_com/status/539891822190166022">December 2, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


_(Note: NPR Digital Services, the team behind Core Publisher, doesn&rsquo;t maintain or support Pym.js and can&rsquo;t help you use it. But they didn&rsquo;t raise any concerns about this workaround.)_

## I Was Ready Yesterday, What Do I DO?

I like that enthusiasm. First of all, let&rsquo;s get a few assumptions out of the way: We&rsquo;re assuming you are familiar with working in [Core Publisher](http://digitalservices.npr.org/topic/core-publisher), know the post building process, comfortable with working in the source code view in the [WYSIWYG](http://www.webopedia.com/TERM/W/WYSIWYG.html) with HTML, and that you have a separate web space to host all of your files (KUNC, like the NPR Visuals team, uses Amazon&rsquo;s [S3](http://aws.amazon.com/s3/) service).

1) [Download Pym.js.](http://blog.apps.npr.org/pym.js/).  Follow the [instructions](http://blog.apps.npr.org/pym.js/#how) to integrate it into your project. (In Pym.js terms: Your project is the &ldquo;child&rdquo; page, while the Core Publisher story page it will live on is the &ldquo;parent&rdquo; page.)

2) Publish your project to the service of your choice. Note the URL path: You&rsquo;ll need it later.

3) Build a post as normal in Core Publisher and then switch to the source code view and locate in the code where you want to place your iframe.

4) Core Publisher often strips out or ignores tags and scripts that it doesn&rsquo;t recognize when it publishes. We&rsquo;re going to get around that by using tags that CP does recognize. We&rsquo;ll use Pym.js&rsquo;s [&ldquo;auto-initialize&rdquo;](http://blog.apps.npr.org/pym.js/#auto) method, rather than inline JavaScript, to embed our project on the page. But, contrary to the example code in the docs, don&rsquo;t use `<div>` tags to indicate where the iframe will go &mdash; use `<p>` tags instead. You&rsquo;ll also need the URL path to your project from step 2: That will be your data target. The tag will look like this: `<p data-pym-src="http://example.com/project/"></p>`.
Your target code for the iframe should look something like this:

```
<p>Bacon ipsum dolor amet cupim cow andouille tenderloin biltong pork belly corned beef meatball swine pastrami alcatra.</p>
<p data-pym-src="http://example.com/project/">&nbsp;</p>
<p>Cupim beef ribs ribeye swine tail strip steak drumstick venison bacon salami pig chicken.</p>
```

Beware: Core Publisher often will ignore paragraph tags `<p>` that are empty when it publishes. To avoid this, insert a non-breaking space `&nbsp;` between the opening and closing `<p>` tags for your pym target. Sometimes the CP WYSIWYG hobgoblins will insert this for you as well.

5) Next, point to the Pym.js script file. `<script>` tags are sometimes hit-or-miss in Core Publisher, so you should save your work right now.

_(Note: If you&rsquo;re embedding multiple Pym.js iframes on a page, you only need to include this script tag once, after the last embed.)_

6) Did you save?

7) Good, let&rsquo;s place that script tag now. It should follow the last iframe target in your post and should only appear once. You&rsquo;ll need your URL path to pym from step 2. The full tag will look like this: `<script type="text/javascript" src="http://example.com/project/js/pym.js"></script>`.

8) Your complete code should now look like this:

```
<p>Bacon ipsum dolor amet cupim cow andouille tenderloin biltong pork belly corned beef meatball swine pastrami alcatra.</p>
<p data-pym-src="http://example.com/project/">&nbsp;</p><script type="text/javascript" src="http://example.com/project/js/pym.js"></script>
<p>Cupim beef ribs ribeye swine tail strip steak drumstick venison bacon salami pig chicken.</p>
```

Most of the time the script tag should be fine since it is a simple one &mdash; only the tag and URL, and no other arguments. Sometimes Core Publisher will still strip it out. This should be the last thing you place in your post before you save to preview or publish.

If you go in later and edit the post, double-check that the script wasn&rsquo;t stripped out.

A good sign that the script wasn&rsquo;t dropped? The following text might appear in the normal WYSIWYG text view: `{cke_protected_1}`. Don&rsquo;t delete it: That&rsquo;s script code.

Take a look at your post and revel in how cool that Pym.js-inserted element is. Or take a look at [this example](http://www.kunc.org/post/real-life-or-lego-life-hit-bricks-plastic-cu-boulder) or [this one](http://www.kunc.org/post/watch-greeley-get-surrounded-15000-oil-wells-13-years).

## What Gives? Your Example Isn&rsquo;t On The Responsive Theme.

We&rsquo;ll be transitioning to the responsive design in a few months. In the meantime, KUNC has a lot of legacy iframes that we&rsquo;ll be going back to and embedding with Pym.js. And Pym.js works like a champ on the already-responsive mobile site, so these projects will work better for the quickly-growing mobile audience. [Always think mobile.](https://twitter.com/ejimbo_com/status/532215188028530688)

## So, Does It Work On The Responsive Theme?

It sure does! [Anna Rader](https://twitter.com/anna_rader) at [Wyoming Public Media](http://wyomingpublicmedia.org) was kind enough to let me try a Pym.js test post on their newly-transitioned responsive site. Everything worked like a charm and there was much excitement.

## Will The Pym Code In A Post Carry Over The API For Station-To-Station Sharing?

I haven&rsquo;t tested this yet. If you&rsquo;d like to be a test subject, let me know and we can give it a try. Looking at the raw NPRML in the API for a post with the pym code it in, it all seems to be there.

Have any questions? Find me on Twitter <a href="http://twitter.com/ejimbo_com">@ejimbo_com</a> and ask away.
