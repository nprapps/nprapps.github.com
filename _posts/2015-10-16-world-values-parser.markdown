---
layout: post
title: "Parsing complex social study data"
description: "How we crunched numbers from the World Values Survey."

author: David Eads
email: deads@npr.org
twitter: eads
---

NPR's [#15girls](https://twitter.com/search?q=%2315girls) project looks at the lives of 15 year old girls around the world. The reporting team was interested in using data from the [World Values Survey](http://www.worldvaluessurvey.org/wvs.jsp) (WVS) to help inform the reporting and produce a "by-the-numbers" piece.

Analyzing the World Values Survey data represents a fairly typical problem in data journalism: crunching numbers from social science surveys. Social science surveys have some typical features:

* The data is in proprietary/non-standard formats like those used by Stata or SPSS.
The WVS, happily, distributes comma separated value (CSV) files as well as SPSS and Stata files.
* The data has hundreds of columns per respondent that correspond to responses to each question. The WVS has 431 columns.
* The possible responses are coded in a separate file, known as the codebook.

## Parsing and analysis requirements

To crunch such numbers, we need a process that accounts for the issues inherent in importing and parsing data with these qualities. Our end goal is to get all this stuff into a Postgres database where we can analyze it. Here's what we need to do that:

* Implicit column creation: Typing in a schema for hundreds of columns is no fun and error-prone. We need some way to automatically create the columns.
* Fast import: Importing tens of thousands of rows with hundreds of columns each can get pretty slow. We need efficient import.
* Generic analysis: We need a way to match responses for a given question with the possible responses from the codebook, whether it is a free-form response, Likert scale, or coded value, or something else.

## Importing the World Values Survey response data

We use a three-step process to get implicit column creation *and* fast import.

Dataset, a Python database wrapper, auto-magically creates database fields as data is added to a table. That handles the schema creation. But Dataset is wildly inefficient at inserting over 86,000 rows with 431 columns each.

The Postgres `COPY [table] FROM [file]` syntax is very efficient at importing data from a CSV, but notoriously finkicky about data formatting. Happily, the WVS provides CSV data files. If they didn't, we'd use a tool like R to convert from Stata or SPSS to CSV. Less happily, the WVS uses inconsistent quoting, which causes the Postgres `COPY` routine to choke.

To get the advantages of both tools, we took a hybrid approach. It's a bit ugly, but it does the job with aplomb. Our import process looks like this:

* Open the dirty source CSV with Python
* Read the file line-by-line:
  * On the first data row:
    * Create a single database row with Dataset which creates all the columns in one go.
    * Delete the row from the database.
  * Write each cleaned line to a new CSV file, quoting all values.
* Use the Postgres `COPY` command to import the data.

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
            <td colspan="3" style="text-align: center;"> ... </td>
        </tr>
    </tbody>
</table>

Note that the potential responses has a complex encoding scheme. Carriage returns separate the responses. Within a line, `#` characters split the response into a response code, optional middle value (for encoding notes), and verbose value.

Our codebook parser writes to two tables. One table holds metadata about the question, the other contains the possible response values. The conceptual operation looks like this:

* For each row in codebook:
  * Write question id, label, and description to questions table.
  * Split the possible responses on carriage returns.
  * For each row in possible responses:
    * Split response on `#` character to decompose into response code, middle value (which we throw out) and the real value (the verbose name of the response).
    * Write the code, real value, and associated question id to response table.

## Analyzing the data

Now we have three tables -- survey responses, codebook questions, and potential responses to each question. It's not fully normalized, but it's normalized enough to run some analysis. 

What we need to do is write some code that can dynamically generate a query that gets all the responses to a given question. Once we have that, we can summarize and analyze the numbers as needed with Python code.

The helper query looks like this, and dynamically generates a query against the correct column and joins the correct survey responses using subqueries:

```python
result = db.query("""
    select
        countries.value as country, c.value as response
    from
        survey_responses r
    join
        (select * from categories where question_id='{0}') c on r.{0}=c.code
    join
        (select * from categories where question_id='v2a') countries on r.v2a=countries.code
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

You could try to write a mega-query with SQL to automatically summarize this data further, 
but using a little basic Python (or a slick analysis tool like Agate) works just as well.

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

## Half-way solutions for the win

None of these techniques would be considered "best practice" from a data management standpoint. Each step represents a partial solution to a tough problem. But together, they provide a nice middle ground between needing to write a lot of code and schemas and complex queries to do things the Right Way and not being able to do anything at all with the data.
