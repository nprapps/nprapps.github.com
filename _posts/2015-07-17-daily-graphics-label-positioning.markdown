---
layout: post
title: "What's new in our first release version of the dailygraphics rig?"
description: We've fixed a "release" version of the dailygraphics rig for the first time. Learn about the new `block_histogram` template, improvements we've made to label positioning and more.
author: Christopher Groskopf
email: cgroskopf@npr.org
twitter: onyxfish
---
Our dailygraphics rig has been around for more than a year and in that time we've used it to make hundreds of responsive rectangles of good internet, but we've never made it easy for others to use. The rig is heavily customized for our needs and includes our organization-specific styles and templates. Despite this, a handful of hardy news organizations have made efforts to adopt it. In order to better facilitate this, today we are releasing our first fixed "version" of the rig: `0.1.0`.

This isn't a traditional release. The rapid pace of development and the pace of our news cycle makes it impossible for us to manage normal open source releases. Instead, we will tag selected commits with version numbers, and maintain a detailed [CHANGELOG](https://github.com/nprapps/dailygraphics/blob/master/CHANGELOG) of everything that happens between those commits. This way users who want to use and stay up to date with the rig will have a clear path to do so.

As part of this release we've folded in a number of changes that make dailygraphics better than ever.

## Block histogram

<div id="responsive-embed-blog-block-histogram-20150717">
</div>
<script src="http://apps.npr.org/dailygraphics/graphics/blog-block-histogram-20150717/js/lib/pym.js" type="text/javascript"></script>
<script type="text/javascript">
    var pymParent = new pym.Parent(
        'responsive-embed-blog-block-histogram-20150717',
        'http://apps.npr.org/dailygraphics/graphics/blog-block-histogram-20150717/child.html',
        {}
    );
</script>

This block histogram is a format we've used several times to display discrete "binned" data. It works especially well for states or countries. [Aly](https://twitter.com/alykat) has turned it into a new [graphic template](https://github.com/nprapps/dailygraphics/tree/master/graphic_templates/block_histogram) so we can spin them up quickly. Run `fab add_block_histogram` to make one now!

## Negative numbers and smart label positioning

<div id="responsive-embed-blog-column-chart-20150717">
</div>
<script type="text/javascript">
    var pymParent = new pym.Parent(
        'responsive-embed-blog-column-chart-20150717',
        'http://apps.npr.org/dailygraphics/graphics/blog-column-chart-20150717/child.html',
        {}
    );
</script>

The ``bar_chart``, ``column_chart``, ``grouped_bar_chart``, ``stacked_bar_chart`` and ``stacked_column_chart`` graphic templates have all been updated to gracefully support negative numbers.

<div id="responsive-embed-blog-stacked-bar-chart-20150717">
</div>
<script type="text/javascript">
    var pymParent = new pym.Parent(
        'responsive-embed-blog-stacked-bar-chart-20150717',
        'http://apps.npr.org/dailygraphics/graphics/blog-stacked-bar-chart-20150717/child.html',
        {}
    );
</script>

These five templates are also now much smarter about positioning labels so they always fit within the confines of the chart or hiding them if there is no way to make them fit in the available space.

(Curious how we did this? Here is the [relevant code for bar charts](https://github.com/nprapps/dailygraphics/blob/master/graphic_templates/bar_chart/js/graphic.js#L271-L296). And here it is [for column charts](https://github.com/nprapps/dailygraphics/blob/master/graphic_templates/column_chart/js/graphic.js#L262-L287).)

## Custom Jinja filters

Lastly, we've added support for defining custom Jinja filter functions in ``graphic_config.py``. This allows for, among other things, much more complex formatting of numbers in Jinja templates. For example, to print comma-formatted numbers you can add this filter function:

```python
def comma_format(value):
    return locale.format('%d', float(value), grouping=True)

JINJA_FILTER_FUNCTIONS = [
    comma_format
]
```

And then use it in your template, like this:

{% raw %}
<td>{{ row.value|comma_format }}</td>
{% endraw %}

Documention for this feature has been [added to the README](https://github.com/nprapps/dailygraphics#using-custom-jinja-filter-functions).

Please see the [CHANGELOG](https://github.com/nprapps/dailygraphics/blob/master/CHANGELOG) for a more complete list of changes we've made. We hope this new release process allows more news organizations to experience the joy of using a code-driven process for making daily charts and graphics.
