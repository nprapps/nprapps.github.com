---
layout: post
title: "Blue and Red America: How We Built It"
description: Some QGIS, some Python and a whole lot of Shapefiles

author: Sean McMinn
email: smcminn@npr.org
twitter: shmcminn
---

[This story](https://www.npr.org/2018/11/09/664377885/what-do-blue-and-red-america-have-in-common-craft-breweries-and-more) started, as many do, with a tweet.


<div class="center">

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Just ran the numbers: of the 46 GOP-held House seats in the deepest trouble (Toss Up or Lean/Likely D at <a href="https://twitter.com/CookPolitical?ref_src=twsrc%5Etfw">@CookPolitical</a>), 63% contain a Whole Foods Market (vs. 38% of all 194 other GOP-held seats). <a href="https://t.co/pF3pt9mrbS">https://t.co/pF3pt9mrbS</a></p>&mdash; Dave Wasserman (@Redistrict) <a href="https://twitter.com/Redistrict/status/1054045345792045057?ref_src=twsrc%5Etfw">October 21, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

</div>


-----------------------------------------------

Fast forward a few weeks, and we've published a series of maps with the headline "[What Do Blue And Red America Have In Common? Craft Breweries — And More](https://www.npr.org/2018/11/09/664377885/what-do-blue-and-red-america-have-in-common-craft-breweries-and-more)". 

<img src="/img/posts/2018-11-19-elex-18-districts/starbucks.png" alt="starbucks map" width="400"/>

Everyone talks about how divided the country is, especially after elections, so I thought it would be interesting to show what kinds of things Americans have in common, as well as what we don’t. I think we were all surprised that small breweries were almost as common in red districts as they were in blue ones, and I personally wasn’t expecting the gap in farming districts to be quite as big as it was. 

<img src="/img/posts/2018-11-19-elex-18-districts/farms.png" alt="farms map" width="400"/>

This was my first map-heavy project for NPR, and my first time doing shapefile analysis on congressional districts. Though it involved at least a dozen data sources, it wasn't really as hard as it might sound. 

### Step 1: Figure out what what's worth mapping

I wanted this to show the kinds of things that are important to lots and lots of Americans. I still don't think I have a perfect single word that describes these kinds of locations — I toyed with "cultural indicators", and in the story we went with "touchstones of American life."

I did an everything-even-your-bad-ideas brainstorm to come up with an initial list of things I might find data for.

<img src="/img/posts/2018-11-19-elex-18-districts/brainstorm.jpg" alt="brainstorm" width="400"/>

### Step 2: Get the data

For each of those, I did some variation of Googling "X locations in United States data." For some it was easy — Amtrak publishes [a list](http://osav-usdot.opendata.arcgis.com/datasets/3e9daf681b154fb19372044f4d52941a_0) of their train stations with latitudes and longitudes for anyone to download. Others I realized would be impossible to do in a timely way — the list of all U.S. gyms, for example, isn't something that anyone tracks publicly.    

What was important during this process was getting the precise latitude and longitude for each location we would be including. Since most data sources don't group their records by congressional district, (shoutout to USDA, which [actually does](https://www.nass.usda.gov/Publications/AgCensus/2012/Online_Resources/Congressional_District_Profiles/index.php!)) we would need to do our own analysis of which congressional district they fall in.

That congressional district boundary data is provided as a shapefile from the [Census Bureau](https://www.census.gov/geo/maps-data/data/cbf/cbf_cds.html), and is updated with the most recent redistricted boundaries in Pennsylvania. 

### Step 3: Load the data with the most recent congressional district maps

To analyze which districts the locations fall in, I used open-source software called QGIS. If you want to do a similar analysis, here are the steps:

1. Add vector layer, using the district `.shp` file from the Census Bureau.
2. Add delimited text layer for each `CSV` file containing locations you want to analyze.
    * When adding the layer, specify the `X field` as your longitude column name, and the `Y field` as your latitude column name.

    <img src="/img/posts/2018-11-19-elex-18-districts/comma-import.png" alt="QGIS comma import" width="400"/>

3. In the `Vector` menu, select `Analysis Tools => Count points in polygon`.
    * For the `polygon` option, use the congressional districts shapefile layer.
    * For the `points` option, use the location layer with data points you want to analyze
    * NOTE: If the two coordinate systems do not align, hit `Close` and reproject the points location layer by right-clicking on it in the Layers Panel and selecting `Set Layer CRS`. Then choose the same `CRS` as the congressional district layer. 
    * Change the `Count field name` to something descriptive, such as `NUMPOINTSstarbucks`.
    * Click `Run`.

    <img src="/img/posts/2018-11-19-elex-18-districts/layer-analysis.png" alt="QGIS comma import" width="400"/>

4. Right-click on the new layer called `Count` and click `Save As`. Save it as a `CSV` to your computer. That new file should have a column with `GEOID` with the FIPS I.D. for each district, as well as a new column called `NUMPOINTSstarbucks` with the count of Starbucks — for example — in each district.
5. Repeat steps 2-4 for each location `CSV` you want to analyze.

### Step 4: Combine with election results

I put each of those new files in a folder and ran a [Python script](https://github.com/nprapps/open-data/blob/master/district-portrait/combine_qgis_exports_w_dists.py) to combine them with district data showing who had won each district in the 2018 general election.


--------------

### What I could have done differently

Though this whole process wasn’t really that hard, it did involve a lot of steps. That means there was more room for error — whoops, didn’t really mean to click that `Delete` button — and less of an automated process to follow for next time we want to do something like this. 

Our new team developer Thomas Wilburn told me that we could have used PostGIS, which I’ve never touched before, to script much of this process. If we didn’t want to add another tool, we could have probably used QGIS to merge the winners for each district with the district location information, cutting the extra Python script out of the process.


-------------------


Once I had all the data, I opened up a d3.js-based U.S. map template that my colleague Alyson Hurt developed. I passed the data to Javascript to color each congressional district based on its `GEOID` and the count of locations inside in it. 

The graphic you see repeated 11 times on the story page is actually the same static file iFramed in each time, but with an added parameter of `chartdata=XYZ`. The Javascript reads that parameter then displays the appropriate data.

Complete data (excluding the Brewers Association's proprietary they gave us to use for this piece) is available [here](https://github.com/nprapps/open-data/tree/master/district-portrait).
