---
layout: post
title: "How we approached data cleaning for Our Listeners' Favorite Albums of 2017"
description: Using Makefiles to make reproducible data pipelines

author: Juan Elosua and Brittany Mayes
email: nprapps@npr.org
twitter: nprviz
---

![Header of All Songs Considered article](/img/posts/2017-12-20-all-songs-considered-poll/header.png)<small>All Songs Considered asks listeners for their favorite albums of 2017</small>

As 2017 was aproaching to an end All Songs Considered continued a long living tradition and [asked listeners for their favorite albums of 2017](https://www.npr.org/sections/allsongs/2017/12/04/567424678/vote-for-your-favorite-albums-of-2017). Users could enter up to five different albums and artist pairs in a Google Form, ranked according to their preferences. The poll was open for eight days and resulted in more than 4,800 entries.

In the end, the All Songs Considered team wanted a ranked list of the best albums. We have already dived into this task in 2016, [you can check the process in this old post](http://blog.apps.npr.org/2016/12/16/all-songs-considered-poll.html). After reviewing code snippets from last year we decided to take a new approach this year and in this post we will explain the decissions made and why we think it is an improvement and will allow us to move forward more quickly come these dates in following years.

Our main goals this year were:

1. Form improvements to start with a cleaner dataset.
2. We wanted to use a more programatic approach to the clustering of similar entries for artist/album pairs.
3. Feeling inspired by this awesome explanations of the use of Makefiles for data processing by [Datamade](https://github.com/datamade/data-making-guidelines) we wanted to use that approach to streamline our data processing pipeline.
4. Reuse ranking strategy from previous year.

Let's dive into each of those goals and how we tackled them.

## Form improvements

Our first question was, is there a way to improve the google form used to ask our audience to have cleaner initial results? In previous years we had ask our audience to add a comma separated artist and album pair, but that rule was not always followed (surprise!! welcome to the world of free text fields).

This year we decided to split album and artist on the form into separated textfields grouped by a common heading.

![2017 Form](/img/posts/2017-12-20-all-songs-considered-poll/form.png)<small>2017 form</small>

Looking back to that decission it was really useful to have a better starting point for our clean up process.

## Clustering similar artist/album entries

Members of our team had already tried out [dedupe](https://github.com/dedupeio/dedupe) in other projects and we thought this data cleaning task was well suited for. Basically we want to identify and group together similar entries of artist/album pairs in order to be able to correctly rank them later.

We finally used [csvdedupe](https://github.com/dedupeio/csvdedupe), A command line tool for deduplicating csv files (takes a messy input file or STDIN pipe and identifies duplicates).

Installation is as easy as using pip

```
pip install csvdedupe
```

### Preparing data for csvdedupe

In order to use `csvdedupe` effectively we first needed to change the format of the input data so that every artist/pair was in a different row, that way `csvdedupe` could work across all of the album/artist entries and group them.

![Input data normalized](/img/posts/2017-12-20-all-songs-considered-poll/normalized.png)<small>One artist/album pair per row</small>

As you can see in that image we have assigned points to each album/artist pair depending on the position on the google form. We wanted a point schema that would rank two votes for an artist/album pair always higher than a single vote no matter in which position it was added by a given user.

So in order to comply with the above rule we have assigned the following point schema:

* 15 points to album/artist #1
* 14 points to album/artist #2
* 13 points to album/artist #3
* 12 points to album/artist #4
* 11 points to album/artist #5

### Training csvdedupe

Dedupe uses a supervised machine learning algorithm to detect what we want to identify as similar and what not. The first step in using it is training the machine learning algorithm to understand what is similar in our given realm and what not. `Dedupe` suggests that at least we provide 10 positive results (similar entries) and 10 negative results (non-similar entries) for it to find an algorightm that can give us accurate results.

![Dedupe training](/img/posts/2017-12-20-all-songs-considered-poll/training.png)<small>Training dedupe on the terminal</small>

### Verifying csvdedupe results

Dedupe was a huge improvement in terms of easing up our detection of similar entries but we wanted somekind of manual verification step where we could fine tune entries that were either bundled together incorrectly or not bundled together when they should have been.

For this we have used OpenRefine. With its visual facet capabilities it allows you to quickly identify the most prominent clusters and review them searching for incongruencies.

![Verification with OpenRefine](/img/posts/2017-12-20-all-songs-considered-poll/verification.png)<small>Using facets on OpenRefine to verify dedupe results</small>

## Using Makefiles for our data processing pipeline

As Mike Bostock, the creator of [D3.js](https://d3js.org/) states in [this article](https://bost.ocks.org/mike/make/) - "Makefiles are machine-readable documentation that make your workflow reproducible".

It takes a while to adapt yourself to the syntax of a makefile but once you start to get familiar with it you start to move more quickly and at the end you will have a reproducible data pipeline. Your teammates or your future self will be really happy that you have spent the time to document the process into a Makefile when they will need to reproduce the workflow in a tight deadline.

### Basic Syntax

A makefile is a set of rules with the following format:

```
targetfile: sourcefile(s)
    command(s)
```

* targetfile is the file you want to generate,
* sourcefile(s) are the file(s) it depends on
* command(s) is what you need to run on the terminal to generate the target file.

You can then chain these rules making the next rule sourcefile the targetfile of a previous rule and that way you generate a pipeline of steps.

### Let's see an example from our own makefile

```shell
INPUT_DATA_DIR = data
INPUT_FILE = 2017_responses.csv
OUTPUT_DATA_DIR = output
...

# clean and dedupe rules
clean_dedupe: $(OUTPUT_DATA_DIR)/2017_responses_deduped.csv

$(OUTPUT_DATA_DIR)/2017_responses_deduped.csv: $(OUTPUT_DATA_DIR)/2017_responses_normalized.csv
    ./scripts/dedupe.sh $< > $@

$(OUTPUT_DATA_DIR)/2017_responses_normalized.csv: $(INPUT_DATA_DIR)/$(INPUT_FILE) $(OUTPUT_DATA_DIR)
    cat $< | ./scripts/clean_ballot_stuffing.py | ./scripts/transform_form_responses.py > $@
...

# Aux rules
$(OUTPUT_DATA_DIR):
    mkdir -p $(OUTPUT_DATA_DIR)
...
```

At first looking at that can be overwhelming but let us walk you through what it actually does and, trust me, in no time you'll fall in love with the approach.

### Defining variables

You can define variables in your Makefiles for example `OUTPUT_DATA_DIR` in the example above and you can then refer to them on your rules in this way `$(OUTPUT_DATA_DIR)`

### Automatic variables

GNU make comes with some automatic variables that you can use in your recipe to refer to speficic targets or sourcefiles

* `$@` - the filename of the target
* `$^` - the filenames of all dependencies
* `$?` - the filenames of all dependencies that are newer than the target
* `$<` - the filenames of the first dependency

In our example we are using `$<` normally as the input to a given command and `$@` as the output of the command.

### Using Makefile chain syntax

We will run the following command to execute our cleaning and dedupe pipeline `make clean_dedupe`

You can see that is one of our `targetfiles` in the Makefile, but it has a dependency on a file in the filesystem, if that file does not exist or it needs to be regenerated since something higher up on the chain has changed then `make` will search for other rules to generate that dependency file.

`Make` will find another rule whose targetfile is precisely that filename in the previous rule and will in turn search for any dependency it needs to comply with in order to be able to generate it.

Do you start to see the chain behavior?

### Translating the Makefile to plain text

The example makefile shown above could be translated to the following initial execution:

1. `cat data/2017_responses.csv | ./scripts/clean_ballot_stuffing.py | ./scripts/transform_form_responses.py > output/2017_responses_normalized.csv`
    * Start with the raw form responses
    * Use a python script to remove duplicate entries in a given time window
    * Then use another python script to transform the responses into one artist/album pair per row and assign points to each entry accordingly.

2. `./scripts/dedupe.sh output/2017_responses_normalized.csv > output/2017_responses_deduped.csv`

    * Train `csvdedupe` and then apply the machine learned algorithm to cluster similar entries together.
    * Dump the output to a csv file named `output/2017_responses_deduped.csv`

![Dedupe output](/img/posts/2017-12-20-all-songs-considered-poll/dedupe-output.png)<small>Dedupe output with Cluster IDs</small>

### Suggestions when using Makefiles

In order to take full advantage of the makefile approach here are some suggestions:

* Always try to use `stdin` and `stdout` as input and output for your scripts so that you can pipe scripts together.
* Think backwards: Start with the final output rule and then start to write the rules that will need to generate its dependencies.
* Use automatic variables to avoid hardcoding filenames on your commands.

## Reuse 2016 ranking strategy

Even though our approach to data cleaning was quite different from 2016, once the data was cleaned and in order to provide consistency with previous years we wanted to reuse the same ranking strategy to determine the top100 list.

Lisa liked to work on `R` and we like to work on `python` so we reimplemented her strategy mainly using the [pandas](https://pandas.pydata.org/) library.

## Code

Do you want to take a look at the full `Makefile` or look at the process we used to rank the entries in order to arrive to the Top 100? [Take a look at our repo](https://github.com/nprapps/allsongsconsidered-poll/)

The final ranking is [published on All Songs Considered](https://www.npr.org/sections/allsongs/2017/12/18/570799909/poll-results-all-songs-considered-listeners-100-favorite-albums-of-2017).
