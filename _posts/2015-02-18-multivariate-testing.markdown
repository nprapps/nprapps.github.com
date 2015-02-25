---
layout: post
title: "Multivariate testing: Learning what works from your users at scale"
description: "We ran an experiment to figure out how to end a story. Here are the results."

author: Tyler Fisher and Livia Labate
email: visuals@npr.org
twitter: nprviz
---

[Multivariate and AB testing](http://en.wikipedia.org/wiki/A/B_testing) are very popular research methods used to iterate on products over time. But what do you do when your product is always different, like the visual stories we tell? We've been exploring how we to continuously learn from our audience while apply insights to future stories.

For the past year, NPR Visuals has been iterating on a story format for picture stories that works like a slideshow, presenting full-width cards with photos, text and any other HTML elements and the ability to navigate between cards. As we have iterated over this format, we have experimented with various tweaks to the presentation, but without a good process for measuring whether these tweaks were actually more successful.

In the middle of February, we had three stories approaching launch based around this format: ["A Brother And Sister In Love"](http://apps.npr.org/lookatthis/posts/lovestory/), ["Life After Death"](http://apps.npr.org/life-after-death) and ["A Photo I Love: Thomas Allen Harris"](http://apps.npr.org/lookatthis/posts/harrisloves/). In [previous](http://apps.npr.org/lookatthis/posts/colors/) [iterations](http://apps.npr.org/lookatthis/posts/publichousing/) of this format, we had concluded the story with some combination of share buttons and a promotion for another post. Our Google Analytics event tracking had shown that the share buttons were vastly unsuccessful; most users shared the story in ways that didn't use our share buttons.

With three opportunities coming up to try something else, we decided to properly test different conversion rates for getting a user to take action at the end of a story. We also discussed how sharing the story was not the most productive action a user could take. Instead, we wanted to encourage users to either support NPR by donating to member stations or, in the case of "A Brother And Sister In Love" and "A Photo I Love", follow our new project [Look At This](http://lookatthisstory.tumblr.com) on various social media.

To find out what is the most successful way of getting users to take action, we conducted a live experiment using multivariate testing, a research method that allows us to show users slightly different versions of the same page and assess which version people respond to more positively.

In multivariate testing, you determine a control scenario (something you already know) and form a hypothesis that a variation of that scenario would perform better (such as getting more users to click on a link) than the control. 

**Note**: You will see the term multivariate testing, A/B testing or split testing to discuss experiments like this. While there is a technical difference between the implementation of these various methods, they all seek to accomplish the same thing so we are not going to worry too much about accuracy of the label for the purposes of discussing what we learned.

In our tests, the control scenario was simply presenting a user with a link to either support public radio or follow us on various social media. We hypothesized that presenting users with a yes or no question that asked them how they felt about the story they just saw before seeing these options, would make them more likely to take action. We'll call this question, which changed slightly on each project, the "Care Question", as it always tried to gauge whether a user cared about a story.

The overall test model worked like this:

<img src="/img/mvt-test-model.png" alt="Test model" />
<p><small>The variations exposed two possible paths to users</small></p>

When we ran the test, about half of users saw a prompt asking them the Care Question with two buttons, “Yes” and “No”. Clicking Yes brought them to one of the two actions listed above, while clicking No revealed a prompt to email us feedback. The other half of users was shown the action we wanted them to take.

With [a small amount of code](https://github.com/nprapps/lookatthis/blob/master/posts/fugelsang/www/js/app.js#L204-L225) to determine which version of the conclusion slide to serve, we were able to run these tests at about equal intervals.

In this blog post, we will show how we determined our results, run through the results of each test and what conclusions we have drawn from those tests.

## Process

To measure the success of each scenario, we used Google Analytics' custom event tracking. When a user reached a conclusion slide, we sent an event to Google Analytics to log which tests a particular user was running. This gave us the denominator for any calculation of success for a particular scenario.

We also tracked clicks on the "Yes" and "No" buttons of the Care Question, and clicks on the support link, each of the follow links and the email link. We consider a click on either the support or follow link a success, thus becoming the numerator in our calculations of success. 

<img src="/img/mvt-care-question.png" alt="Example Care Question" />
<p><small>The Care Question used in A Brother And Sister In Love</small></p>

Determining whether the difference between a hypothesis scenario and the control scenario is statistically significant requires some pretty complex calculations, which you can read about [here](http://20bits.com/article/statistical-analysis-and-ab-testing). Luckily, Hubspot provides a [simple-to-use calculator](http://www.hubspot.com/ab-test-calculator) to determine the statistical significance of your results. 

Significance is determined by the confidence interval, or how confident you can be that your numbers are not determined simply by randomness. Usually, a 95% confidence interval or greater is high enough to draw a conclusion. Using the calculator, we determined whether the _difference in conversion rates_ (where conversion rate is defined as clicks / the number of times a particular test was run) was statistically significant.

In the following results, we will reveal the results of performing these calculations and determine whether or not our hypotheses proved true.

## "A Brother And Sister In Love"

The first test we ran happened on ["A Brother And Sister In Love"](http://apps.npr.org/lookatthis/posts/lovestory/). The format of the story is a little different than our typical slide-based story: it is entirely scripted based on an audio story. Rather than allowing users to advance through the slideshow at their own pace, the slides advance in sync with the audio story.

Still, it borrowed many of the design elements from our previous slide-based stories, including ending with a conclusion slide. The test for this story was actually two separate A/B tests, whether a user was prompted with the Care Question or not, and whether they were prompted to follow Look At This on social media or support NPR by donating. The Care Question was "Did you love this story?"

Combining all the possibilities we ended up with the following variations:

* Story > Follow
* Story > Question (Yes) > Follow
* Story > Support
* Story > Question (Yes) > Support
* Story > Question (No) > Email

<div id="responsive-embed-mvt-lovestory">
</div>
<script src="http://apps.npr.org/dailygraphics/graphics/mvt-lovestory/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParent = new pym.Parent(
        'responsive-embed-mvt-lovestory',
        'http://apps.npr.org/dailygraphics/graphics/mvt-lovestory/child.html',
        {}
    );
</script>

**Caveat**: We attempted to use custom variables on events, which Google has removed support for and we did not know. Due to this, 

Despite the data we lost from our misuse of custom variables with Google Analytics, we were able to determine with 99.90% confidence that prompting a user with a question before asking them to "Support Public Radio" was more successful. We converted 0.184% of users who did not receive the Care Question and 1.913% of users who did, which makes a user who received the Care Question 10 times more likely to click the support link.

## "Life After Death"

One week later, after we had seen the preliminary results of our test from "A Brother And Sister In Love", we ran another test on ["Life After Death"](apps.npr.org/life-after-death). This was not a story associated with Look At This, and there was not an equivalent NPR property to follow, so we decided to hone our test on converting users to the donate page.

We wanted to confirm that users would convert at a higher percentage when presented with a Care Question first, so we kept the same control scenario. Instead of only using one question, we decided to run a multivariate test with four possible questions. The control scenario and the four question variations each received ~20% of the test traffic. The four possible questions were:

* Did you like this story?
* Did you like this story? (It helps us to know)
* Does this kind of reporting matter to you?
* Does this kind of reporting matter to you? (It helps us to know)

For this test, we tested each question against the control scenario -- presenting the user with a support button without showing them a question first.

<div id="responsive-embed-mvt-liberia">
</div>
<script src="http://apps.npr.org/dailygraphics/graphics/mvt-liberia/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParent = new pym.Parent(
        'responsive-embed-mvt-liberia',
        'http://apps.npr.org/dailygraphics/graphics/mvt-liberia/child.html',
        {}
    );
</script>

Once again, we determined that presenting users with a Care Question before asking them to support public radio was a more successful path. Each of our four questions outperformed the control scenario at > 95% confidence intervals. Of the four questions, the two asking "Does this type of reporting matter to you?" were the best performers, which perhaps suggests that tailoring the Care Question to the content is the best course of action. Life After Death is a harrowing, intense story about a devastated village in Liberia, so perhaps asking a user if they "liked" a story was offputting in this case.

## "A Photo I Love: Thomas Allen Harris"

A week after "A Brother And Sister In Love", we were able to run another test on a very similar story. It was a slide-based story that was also driven by the audio. We decided to rerun our original test, but fix our errors when logging to Google Analytics to create a better testing environment.

We left the same Care Question, "Did you love this story?", and maintained our Look At This follow links.

<div id="responsive-embed-mvt-harris">
</div>
<script src="http://apps.npr.org/dailygraphics/graphics/mvt-harris/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">

    var pymParent = new pym.Parent(
        'responsive-embed-mvt-harris',
        'http://apps.npr.org/dailygraphics/graphics/mvt-harris/child.html',
        {}
    );
</script>

Once again, we determined that giving users a question before a prompt to take action is a more successful path for conversion. Though only at a 95.58% confidence interval, the follow buttons performed in the same way, but in a less dramatic fashion, with the conversion rate only improving 0.8%. With our third test confirming that the Care Question makes more users go where we want them to go, we feel confident in saying this is something we want to implement by default going forward.

## Lessons Learned

We learned a lot in a short amount of time: some things about the stories themselves, a lot about the running of live tests and the math behind it. A few insights:

* First, we learned that a Care Question has a positive impact on performance of actions presented at the end of stories. We also demonstrated that the language used to frame the Care Question matters. So far, aligning the tone of th question with the tone of the story has proven most successful.

* Running the same test twice helped us simply validate that everything was working as planned. We are new to this, so it's not a bad idea to double check. We also quelched any concerns about the validity of the Care Question hypothesis when run on a more standard slide-based story versus one more choreographed around an audio track.

* Also regarding test design, given the nature of the traffic we usually see for our stories (intense 2-4 days of high volume followed by a long tail of decreased traffic), we need to make sure statistical significance is achieved within the first few days, as running a test for a longer period of time doesn't add much at all.

* Calculating the right sample size for a test is always a concern and particularly difficult when you don't have a reliable cadance for what traffic to expect (since it varies from story to story), so we found we don't need to do that at all. Instead, we can simply expose the entire audience for a story to the test we run and make the most of it as soon as possible. 

* Double check your math. We made several mistakes while analyzing the data simply because this is not something we do every day. Having multiple people look at the analysis as it was happening, helped us both correct errors and get a better understanding of how to make sense of the numbers. 

* Google Analytics automatically samples your reporting data if your sessions exceed 500,000. To analyze tests like these you will want to make sure you have a full picture of your audience, so request an unsampled report (available from [GA Premium](https://www.google.com/analytics/premium/) only) so you can ensure your test is valid and reliable. 

* Also, with Google Analytics dropping [support for custom variables](https://developers.google.com/analytics/devguides/collection/upgrade/faq#custom-vars), use distinct events to identify the variations of your test instead.


