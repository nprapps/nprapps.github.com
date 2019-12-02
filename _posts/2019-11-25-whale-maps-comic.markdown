---
layout: post
title: "How I Made This Graphic: A Comic"
description: "Creating an animated map of warming waters off the coast of Maine"
author: Connie Hanzhang Jin
email: cjin@npr.org
twitter: connjie
---

For my first published graphic, I worked with reporter [Jason Breslow](https://www.npr.org/people/619177672/jason-breslow) and fellow intern [Avery Ellfeldt](https://www.npr.org/people/777020223/avery-ellfeldt) to create a graphic for their [story](https://www.npr.org/2019/10/06/766401296/the-gulf-of-maine-is-warming-and-its-whales-are-disappearing) about the impact that the warming waters off the coast of Maine are having on the local whale population.

Here's how I did it, in comic form.

![How I made this graphic](/img/posts/2019-11-25-whale-maps-comic/comic-1.gif)

![A reporter requested a graphic for their story](/img/posts/2019-11-25-whale-maps-comic/comic-2.jpg)

![What elements do I have and how do I show them best?](/img/posts/2019-11-25-whale-maps-comic/comic-3.jpg)

![Maybe visualizing recent trends would be helpful?](/img/posts/2019-11-25-whale-maps-comic/comic-4.jpg)

![Call a researcher to check work, have a new idea](/img/posts/2019-11-25-whale-maps-comic/comic-5.jpg)

![Wouldn't it be more helpful to visually show the actual warming as an animation?](/img/posts/2019-11-25-whale-maps-comic/comic-6.gif)

![Pulled yearly temperature data into QGIS; exported each year and styled it in Illustrator; assembled layers in Photoshop](/img/posts/2019-11-25-whale-maps-comic/comic-7.jpg)

![Then I ask my great team for edits!](/img/posts/2019-11-25-whale-maps-comic/comic-8.jpg)

![Finally I used the graphics rig and templates to add the graphic into the story](/img/posts/2019-11-25-whale-maps-comic/comic-9.jpg)

![This is what the final animation looked like](/img/posts/2019-11-25-whale-maps-comic/comic-10.gif)

## Details and Caveats

I would first like to acknowledge that while I love making maps, I am unqualified to call myself a cartographer and owe much of my training to fellow news map-makers. I look forward to learning more about map-making in the future! Also, the final product would not have been possible without heavy research, design and judgement input from my very cool teammates and subject matter experts at [NOAA](https://www.noaa.gov/).  

I used yearly surface sea temperature data from [NOAA Coral Reef Watch](https://coralreefwatch.noaa.gov/satellite/hdf/index.php) and Natural Earth shapefiles for landmasses.

## Takeaways

If I had to make a similar animated map again, I would definitely find a way to automate the process so that the edit process would be less painful. Every time I got an edit, I would tweak all the individual Illustrator map layers and reexport them to Photoshop before reexporting the animated GIF. In the timeframe I had, I wanted to work with the skills and tools I found familiar, but this workflow is frankly unsustainable long-term. Other challenges that this workflow had were:

* The GIF had small but definite jitters from manually aligning the layers in Photoshop.

* The final product is a static GIF, which means that in other situations the text won't always scale readably between desktop and mobile.

* QGIS SVG and PDF exports are frequently unreliable in how they preserve layers and image resolution. That wasn't as much of a problem with this graphic, but in the past I've often had to reexport map layers in different file formats and combine them for maps with greater raster detail.

Next time, if there is a next time, I'll try my hand at writing scripts for outputting map files into GIF format. There are many tools to experiment with, including Dylan Moriarty's [command line mapping tutorial](https://moriartynaps.org/command-carto-part-one/) with mapshaper and makefiles; Mike Bostock's [map tutorial](https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c) using D3 and TopoJSON; and my colleague Alyson Hurt's [locator map tutorial](https://blog.apps.npr.org/2015/05/18/locator-maps.html).
