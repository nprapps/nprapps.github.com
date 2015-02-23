---
layout: post
title: "Multivariate testing: Learning what works from your users at scale"
description: "We ran an experiment to figure out how to end a story. Here are the results."

author: Tyler Fisher and Livia Labate
email: visuals@npr.org
twitter: nprviz
---

When we made ["A Brother And Sister Fall In Love"](apps.npr.org/lookatthis/posts/lovestory/), we decided we wanted to do more than track pageviews and share counts once we launched. We wanted to run an experiment, to try a few different ideas at once and see what stuck. In particular, we were concerned with how we ended the story and prompted users to take action in some way.

The story, if you haven’t seen it, is presented as an audio slideshow. Users listen to story while text, photos, and animated gifs appear on the screen, synchronized to the audio. After the story has finished, we show a conclusion slide with project credits and a link to [another Look At This post](http://apps.npr.org/lookatthis/posts/mystkowski-loves/) we think users of this story would like. In previous stories, we would also include share buttons for Facebook, Twitter and email on this slide. We have tried something like this on a few stories now, and the share buttons have been highly unsuccessful. No one uses them.

Our mission as a team is to help [create empathy](http://hackerjournalist.net/2014/04/24/what-is-your-mission/), so letting the stories shine on their own always comes first, but once you've seen a story we also want to help you do other meaningful things. We want to encourage users to take more productive actions at the end of stories so to see which action would be *most* productive, we decided to test some variations.

First, we chose to experiment with two main actions: following our social media accounts for more stories or donating to NPR so we can continue to do more work like this. Then, we hypothesized that there would be an impact if we first asked users if they liked the story (our "Care Question") before presenting either of these options.

The overall test model worked like this:

Story > Question > Action 

   |_________________^

Combining all the possibilities we ended up with the following variations:

* Story > Follow
* Story > Question (Yes) > Follow
* Story > Support
* Story > Question (Yes) > Support
* Story > Question (No) > Email

When we ran the test, about half of users saw a prompt asking them the Care Question (“Did you love this story?”) with two buttons, “Yes” and “No”. Clicking Yes brought them to one of the two actions listed above, while clicking No revealed a prompt to email us feedback. The other half of users was shown either of the two actions without the question preceeding it.

## Analysis

With Google Analytics and [a small amount of code](https://github.com/nprapps/lookatthis/blob/master/posts/fugelsang/www/js/app.js#L204-L225) to determine which version of the conclusion slide to serve, we were able to run these tests, determine their effectiveness and come to some conclusions about what works and what doesn’t.

In this blog post, we will run through some of the results of our tests and what we can learn from those conclusions. First, we will share some of the baseline analytics (sessions, device usage, completion rates) necessary for understanding these numbers.

### Traffic / Usage

<table class="data">
    <caption>Total Traffic</caption>
    <tr>
        <td>Pageviews</td>
        <td class="amt">488,630</td>
    </tr>
    <tr>
        <td>Unique Pageviews</td>
        <td class="amt">444,247</td>
    </tr>
    <tr>
        <td>Users</td>
        <td class="amt">422,373</td>
    </tr>
    <tr>
        <td>Sessions</td>
        <td class="amt">445,998</td>
    </tr>
</table>

<table class="data">
    <caption>Devices (Share of Sessions)</caption>
    <tr>
        <td>Mobile</td>
        <td class="amt">56.5%</td>
    </tr>
    <tr>
        <td>Desktop</td>
        <td class="amt">33.0%</td>
    </tr>
    <tr>
        <td>Tablet</td>
        <td class="amt">10.5%</td>
    </tr>
</table>

We received **nearly 450,000 sessions** on this story, which is the best any Look At This story has ever done by a wide margin. The closest, ["Plastic Rebirth"](apps.npr.org/lookatthis/posts/plastic/), received just over 300,000 sessions. With traffic at this scale, we were able to run our tests on a large number of users. This also received the highest percentage of mobile users on a custom app that we have ever built.

### Completion

<table class="data">
    <caption>Completion (share of sessions)</caption>
    <tr>
        <td>25% complete</td>
        <td class="amt">43.9%</td>
    </tr>
    <tr>
        <td>50% complete</td>
        <td class="amt">41.0%</td>
    </tr>
    <tr>
        <td>75% complete</td>
        <td class="amt">36.0%</td>
    </tr>
    <tr>
        <td>100% complete</td>
        <td class="amt">33.9%</td>
    </tr>
</table>

About **34% of sessions completed the piece.** In this case, completion is defined as reaching the last slide of content, not reaching the conclusion slide .  For comparison, ["This Is Color"](http://apps.npr.org/lookatthis/posts/colors/) and ["Plastic Rebirth"](apps.npr.org/lookatthis/posts/plastic/) had ~28% completion rates, while ["What Do Homeless Vets Look Like?"](http://apps.npr.org/lookatthis/posts/veterans/) had ~42%, but completion was defined as the last slide (including conclusion slides) for those stories. Completion rate is important for understanding our test, because we ran the test after people completed the story.

More interestingly, **77% of sessions that got 25% of the way through the story completed the piece.** If users began the story and stuck with us for a quarter of the piece, they were very likely to finish the whole thing. However, only **44% of sessions got 25% of the way through.** It seems like the biggest road block was hooking people and getting them started. The story’s **high bounce rate (52%)** also backs up this conclusion.

### Running The Test: Tracking Challenges

**Caveat**: We attempted to use custom variables on events, which Google has removed support for and we did not know. Due to this, we do not know for certain the following things:

1. Whether people who clicked on to follow us on social media was prompted with the question "Did you like this story?" or not.

2. How many tests we ran for each of the two main actions (follow on social media, and support public radio), but we can deduce this from other evidence.

A total of **147,481 sessions** reached the conclusion slide. As intended, about half of users received the prompt with the question and half did not. Though we lost the exact numbers for the breakdown between follow and support links, the same random integer code was used to determine both tests, so we can deduce that the split was about even for that as well.

### The Care Question

![Care Question](/img/posts/mvt-like.png)

Of the ~74,000 users who saw the care question, **~19,000** of them took action, or 25%. **98%** of those users clicked “Yes”. This is expected; if users made their way through a 5-and-a-half minute audio piece, they probably enjoyed it.

**Note:** The specific language used for this question is something we want to explore further, so for this test we kept it as simple as possible (and the love theme carried through nicely!)

### Support link

![support prompt](/img/posts/mvt-support.png)

**711 people clicked the support link.** If we estimate that ~74,000 people were given the support prompt, then we converted **1% of sessions** to the donate page. 

However, **91.5%** of the support clicks came after clicking “Yes” from the care question. We can guess that ~37,000 sessions had the combination of a care question and the support button. Using that guess, we converted **1.9% of those sessions** to the donate page.

Clearly, asking people if they liked a story before we ask them to donate is a much more successful path. If we had done this for everyone, we can estimate that we could have sent more than 2,500 people to the [NPR donate page](http://www.npr.org/stations/donate).

### Social network links

![follow prompt](/img/posts/mvt-follow.png)

**900 people clicked one of the links to the Look At This social media accounts** -- either Facebook, Tumblr or Twitter. Facebook was the most popular of the links, account for 52.2% of clicks. Tumblr accounted for 41.8%, while Twitter only accounted for 6%.

Unfortunately, due to the information we lost using custom variables, we do not know whether the care question was as successful in this case as it was in the support case.

### Email us

![email prompt](/img/posts/mvt-email.png)

The email link, which only appeared if a user clicked "No" on the care question, received **39 clicks.** 390 people clicked no in total, so **10% of users took action.** We received eight actual emails from this.

### Next post clicks

Everyone who reached the conclusion slide saw the prompt to click to the next post. __4,828 sessions clicked forward to the next post__, or about __3.3% of people who reached the conclusion slide.__ 

## Insights

- In terms of raw sessions, this was the most successful Look At This story we’ve run yet. However, the high bounce rate indicates that not all of these sessions were all that productive.
- We received the highest proportion of mobile traffic any of our custom apps have ever seen.
- The story’s completion rate was good, but we lost a large percentage of users before the story even started. If the user started the story, we maintained a high number of those users until the end. (Something else to explore in the future!)
- The care questoin was much more successful in driving users to the donate page than just showing them the donate link.
- The Tumblr link is successful as the first link in the list of social media accounts, but Facebook is still the primary network of interest. (We can further experiement with order and phrasing to see what impact it may have in helping people find more stories in their chosen social media platform)
- Users who did not like the story will sometimes take action if we give them the option.

In conclusion, we learned a fair bit with this first experiment (primarily validating the hypothesis that asking a question about the story before offering the user more actions is a more productive way to engage them in those actions) and have a variety of new questions we want to explore next. You'll hear more from us about this soon!
