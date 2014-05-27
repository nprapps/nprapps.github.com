---
layout: post
title: "Introducing copytext.py: your words are data too"
description: "Is your writing all mixed up with your code? Copytext.py gives editorial control back to reporters and editors."
author: Christopher Groskopf
email: cgroskopf@npr.org
twitter: onyxfish
---

!["We used copytext for Planet Money Makes a T-Shirt.](/img/copytext.jpg)

Most of our work lives outside of NPR's content management system. This has many upsides, but it complicates the editing process. We can hardly expect every veteran journalist to put aside their beat in order to learn how to do their writing inside HTML, CSS, Javascript, and Python&mdash;to say nothing of version control.

That's why we made [copytext](http://copytext.readthedocs.org), a library that allows us to give editorial control back to our reporters and editors, without sacrificing our capacity to iterate quickly.

## How it works

Copytext takes a Excel ``xlsx`` file as an input and creates from it a single Python object which we can use in our templates.

Here is some example data:

<iframe width="600px" height="200px" src="https://docs.google.com/spreadsheets/d/10XiE39UYJ7aEMTlx3XVn9OoDPn4eFU4EiX6bIzgk3OA/pubhtml?widget=true&amp;headers=false"></iframe>

And here is how you would load it with copytext:

    copy = copytext.Copy('examples/test_copy.xlsx')

This object can then be treated sort of like a JSON object. Sheets are referenced by name, then rows by index and then columns by index.

    # Get a sheet by name
    sheet = copy['content']
    
    # Get a row by index
    row = sheet[1]

    # Get a cell by column index
    cell = row[1]
    
    print cell
    >> "Across-The-Top Header"
    
But there is also one magical perk: worksheets with ``key`` and ``value`` columns can be accessed like object properties.

    # Get a row by "key" value
    row = sheet['header_title']
      
    # Evaluate a row to automatically use the "value" column
    print row
    >>  "Across-The-Top Header"
    
You can also iterate over the rows for rendering lists!

    sheet = copy['example_list']
    
    for row in sheet:
        print row['term'], row['definition']
    
## Into your templates
    
These code examples might seem strange, but they make a lot more sense in the context of our page templates. For example, in a template we might once have had ``<a href="/download">Download the data!</a>`` and now we would have something like ``<a href="/download">{{ COPY.content.download }}</a>``. COPY is the global object created by copytext, "content" is the name of a worksheet inside the spreadsheet and "download" is the key that uniquely identifies a row of content.

Here is an example of how we do this with a Flask view:

    from flask import Markup, render_template
    
    import copytext
    
    @app.route('/')
    def index():
        context = {
            'COPY': copytext.Copy('examples/test_copy.xlsx', cell_wrapper_cls=Markup)
        }
    
        return render_template('index.html', context)
        
The ``cell_wrapper_cls=Markup`` ensures that any HTML you put into your spreadsheet will be rendered correctly in your Jinja template.

And in your template:
{% raw %}

    <header>
        <h1>{{ COPY.content.header_title }}</h1>
        <h2>{{ COPY.content.lorem_ipsum }}</h2>
    </header>
    
    <dl>
        {% for row in COPY.example_list %}
        <dt>{{ row.term }}</dt><dd>{{ row.definition }}</dd>
        {% endfor %}
    </dl>

{% endraw %}

## The spreadsheet is your CMS

If you combine copytext with Google Spreadsheets, you have a very powerful combination: a portable, concurrent editing interface that anyone can use. In fact, we like this so much that we bake this into every project made with our [app-template](https://github.com/nprapps/app-template). Anytime a project is rendered we fetch the latest spreadsheet from Google and place it at ``data/copy.xlsx``. That spreadsheet is loaded by copytext and placed into the context for each of our Flask views. All the text on our site is brought up-to-date. We even take this a step further and automatically render out a ``copytext.js`` that includes the entire object as JSON, for client-side templating.

The documentation for copytext has [more code examples](http://copytext.readthedocs.org/en/latest/) of how to use it, both for Flask users and for anyone else who needs a solution for having writers work in parallel with developers.

Let us know how you use it! 
