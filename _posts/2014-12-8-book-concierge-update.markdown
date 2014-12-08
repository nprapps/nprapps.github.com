---
layout: post
title: "Book Concierge Update"

author: David Eads and Christina Rees
email: visuals@npr.org
twitter: nprviz
---
The 2013 NPR year-end “Book Concierge” was a big hit. Instead of writing a bunch of relatively boring lists, the books team solicited over 200 short reviews by critics and staff and put them into a single, beautiful website designed to make discovering great books fun. Readers loved it.

Approaching the 2014 Book Concierge, our goal was to build off the success of last year’s version while resisting the urge to completely rewrite the code or wildly revamp the site. This is a catalog of small improvements that add up to an improved experience.

###Modal Improvements
We changed the modal proportions so that it fits into a wider range of screen sizes without forcing the user to scroll. We also added a max-width to the modal, limiting the book cover image size on larger screens.

We also replaced the modal’s ‘previous’ and ‘next’ buttons &mdash; which were tucked away at the bottom of the review &mdash; with side paddles. This allows the user to easily click through the reviews without having to hunt for the buttons at the bottom of each review.

<img src="/img/posts/books14-image-size-2013.jpg" alt="">
<p><small>2013<small></p>

<img src="/img/posts/books14-image-size-2014.jpg" alt="">
<p><small>2014</small></p>

###Social Buttons
We added social buttons to the book modal, allowing users to share individual book reviews.
We also removed the top bar that housed share buttons for the overall app. Instead, we link to our share modal from a single button in the header.

###Tag Colors
We added a color gradient over the list of tags. This helps distinguish the tags from each other and improves the legibility of the tags when displayed in a block. And it’s pretty.

<div class="wrapper-image">
    <div class="col">
        <img src="/img/posts/books14-tags-2013.jpg" alt="">
        <p><small>2013</small></p>
    </div>
    <div class="col">
        <img src="/img/posts/books14-tags-2014.jpg" alt="">
        <p><small>2014</small></p>
    </div>
</div>

###Filter Button Location
On smaller screens, we moved the ‘filter’ button out of the header and closer to the content. This puts the button in a more appropriate context.

<div class="wrapper-image">
    <div class="col">
        <img src="/img/posts/books14-filter-2013.jpg" alt="">
        <p><small>2013</small></p>
    </div>
    <div class="col">
        <img src="/img/posts/books14-filter-2014.jpg" alt="">
        <p><small>2014</small></p>
    </div>
</div>

###Links to Previous Years
Ideally, we would have combined the books from 2013 and 2014 into one big concierge, but due to time restrictions and data management complexity we kept them separate. We still wanted to reference last year’s concierge as well as book lists from previous years, so we added these links to the header. Additionally, we added a link below the tags list to catch people who skipped past the header. 

<img src="/img/posts/books14-links-2014.jpg" alt="">
<p><small>2014</small></p>


###Lighten page load, improve performance
We’ve been able to realize significant performance gains in recent projects by using custom builds of our libraries and assets. We shaved over 300k off the initial page load by using a custom icon font generated with Fontello (http://fontello.com/) rather than including all of Font Awesome.

To further lighten the load, we dropped a few unnecessary libraries and consolidated all our scripts into a single file loaded at the bottom of the source. We disabled CSS transitions at small viewport sizes to improve mobile performance and dropped all CPU intensive 3D CSS transitions.

Paradoxically, we were able to improve performance by eliminating thumbnail sized book cover images. In 2013, we made a slightly smaller thumbnail version of the cover image. This year, we aggressively optimized the full-size cover images. The page weight is almost identical, but instead of loading a thumbnail for the the cover and a full sized cover when looking at a review, only a single image is loaded.

###Listening to users
After we launched the site, some librarians suggested to NPR Books that next year we should include a link to Worldcat, a site that will help you find a book at your local library.

We thought this was a lovely idea and didn’t see why it needed to wait.  So we used the Online Computer Library Center identifier API to get the magic book identifier used by Worldcat and added a “find at your library” link the day after launch.

###How did the improvements help?

As of writing, we have analytics data for the first 5 days of the site's launch. Comparing to last year is complicated by changing methods for collecting analytics. In 2013, about 370,000 people landed on the concierge home page during the first 5 days. In 2014, it has been a little lower -- about 337,000 people. 

Despite the lower number of visitors, engagement appears to have increased fairly significantly. About 86,000 people clicked the most popular tag (NPR Staff Picks) in 2014, up from about 75,000 in 2013. Similarly, the top review so far in 2014 has been David Mitchell's The Bone Clocks with 23,000 views, while the top book in 2013, Dave Eggers' The Circle, was viewed about 18,000 times.

In all, visitors read about 1.25 million book reviews in the first five days and selected some combination of tags 923,000 times.
