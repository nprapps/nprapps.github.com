---
layout: post
title: "Let’s tesselate: Hexagons for tile grid maps"
description: "Bored with four-sided tiles for your grid map choropleths? Add two sides and amaze your friends!"
author: Danny DeBelius
email: ddebelius@npr.org
twitter: dannydb
---

![A hexagon tile grid, square tile grid and geographic choropleth map. Maps by Danny DeBelius and Alyson Hurt](/img/posts/2015-05-11-hex-tile-maps/side-by-side.png)

<p class="caption"><small>A hexagon tile grid, square tile grid and geographic choropleth map. Maps by Danny DeBelius and Alyson Hurt.</small></p>

As the saying goes, nothing is certain in this life but death, taxes and requests for geographic data to be represented on a map.

For area data, the choropleth map is a tried and true visualization technique, but not without significant dangers depending on the nature of the data and map areas represented. Clarity of mapped state-level data, for instance, is frequently complicated by the reality that most states in the western U.S. carry far more visual weight than the northeastern states.

![Are more northeastern states shaded than western? That’s hard to say with this type of choropleth. Whatever, though. West coast, best coast, right?](/img/posts/2015-05-11-hex-tile-maps/geo-choropleth.png)

<p class="caption"><small>Are more northeastern states shaded than western? That’s hard to say with this type of choropleth. Whatever, though. West coast, best coast, right?</small></p>

While this presentation is faithful to my Californian perception of the U.S. where the northeast is a distant jumble of states I pay little attention to, I’ve learned in four years of living in D.C. that there are actually a lot of people walking around that jumble, and they’d prefer not to be ignored in mapped data visualizations. There are approximately 74 million people living in the thirteen states the U.S. Census Bureau defines as the Western United States, while around 42 million people live just in the combined metropolitan statistical areas of New York, Washington, Boston and Philadelphia.

One popular solution to this problem is the cartogram — maps where geography is distorted to correspond with some data variable (frequently population). By shading and sizing map areas, a cartogram can display two variables simultaneously. In this [New York Times example](http://elections.nytimes.com/2012/ratings/electoral-map) from the 2012 election, the size of the squares corresponds to the number of electoral votes assigned to each state, while the shade represents possible vote outcomes. NPR’s [Adam Cole](http://skunkbear.tumblr.com/) used this technique to [size states according to electoral votes and ad spending](http://www.npr.org/blogs/itsallpolitics/2012/11/01/163632378/a-campaign-map-morphed-by-money), as seen in the map below. Cartograms can be a great solution with some data sets, but they introduce complexity that might not serve our ultimate goal of clarity.

![A cartogram of the U.S. with states sized proportionally by electoral votes. Map by Adam Cole.](/img/posts/2015-05-11-hex-tile-maps/cartogram.jpg)

<p class="caption"><small>A cartogram of the U.S. with states sized proportionally by electoral votes. Map by Adam Cole.</small></p>

Recently, a third variation of choropleth has gained popularity — the tile grid map. In this version, the map areas are reduced to a uniform size and shape (typically a square) and the tiles are arranged to roughly approximate their real-world geographic locations. It's still a cartogram of sorts, but where the area sizing is based on the shared value of one "map unit." Tile grid maps avoid the visual imbalances inherent to traditional choropleths, while keeping the map a quick read by forgoing the complexity of cartograms with map areas sized by a variable data point.

Tile grid maps are a great option for mapped state data where population figures are not part of the story we’re trying to tell with the map. Several news organizations have used this approach to great effect, including [FiveThirtyEight](http://fivethirtyeight.com/features/where-your-state-gets-its-money/), [Bloomberg Business](http://www.bloomberg.com/graphics/2015-pace-of-social-change/),  [The Guardian](http://www.theguardian.com/us-news/ng-interactive/2014/oct/22/-sp-voting-rights-identification-how-friendly-is-your-state), [The Washington Post](http://www.washingtonpost.com/graphics/health/how-fast-does-measles-spread/) and [The New York Times](http://www.nytimes.com/interactive/2013/06/26/us/scotus-gay-marriage.html).

![A square tile grid map](/img/posts/2015-05-11-hex-tile-maps/square-tiles.png)

<p class="caption"><small>A square tile grid map.</small></p>

Here at NPR, we recently set out to create a template for quickly producing this type of map, but early in the process my editor [Brian](https://twitter.com/brianboyer) asked, “Do the tiles have to be squares?”

More specifically, Brian was interested in exploring the possibility of using hexagons instead of squares, with the assumption that two additional sides would offer greater flexibility in arranging the tiles and a better chance at maintaining as many border adjacencies as possible.

The idea was intriguing, but I had questions about sacrifices we might make in scanability by trading the squares for hexagons. The columns and rows of a square grid lend to easy vertical and horizontal scanning, and I wondered if the tessellation of hexagons would provide a comfortable reading experience for the audience.

Here is Brian’s first quick pencil sketch of a possible state layout using hexagons:

![Brian’s hex grid sketch.](/img/posts/2015-05-11-hex-tile-maps/sketch.png)

<p class="caption"><small>Brian’s hex grid sketch.</small></p>

That proof of concept was enough to convince me that the idea was worth exploring further. I opened up Sketch and redrew Brian’s map with the polygon tool so we could drag the states around to experiment with the tile layout more easily. We tried several approaches in building the layout, starting from each coast and building from the midwest out, to varying degrees of success.

Ultimately, I decided to prioritize accuracy in representing the unique geographic features of the U.S. border (Texas and Florida as the southernmost tips, notches for the Great Lakes) and making sure the four “corners” of the country were recognizable for orientation.

The final layout that will power our tile grid map template looks like this:

![Six sides instead of four! That means it’s two better, right?](/img/posts/2015-05-11-hex-tile-maps/hex-tiles.png)

<p class="caption"><small>Six sides instead of four! That means it’s two better.</small></p>

This map still has many of the same problems that other attempts at a tile layout of the U.S. have fallen into — the relationship of North and South Carolina, for one example — but we like the increased fidelity of the country’s shape the hex grid makes possible.

In case you were wondering, news dev Twitter loves talking about maps:

<a class="twitter-timeline" href="/dannydb/timelines/597828393728614400" data-widget-id="597829807565594626">Hex Tile Grid Maps</a>

<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

We recently published our [first use of the hexagon tile grid map](http://www.npr.org/blogs/itsallpolitics/2015/04/28/402774189/activists-urge-states-to-protect-the-civil-rights-of-lgbt-people) to show the states that currently have laws restricting discrimination in employment, housing and public accommodations based on sexual orientation, gender identity and gender expression. The hex grid tile map also made appearances in several presentations of last week's U.K. election results, including those by [The Guardian](http://www.theguardian.com/politics/ng-interactive/2015/may/07/live-uk-election-results-in-full), [Bloomberg Business](http://www.bloomberg.com/graphics/2015-uk-election/) and [The Economist](http://www.economist.com/news/special-report/21647798-why-election-exceptionally-hard-predict-aint-got-swing?fsrc=scn/fb/te/pe/ed/aintgotthatswing).

What do you think? Vote in the poll below!

<script src="http://assets-polarb-com.a.ssl.fastly.net/assets/polar-embedded.js" async="true" data-publisher="dannydb" data-poll-id="220963"></script>
