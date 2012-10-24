---
layout: post
title: "The Swing State Scorecard: Generating the combinations"
description: "Early in the development of the Swing State Scorecard we determined that we wanted to tell a story about how many simple (2-state, 3-state) combinations of tossup states there are which would win the election for Obama (based on our projections). One idea that seemed compelling was to try to actually illustrate all the possible combinations of states that would win the election for each candidate."
author: Christopher Groskopf
---
*This is the first in a series of two (or more) blog posts about how we built the [Swing State Scorecard](http://apps.npr.org/swing-state-scorecard/).*

### The idea

Early in the development of the Swing State Scorecard we determined that we wanted to tell a story about how many simple (2-state, 3-state) combinations of tossup states there are which would win the election for Obama (based on our projections). One idea that seemed compelling was to try to actually illustrate all the possible combinations of states that would win the election for each candidate. Doing so would, we speculated, demonstrate very clearly how important certain states (Florida) are to each candidates overall chance of winning the election. We had seen [one other example](http://www.270towin.com/presidential_map/combinations.php?party=Republican&num_rem=79&st_remain=FL,PA,OH,NC,VA,CO,IA,NV,NH&me=&ne=) of this, but it was difficult to use and didn't allow you to quickly compare the candidates.

### Building it

The one wrinkle to building our "paths to victory" was that we weren't actually sure we had the computational capacity to do it. Pre-rendering all the possible combinations would be a huge pain&mdash;the numbers quickly become unmanageable and an API would be untenable on election night. The better option was to actually generate the combinations on the fly in Javascript, but we weren't sure whether or not the average user's computer would have the horsepower to do it.

With these constraints in mind I set to work prototyping the algorithms that generate the combinations. Javascript lacks good library support for this sort of operation, but I was able to find many combination generating functions on Stack Overflow and elsewhere. The vast majority of these were recursive solutions, which immediately blew the [call stack](http://www.nczonline.net/blog/2009/05/19/javascript-stack-overflow-error/) in several of our target browsers. Fortunately, I found a [very fast, non-recursive solution](http://stackoverflow.com/a/4061167) developed by Stack Overflow user [Sid_M](http://stackoverflow.com/users/449043/sid-m). I modified this very slightly and the final function is in [combinations.js](https://gist.github.com/3947519) in our codebase. To my surprise this method of generating combinations is very, very fast and works great even in IE running in a VM. Of course, performance of the algorithm does degrade quickly with the number of tossup states, so we know we have to keep that number under fifteen in order for this method to work.

(For load-time performance we do pre-render the first set of combinations. We could extend this to second-order combinations if necessary for performance, but the additional file size is undesirable.)

### Pruning the combinations

The resulting combinations still need to be pruned down in order to be interesting. We filter them in two ways. First, and most obviously, we only include ones that accumulate enough votes to form a winning combination. (This could probably be faster if we pushed the logic down into the combinations algorithm, but I preferred to keep things well-factored.) Secondly, we remove any combination which is a superset of a previous combination. That is, if we have the combination "Florida + Colorado", then we discard "Florida + Colorado + New Hampshire". Fortunately the output of our combinations process is sorted, so we can do all this pruning in a single iteration over the list.

Here is the final code that generates and prunes the combinations:

<script src="https://gist.github.com/3948223.js"> </script>

Obama's lead in the polls has shrunk (or even reversed, depending on who you read) since we developed this approach, but we feel the illustration of the relative complexity of the paths to victory remains compelling and unique amongst election apps.