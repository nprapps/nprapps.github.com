---
layout: post
title: "Useful Scraping Techniques"
description: "How to scrape thousands of URLs in minutes."

author: David Eads
email: deads@npr.org
twitter: eads
---

A recent NPR project that collects structured data about [gun sale listings from Armslist.com](http://www.npr.org/sections/alltechconsidered/2016/06/17/482483537/semiautomatic-weapons-without-a-background-check-can-be-just-a-click-away) demonstrates several of my favorite tricks for writing simple, fast scrapers with Python.

The code for the Armslist scraper is [available on Github](https://github.com/nprapps/armslist-scraper).

## Can you scrape?

Scraping is a complicated legal issue. Before you start scraping, make sure your scraping is acceptable. At minimum, check the terms of service and robots.txt of the site you'd like to scrape. And if you can talk with a lawyer, you should.

## Data model classes

The Armslist scraper encapsulates scraped data in model classes.

Here's the basic idea. You provide the model class with all the HTML it should scrape. The class performs the scrape and stores each piece of data in an instance property. Then, you access the scraped attributes in your code via those instance properties. Look at this lightly modified example of the model class code from the Armslist scraper. 

```python
class Listing:
   """Encapsulates a single gun sale listing."""

    def __init__(self, html):
        self._html = html
        self._soup = BeautifulSoup(self._html, 'html.parser')

    @property
    def title(self):
        """Return listing title."""
        return self._soup.find('h1').string.strip()
```

To use this class, instantiate it with an HTML string as the first argument, then start accessing properties:

```python
html = '<html><body><h1>The title</h1></body></html>'
mylisting = Listing(html)
mylisting.title
```

Every listing instance takes an HTML string which can be downloaded during a scrape or provided from another source (e.g. from a file in an automated test). The `Listing` class uses the `@property` decorator to create methods that “look like” instance properties but perform some computation before returning a value.

This makes it easy to test and understand each computed value. Want to double check that we’re grabbing the price correctly? This method is sane enough that you don’t have to know a lot about the other parts of the system to understand how it works:

```python
class Listing:
    #...
    @property
    def price(self):
        span_contents = self._soup.find('span', {'class': 'price'})
        price_string = span_contents.string.strip()
        if price_string.startswith('$'):
            junk, price = span_contents.string.strip().split('$ ')
            return price
        else:
            return price_string
```

The model class is then used in a simple script which makes the actual HTTP request based on a URL provided as an argument and prints a single CSV line. Here’s a lightly modified version of the controller script:

```python
#!/usr/bin/env python

import sys
import requests
import unicodecsv as csv

from models.listing import Listing

def scrape_listing(url):
    writer = csv.writer(sys.stdout)
    response = requests.get(url)
    listing = Listing(response.content)
    writer.writerow([
        url,
        listing.post_id,
        listing.title,
        listing.listed_date,
        # ...
    ])


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('url required')
        sys.exit()

    url = str(sys.argv[1])
    scrape_listing(url=url)
```

This script is very easy to interact with to see if the scraper is working properly. Just invoke the script on the command line with the URL to be scraped.

## Parallelization with GNU parallel

The framework above almost seems too simple. And indeed, scraping the 80,000+ pages with listings on Armslist one-by-one would be far too slow.

Enter [GNU parallel](http://www.gnu.org/software/parallel/), a wonderful tool for parallelization.

Parallelization means running multiple processes concurrently instead of one-by-one. This is particularly useful for scraping because so much time is spent simply initiating the network request and downloading data. A few seconds of network overhead per request really starts to add up when you have thousands of URLs to scrape. 

Modern processors have multiple cores, which hypothetically makes this easy. But it’s still a tricky problem in common scripting languages like Python. The programming interfaces are clunky, managing input and output is mysterious, and weird problems like leaving thousands of file handles open can crop up.

Most importantly, it’s easy to lose hardware abstraction, one of the most powerful parts of modern scripting languages when using parallelization libraries. Including a bunch of multiprocessing library magic in a Python scraper makes it much harder for anyone with basic programming skills to be able to read and understand the code. In an ideal world, a Python script shouldn’t need to worry about how many CPU cores are available. 
 
This is why GNU parallel is such a useful tool. Parallel elegantly handles parallelizing just about any command that can be run on the command line. Here’s a simple example from the Armslist scraper: 

```bash
csvcut -c 1 cache/index.csv | parallel ./scrape_listing.py {} > cache/listings.csv
```

The csvcut command grabs the first column from a CSV with URLs and some metadata about each one. The `scrape_listing.py` command takes a URL as an argument and outputs one processed, comma separated line of extracted data. By passing the output of `csvcut` to a `parallel` command which calls `scrape_listing.py`, the scraper is automatically run simultaneously on all the system's processors. 

Parallel is smart about output -- normal Unix output redirection works the way you would expect when using parallel.  Because the commands are running simultaneously and timing will vary, the order of the records in the listings.csv file will not exactly match that of the index.csv file. But all the output of the parallelized scrape operation will be dumped into listings.csv correctly.

The upshot is that `scrape_listing.py` is still as understandable as it was before we added parallelization. Plus it's easy to run one-off scrapes by passing `scrape_listing.py` a URL and seeing what happens. 

## Getting close to the source

It never hurts to figure out where the server you’d like to scrape is, physically, to see if you can cut down on network latency. The [Maxmind GeoIP2 demo](https://www.maxmind.com/en/geoip-demo) lets you geolocate a small number of IP addresses. 

When I plugged the Armslist.com IP address into the demo, I found something very interesting: The location is in Virgina and the ISP is Amazon. That’s the big east coast Amazon data center (aka us-east-1).

Because NPR Visuals also uses Amazon Web Services, we were able to set up the machine to scrape the server in the same data center. Putting your scraper in the same data center as the host you’re scraping is going to eliminate about as much network overhead as humanly possible. 

While that’s probably a bit too lucky to cover most common cases, if you are hosting your scraper on Amazon and find the server you’d like to scrape is on the West Coast of the US, you can set up your EC2 instance in the west coast data center to lose a little extra latency.

## Choosing the right EC2 server

We used an Amazon c3.8xlarge server, which is a compute optimized instance with 32 virtual processors available. We chose a compute-optimized instance because the scraper doesn’t use a lot of memory or disk. It doesn’t use that much CPU either, but it’s more CPU intensive than anything else, and the c3.8xlarge is cheaper than any other option with more than 16 CPUs. 

On a c3.8xlarge, scraping roughly 80,000 urls took less than 16 minutes, which comes out to less than $0.50 to run a full scrape.

### Putting it all together

The full scraper actually carries out two operations:

* Scrape the Armslist.com index pages to harvest listing URLs and write the list to csv. To speed up the process, this step is parallelized over states. It could be refactored to be even more efficient but works well enough for our purposes.
* Scrape each listing URL from the index csv file using parallel to scrape as many URLs simultaneously as possible.

## Analyzing the data

We do further post-processing for our analysis using shell scripts and PostgreSQL using a process similar to the one [described here](http://blog.apps.npr.org/2014/09/02/reusable-data-processing.html). If you’d like to check our work, take a look at the [armslist-analysis](https://github.com/nprapps/armslist-analysis) code repository.

## Props where they are due

I learned many of these techniques -- particularly model classes and using GNU parallel -- from developer Norbert Winklareth while we were working on a Cook County Jail inmate scraper  in Chicago.
