---
layout: post
title: "Parsing complex social study data"
description: "How we crunched numbers from the World Values Survey."

author: David Eads
email: deads@npr.org
twitter: eads
---

NPR's [#15girls](https://twitter.com/search?q=%2315girls) project looks at the lives of 15 year old girls around the world. The reporting team was interested in using data from the [World Values Survey](http://www.worldvaluessurvey.org/wvs.jsp) (WVS) to help inform the reporting and produce a "[by-the-numbers](http://www.npr.org/sections/goatsandsoda/2015/10/20/448407788/where-the-girls-are-and-aren-t-15girls)" piece.

Analyzing the World Values Survey data represents a fairly typical problem in data journalism: crunching numbers from social science surveys. Social science surveys have some typical features:

* The data is in proprietary/non-standard formats like those used by Stata or SPSS.
The WVS, happily, distributes comma separated value (CSV) files as well as SPSS and Stata files.
* The data has hundreds of columns per respondent that correspond to responses to each question. The WVS has 431 columns and over 86,000 rows.
* The possible responses are coded in a separate file, known as the codebook, which match a numerical or text code with the response value. 
* Possible responses to any question range from free-form ("what is your name?", "what is your age?") to structured ("agree", "disagree", "neither").

In other words, they're kind of a pain to work with. In analyzing this data, I learned some tricks that might ease the pain.

