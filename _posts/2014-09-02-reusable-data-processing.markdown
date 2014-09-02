---
layout: post
title: "A reusable data processing workflow"
description: "How NPR Visuals processed data from the Law Enforcement Support Office."

author: David Eads
email: deads@npr.org
twitter: eads
---

The NPR Visuals team was recently tasked with [analysing data from the Pentagon’s program to disperse surplus military gear](http://www.npr.org/2014/09/02/2014/08/22/342494225/mraps-and-bayonets-what-we-know-about-the-pentagons-1033-program) to law enforcement agencies around the country through the Law Enforcement Support Office (LESO), also known as the "1033" program. The project offers a useful case study in creating data processing pipelines for data analysis and reporting.

The source code for the processing scripts discussed in this post is [available on Github](https://github.com/nprapps/leso/). The processed data is available in a  [folder on Google Drive](https://drive.google.com/folderview?id=0B03IIavLYTovdWg4NGtzSW9wb2c&usp=sharing).

## Automate everything

There is one rule for data processing: **Automate everything**.

Data processing is fraught with peril. Your initial transformations and data analysis will always have errors and never be as sophisticated as your final analysis. Do you want to hand-categorize a dataset, only to get updated data from your source? Do you want to laboriously add calculations to a spreadsheet, only to find out you misunderstood some crucial aspect of the data? Do you want to arrive at a conclusion and forget how you got there? 

No you don’t!  Don’t do things by hand, don’t do one-off transformations, don’t make it hard to get back to where you started.

Create processing scripts managed under version control that can be refined and repeated. Whatever extra effort it takes to set up and develop processing scripts, you will be rewarded the second or third or fiftieth time you need to run them.

It might be tempting to change the source data in some way, perhaps to add categories or calculations. If you need to add additional data or make calculations, your scripts should do that for you.

The top-level build script from our recent project shows this clearly, even if you don’t write code:

```bash
#!/bin/bash

echo 'IMPORT DATA'
echo '-----------'
./import.sh

echo 'CREATE SUMMARY FILES'
echo '--------------------'
./summarize.sh

echo 'EXPORT PROCESSED DATA'
echo '---------------------'
./export.sh
```

We separate the process into three scripts: one for importing the data, one for creating summarized versions of the data (useful for charting and analysis) and one that exports full versions of the cleaned data.

## How we processed the LESO data

The data, provided by the Defense Logistics Agency's Law Enforcement Support Office, describes every distribution of military equipment to local law enforcement agencies through the “1033” program since 2006. The data does not specify the agency receiving the equipment, only the county the agency operates in. Every row represents a single instance of a single type of equipment going to a law enforcement agency. The fields in the source data are:

* **State**
* **County**
* **National Supply Number**: a standardized categorization system for equipment
* **Quantity**
* **Units**: A description of the unit to use for the item (e.g. “each” or “square feet”)
* **Acquisition cost**: The per-unit cost of the item when purchased by the military
* **Ship date**: When the item was shipped to a law enforcement agency

## Import

[Import script source](https://github.com/nprapps/leso/blob/master/import.sh)

The process starts with a single Excel file and builds a relational database around it. The Excel file is cleaned and converted into a CSV file and imported into a PostgreSQL database. Then additional data is loaded that help categorize and contextualize the primary dataset.

Here’s the whole workflow:

* [Convert Excel data to CSV with Python](https://github.com/nprapps/leso/blob/master/clean.py).
  * Parse the date field, which represents dates in two different formats
  * Strip out extra spaces from any strings (of which there are many)
  * Split the National Supply Number into two additional fields: The first two digits represent the top level category of the equipment (e.g. “WEAPONS”). The first four digits represent the “federal supply class” (e.g. “Guns, through 30 mm”).
* [Import the CSVs generated from the source data into PostgreSQL](https://github.com/nprapps/leso/blob/master/import.sh#L7:L29).
* [Import a “FIPS crosswalk” CSV into PostgreSQL](https://github.com/nprapps/leso/blob/master/import.sh#L31:L37). This file, provided to us by an NPR reporter, lets us map county name and state to the Federal Information Processing Standard identifier used by the Census Bureau to identify counties.
* [Import a CSV file with Federal Supply Codes into PostgreSQL](https://github.com/nprapps/leso/blob/master/import.sh#L40:L54). Because there are repeated values, this data is de-depulicated after import.
* [Import county population estimates](https://github.com/nprapps/leso/blob/master/import.sh#L56:L168) from the US Census Bureau’s American Community Survey using the American FactFinder download tool. The files were added to the repository because there is no direct link or API to get the data.
  * Import 5 year county population estimates (covers all US counties)
  * Import 3 year county population estimates (covers approximately 53% of the most populous US counties)
  * Import 1 year county population (covers approximately 25% of the most populous US counties).
  * Generate a single population estimate table by overwriting 5 year estimates with 3 year estimates or 1 year estimates (if they exist).
* [Create a PostgreSQL view](https://github.com/nprapps/leso/blob/master/import.sh#L171:L179) that joins the LESO data with census data through the FIPS crosswalk table for convenience. 

We also [import a list of all agencies](https://github.com/nprapps/leso/blob/master/import.sh#L181:L193) using [csvkit](https://csvkit.readthedocs.org):

* Use csvkit’s `in2csv` command to extract each sheet
* Use csvkit’s `csvstack` command to combine the sheets and add a grouping column
* Use csvkit’s `csvcut` command to remove a pointless “row number” column
* Import final output into Postgres database

## Summarizing

[Summarize script source](https://github.com/nprapps/leso/blob/master/summarize.sh)

Once the data is loaded, we can start playing around with it by running queries. As the queries become well-defined, we add them to a script that exports CSV files summarizing the data. These files are easy to drop into Google spreadsheets or send directly to reporters using Excel.

We won’t go into the gory details of every summary query. Here’s a simple query that demonstrates the basic idea:

```bash
echo "Generate category distribution"
psql leso -c "COPY (
select c.full_name, c.code as federal_supply_class,
  sum((d.quantity * d.acquisition_cost)) as total_cost
  from data as d
  join codes as c on d.federal_supply_class = c.code
  group by c.full_name, c.code
  order by c.full_name
) to '`pwd`/build/category_distribution.csv' WITH CSV HEADER;"
```

This builds a table that calculates the total acquisition cost for each federal supply class:

<table class="table">
  <thead>
    <tr>
      <th>full_name</th>
      <th>federal_supply_code</th>
      <th>total_cost</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Trucks and Truck Tractors, Wheeled</td>
      <td>2320</td>
      <td>$405,592,549.59</td>
    </tr>
    <tr>
      <td>Aircraft, Rotary Wing</td>
      <td>1520</td>
      <td>$281,736,199.00</td>
    </tr>
    <tr>
      <td>Combat, Assault, and Tactical Vehicles, Wheeled</td>
      <td>2355</td>
      <td>$244,017,665.00</td>
    </tr>
    <tr>
      <td>Night Vision Equipment, Emitted and Reflected Radiation</td>
      <td>5855</td>
      <td>$124,204,563.34</td>
    </tr>
    <tr>
      <td>Aircraft, Fixed Wing</td>
      <td>1510</td>
      <td>$58,689,263.00</td>
    </tr>
    <tr>
      <td>Guns, through 30 mm</td>
      <td>1005</td>
      <td>$34,445,427.45</td>
    </tr>
    <tr>
      <td colspan="3">...</td>
    </tr>
  </tbody>
</table>

Notice how we use SQL joins to pull in additional data (specifically, the full name field) and aggregate functions to handle calculations. By using a little SQL, we can avoid manipulating the underlying data.

The usefulness of our approach was evident early on in our analysis. At first, we calculated the total cost as `sum(acquisition_cost)`, not accounting for the quantity of items. Because we have a processing script managed with version control, it was easy to catch the problem, fix it and regenerate the tables.

## Exporting

[Export script source](https://github.com/nprapps/leso/blob/master/import.sh)

Not everybody uses PostgreSQL (or wants to). So our final step is to export cleaned and processed data for public consumption. This big old query merges useful categorical information, county FIPS codes, and pre-calculates the total cost for each equipment order:

```bash
psql leso -c "COPY (
  select d.state,
    d.county,
    f.fips,
    d.nsn,
    d.item_name,
    d.quantity,
    d.ui,
    d.acquisition_cost,
    d.quantity * d.acquisition_cost as total_cost,
    d.ship_date,
    d.federal_supply_category,
    sc.name as federal_supply_category_name,
    d.federal_supply_class,
    c.full_name as federal_supply_class_name
  from data as d
  join fips as f on d.state = f.state and d.county = f.county
  join codes as c on d.federal_supply_class = c.code
  join codes as sc on d.federal_supply_category = sc.code
) to '`pwd`/export/states/all_states.csv' WITH CSV HEADER;"
```

Because we’ve cleanly imported the data, we can re-run this export whenever we need. If we want to revisit the story with a year’s worth of additional data next summer, it won’t be a problem.

## A few additional tips and tricks

**Make your scripts chatty:** Always print to the console at each step of import and processing scripts (e.g. `echo "Merging with census data"`). This makes it easy to track down problems as they crop up and get a sense of which parts of the script are running slowly.

**Use mappings to combine datasets:** As demonstrated above, we make extensive use of files that map fields in one table to fields in another. We use [SQL joins](http://blog.codinghorror.com/a-visual-explanation-of-sql-joins/) to combine the datasets. These features can be hard to understand at first. But once you get the hang of it, they are easy to implement and keep your data clean and simple.

**Work on a subset of the data:** When dealing with huge datasets that could take many hours to process, use a representative sample of the data to test your data processing workflow. For example, use 6 months of data from a multi-year dataset, or pick random samples from the data in a way that ensures the sample data adequately represents the whole. 
