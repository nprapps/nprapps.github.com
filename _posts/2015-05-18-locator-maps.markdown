---
layout: post
title: "Simplifying Map Production"
description: "tk tk tk"
author: Alyson Hurt
email: ahurt@npr.org
twitter: alykat
---

[![Map of recent Nepal earthquakes](http://media.npr.org/news/graphics/2015/04/map-nepal-earthquake-624.png)](http://www.npr.org/sections/thetwo-way/2015/05/12/406111860/magnitude-7-3-earthquake-strikes-nepal-deaths-injuries-reported)

When news happens in locations that our audience may not know very well, a map seems like a natural thing to include as part of our coverage.

But good maps take time.*

In [ArcMap](http://www.esri.com/software/arcgis), I'll assemble the skeleton of my map with shapefiles from [Natural Earth](http://naturalearthdata.com) and other sources and find an appropriate projection. Then I'll export it to .AI format and bring it into Adobe Illustrator for styling. (In the example below, I also separately exported a raster topography layer.) And then I'll port the final thing, layer by layer, to Adobe Photoshop, applying layer effects and sharpening straight lines as necessary.

![Mapping process](/img/posts/map-arc-process.png)

_* Note: I do not claim to be a professional cartographer, and I know I still have a lot to learn._

I concede that this workflow has some definite drawbacks:

- It's cumbersome and undocumented (my own fault), and it's difficult to train others how to do it.
- It relies on an expensive piece of software that we have on a single PC. (I know there are free options out there like QGIS, but I find QGIS's editing interface difficult to use and SVG export frustrating. ArcMap is difficult to use, too, but I'm used to its quirks and the .AI export preserves layers better.)
- This reliance on ArcMap means I can't easily make maps from scratch if I'm not in the office.
- The final maps are flat images, which means that text doesn't always scale readably between desktop and mobile.
- Nothing's in version control.

So for the most recent round of [Serendipity Day](http://www.npr.org/sections/inside/2011/10/14/141312774/happy-accidents-the-joy-of-serendipity-days) at NPR (an internal hackday), I resolved to explore ways to improve the process for at least very simple locator maps -- and maybe bypass the expensive software altogether.

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/alykat">@alykat</a> LOCATORS UNTO THE LOCATOR GOD</p>&mdash; Appropriate Tributes (@godtributes) <a href="https://twitter.com/godtributes/status/599303492684095489">May 15, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Filtering And Converting Geodata

My colleague Danny DeBelius had explored a little bit of scripted mapmaking with his animated map of [ISIS-claimed territory](http://www.npr.org/sections/parallels/2014/07/23/334475601/common-ground-between-iraqs-rebels-may-be-crumbling#res334476838). And Mike Bostock has a [great tutorial](http://bost.ocks.org/mike/map/) for making maps using [ogr2ogr](http://www.gdal.org/ogr2ogr.html), [TopoJSON](https://github.com/mbostock/topojson) and D3.

Danny figured out how to use ogr2ogr to clip a shapefile to a defined bounding box. This way, we only have shapes relevant to the map we're making, keeping filesize down. 

    ogr2ogr -f GeoJSON -clipsrc 77.25 24.28 91.45 31.5 data/nepal-geo.json ../_basemaps/cultural/ne_10m_admin_0_countries_v3.1/ne_10m_admin_0_countries.shp

We applied that to a variety of shapefile layers — populated places, rivers, roads, etc. -- and then ran a separate command to compile and compress them into TopoJSON format.

    ogr2ogr -f GeoJSON -clipsrc 77.25 24.28 91.45 31.5 data/nepal-geo.json ../_basemaps/cultural/ne_10m_admin_0_countries_v3.1/ne_10m_admin_0_countries.shp

    ogr2ogr -f GeoJSON -clipsrc 77.25 24.28 91.45 31.5 data/nepal-cities.json -where "adm0name = 'Nepal' AND scalerank < 8" ../_basemaps/cultural/ne_10m_populated_places_simple_v3.0/ne_10m_populated_places_simple.shp

    ogr2ogr -f GeoJSON -clipsrc 77.25 24.28 91.45 31.5 data/nepal-neighbors.json -where "adm0name != 'Nepal' AND scalerank <= 2" ../_basemaps/cultural/ne_10m_populated_places_simple_v3.0/ne_10m_populated_places_simple.shp

    ogr2ogr -f GeoJSON -where \"featurecla = 'River' AND scalerank < 8\" -clipsrc 77.25 24.28 91.45 31.5 data/nepal-rivers.json ../_basemaps/physical/ne_10m_rivers_lake_centerlines_v3.1/ne_10m_rivers_lake_centerlines.shp

    ogr2ogr -f GeoJSON -clipsrc 77.25 24.28 91.45 31.5 data/nepal-lakes.json ../_basemaps/physical/ne_10m_lakes_v3.0/ne_10m_lakes.shp

    ogr2ogr -f GeoJSON -clipsrc 77.25 24.28 91.45 31.5 data/nepal-roads.json ../_basemaps/cultural/ne_10m_roads_v3.0/ne_10m_roads.shp

    topojson -o data/nepal-topo.json --id-property NAME -p featurecla,city=name,country=NAME -- data/nepal-geo.json data/nepal-cities.json data/nepal-neighbors.json data/nepal-rivers.json data/nepal-lakes.json data/nepal-roads.json data/nepal-quakes.csv
    
_(Why two separate calls for city data? The Natural Earth shapefile for populated places have a column called ```scalerank```, which ranks cities by importance or size. Since our example was a map of Nepal, I wanted to show a range of cities inside Nepal, but only major cities outside.)_

## Mapturner

Christopher Groskopf and Tyler Fisher extended that series of ogr2ogr and TopoJSON commands to a command-line utility: [mapturner](https://github.com/nprapps/mapturner).

Mapturner takes in a YAML configuration file, filled out with the bounding box, layers, column names and other information you want, processes the data and saves out a compressed TopoJSON file. The config file for our Nepal example looked like this:

    bbox: '77.25 24.28 91.45 31.5'
    layers:
        countries:
            type: 'shp'
            path: 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip'
            id-property: 'NAME'
            properties:
                - 'country=NAME'
        cities:
            type: 'shp'
            path: 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_populated_places_simple.zip'
            id-property: 'name'
            properties:
                - 'featurecla'
                - 'city=name'
                - 'scalerank'
            where: adm0name = 'Nepal' AND scalerank < 8
        neighbors:
            type: 'shp'
            path: 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_populated_places_simple.zip'
            id-property: 'name'
            properties:
                - 'featurecla'
                - 'city=name'
                - 'scalerank'
            where: adm0name != 'Nepal' AND scalerank <= 2
        lakes:
            type: 'shp'
            path: 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_lakes.zip'
        rivers:
            type: 'shp'
            path: 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_rivers_lake_centerlines.zip'
            where: featurecla = 'River' AND scalerank < 8
        quakes:
            type: 'csv'
            path: 'data/nepal.csv'
            properties:
                - 'date'
                - '+intensity'

Mapturner currently supports SHP, JSON and CSV files.

## Drawing The Map

tk tk tk

<div data-pym-src="http://apps.npr.org/dailygraphics/graphics/test-map-nepal-earthquake/child.html">&nbsp;</div><script src="http://apps.npr.org/dailygraphics/graphics/test-map-nepal-earthquake/js/lib/pym.js" type="text/javascript"></script>

## Locator Maps And Dailygraphics

tk tk tk

## Caveats And Next Steps

tk tk tk