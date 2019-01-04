---
layout: post
title: "Dailygraphics: Updates And Upgrades For 2019 And Beyond"
description: "We're rolling out updated and new versions of our dailygraphics rig."

author: Thomas Wilburn
email: twilburn@npr.org
twitter: thomaswilburn
---

This month, the NPR [Dailygraphics](https://github.com/nprapps/dailygraphics) rig turns five: The very first commit in the repo is from Jan. 13, 2014. Happy birthday, kid! As an early surprise gift, we have a couple of related announcements: Alongside improvements to the classic rig, we're releasing a new-and-improved rewrite of the rig that (hopefully!) sets us up for another five years.

## New release

First, we've formally released version 0.1.5 of the classic rig, which includes [a number of improvements](https://github.com/nprapps/dailygraphics/blob/master/CHANGELOG) for newsroom workflow. Among these:

* Node libraries (such as LESS) and Python dependencies have been updated. You'll need to run `npm install` and `pip install -r requirements.txt` to get the latest specified versions.
* The rig now automatically appends the current date to the slug for new and cloned graphics.
* You can [generate an email](https://github.com/nprapps/dailygraphics/tree/0.1.5#generating-copyedit-notes) to alert that a graphic is ready for copy editing using the command `fab copyedit`. The email includes a boilerplate introduction and content from the `labels` sheet of that graphic’s Google Sheet.
* State grid maps now optionally contain U.S. territories. (Territory visibility can be enabled or disabled via the graphic’s Google Sheet.)
* To keep your Google Drive folders tidy, you can now [specify a Drive folder](https://github.com/nprapps/dailygraphics/blob/0.1.5/app_config.py#L36-L38) for storing generated spreadsheets (separate from your template folder). **Whether you use the feature or not, you must set the new `DRIVE_SPREADSHEETS_FOLDER` param in `app_config.py` either to `None` or to a folder.**
* As part of a general accessibility audit of all templates, we’ve added a `screenreader` field to the graphic template spreadsheets so you can more easily provide descriptive text for users with limited vision.
* Whitespace is trimmed from strings coming in from the sheet, hopefully preventing weird line breaks.
* The default embed code has been simplified considerably using the “[autoinit](http://blog.apps.npr.org/pym.js/#auto)” style of pym.js embedding and [pym-loader.js](http://blog.apps.npr.org/pym.js/#loader). By default, dailygraphics uses an [NPR-specific flavor of pym-loader.js](https://github.com/nprapps/npr-pym-loader).
* Graphics templates no longer use Modernizr and Underscore.

This release was made possible by contributions from **Alice Goldfarb**, **Alyson Hurt**, **Brittany Mayes**, **Hilary Fung**, **Juan Elosua**, **Kae Petrin**, **Katie Park**, **Matthew Zhang**, **Miles Watkins** and **Vanessa Qian**. Thanks to everyone who helped out, and who tested these changes with us!

## The Next Generation

Since the Dailygraphics rig was first created, it's been a pretty stable piece of software. We still update the tool and use it for most of the graphics work we produce. But other than a big push in 2015 to add OAuth login for Google and restructure template inheritance, commits have been pretty sparing. There's nothing necessarily wrong with that: A mature product that does what you want it to do is a good thing.

However, there are also places where it's [become a little long in the tooth](https://github.com/nprapps/dailygraphics/issues/258). The packaged templates use a version of D3 that's two major releases behind the latest version, and upgrading has become difficult. The rig also lacks support for front-end tooling improvements, and it lacks a number of quality-of-life features versus common bundling solutions like Webpack. 

Soon after I joined the team late last year, I started prototyping some approaches to update the rig. That effort grew into [Dailygraphics Next](https://github.com/nprapps/dailygraphics-next), a from-scratch rewrite of the classic rig that preserves the workflow as much as possible, but modernizes the behind-the-scenes mechanics and establishes a strong foundation for the next five years (hopefully). Improvements fall into three categories: ergonomics, ecosystem and community.

### Ergonomics

Once you've used tools like Webpack, which offer live reload and transpilation, it's difficult to go back to ordering scripts by hand and refreshing the page manually. Under the new rig, the experience should be much smoother: Preview embeds will refresh whenever you save a file; all unaltered assets are cached for speed; and errors will be piped over a websocket to the browser console, so you don't need to check the terminal to see why that .less file isn't rebuilding properly.

If you've moved that much feedback into the browser, why stop there? Since the new rig is powered by a unified, monolithic local server, it was relatively easy to expose functions to the web UI via REST endpoints. You can still use the command line if you want, but once the process is started, all administrative tasks can be done from the comfort of your browser. This should make it much simpler for both new and experienced users to create, duplicate and deploy graphics without juggling terminal windows or remembering Fabric command lists.

### Ecosystem

The new rig breaks compatibility in a few places with the classic Dailygraphics system, but we tried to keep the shift to a minimum, to the point where [an old graphic can be converted over](https://github.com/nprapps/dailygraphics-next#migrating-from-the-original-dailygraphics-rig) in about 20 minutes (more, if you want to update to the newest D3 and JavaScript while you're in there). But the main goal was not to strictly stick to the old system as much as it was to become compatible with the wider JS ecosystem.

Since the core of the application is now written in Node, we're able to directly harness the tremendous energy that's gone into JavaScript front-end development tools. Visualization code is transpiled using Babel, so it can use the latest syntax even in older browsers. It's bundled and minified using Browserify, so any module published to NPM can easily be installed and loaded with the standard `require()` and `import` methods. Finally, the code is optimized for tree-shaking and flat-packing, to remove dead code and minimize the runtime cost of modules.

### Community

There are two regular requests that I heard from users when I started talking to people about the graphics rig: They wanted the option to run the code on Windows, and they wanted an easier way to create and share templates between newsrooms.

The former is, frankly, long overdue. The NPR Visuals team has always worked on Macs, and Python can be difficult to run consistently between operating systems (even with all their similarities, getting the rig running on Linux requires some patience and know-how), so it hadn't been prioritized. But many newsrooms run on Windows, at least in part, and requiring OS X also imposes a minimum cost for students or freelance journalists who can't afford particular hardware. Luckily, the cross-platform story on Node is much smoother, and so the rig should work on all three major operating systems without problems.

Sharing templates is a simpler change: Instead of loading them from inside the rig itself, they're kept in a sibling folder that has [its own Git repo](https://github.com/nprapps/dailygraphics-templates) (please note that not all templates have been converted over from the classic rig yet). We hope this will make it simpler for our users to create their own templates, share them with each other, and contribute back for everyone to use!

## The future of Dailygraphics

The release of Dailygraphics Next doesn't mean we're deprecating the classic Dailygraphics code. We still have active users inside the newsroom and outside, and we still use it for a lot of our work (for example, when we need to recreate a graphic on a deadline too short to do a full conversion to the new system). So don't worry: We're not getting rid of the tool you've grown to love, and we'll continue to maintain it.

That said, when it comes to keeping pace with the wider web ecosystem, [Dailygraphics Next](https://github.com/nprapps/dailygraphics-next) is where we'll be putting our efforts. We've already started using it for many of our graphics, and we’re planning ways it can get better. Please feel free to try it out and let us know what you think. We'd love to hear your feedback!

