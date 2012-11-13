---
layout: post
title: "Election 2012: Electoral combinations"
description: "Early in the development of the Swing State Scorecard we determined that we wanted to tell a story about how many combinations (2-state, 3-state) of tossup states there are which would win the election for Obama or Romney."
author: Christopher Groskopf
---
*This is the first in a series of two (or more) blog posts about how we built the [Swing State Scorecard](http://apps.npr.org/swing-state-scorecard/) and our [Election 2012 results site](http://election2012.npr.org/).*

### The idea

Early in the development of the Swing State Scorecard we determined that we wanted to tell a story about how many combinations (2-state, 3-state) of tossup states there are which would win the election for Obama or Romney (based on NPR projections). One idea that seemed compelling was to try to actually illustrate all the possible combinations of states that would win the election for each candidate. Doing so would, we speculated, demonstrate very clearly how important certain states (Florida) were to each candidate's overall chance of winning the election. We had seen [one other example](http://www.270towin.com/presidential_map/combinations.php?party=Republican&num_rem=79&st_remain=FL,PA,OH,NC,VA,CO,IA,NV,NH&me=&ne=) of this, but it was difficult to use and didn't allow you to quickly compare the candidates.

### Building it

The one wrinkle to generating our "paths to victory" was that we weren't actually sure we had the computational capacity to do it. Pre-rendering all the possible combinations would be a huge pain&mdash;the numbers quickly became unmanageable and an API would have been untenable on election night. The better option was to actually generate the combinations on the fly in Javascript, but we weren't sure whether or not the average user's computer would have the horsepower to do it.

With these constraints in mind I set to work prototyping the algorithms that generate the combinations. Javascript lacks good library support for this sort of operation, but I was able to find many combination generating functions on Stack Overflow and elsewhere. The vast majority of these were recursive solutions, which immediately blew the [call stack](http://www.nczonline.net/blog/2009/05/19/javascript-stack-overflow-error/) in several of our target browsers. Fortunately, I found a [very fast, non-recursive solution](http://stackoverflow.com/a/4061167) developed by Stack Overflow user [Sid_M](http://stackoverflow.com/users/449043/sid-m). I modified this very slightly and the final function is called in [combinations](https://github.com/nprapps/electris/blob/master/www/js/app.js#L424) in our codebase. To my surprise this method of generating combinations is very, very fast and works great even in IE. Of course, performance of the algorithm does degrade quickly with the number of tossup states, so we had to keep that number under thirteen in order for this method to work.

### Pruning the combinations

The resulting combinations still needed to be pruned down in order to be interesting. We filtered them in two ways. First (1), and most obviously, we only included ones that accumulated enough votes to form a winning combination. (This would probably have been faster if we pushed the logic down into the combinations algorithm, but I preferred to keep things well-factored.) Secondly (2), we removed any combination which was a superset of a previous combination. That is, if we already had the combination "Florida + Colorado", then we discarded "Florida + Colorado + New Hampshire". Fortunately the output of our combinations algorithm was sorted, so we were able to do all this pruning in a single iteration over the list.

Here is the final code that generates and prunes the combinations for the Scorecard:

<script src="https://gist.github.com/3948223.js"> </script>

Obama's lead in the polls shrank (or even reversed, depending on who you read) after we developed this approach, but we felt the illustration of the relative complexity of the paths to victory remained compelling. For [election night](http://election2012.npr.org) we refactored this this code into a "prediction mode" that would kick on automatically when we got down to the last twelve states.

<img src="/img/posts/election-night-prediction-mode.png" />

As it turns out the election was over so quickly many users probably never even noticed it, but had the ballot counting gone on into Wednesday it would have provided a ongoing way for users to interact with the results. Apparently, we weren't the only ones with this in mind as the New York Times published a different view on the same information with their [Paths to the White House](http://flowingdata.com/2012/11/05/all-possible-paths-to-the-white-house/) app just before the election and updated automatically it throughout the night.
