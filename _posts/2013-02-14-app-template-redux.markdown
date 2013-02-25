---
layout: post
title: "How to build a news app that never goes down and costs you practically nothing"
description: "Spoiler: Our app template makes it possible."

author: Katie Zhu
email: kzhu91@gmail.com
twitter: kzhu91
---

![inauguration app](/img/posts/inaug.png)<br/>
<small>Our app on a shiny iPad: <a href="http://apps.npr.org/inauguration">Inauguration 2013</a>.</small>

## Prelude

I've been on the NPR apps team for a little over a month now. I'll be real – it's been pretty dope.

We launched a slideshow showcasing the [family photos of Justice Sotomayor], an [inauguration app] using [Tumblr], and we just wrapped up our [State of the Union] live coverage.

And we did it all in the [open].

But the thing that really blew my mind is this: We're only running two servers. These two servers let us build news applications that never go down and cost very little (here's looking at you, [S3]). Exhibit A: NPR's elections site only required a _single_ server for running cron jobs — and was rock solid throughout election night. Even in 8-bit mode.

[S3]: http://www.hongkiat.com/blog/amazon-s3-the-beginners-guide/

Developing in the newsroom is fast-paced and comes with a different set of priorities than when you're coding for a technology product team. There are three salient Boyerisms I've picked up in my month as an NP-Rapper that sum up these differences:

1. **Servers are for chumps.** Newsrooms aren't exactly making it rain. Cost-effectiveness is key. Servers are expensive and maintaining servers means less time to make the internets. Boo and boo. (We're currently running only one production server, an [EC2 small instance](http://aws.amazon.com/ec2/pricing/#on-demand) for running scheduled jobs. It does not serve web content.)

2. **If it doesn't work on mobile, it doesn't work.** Most of our work averages 10 to 20 percent mobile traffic. But for our [elections app], 50 percent of users visited our [Big Board] on their phone. (And it wasn't even responsive!) Moral of the stats: A good mobile experience is absolutely necessary.

[elections app]: http://elections.npr.org/
[Big Board]: http://elections.npr.org/bigboard/president.html

3. **Build for use. Refactor for reuse.** This one has been the biggest transition for me. When we're developing on deadline, there are certain sacrifices we have to make to roll our app out time – news doesn't wait. Yet as a programmer, it causes me tension and anxiety to ignore code smells in the shitty JavaScript I write because I know that's technical debt we'll have to pay back later.

On our team, these Boyerisms aren't just preached — they're practiced and implemented in code.

Cue our team's [app template].

*drumroll ...*

---

## Raison d'être

It's an opinionated template for building client-side apps, lovingly maintained by [Chris], which provides a skeleton for bootstrapping projects that can be served entirely from flat files.

[Chris]: http://twitter.com/onyxfish

Briefly, it ships with:

* [Flask](http://flask.pocoo.org/) (for rendering the project locally)
* [Jinja](http://jinja.pocoo.org/) (HTML templates)
* [LESS](http://lesscss.org) (because who writes vanilla CSS anymore, right?)
* [JST](http://ricostacruz.com/backbone-patterns/#jst_templates) ([Underscore.js templates](http://underscorejs.org/#template) for JavaScript)

For a more detailed rundown of the structure, check out the [README].

There's a lot of work that went into this app template and a fair amount of discipline after each project we do to continue to maintain it. With every project we learn something new, so we backport these things accordingly to ensure our app template is in tip-top shape and ready to go for the next project.

---

## Design choices: A brief primer

Here's a rundown of how we chose the right tools for the job and why.

### Flask — *seamless development workflow*

We run a Flask app to simplify local development and is the crucial part of our template.

`app.py` is rigged to provide a development workflow that minimizes the pains between local development and deployment. It lets us:

* Render Jinja HTML templates on demand
* Compile LESS into CSS
* Compile individual JST templates into a single file called `templates.js`
* Compile `app_config.py` into `app_config.js` so our application configuration is also available in JavaScript

That last point is worth elaborating on. We store our application configuration in `app_config.py`. We use environment variables to set our deployment targets. This allows `app_config.py` to detect if we're running in staging or production and changes config values appropriately. For both local dev and deployed projects, we automatically compile `app_config.js` to have our same application configuration available on the client side. Consistent configuration without repetition — it's [DRY]!

### Asset pipeline – *simplifies local development*

Our homegrown app template asset pipeline is quite nifty. As noted above, we write styles in LESS and keep our JS in separate files when developing locally. When we deploy, we push all our CSS into one file and all of our JS into a single file. We then gzip all of these assets for production (we only gzip, not minify, to avoid obfuscation).

Chris wrote some dope "pseudo-template tags" for Jinja that allow us to automatically serve original files locally or compress them when we deploy.

{% raw %}
    <!-- CSS -->
    {{ CSS.push('css/bootstrap.css') }}
    {{ CSS.push('css/bootstrap-responsive.css') }}
    {{ CSS.push('less/app.less') }}
    {{ CSS.render('css/app.min.css') }}

    <!-- JS -->
    {{ JS.push('js/app_config.js') }}
    {{ JS.push('js/console.js') }}
    {{ JS.push('js/lib/jquery-1.8.3.js') }}
    {{ JS.push('js/lib/modernizr.js') }}
    {{ JS.push('js/responsive-ad.js') }}
    {{ JS.render('js/app-header.min.js') }}
{% endraw %}


You can see these in action in [\_base.html].

The `push` and `render` are defined in [render_utils.py].

So what does this actually mean? Our asset pipeline works like this:

* If running locally, we compile our LESS and JSTs to serve individual files.
* If deploying, we compile, concatenate our CSS and JS into single files, minify these two batches (remove whitespace), then gzip all static assets.

We push all our CSS and JS into single files to make our apps mobile-friendly. This translates to fewer browser requests and a faster page load time. Of course, this helps with desktop performance as well, but you really feel the snappiness on your phone.

### Bootstrap – *front-end foundation*

We use Bootstrap as our base layer of CSS. Why? Because of reasons.

* Grid system
* Natively responsive — having a responsive base is cool
* Bootstrap modules are relatively painless to implement (i.e. modals)
* Not terribly ugly (we re-style almost everything anyways)
* Cross-browser testing is much easier

Let's elaborate on that last point. Having Bootstrap on the page is a giant CSS reset (plus plus). Our browser testing process becomes much simpler, way less painful, and there's almost no crying.

As a n00b on the apps team, using the Bootstrap as a foundation gives me _reasonable_ peace of mind that the hacky JavaScript event bindings and functions I write will work across browsers.

### Fab is fabulous — *DRY (don't repeat yourself!)*

`fab` ties our template together. We've got environment-configuration functions, template functions, deployment functions and supermerge functions (stay tuned!) all covered.

We use [Fabric] to manage our setup and configuration, both locally and when we deploy. `fabfile.py` pulls its config from `app_config.py`. The cool thing I learned about Fabric in my first week here was its ability to chain commands together.

Here's the command that deploys our master branch to production:

	$ fab production master deploy

This will automatically render files with the correct configuration for prod, gzips our assets, and then pushes files out to S3.

---

## Sold?

Get our code [here]. It's got a shiny [MIT license] so take 'er for a spin! If you are so inclined, try deploying a small little test app. All you'll need is S3 and a small EC2 instance (only if you want crons). Our template is always a work in progress and we'd love to hear your [feedback].

> Nerd aside: ICYW, our servers are running vanilla Ubuntu. We are planning to document our server configuration, but we haven't had the time to do so yet.

Happy hacking!


[render_utils.py]: https://github.com/nprapps/app-template/blob/master/render_utils.py
[\_base.html]: https://github.com/nprapps/app-template/blob/master/templates/_base.html
[DRY]: http://en.wikipedia.org/wiki/Don't_repeat_yourself
[inauguration app]: http://apps.npr.org/inauguration
[family photos of Justice Sotomayor]: http://apps.npr.org/sotomayor-family-photos
[Tumblr]: http://inauguration2013.tumblr.com/
[State of the Union]: http://apps.npr.org/state-of-the-union-2013/
[open]: http://github.com/nprapps
[app template]: http://github.com/nprapps/app-template
[here]: http://github.com/nprapps/app-template
[README]: https://github.com/nprapps/app-template/blob/master/README.md#about-this-template
[feedback]: https://github.com/nprapps/app-template/pulls
[MIT license]: https://github.com/nprapps/app-template/blob/master/LICENSE
[Fabric]: http://docs.fabfile.org/en/1.5/