As always, the code used in the analysis is [available on Github](https://github.com/nprapps/worldvalues).

## Parsing and analysis requirements

To crunch such numbers, we need a process that accounts for the issues inherent in importing and parsing data with these qualities. Our end goal is to get all this stuff into a Postgres database where we can analyze it. Here's what we need to do that:

* **Implicit column creation**: Typing in a schema for hundreds of columns is no fun and error-prone. We need some way to automatically create the columns.
* **Fast import**: Importing tens of thousands of rows with hundreds of columns each can get pretty slow. We need efficient import.
* **Generic analysis**: We need a way to match responses for any given question with the possible responses from the codebook, whether it is a free-form response, Likert scale, a coded value, or something else.

## Importing the World Values Survey response data

We use a three-step process to get implicit column creation *and* fast import.

[Dataset](https://dataset.readthedocs.org/en/latest/), a Python database wrapper, auto-magically creates database fields as data is added to a table. That handles the schema creation. But because of all the magic under the hood, Dataset is very inefficient at inserting large datasets. The WVS data -- with over 86,000 rows with 431 columns each -- took many hours to import.

The Postgres `COPY [table] FROM [file]` [command](http://www.postgresql.org/docs/9.4/static/sql-copy.html) is very efficient at importing data from a CSV, but notoriously finkicky about data formatting. Instead of hours, `COPY` runs in seconds, but your data needs to be *perfectly* formatted for the table you're importing into.

The good news is that the WVS provides CSV data files. If they didn't provide CSV, we'd use a tool like R to convert from Stata or SPSS to CSV. The bad news is that the WVS data files use inconsistent quoting and contain a few other oddities that causes the Postgres `COPY` routine to choke.

To get the advantages of both tools, we took a hybrid approach. It's a bit ugly, but it does the job nicely. Our import process looks like this:

<ul>
    <li>Open the dirty source CSV with Python</li>
    <li>
        Read the file line-by-line:

        <ul>
            <li>
                On the first data row:
                <ul>
                    <li>Create a single database row in the responses table with Dataset which creates all the columns in one go.</li>
                    <li>Delete the row from the responses table in the database.</li>
                 </ul>
            </li>
            <li>Write each cleaned line to a new CSV file, quoting all values.</li>
        </ul>
    </li>
    <li>Use the Postgres <code>COPY</code> command to import the data.</li>
</ul>

## Importing the World Values Survey codebook

The codebook format is fairly typical. There are columns for the question ID, details about the question, and a carriage-return separated list of possible responses. Here's a simplified view of a typical row:

<table class="table" style="font-size: 12px;">
    <thead>
        <tr>
            <th>ID</th>
            <th>Label</th>
            <th>Categories</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                V48
            </td>
            <td>
                Having a job is the best way for a woman to be an independent person.
            </td>
            <td>
                1##Agree<br/>
                2##Neither<br/>
                3##Disagree<br/>
                -5##BH,SG:Missing; DE,SE:Inapplicable; RU:Inappropriate response{Inappropriate}<br/>
                -4##Not asked<br/>
                -3##Not applicable<br/>
                -2##No answer<br/>
                -1##Don´t know<br/>
            </td>
        </tr>
        <tr>
            <td>
                V241
            </td>
            <td>
                Year of birth
            </td>
            <td>
                1900#1909#1900-1909<br/>
                1910#1919#1910-1919<br/>
                1920#1929#1920-1929<br/>
                1930#1939#1930-1939<br/>
                1940#1949#1940-1949<br/>
                1950#1959#1950-1959<br/>
                1960#1969#1960-1969<br/>
                1970#1979#1970-1979<br/>
                1980#1989#1980-1989<br/>
                1990#1999#1990-1999<br/>
                2000#2010#2000-2010<br/>
                -5##Missing; Unknown; SG: Refused{Missing}<br/>
                -4##Not asked in survey<br/>
                -3##Not applicable<br/>
                -2##No answer<br/>
                -1##Don´t know<br/>
            </td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center;"> ... </td>
        </tr>
    </tbody>
</table>

Note that the potential responses have a complex encoding scheme of their own. Carriage returns separate the responses. Within a line, `#` characters split the response into a response code, optional middle value (as seen above for the year of birth question), and verbose value. We're still not sure what the middle value is for, but we learned the hard way we have to account for it.

Our codebook parser writes to two tables. One table holds metadata about the question, the other contains the possible response values. The conceptual operation looks like this:

<ul>
    <li>For each row in the codebook:
        <ul>
            <li>Write question id, label, and description to questions table.</li>
            <li>Split the possible responses on carriage returns.</li>
            <li>For each row in possible responses:
                <ul>
                <li>Split response on <code>#</code> character to decompose into response code, middle value (which we throw out) and the real value (the verbose name of the response).</li>
                    <li>Write the code, real value, and associated question id to response table.</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

## Analyzing the data

Now we have three tables -- survey responses, codebook questions, and potential responses to each question. It's not fully normalized, but it's normalized enough to run some analysis. 

What we need to do is write some code that can dynamically generate a query that gets all the responses to a given question. Once we have that, we can summarize and analyze the numbers as needed with Python code.

The helper query dynamically generates a query against the correct column and joins the correct survey responses using subqueries:

```python
result = db.query("""
  select
    countries.value as country, c.value as response
  from
    survey_responses r
  join
    (select * from categories where question_id='{0}') c 
    on r.{0}=c.code
  join
    (select * from categories where question_id='v2a') countries
    on r.v2a=countries.code
  order by
    country
  ;
  """.format(question_id))
```

The results look like:

<table class="table" style="font-size: 12px;">
    <thead>
        <tr>
            <th>Country</th>
            <th>Response</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Brazil</td>
            <td>Agree</td>
        </tr>
        <tr>
            <td>Brazil</td>
            <td>Agree</td>
        </tr>
        <tr>
            <td>Brazil</td>
            <td>Neither</td>
        </tr>
        <tr>
            <td>Brazil</td>
            <td>Disagree</td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center;"> ... </td>
        </tr>
    </tbody>
</table>

We could have expanded on the SQL above to summarize this data further,
but using a little basic Python (or a slick analysis tool like [Agate](http://agate.readthedocs.org/en/0.11.0/)) works just as well and has some advantages. Specifically, caculating percentages for arbitrary response values in pure SQL would have led to a rather ugly query (we tried), so post-processing was going to be necessary in all events. And the relatively simple format let us use the query results for more advanced analysis, specifically to add "agree/strongly agree" and favorable Likert scale responses into a composite values for reporting purposes.

Here's a snippet from our processing code that adds up the counts for each response (`initialize_counts` is a helper function to create a dict with zeroed out values for all possible responses; you could also use Python's DefaultDict):

```python
counts = OrderedDict()
for row in result:
    if not row['country'] in counts.keys():
        counts[row['country']] = initialize_counts(question_id)

    counts[row["country"]][row["response"]] += 1
```

If you were to present the `counts` dict as a table, the processed data looks like this:

<table class="table" style="font-size: 12px;">
    <thead>
        <tr>
            <th>Country</th>
            <th>Agree</th>
            <th>Neither</th>
            <th>Disagree</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>United States</td>
            <td>1,043</td>
            <td>683</td>
            <td>482</td>
        </tr>
        <tr>
            <td colspan="4" style="text-align: center;"> ... </td>
        </tr>
    </tbody>
</table>

This simple example might have been better handled with SQL. The real code calculates percentages as well as counts, which turned out to be hard because of our less-than-ideal database structure. And the code uses the same query mechanism to come up with those composite agreement and Likert numbers. A query that returns the data partially processed turned out to be the best option for the full range of analysis we wanted to run.

## Half-way solutions for the win

None of these techniques would be considered a best practice from a data management standpoint. Each step represents a partial solution to a tough problem. Taken together, they provide a nice middle ground between needing to write a lot of code and schemas and complex queries to do things the Right Way and not being able to do anything at all. The process might be a little ugly but it's fast and repeatable. That counts for a lot in a newsroom.
