---
layout: post
title: "Store Your Text AND Your Data In A Spreadsheet"
description: "How to "

author: Alyson Hurt
email: ahurt@npr.org
twitter: alykat
---

Do you use our [dailygraphics](http://blog.apps.npr.org/2014/05/27/dailygraphics.html) rig to create and deploy small charts? The latest version of [copytext.py](http://blog.apps.npr.org/2014/04/21/introducing-copytext-py.html) allows users to inject serialized JSON from a Google Spreadsheet onto their page with one line of template code.

{% raw %}
    <script type="text/javascript">
        var GRAPHIC_DATA = {{ COPY.data_line.json() }};
    </script>
{% endraw %}

#### Benefits:

* Store your text and your data in one Google Spreadsheet, making editing a little simpler.
* The data is baked right into your page, so there's one fewer file to load.

If you're already using dailygraphics, pull the latest code from GitHub (we've updated libraries and made other bugfixes in recent weeks), and update requirements:

    pip install -Ur requirements.txt

Here are a couple examples, using [this datafile](https://docs.google.com/spreadsheets/d/18HIRf1ZSWbK1od50DiwBbsiBlrp63DuEt4nIImWU5zA/edit?usp=sharing):

<iframe src="https://docs.google.com/spreadsheets/d/18HIRf1ZSWbK1od50DiwBbsiBlrp63DuEt4nIImWU5zA/pubhtml?widget=true&amp;headers=false" style="width: 100%; height: 300px;"></iframe>

----------

### Line Chart



----------

### Bar Chart

<div id="responsive-embed-test-json-object-bar"></div>
<script src="http://apps.npr.org/dailygraphics/graphics/test-json-object-bar/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParentBar = new pym.Parent(
        'responsive-embed-test-json-object-bar',
        'http://apps.npr.org/dailygraphics/graphics/test-json-object-bar/child.html',
        {}
    );
</script>




----------

#### Related Posts

* [Creating And Deploying Small-Scale Projects](http://blog.apps.npr.org/2014/05/27/dailygraphics.html)
* [Responsive Charts With D3 And Pym.js](http://blog.apps.npr.org/2014/05/19/responsive-charts.html)
* [Making Data Tables Responsive](http://blog.apps.npr.org/2014/05/09/responsive-data-tables.html)
* [Introducing copytext.py: your words are data too](http://blog.apps.npr.org/2014/04/21/introducing-copytext-py.html)
* [Introducing Pym.js](https://source.opennews.org/en-US/articles/introducing-pym/)