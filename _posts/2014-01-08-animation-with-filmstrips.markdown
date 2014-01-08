---
layout: post
title: "Animation With Filmstrips"
description: "For the Planet Money T-Shirt project, we experimented with an alternative to animated GIFs."
author: Alyson Hurt
email: ahurt@npr.org
twitter: alykat 
---
Animated gifs have immediate visual impact &mdash; from [space cats](http://collegecandy.files.wordpress.com/2013/09/pizza_cat_in_space.gif) to [artistic cinemagraphs](http://iwdrm.tumblr.com/). For NPR's "[Planet Money Makes A T-Shirt](http://apps.npr.org/tshirt/)" project, we wanted to experiment with using looping images to convey a quick concept or establish a mood.

However, GIF as a format requires so many compromises in image quality and the resulting files can be enormous. A few months ago, [Zeega](http://zeega.com)'s Jesse Shapins wrote about a [different technique](https://medium.com/p/de37c61e1d71) that his company is using: [filmstrips](http://www.niemanlab.org/2013/09/can-you-build-a-better-gif-zeega-wants-to-remake-the-aged-animation-format-for-mobile/). The frames of the animation are stacked vertically and saved out as a JPG. The JPG is set as the background image of a div, and a CSS animation is used to shift the y-position of the image.

Benefits of this approach: 

* Potentially better image quality and lower filesize than an equivalent GIF

* Since the animation is done in code, rather than baked into the image itself, you can do fun things like toy with the animation speed or trigger the animation to pause/play onclick or based on scroll position, [as we did in this prototype](http://apps.npr.org/tshirt/prototypes/filmstrip-06.html).

Drawback: 

* Implementation is very code-based, which makes it much more complicated to share the animation on Tumblr or embed it in a CMS. Depending on your project needs, this may not matter.

We decided to use this technique to show a snippet of a [1937 Department of Agriculture documentary](https://archive.org/details/CEP165) in which teams of men roll large bales of cotton onto a steamboat. It's a striking contrast to the highly efficient modern shipping methods that are the focus of this chapter, and having it [play immediately, over and over](http://apps.npr.org/tshirt/#/boxes), underscores the drudgery of it.

<img src="/img/posts/filmstrip-original.jpg" alt="screenshot from the video" />
_(This is just a screenshot. You can see the animated version in the ["Boxes" chapter](http://apps.npr.org/tshirt/#/boxes) of the t-shirt site.)_


Making A Filmstrip
------------------

The hardest part of the process is generating the filmstrip itself.  What follows is how I did it, but I'd love to find a way to simplify the process.

First, I downloaded the highest-quality version of the video that I could find from archive.org. Then I opened it in [Adobe Media Encoder](http://www.adobe.com/products/mediaencoder.html) (I'm using CS5, an older version).

<img src="/img/posts/filmstrip-encoder-1.png" alt="screenshot of the Adobe Media Encoder CS5 interface" />

I flipped to the "output" tab to double-check my source video's aspect ratio. It wasn't precisely 4:3, so the encoder had added black bars to the sides. I tweaked the output height (right side, “video” tab) until the black bars disappeared. I also checked “Export As Sequence” and set the frame rate to 10. Then, on the left side of the screen, I used the bar underneath the video preview to select the section of video I wanted to export.

The encoder saved several dozen stills, which I judged was probably too many. I went through the stills individually and eliminated unnecessary ones, starting with frames that were blurry or had cross-fades, then getting pickier. When I was done, I had 25 usable frames. (You may be able to get similar results in less time by experimenting with different export frame rates from Media Encoder.)

Then I used a Photoshop script called [Strip Maker](http://ps-scripts.com/bb/viewtopic.php?t=2489) to make a filmstrip from my frames.

<img src="/img/posts/filmstrip-stripmaker.png" alt="the StripMaker interface" />

And [here's the result](http://apps.npr.org/tshirt/img/filmstrip-cotton-archive.jpg), zoomed way out and flipped sideways so it'll fit onscreen here:

<img src="/img/posts/filmstrip-strip.png" alt="the finished filmstrip" />

I exported two versions: one at 800px wide for desktop and another at 480px for mobile. (Since the filmstrip went into the page as a background image, I could use media queries to use one or the other depending on the width of the viewport.) Because the image quality in the source video was so poor, I could save the final JPG at a fairly low image quality setting without too much visible effect. The file sizes: 737KB for desktop, 393KB for mobile.


And Now The Code
----------------

Here's how it appeared in the [HTML markup](https://github.com/nprapps/tshirt/blob/master/templates/_chapter_boxes.html#L32-L41):

<script src="https://gist.github.com/alykat/8319004.js"> </script>

And the [LESS/CSS](https://github.com/nprapps/tshirt/blob/master/less/app.less#L1306-L1329):

<script src="https://gist.github.com/alykat/8319352.js"> </script>

Key things to note:

* ```.filmstrip``` is set to stretch to the height/width of its containing div, .filmstrip-wrapper. The dimensions of ```.filmstrip-wrapper``` are explicitly set to define how much of the filmstrip is exposed. I initially set its height/width to the original dimensions of the video (though I will soon override this via JS). The key thing here is having the right aspect ratio, so a single full frame is visible.

* The background-size of ```.filmstrip``` is 100% (width) and 100 times the number of frames (height) &mdash; in this case, that's 25 frames, so 2500%. This ensures that the image stretches at the proper proportion.

* The background-image for ```.filmstrip``` is set via media query: the smaller mobile version by default, and then the larger version for wider screens.

* I'm using a separate class called ```.animated``` so I have the flexibility to trigger the animation on or off just by applying or removing that class.

* ```.animated``` is looking for a CSS animation called ```filmstrip```, which I will define next in my JavaScript file.

On page load, as part of the initial JavaScript setup, I call a series of functions. One of those [sets up CSS animations](https://github.com/nprapps/tshirt/blob/master/www/js/app.js#L492-L540). I'm doing this in JS partly out of laziness &mdash; I don't want to write four different versions of each animation (one for each browser prefix). But I'm also doing it because there's a separate keyframe for each filmstrip still, and it's so much simpler to render that dynamically. Here's the code (filmstrip-relevant lines included):

<script src="https://gist.github.com/alykat/8319458.js"> </script>

I set a variable at the very beginning of the function with the number of frames in my filmstrip. The code loops through to generate CSS for all the keyframes I need (with the relevant browser prefixes), then appends the styles just before the ```</head>``` tag. The result looks like this (excerpted):

<script src="https://gist.github.com/alykat/8319511.js"> </script>

Key things to note:

* The first percentage number is the keyframe's place in the animation.

* The timing difference between keyframes depends on the number of video stills in my filmstrip.

* ```background-position```: The left value is always 0 (so the image is anchored to the left of the div). The second value is the y-position of the background image. It moves up in one-frame increments (100%) every keyframe.

* ```animation-timing-function```: Setting the animation to move in steps means that the image will jump straight to its destination, with no transition tweening in between. (If there was a transition animation between frames, the image would appear to be moving vertically, which is the completely wrong effect.)

Lastly, I have a function that resizes ```.filmstrip-wrapper``` and makes the filmstrip animation [work in a responsive layout](https://github.com/nprapps/tshirt/blob/master/www/js/app.js#L546-L550). This function is called when the page first initializes, and again any time the screen resizes. Here it is below, along with some variables that are defined at the very top of the JS file:

<script src="https://gist.github.com/alykat/8319550.js"> </script>

This function:

* Checks the width of the outer wrapper (```.filmstrip-outer-wrapper```), which is set to fill the width of whatever div it's in;

* Sets the inner wrapper (```.filmstrip-wrapper```) to that width; and

* Proportionally sets the height of that inner wrapper according to its original aspect ratio.

_Footnote: For the [chapter title cards](http://apps.npr.org/tshirt/#/cotton), we used looping HTML5 videos instead of filmstrips. My colleague Wes Lindamood found, through some experimentation, that he could get smaller files and better image quality with video. Given iOS's restrictions on auto-playing media &mdash; users have to tap to initiate any audio or video &mdash; we were okay with the title cards being a desktop-only feature._