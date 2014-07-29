---
layout: post
title: "Everything our app template does: July 2014 edition"
description: "A comprehensive update on everything our app template does in July 2014."

author: Tyler Fisher
email: tfisher@npr.org
twitter: tylrfishr
---

The NPR News Apps team, before its merger with the Multimedia team to form Visuals, made [an early commitment](http://election2012.npr.org) to building client-side news applications, or static sites. The team made this choice for many reasons — performance, reliability and cost among them — but such a decision meant we needed our own template to start from so that we could easily build production-ready static sites. Over the past two years, the team has iterated on our [app template](https://github.com/nprapps/app-template), our “opinionated project template for client-side apps.” We also commit ourselves to keeping that template completely open source and free to use.

We last checked in on the app template [over a year ago](http://blog.apps.npr.org/2013/02/14/app-template-redux.html). Since then, our team has grown and merged with the Multimedia team to become Visuals. We have built [user-submitted databases](http://apps.npr.org/playgrounds/), [visual stories](http://apps.npr.org/borderland/) and curated collections of [great](http://apps.npr.org/best-books-2013/) [things](http://apps.npr.org/commencement/), all with the app template. As we continue to build newer and weirder things, we learn more about what our app template needs. When we develop something for a particular project that can be used later — say, the share panel from [Behind the Civil Rights Act](http://apps.npr.org/behind-the-civil-rights-act) — we refactor it back into the app template. Since we haven’t checked in for a while, I thought I would provide a rundown of everything the app template does in July 2014.

## The Backbone

The fundamental backbone of the app template is the same as it has always been: a [Flask](http://flask.pocoo.org/) app that renders the project locally and provides routes for baking the project into flat files. All of our tooling for local development revolves around this Flask app. That includes:

* [Fabric](http://www.fabfile.org/): Using the app template requires knowledge of the command line. This is because we use Fabric, a Python library for running functions from the command line, to automate every task from bootstrapping the template to deploying to production.
* [Jinja2](http://jinja.pocoo.org/docs/): Jinja2 provides templating within HTML, which is essential for baking out our various pages within an app. The Flask app allows us to pass any data we want, but we pass in data from a Google Spreadsheet and data from a configuration file by default (more on this later).
* [awscli](https://pypi.python.org/pypi/awscli): All of our apps are hosted on [Amazon S3](http://aws.amazon.com/s3/). It is cheap, reliable and fast. With awscli and Fabric, we can fully automate deployment from the command line. It is true one-touch deployment.

Out of these tools, we essentially built a basic static site generator. With just these features, the app template wouldn’t be all that special or worth using. But the app template comes with plenty more features that make it worth our investment.

## Copytext and Google Spreadsheets

A few months ago, we released [copytext](http://copytext.readthedocs.org/en/latest/), a library for accessing a spreadsheet as a native Python object suitable for templating. Some version of copytext has been a part of the app template for much longer, but we felt it was valuable enough to factor out into its own library. 

We often describe our Google Docs to Jinja template workflow entirely as “copytext”, but that’s not entirely true. Copytext, the library, works with a locally downloaded `.xlsx` version of a Google spreadsheet (or any `.xlsx` file). We have [separate code](https://github.com/nprapps/app-template/blob/master/etc/gdocs.py) in the app template itself that handles the automated download of the Google Spreadsheet. 

Once we have the Google Spreadsheet locally, we use copytext to turn it into a Python object, which is passed through the Flask app to the Jinja templates (and a separate JS file if we want to render templates on the client). 

The benefits of using Google Spreadsheets to handle your copy are [well-documented](https://source.opennews.org/en-US/articles/ultralight-cmses/). A globally accessible spreadsheet lets us remove all content from the raw HTML, including [tags for social media and SEO](https://github.com/nprapps/app-template/blob/master/templates/_social_tags.html). Spreadsheets democratize our workflow, letting reporters, product owners and copy editors read through the raw content without having to dig into HTML. Admittedly, a spreadsheet is not an optimal place to read and edit long blocks of text, but this is the best solution we have right now.

## Render Pipeline

Another piece of the backbone of the static site generator is the render pipeline. This makes all of our applications performance-ready once they get to the S3 server. Before we deploy, the render pipeline works as follows:

1. Compile our LESS files into CSS files.
2. Compile our JavaScript templates (JSTs).
3. Render our [app configuration file](https://github.com/nprapps/app-template/blob/master/app_config.py) and copy spreadsheet as JavaScript objects.
4. Run through the Flask routes and render Jinja templates into flat HTML as appropriate.

When running through the Jinja templates, some more optimization magic happens. We defined [template tags](https://github.com/nprapps/app-template/blob/master/templates/_base.html#L111) that allow us to “push” individual CSS and JavaScript files into one minified and compressed file. You can see the code that creates those tags [here](https://github.com/nprapps/app-template/blob/master/render_utils.py#L16). In production, this reduces the number of HTTP requests the browser has to make and makes the files the browser has to download as small as possible.

## Sensible Front-End Defaults

We like to say that the app template creates the 90% of every website that is exactly the same so we can spend our time perfecting the last 10%, the presentation layer. But we also include some defaults that make creating the presentation layer easier. Every app template project comes with [Bootstrap](http://getbootstrap.com) and [Font Awesome](http://fortawesome.github.io/Font-Awesome/). We include our custom-built share panel so we never have to do that again. Our NPR fonts are automatically included into the project. This makes going from paper sketching to wireframing in code simple and quick. 

## Synchronized Assets

Once we merged with the Multimedia team, we started working more with large binary files such as images, videos and audio. Committing these large files to our git repository was not optimal, slowing down clone, push and pull times as well as pushing against repository sizes limits. We knew we needed a different solution for syncing large assets and keeping them in a place where our app could see and use them.

First, we tried symlinking to a shared Dropbox folder, but this required everyone to maintain the same paths for both repositories and Dropbox folders. We quickly approached our size limit on Dropbox after a few projects. So we decided to move all of our assets to a separate S3 bucket that is used solely for syncing assets across computers. We use a Fabric command to scan a gitignored assets folder to do three things:

1. Scan for files that the local assets folder contains but S3 does not. Then, we prompt the user to upload those files to S3.
2. Scan for files that the S3 bucket has but the local folder does not. Then, we download those files.
3. Scan for files that are different and prompt the user to pick which file is newer.

This adds a layer of complexity for the user, having to remember to update assets continually so that everyone stays in sync during development. But it does resolve space issues and keeps assets out of the git repo.

## Project Management

On the Visuals Team, we use GitHub Issues as our main project management tool. Doing so requires a bit of configuration on each project. We don’t like GitHub’s default labels, and we have a lot of issues (or tickets, as we call them) that we need to open for every project we do, such as browser testing.

To automate that process we have — you guessed it — a Fabric command to make the whole thing happen! Using the GitHub API, we run [some code](https://github.com/nprapps/app-template/blob/master/etc/github.py) that sets up our default labels, milestones and issues. Those defaults are defined in [`.csv` files](https://github.com/nprapps/app-template/blob/master/etc/default_tickets.csv) that we can update as we learn more and get better.

## Command Line Analytics

Every few weeks, [Chris Groskopf](https://twitter.com/onyxfish) gets an itch. He gets an itch that he must solve a problem. And he usually solves that problem by writing a Python library.

Most recently, Chris wrote [clan](https://github.com/onyxfish/clan) (or Command Line Analytics) for generating analytics reports about any of our projects. The app template itself has baseline event tracking baked into our default JavaScript files (Who opened our share panel? Who reached the end of the app?). Clan is easily configured through a YAML file to track those events as well as Google Analytics’ standard events for any of our apps. While clan is an external library and not technically part of the template, we configure our app template with Google Analytics defaults that make using clan easy.

It is important for us to be able to not only easily make and deploy apps, but also easily see how well they are performing. Clan allows us to not only easily generate individual reports, but also generate reports that compare different apps to each other so we get a relative sense of performance. 

## Servers!

Our static site generator can also deploy to real servers. Seriously. In our [Playgrounds For Everyone](http://apps.npr.org/playgrounds/) app, we need a cron server running to listen for when people submit new playgrounds to the database. As much as we wish we could, we can’t do that statically, but that doesn’t mean the entire application has to be dynamic! Instead, the app template provides tooling for deploying cron jobs to a cron server. 

In the instance of Playgrounds, the cron server listens for new playground submissions and sends an email daily to the team so we can see what has been added to the database. It also re-renders and re-deploys the static website. Read more about that [here](http://blog.apps.npr.org/2013/09/13/using-a-static-site-to-crowdsource-playgrounds.html).

This is the benefit of having a static site generator that is actually just a Flask application. Running a dynamic version of it on an EC2 server is not much more complicated.

## In Summation

Over 1500 words later, we’ve gone through (nearly) everything the app template can do. At the most fundamental level, the app template is a Flask-based static site generator that renders dynamic templates into flat HTML. But it also handles deployment, spreadsheet-based content management, CSS and JavaScript optimization, large asset synchronization, project management, analytics reporting and, if we need it, server configuration. 

While creating static websites is a design constraint, the app template’s flexibility allows us to do many different things within that constraint. It provides a structural framework through which we can be creative about how we present our content and tell our stories.