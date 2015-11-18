---
layout: post
title: "What We've Learned Building Sequential Visual Stories"
description: "A deep dive into user engagement on our sequential visual stories"
author: Tyler Fisher
email: tfisher@npr.org
twitter: tylrfishr
---

Since we published Borderland in April of 2014, the NPR Visuals Team has been iterating on a style of storytelling we call "sequential visual stories." They integrate photography, text, and sometimes audio, video or illustration into a slideshow-like format. My colleague Wes Lindamood [already wrote more eloquently than I can](https://source.opennews.org/en-US/learning/evolution-nprs-picture-stories/) about the design approach we took to evolving these stories, and you should absolutely read that.

In this blog post, I will use data from Google Analytics event tracking to evaluate the performance of certain features of our sequential visual storytelling, focusing on our ability to get users to start and finish our stories.

With a few abberations, we have consistently tracked user engagement on these stories and, with over 2 million unique pageviews on our sequential visual storytelling, we can come to some conclusions about how users interact with this type of storytelling.

## Why Do This?

At NPR Visuals, [our mission is to make people care](http://hackerjournalist.net/2014/04/24/what-is-your-mission/). In order to determine whether or not we are making people care, we need better ways to measure than the pageview. 

You may have heard the Visuals Team recently received a Knight Prototype Grant to build a product we're calling [Carebot](http://knightfoundation.org/grants/201551645/). We're hoping the Carebot can help us determine whether people cared about our story automatically and quickly. Consider this exploration of event tracking data a very manual, very early, very facile version of what Carebot might do.

## Clear Calls To Action Work

A consistent feature among our set of stories is a titlecard that presents a clear call to action, often asking users to "Go" or "Begin", which advances the user to the next slide. Using Google Analytics, we were able to track clicks on these buttons. Of the 16 stories we tracked begin rates on, nine of them have begin rates of greater than 70%. 

![An example titlecard](/img/posts/titlecard-example.png)

For the stories where begin performance fell flat, we can point to a clear reason: "Put on your headphones" prompts or similar warnings that audio will be a part of the experience. Of all users who saw a titlecard without an audio warning, 74.4% of them clicked to the next slide. If an audio warning was on the slide, only 59.8% of users faced with that titlecard moved forward. The lowest performing titlecard was on [A Photo I Love: Erin Mystkowski](apps.npr.org/lookatthis/posts/mystkowski-loves/), which prompted users to "Listen" instead of "Begin."

<div id="begin"></div>
<script type="text/javascript" src="http://stage-apps.npr.org/dailygraphics/graphics/look-begin-rate-table/js/lib/pym.js"></script>
<script>
    var pymParent = new pym.Parent('begin', 'http://stage-apps.npr.org/dailygraphics/graphics/look-begin-rate-table/child.html', {});
</script>

It is also worth nothing that we have tried audio warnings at other places in our stories, and we see similar levels of dropoff. In [Drowned Out](http://apps.npr.org/lookatthis/posts/whales) and [Rethinking Arab Art](http://apps.npr.org/lookatthis/posts/al-qassemi), we placed the audio warning on a second slide. With Drowned Out, only 61.28% of users got past both slides, while with Rethinking Arab Art, only 44.3% did. Though these are two examples with lower traffic than most stories, it seems clear that this is not a more effective way of getting users into the story.

Does this mean we should remove audio warnings from titlecards? Or stop doing sequential visual stories that integrate audio altogether? Maybe, but as we will see later, stories with audio in them perform better in other aspects that filter out the begin rate.

## Sequential Visual Stories Effectively Move Users Through Stories

One of the most important metrics for us in determining the success of our stories is completion rate. Completion is defined as when a user reaches the last slide of content in a sequential visual story. 

We can calculate the mean completion rate for our sequential visual stories in two ways. The first takes all completion events fired across our sequential visual stories and divides it by the total number of unique pageviews. In this scenario, stories with higher pageviews will affect the outcome of the average more than stories with lower pageviews. I will call this the weighted method.

A second method takes the overall completion rates of each story, adds them together, and divides by the total number of stories. This gives each story equal weight, but now we're averaging percentages, which is maybe weird. I will call this the equal method. Neither method is perfect.

Across our sequential visual stories, the weighted method bears out an average 31.2% completion rate, while the equal method shows a 35.4% completion rate. 

Compare that to [Chartbeat data about the average web page](http://time.com/12933/what-you-think-you-know-about-the-web-is-wrong/), where 55% of users spend less than 15 seconds on a page. Chartbeat never talked about completion rate, but if the average web page were to compete with our sequential visual stories, 85-90% of users who spend more than 15 seconds with a page would have to finish the page. That seems unlikely.

However, completion rates varied wildly across stories. In our first sequential visual story, [Borderland](http://apps.npr.org/borderland), we only acheived a completion rate of 20%. It was also 130 slides long, nearly twice as many slides as any other sequential visual story we've done. Meanwhile, [The Unthinkable](http://apps.npr.org/lookatthis/posts/yemen), a heavy story about the "war on civilians" in Yemen, managed a completion rate of 57.6%, our highest ever. It clocked in at 35 slides. 

Despite these two data points, there seems to be no correlation between number of slides and completion rate. For example, [Plastic Rebirth](http://apps.npr.org/lookatthis/posts/plastic/), a relatively quick story about plastic surgery in Brazil, only had 33 slides and had completion rate of 33.2%.

<div id="correlation"></div>
<script type="text/javascript" src="http://stage-apps.npr.org/dailygraphics/graphics/look-slides-completion/js/lib/pym.js"></script>
<script>
    var pymParent = new pym.Parent('correlation', 'http://stage-apps.npr.org/dailygraphics/graphics/look-slides-completion/child.html', {});
</script>

## A Better Completion Rate

However, as demonstrated by the wide variance in begin rate across stories, completion rate is highly influenced by the ability for the titlecard to entice people to continue into the story. So I created a new metric, what I call "engaged user completion rate," to find which of our stories were doing the best at pulling an engaged user all the way through. Engaged user completion rate uses the number of users who began the story as the denominator instead of the number of unique pageviews.

Using the same two measures as the overall completion rate, the weighted engaged user completion rate was 42.4% while the equal rate was 50.9%. But the data gets more interesting when we start dividing by story subtypes &mdash; particulary the divide between stories that integrate audio and those that do not.

The weighted method, accounting for traffic to a given stories, show that stories with audio have much higher engaged user completion rates than stories without audio &mdash; 57.8% to 44.1%. If we use an equal weighting method, the disparity is a little less extreme &mdash; 54.5% for stories with audio to 48.5% without. 

(Note that for all of these calculations, I considered "beginning" the story getting after the audio warning on the second slide in the case of Drowned Out and Rethinking Arab Art.)

So what's the answer? I think the jury is still out on whether integrating audio into our sequential visual stories makes them perform better or worse because our sample size is still quite small, but early indicators point towards them being better for users that choose to engage. However, [A Photo I Love: Reid Wiseman](http://apps.npr.org/lookatthis/posts/spacepix) is our highest performing story overall with regards to engaged user completion rate, so we have evidence that at its best, combining audio and visuals can make a compelling, engaging story.

<div id="completion"></div>
<script type="text/javascript" src="http://stage-apps.npr.org/dailygraphics/graphics/look-completion-rate-table/js/lib/pym.js"></script>
<script>
    var pymParent = new pym.Parent('completion', 'http://stage-apps.npr.org/dailygraphics/graphics/look-completion-rate-table/child.html', {});
</script>

## So, Did We Make People Care?

Maybe? It's clear that we are achieving high completion rates even on our lowest performing stories. Consider that Borderland, our lowest performing story with a completion rate of 20.1% and engaged user completion rate of 31.6%, was over 2,500 words long. 

Ultimately, making people care is about the quality of the story itself, not about the format in which we tell it. But I feel that, with stories where text plays a large role, we are capable of making people read stories longer than they normally would because of how sequential visual storytelling allows us to pace the story. And when audio is driving the story, we are getting people to listen to short audio stories at higher rates than we normally see on [npr.org](http://npr.org).

Of course, this is not an argument for telling all stories in the sequential visual story format. Sequential visual stories work when the visuals are strong enough to deem the treatment. Not all of our stories have worked. But when they do, we can tell important stories in a way that pulls people through to the end.