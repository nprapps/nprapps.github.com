---
layout: post
title: "Lunchbox update: We're dropping support for electron"
description: "As it turns out, corporate IT policies make distributing a newsroom tool as a native app really hard."

author: Tyler Fisher
email: tyler@tylerjfisher.com
twitter: tylrfishr
---

Last year, NPR Visuals sent a team to OpenNews's Portland Code Convening to create Lunchbox, a suite of newsroom tools that make  images for social media sharing, and make it easily deployable for newsrooms.

We decided to experiment with a new way of distributing newsroom technology -- desktop apps, built with the brilliant library Electron. Electron allows you to build webapps with JavaScript and package them into native software. We also maintained the ability to deploy the app as a static webapp on Amazon S3 or a fileserver.

And truth be told, we're still using Lunchbox as a web app, not as a desktop app. As it turns out, installing desktop apps across our newsroom with a corporate IT policy is pretty much impossible for us, and other Lunchbox users have faced similar problems across newsrooms.

Truth be told again, the Electron app for Windows was always super buggy in perplexing ways.

After talking to a few of our biggest users about Lunchbox, we've decided to drop Electron support for Lunchbox. We are now encouraging you to deploy the app to Amazon S3 or another fileserver. The processes for doing this [are documented](https://github.com/nprapps/lunchbox#deployment).

Moving Lunchbox to a web app first requires one change to Waterbug: Because of cross-domain issues, loading images into Waterbug from external URLs is unreliable and pretty much impossible from our end. So we've removed that from the app -- users will need to download the image locally and then upload it into Waterbug.

Despite removing support, I've left all the electron code (basically a fab command and some npm config) in the app, in case anyone wants to continue building desktop apps (or fix the Windows app!). But we will not be actively developing or building desktop app versions of Lunchbox in the future.

If you would like to contribute to Lunchbox in any way, the repo is [here](http://github.com/nprapps/lunchbox). Feel free to open issues and submit pull requests!
