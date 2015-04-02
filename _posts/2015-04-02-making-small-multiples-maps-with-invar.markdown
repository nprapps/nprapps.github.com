---
layout: post
title: "Making small multiples maps with invar"
description: "Use the invar toolkit to generate many small maps centered on different cities."

author: Christopher Groskopf
email: cgroskopf@npr.org
twitter: onyxfish
---

## Mapping the spread of Wal-Mart

For a recent story on [the growth of Wal-Mart in urban areas](http://www.npr.org/2015/04/01/396757476/the-neighborhood-wal-mart-a-blessing-or-a-curse) we set out to map Wal-Marts across the US and over time. Due to limitations with our dataset, we only ended up mapping three cities. Here is the graphic we produced:

<div id="responsive-embed-walmart-city-maps">
</div>
<script src="http://apps.npr.org/dailygraphics/graphics/walmart-city-maps/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParent = new pym.Parent(
        'responsive-embed-walmart-city-maps',
        'http://apps.npr.org/dailygraphics/graphics/walmart-city-maps/child.html',
        {}
    );
</script>

Automation is key to generating these sorts of maps. There are huge number of things that could go wrong if each one was produced by hand. For this story the automated process involved connecting several different tools and many different data sources. In this post I'm going to set that complexity aside and focus on just the final part of the toolchain: outputting SVG maps for final styling in Illustrator. If you're interested in the complete process, [we've open sourced the code here](https://github.com/nprapps/walmart).

## Why use many little maps?

For this story the maps we produced were used as "small multiples", that is, many small images that collectively illustrate a something larger. However, there are many other occasions where producing small maps is useful, such as when illustrating city or county-level data for many hundreds of places. Sometimes it's necessary to generate these maps dynamically, but in many cases they can be pre-generated and "looked up" as needed.

## From XML to SVG

To generate map images we used a tool I originally wrote over four years ago, when I was working for the Chicago Tribune: [invar](http://invar.rtfd.org/).

invar is a suite of three command line tools:

* **ivtile** generates map tiles suitable making slippy maps.
* **ivframe** generates individual maps centered on locations.
* **ivs3** bulk uploads files (such as map tiles) to Amazon S3 for distribution.

Both **ivtile** and **ivframe** use [Mapnik](http://mapnik.org/) as a rendering engine. Mapnik allows you to input an XML configuration file specifying styles and datasources and output map images as PNGs or SVGs. For example, here is a fragment of the configuration for the circles ("buffers") around each store:

    <Layer name="buffers" status="on" srs="+init=epsg:4269">
        <StyleName>buffer-styles</StyleName>
        <Datasource>
            <Parameter name="type">postgis</Parameter>
            <Parameter name="host">localhost</Parameter>
            <Parameter name="dbname">walmart</Parameter>
            <Parameter name="table">(select * from circles where year::integer \&lt;= 2005 order by range desc) as buffers</Parameter>
        </Datasource>
    </Layer>

    <Style name="buffer-styles">
    <Rule>
        <Filter>[range] = 1</Filter>
        <PolygonSymbolizer fill="#28556F" />
    </Rule>
    <Rule>
        <Filter>[range] = 2</Filter>
        <PolygonSymbolizer fill="#3D7FA6" />
    </Rule>
    </Style>

In this example we query a PostGIS table called ```circles``` to get buffers for stores opened before or during 2005. (The ```&lt;``` escaping is an unfortunate necessity for getting the XML to parse correctly.) We then color the circles differently based on whether they represent a one or two mile range. To render the map for Chicago we would run:

    ivframe -f svg --name chicago_2005.svg -z 10 -w 1280 -t 1280 map.xml . 41.83 -87.68

 (You can also render a series of images using coordinates from a CSV. See the [invar docs](http://invar.rtfd.org/) for more examples and more details on the flags being used here.)

 Documentation of the [Mapnik XML format](https://github.com/mapnik/mapnik/wiki/XMLConfigReference) is relatively sparse, but Googling frequently turns up working examples. If the XML annoys you too badly, there are also [Python bindings for Mapnik](https://github.com/mapnik/mapnik/wiki/GettingStartedInPython) though personally I've never had much luck generating maps from scratch with them.

## Using invar to make your own maps

invar is easy to install, just ```pip install invar```. Unfortunately, the Mapnik dependency is notoriously difficult. You'll find instructions specific to your platform on the [Mapnik wiki](https://github.com/mapnik/mapnik/wiki/Mapnik-Installation). (If you're on OSX I recommend brew!) This is the only time I will ever suggest **not** using [virtualenv](https://virtualenv.pypa.io/en/latest/) to manage your Python dependencies. Getting Mapnik to work within a virtualenv is a painful process and you're better off simply installing everything you need globally. (Just this once!)

Dusting off invar after not having used it for a long time gave me a good opportunity to fix some critical bugs and the new 0.1.0 release should be the most stable version ever. More importantly, it now supports rendering SVG images, so you can produce rough maps with invar and then refine them with Illustrator, which is what we did for the Wal-Mart maps. Go ahead and give it a spin: the [full documentation is here](http://invar.rtfd.org/). Let us know how you use it!
