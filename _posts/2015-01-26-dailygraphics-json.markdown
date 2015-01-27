---
layout: post
title: "Bake Your Chart Data Into Your Page"
description: "A new dailygraphics feature lets users embed JSON data from a Google Spreadsheet."
author: Alyson Hurt
email: ahurt@npr.org
twitter: alykat
---

Do you use our [dailygraphics](http://blog.apps.npr.org/2014/05/27/dailygraphics.html) rig to create and deploy small charts? We've introduced a new feature: The latest version of [copytext.py](https://github.com/nprapps/copytext) (0.1.7) allows users to inject serialized JSON from a Google Spreadsheet onto their page with one line of template code.

#### Benefits:

* Store your text _and_ your data in the same Google Spreadsheet, making editing a little simpler.
* The data is baked right into your page, so there's one fewer file to load.

(Thanks to Christopher Groskopf and Danny DeBelius for making this work.)

If you're already using dailygraphics, pull the latest code from GitHub (we've updated libraries and made other bugfixes in recent weeks), and update requirements:

    pip install -Ur requirements.txt

----------

## Examples

The following examples assume that you are using our [dailygraphics](http://blog.apps.npr.org/2014/05/27/dailygraphics.html) rig. Both examples point to [this Google Spreadsheet](https://docs.google.com/spreadsheets/d/18HIRf1ZSWbK1od50DiwBbsiBlrp63DuEt4nIImWU5zA/edit?usp=sharing).

<iframe src="https://docs.google.com/spreadsheets/d/18HIRf1ZSWbK1od50DiwBbsiBlrp63DuEt4nIImWU5zA/pubhtml?widget=true&amp;headers=false" style="width: 100%; height: 300px;"></iframe>

The spreadsheet has three tabs:

* ```labels```: Text information (headline, credits, etc.)
* ```data_bar```: The data for the bar chart example below
* ```data_line```: The data for the line chart example below

_Note: Copytext works best when all values (even numeric ones) are cast as text/strings in the Google Spreadsheet, rather than numbers or dates. You can convert them to their proper types later in JavaScript._

----------

### Bar Chart ([Source code on GitHub](https://github.com/nprapps/nprapps.github.com/tree/master/examples/test-json-object-bar/))

<div id="responsive-embed-test-json-object-bar"></div>
<script src="http://apps.npr.org/dailygraphics/graphics/test-json-object-bar/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParentBar = new pym.Parent(
        'responsive-embed-test-json-object-bar',
        'http://apps.npr.org/dailygraphics/graphics/test-json-object-bar/child.html',
        {}
    );
</script>

In ```child_template.html```, add a ```<script></script>``` tag above all the other JavaScript embeds [at the bottom of the page](https://github.com/nprapps/nprapps.github.com/blob/master/examples/test-json-object-bar/child_template.html#L154-L156), and then declare the variable for your data.

{% raw %}
    <script type="text/javascript">
        var GRAPHIC_DATA = {{ COPY.data_bar.json() }};
    </script>
{% endraw %}

* ```GRAPHIC_DATA``` is the variable name you'll use to reference this data
* ```COPY``` refers to the overall spreadsheet
* ```data_bar``` is the name of the specific sheet within the spreadsheet (in this case, the spreadsheet has three sheets)

The result looks like this, with the keys corresponding to the column headers in the table:

{% raw %}
    <script type="text/javascript">
        var GRAPHIC_DATA = [{"label": "Alabama", "amt": "2", "null": null}, {"label": "Alaska", "amt": "4", "null": null}, {"label": "Arizona", "amt": "6", "null": null}, {"label": "Arkansas", "amt": "8", "null": null}, {"label": "California", "amt": "10", "null": null}, {"label": "Colorado", "amt": "12", "null": null}, {"label": "Connecticut", "amt": "14", "null": null}];
    </script>
{% endraw %}

In ```js/graphic.js```, don't bother with declaring or importing ```GRAPHIC_DATA``` — just go straight to whatever additional processing you need to do (like, in this case, [explicitly casting the numeric values as numbers](https://github.com/nprapps/nprapps.github.com/blob/master/examples/test-json-object-bar/js/graphic.js#L29-L46)).

{% raw %}
    GRAPHIC_DATA.forEach(function(d) {
        d['amt'] = +d['amt'];
    });
{% endraw %}

----------

### Line Chart ([Source code on GitHub](https://github.com/nprapps/nprapps.github.com/tree/master/examples/test-json-object-line/))

<div id="responsive-embed-test-json-object-line"></div>
<script src="http://apps.npr.org/dailygraphics/graphics/test-json-object-line/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParentLine = new pym.Parent(
        'responsive-embed-test-json-object-line',
        'http://apps.npr.org/dailygraphics/graphics/test-json-object-line/child.html',
        {}
    );
</script>

In ```child_template.html```, add a ```<script></script>``` tag above all the other JavaScript embeds [at the bottom of the page](https://github.com/nprapps/nprapps.github.com/blob/master/examples/test-json-object-line/child_template.html#L136-L138), and then declare the variable for your data.

{% raw %}
    <script type="text/javascript">
        var GRAPHIC_DATA = {{ COPY.data_line.json() }};
    </script>
{% endraw %}

* ```GRAPHIC_DATA``` is the variable name you'll use to reference this data
* ```COPY``` refers to the overall spreadsheet
* ```data_line``` is the name of the specific sheet within the spreadsheet (in this case, the spreadsheet has three sheets)

The result looks like this, with the keys corresponding to the column headers in the table:

{% raw %}
    <script type="text/javascript">
        var GRAPHIC_DATA = [{"date": "1/1/1989", "One": "1.84", "Two": "3.86", "Three": "5.80", "Four": "2.76"}, {"date": "4/1/1989", "One": "1.85", "Two": "3.89", "Three": "5.83", "Four": "2.78"}, {"date": "7/1/1989", "One": "1.87", "Two": "3.93", "Three": "5.89", "Four": "2.81"}, {"date": "10/1/1989", "One": "1.88", "Two": "3.95", "Three": "5.92", "Four": "2.82"} ... [and so on] ...;
    </script>
{% endraw %}

In ```js/graphic.js```, don't bother with declaring or importing ```GRAPHIC_DATA``` — just go straight to whatever additional processing you need to do (like, in this case, [explicitly casting the dates as dates](https://github.com/nprapps/nprapps.github.com/blob/master/examples/test-json-object-line/js/graphic.js#L31-L33)).

{% raw %}
    GRAPHIC_DATA.forEach(function(d) {
        d['date'] = d3.time.format('%m/%d/%Y').parse(d['date']);
    });
{% endraw %}

----------

#### Related Posts

* [Creating And Deploying Small-Scale Projects](http://blog.apps.npr.org/2014/05/27/dailygraphics.html)
* [Responsive Charts With D3 And Pym.js](http://blog.apps.npr.org/2014/05/19/responsive-charts.html)
* [Making Data Tables Responsive](http://blog.apps.npr.org/2014/05/09/responsive-data-tables.html)
* [Introducing copytext.py: your words are data too](http://blog.apps.npr.org/2014/04/21/introducing-copytext-py.html)
* [Introducing Pym.js](https://source.opennews.org/en-US/articles/introducing-pym/)