---
layout: post
title: "Pym.js v1.0.0 release: What do you need to know"
description: "Pym.js has a new release that tackles some integration problems with CMSes. Let us break down the main goals and changes for this release"

author: Juan Elosua
email: jelosua@npr.org
twitter: jjelosua
---

The NPR Visuals Team happy to announce the release of `Pym.js` v1.0.0. We want to share with all of you the goals that we hope to achieve with it and the design process that led us to the new release.

But wait, what is Pym.js for?
--------------------------------

`Pym.js` embeds and resizes an iframe responsively (width and height) within its parent container while bypassing the usual cross-domain related issues.

Pym.js v1.0.0 Goals
-------------------

* Fix `Pym.js` loading issues and integration problems with certain CMSes.
* Add automated unit testing to improve reliability moving forward.
* Serve `Pym.js` through a canonical CDN, but leave room for the library evolution.
* Clean up small issues and merge pull requests made by the community.

### Loading Pym.js in complicated environments

`Pym.js` v1.0.0 development has been driven by a change needed to extend the ability to use `Pym.js` in certain CMSes used by NPR member stations and other use cases found by our collaborators. The Pym.js loading process broke for these users and thus made the embeds unusable.

Some content management systems prevent custom Javascript from being embedded on the page, others use [`pjax`](https://github.com/defunkt/jquery-pjax) to load content, and still others use `RequireJS` to load libraries. Since `Pym.js` was designed as a library with support for inclusion using `AMD` and `CommonJS`, we have encountered certain CMSes scenarios where `Pym.js` broke in some cases or did not load at all. `Pym.js` v1.0.0 development was geared towards solving these issues.

That's why we created `pym-loader.js`, an additional script that acts as a wrapper to deal with all the nitty gritty details to successfully load `Pym.js` in many common cases. `pym-loader.js` was developed after much thought and discussion with developers using `Pym.js`.

We have decided to separate the particular needs of the `Pym.js` loading process in these special situations into a separate script that will wrap and load `Pym.js` for these cases instead of polluting the `Pym.js` library itself with special needs of certain CMSes.

We want to keep `Pym.js` loading and invocation as manageable as possible. Due to the extensive use of `Pym.js` in many different environments, we encourage implementers to create special loaders if their integrations require it.

If you have a reasonable amount of control over your CMS's `Pym.js` implementation, we recommend the raw inclusion of `Pym.js`. If you do not have that control over your CMS, are having problems loading `Pym.js` directly or just prefer to feel more protected against future changes to your CMS then you can use the loader script.

### Testing Pym.js

Having some unit testing in place for `Pym.js` will allow us to be more reliable and efficient moving forward with the maintenance of the library. So in this v1.0.0 release we have introduced unit testing for `Pym.js`.

The testing suite uses a combination of [Karma](https://karma-runner.github.io/1.0/index.html), [Jasmine](http://jasmine.github.io/2.4/introduction.html) and [Sauce Labs](https://saucelabs.com/) to improve our browser coverage (Sauce Labs provides a nice [free tier solution for open source projects](https://saucelabs.com/open-source)).

We have found some caveats using [Sauce Labs](https://saucelabs.com/) as a testing platform for open source projects. Sauce Labs manages parts of its services, specifically [badges](https://wiki.saucelabs.com/display/DOCS/Using+Status+Badges+and+the+Browser+Matrix+Widget+to+Monitor+Test+Results), with a user-based approach instead of a project based approach. If you need to test more than one open source project you will need to rely on creating _virtual users_ which is just not a good long term solution.

Having talked to Sauce Labs support about it, they have pointed us to their product ideas website to ask for that feature to be included. If you work with open source projects and would like to be able to include tests for multiple projects under the same user, go ahead and support our [feature idea](https://saucelabs.ideas.aha.io/ideas/SLIDEA-I-245).

### Versioning Pym.js

Starting with *Pym.js v1.0.0*, the library follows the [semantic versioning](http://semver.org/) pattern MAJOR.MINOR.PATCH.

* MAJOR version changes for backwards-incompatible API changes.
* MINOR version for new backwards-compatible functionality.
* PATCH version for backwards-compatible bug fixes.

NPR will host and serve `pym.js` and `pym-loader.js` through a canonical CDN at `pym.nprapps.com`. We recommend that you link directly there to benefit instantaneously from the patches and minor releases. Specifically, you can link to:

* [http://pym.nprapps.org/pym.v1.min.js](http://pym.nprapps.org/pym.v1.min.js) (minified)
* [http://pym.nprapps.org/pym.v1.js](http://pym.nprapps.org/pym.v1.js) (uncompressed)

To minimize the impact on our current and future customers, on the production side of `Pym.js` we are only going to keep the major version exposed. That way we can apply *PATCHES* and *MINOR* version changes without any change being made on our customer's code but we maintain the possibility of new major releases that are somewhat disruptive with previous versions of the library.

If for any reason you want to point to a particular release instead, just head over to our [Github release page](https://github.com/nprapps/pym.js/releases) and download the version you are looking for.

### Issues & Pull Requests

With `Pym.js` v1.0.0 release we have fixed 7 open issues and integrated 7 pull requests.

Most of the issues were related with better documentation and fixing integration problems with various CMSes.

Most of the Pull Requests dealt also with adding more configuration options to `Pym.js` as well as solving integration issues.

Summary
-------

We hope that this release of `Pym.js` will extend its ability to be used by NPR member stations and other customers thanks to the new `pym-loader.js` implementation.

Interested in using `Pym.js`? Please refer to the [user documentation](http://blog.apps.npr.org/pym.js/) and [API documentation](http://blog.apps.npr.org/pym.js/api/pym.js/1.0.0/).

We would like to thank all of our collaborators/contributors for their insightful feedback and thorough discussion, a special shout-out goes to [Hearken](http://www.wearehearken.com/) for the progress on their `Pym.js` fork and willingness to merge together so that we do not diverge and thus help us grow `Pym.js` together.


