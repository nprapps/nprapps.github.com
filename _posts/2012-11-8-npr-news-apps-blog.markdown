---
layout: post
title: "Hello world: Nerd blogging with Jekyll"
description: "We're a new team, and we're trying something new (at least for us) as a blog publishing platform: Jekyll, a generator that creates simple, static websites. <br><br>

We're not breaking any ground with this choice, of course, but we liked the idea of launching a blog that's open source — both its code and also its content.<br><br>

This initial post is an introduction to Jekyll for the members of our team -- and anyone else who wants to get started with the tool and/or steal our simple code for their own site."
author: Matt Stiles
---
We're a new team, and we're trying something new (at least for us) as a blog publishing platform: Jekyll, a generator that creates simple, static websites. We're [not breaking any ground](http://developmentseed.org/blog/2011/09/09/jekyll-github-pages/) with this choice, of course, but we liked the idea of launching a blog that's [open source](http://github.com/nprapps/nprapps.github.com) -- both its code and also its content. 

This initial post is an introduction to Jekyll for the members of our team -- and anyone else who wants to get started with the tool and/or steal our simple code for their own site. 

###Getting started

Jekyll eliminates the need for a traditional content management system, like WordPress. Instead, we're creating plain-old HTML pages and serving them from GitHub Pages, where we host our blog code.

To get started, install the Ruby gem with [these instructions](https://github.com/mojombo/jekyll/wiki/install). 

Next, familiarize yourself with the [usage](https://github.com/mojombo/jekyll/wiki/Usage) and [configuration](https://github.com/mojombo/jekyll/wiki/Configuration) documentation provided by Jekyll. There's more detail in there about further customizing a site, which we'll do over time (what we have now is super basic). 

As you'll see, Jekyll uses your source directory templates and converts your [Markdown](http://daringfireball.net/projects/markdown/syntax) text and [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) tags to build a static website. The website -- and any posts you create -- then get published with a <code>git push</code> to GitHub.

###Our configuration

Our templates are built from scratch on top of the [Twitter Bootstrap](http://twitter.github.com/bootstrap/) framework, giving us responsive pages that we've customized for Jekyll. Your source directory should like something this:

	.
	|-- _config.yml
	|-- _includes
	|-- _layouts
	|   |-- default.html
	|   `-- post.html
	|-- _posts
	|   |-- 2012-11-08-npr-news-apps-blog.markdown
	|-- _site
	|-- about
	|   |-- index.html
	|-- bootstrap
	`-- CNAME
	|-- css
	|-- img
	`-- index.html
	`-- README.md

This structure is explained in the [usage documentation](https://github.com/mojombo/jekyll/wiki/Usage), but here are the highlights. Never mind &#95;includes for now. The &#95;layout folder has the templates. We will inject posts into them with the <code>&#123;&#123; content &#125;&#125;</code> Liquid tag. The &#95;posts folder contains, well, posts. Notice the structure of the file names. The date and title are used for the default permalinks structure, and they also define the post date. The &#95;site folder contains the site generated when you run Jekyll.

###Adding content

Below is the Markdown of [this post](http://blog.apps.npr.org/2012/11/08/npr-news-apps-blog.html): 

<script src="https://gist.github.com/3745792.js?file=post">
</script> 

The [YAML Front Matter](http://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) at the top determines which layout file is used (in this case a post) as well as the title, description and author. You can add more information here, like categories and tags, for example, but we haven't built out those features yet. Also notice that these files use Markdown -- <code>[team](/about/)</code> creates a hyperlink to our about page, for example -- that Jekyll will churn out as HTML later.

Below is the HTML of the index.html file, which is the <code>&#123;&#123; content &#125;&#125;</code> we inject into the default.html template for displaying the home page:

<script src="https://gist.github.com/3745411.js?file=index.html">
</script>

Above [YAML Front Matter](http://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) selects the default.html template and defines the title element. We're creating a reverse chronological list of stories, with headlines, dates, author names, and descriptions (here limited to the four most recent posts).

We add headlines linking to the corresponding posts with <code>&#123;&#123; post.url &#125;&#125;</code> and <code>&#123;&#123; post.title &#125;&#125;</code> Liquid output markup. We do the same with the date, and we've defined the display format using [Liquid's filter syntax](http://liquid.rubyforge.org/classes/Liquid/StandardFilters.html#M000012). (As we add posts to the &#95;posts directory, and <code>git push</code> them, more will display on the live home page). Notice the "#disqus_thread" attached to the post URL. That gives us a comment count. 

Below is the HTML for the post.html template. Posts also get injected into the default.html template, but obviously with a deferent design. It too use Liquid output markup to get content onto the static page when Jekyll runs: 

<script src="https://gist.github.com/3757582.js?file=post.html">
</script>

###Publishing to GitHub

We've created a GitHub repo called "[nprapps.github.com](https://github.com/nprapps/nprapps.github.com)" (btw: see documentation for publishing to a custom domain [here](https://help.github.com/articles/setting-up-a-custom-domain-with-pages)). Inside that directory on your local machine, run <code>jekyll</code>. That will build the site. As you edit, the site will be automatically rebuilt, a process you'll notice in the Terminal. To see the site running locally, execute <code>jekyll --server</code>, and then point your browser to <code>localhost:4000</code>. 

When you're satisfied with your post, commit the code and use <code>git push</code> to publish. The site will be updated online soon after.

<em>Thanks to our former interns, <a href="http://twitter.com/afwong">Angela Wong</a> and <a href="http://twitter.com/KevinUhrm">Kevin Uhrmacher</a>, for designing the site.</em> 