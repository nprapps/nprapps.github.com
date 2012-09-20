---
layout: post
title: "Welcome To Our 'Nerd Blog'"
description: "Today the NPR news applications team is launching a “nerd blog,” a space for us to share and discuss our work, a la our friends at ProPublica et al. This post explains how to use Jekyll to publish a blog."
author: Matt Stiles
---
Today the NPR news applications [team](/about/) is launching a “nerd blog,” a space for us to share and discuss our work, much like our friends at [ProPublica](http://www.propublica.org/nerds/) and elsewhere.

We're a new team, and we're trying something new (at least for us) as a blog publishing platform: Jekyll, a generator that creates simple, static websites. We're [not breaking any ground](http://developmentseed.org/blog/2011/09/09/jekyll-github-pages/) with this choice, of course, but we liked the idea of launching a blog that's completely open source -- both its code and its content. 

This initial post is an introduction to Jekyll for the members of our team -- and anyone else who wants to get started with the tool and/or steal our simple code for their own site. 

###Getting Started

By using this tool, we're eliminating the need for a traditional content management system. Instead, we'll be creating old-school HTML pages and serving them from GitHub Pages, where we host our blog code.

To get started, install the Ruby gem with [these instructions](https://github.com/mojombo/jekyll/wiki/install). 

Next, familiarize yourself with the [usage](https://github.com/mojombo/jekyll/wiki/Usage) and [configuration](https://github.com/mojombo/jekyll/wiki/Configuration) documentation provided by Jekyll. There's more detail in there about further customizing a site, which we'll do over time (what we have now super basic). 

As you'll see, Jekyll uses your source directory templates and converts your [Markdown](http://daringfireball.net/projects/markdown/syntax) text and [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) tags, building out a static website. The website -- and any posts you create -- then get published with a <code>git push</code> to GitHub.

###Our Configuration

Our templates are built on top of the [Twitter Bootstrap](http://twitter.github.com/bootstrap/) framework, giving us responsive pages that we've customized for Jekyl. Your source directory should like this:

	.
	|-- _config.yml
	|-- _includes
	|-- _layouts
	|   |-- default.html
	|   `-- post.html
	|-- _posts
	|   |-- 2012-09-17-npr-news-apps-blog.markdown
	|-- _site
	|-- about
	|-- bootstrap
	`-- CNAME
	|-- css
	|-- img
	`-- index.html
	`-- README.md

This structure is explained in the [usage documentation](https://github.com/mojombo/jekyll/wiki/Usage), but here are the highlights. Never mind &#95;includes for now. The &#95;layout folder has the templates. We will inject posts into them with the <code>&#123;&#123; content &#125;&#125;</code> Liquid tag. The &#95;posts folder contains, well, posts. Notice the structure of the file names. The date and title are used for the default permalinks structure, and they also define the post date. The &#95;site folder contains the site generated when you run Jekyll.

###Adding content

Below is the markdown of [this post](http://blog.apps.npr.org/2012/09/17/npr-news-apps-blog.html): 

<script src="https://gist.github.com/3745792.js?file=post">
</script> 

The [YAML Front Matter](http://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) determines which layout file is used (in this case a post) as well as the title, description and author. You can add more information here, like categories and tags, for example, but we haven't built out those pages yet. Also notice that these files use markdown -- <code>[team](/about/)</code> creates a hyperlink to our about page, for example -- that Jekyll will churn out as HTML later.

Below is the markdown of the index.html file, which serves as the <code>&#123;&#123; content &#125;&#125;</code> we inject into the default.html template for displaying the home page:

<script src="https://gist.github.com/3745411.js?file=index.html">
</script>

Above [YAML Front Matter](http://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) selects the default.html template and defines the title element. We're creating a reverse chronological list of stories, with headlines, dates, author names, and descriptions (here limited to the four most recent posts).

We add headlines linking to the corresponding posts with <code>&#123;&#123; post.url &#125;&#125;</code> and <code>&#123;&#123; post.title &#125;&#125;</code> Liquid output markup. We do the same with the date, and we've defined the display format using [Liquid's filter syntax](http://liquid.rubyforge.org/classes/Liquid/StandardFilters.html#M000012). (As we add posts to the &#95;posts directory, and <code>git push</code> them, more will display on the live home page).

###Publishing

We've created a GitHub repo called "[nprapps.github.com](https://github.com/nprapps/nprapps.github.com)". Inside that directory on your local machine, run <code>jekyll</code>. That will build the side. As you edit, the site will be automatically rebuilt, a process you'll notice in the Terminal. To see the site running locally, execute <code>jekyll --server</code>, and the point your browsers to <code>localhost:4000</code>. 

When you're satisfied with your post, commit the code and run <code>git push</code>. 
