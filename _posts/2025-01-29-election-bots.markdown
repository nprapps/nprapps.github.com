---
layout: post
title: "Elections Slackbots"
description: "How we used GitHub and Slack to stay up to date during the 2024 election season."
author: Shajia Abidi
twitter: nprviz
og_image: /img/posts/bots-2.png
---

I joined NPR as an elections developer earlier this year. As part of this work, one of my projects was to build [Slack bots](https://github.com/nprapps/elections-bots/tree/general-elections) to notify the team about AP testing sessions and changes in election tabulation status.

**AP test notifier**

Like most major news organizations, NPR gets its election results data from the Associated Press. Ahead of an election, AP runs automated tests of its [election results APIs](https://developer.ap.org/ap-elections-api/docs/index.html#t=Welcome.htm), and newsroom developers can use those sessions to test their own systems against mock data.

To remind the team about these testing sessions, I [created a Slackbot](https://github.com/nprapps/elections-bots/tree/general-elections/elex-testing-results) that would run regularly using [GitHub Actions' cron job feature](https://github.com/nprapps/elections-bots/blob/general-elections/.github/workflows/schedule.yml).

This bot would offer 2 kinds of notifications:

1. Tests starting imminently (within the next 20 minutes)  
2. A list of all scheduled tests that day, posted at the beginning of the workday

I utilized draw.io to create a flow diagram for this project, which helped me understand the essential steps needed for the notifier.

<div style="max-width: 500px;">
![](/img/posts/bots-1.png)
</div>

AP’s elections API includes an endpoint for its [testing calendar](https://developer.ap.org/ap-elections-api/docs/index.html?#t=Customer_Testing_Schedule_Report.htm&rhsearch=calendar%20report&rhhlterm=calendar%20report&rhsyns=%20), which returns a list of dates and times. Since the endpoint does not have built-in filtering options, I wrote a function to return only the tests scheduled for that day. Another helper function checks if a test is scheduled to start within the next 20 minutes. If so, it dispatches a Slack notification for the team.

<div style="max-width: 500px;">
![](/img/posts/bots-2.png)
</div>

The GitHub Actions [documentation](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule) notes that scheduled events can experience delays during high demand for workflow runs, especially at the start of every hour. To address this, I configured our cron job to run at the 25th and 55th minutes of each hour.

For the daily digest of testing events, I created a new Github [workflow](https://github.com/nprapps/elections-bots/blob/main/.github/workflows/schedule.yml) with a cron job that ran once every day and sent a message if there were any tests.

<div style="max-width: 500px;">
![](/img/posts/bots-3.png)
</div>

**Election tabulation status notifier**

I built on the testing notifier for a [second bot](https://github.com/nprapps/elections-bots/tree/general-elections/elex-tabulation-data) to notify the team when a race's tabulation status or race call status changes. For this notifier, I also used a database and [Slack’s Block Kit](https://app.slack.com/block-kit-builder/). 

The newest version of AP’s elections API (v3) includes information about a race’s [current status](https://developer.ap.org/ap-elections-api/docs/index.html?#t=Release_Notes.htm&rhsearch=tabulation%20status&rhhlterm=tabulation%20status&rhsyns=%20) (in separate values pertaining to AP tabulation status, race call status and AP decision status). For our notifier, we wanted to follow a set of races (for example, all primaries on given day) and get periodic, batch updates of which races were newly reporting results, newly called, or had some other significant change in status.

Our prototype relied on Google Sheets for the database. I wanted a quick solution to store data, and I knew that our dataset would not be too large—just a relatively small number of rows. This new bot had to read, [write](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append), and [delete](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear) data from the sheets, so I created [helper functions](https://github.com/nprapps/elections-bots/tree/general-elections/elex-tabulation-data/sheets) for each of these functionalities. 

I created a function to compare the latest data from AP with the previous version of that data, saved in a Google Sheet. The goal was to identify races whose tabulation status or race call status had changed. Then it would empty the sheet and update it with the latest data. (Of note: Google Sheets works with data in a nested array format, while AP provides data in an array of objects format. I wrote functions to [convert](https://github.com/nprapps/elections-bots/blob/main/helpers/formatToAddToSheets.js) the [formats](https://github.com/nprapps/elections-bots/blob/main/helpers/formatElexData.js) for easy workflows.)

We iterated on which combinations of status messages felt most useful to surface. I developed a function that takes all potential edge cases into account. It returned updated data to be added to the sheets and identified which data required team notification. (One optimization: I realized that we do not need to track changes in tabulation status once the race has been called. AP will often declare a winner while results are still being tabulated.)

After formatting the data and adding it to the Google Sheet, the next step was to set up Slack messages.

The testing-schedule bot was a simple bullet-point list, but this message was a bit more complicated with many different categories. I used [Slack’s Block Kit Builder](https://app.slack.com/block-kit-builder/) to [format](https://github.com/nprapps/elections-bots/blob/main/elex-tabulation-data/slack/getMessage.js) the message.  
![](/img/posts/bots-4.png)  
Lastly, I saved my environment variables as GitHub Actions secrets and passed them into my workflow file. I then set the cron job for the bot to run every 15 minutes.

**Conserving Github Action minutes**

At this point, both bots were functioning correctly; we were receiving notifications about the testing schedule and race updates. However, we soon realized we were approaching our monthly limit of free GitHub Action minutes. 

I began exploring ways to optimize GitHub Actions:

* Instead of running the cron job every 15 minutes daily, I optimized it to run only on election days (defined via a spreadsheet) and for seven days following the election since the results can take some time to come in.  
* I added another column to the spreadsheet to allow for custom runs: Some races take more than seven days to tabulate, and I wanted a way to handle this edge case.   
* In my GitHub actions workflow, I added a new job. The [first job](https://github.com/nprapps/elections-bots/blob/optimize-ga/.github/workflows/tabs-schedule.yml) will read the value in the Google Sheets, pass it to the next job, and if it is TRUE, will proceed; otherwise, end the job.

In the aggregate, these optimizations saved us minutes over the course of a whole day. But later I realized that even though I was saving us seconds each time the cron ran, GitHub still charged me for the entire minute. 

In the end, I kept the initial logic and moved on to other projects. If I had more time, I would have looked into powering the tabulation status bot via the data processing scripts in our [election rig](https://github.com/nprapps/elections24-general) instead of GitHub Actions. This would preserve GitHub Actions minutes for our other projects and also save us AP API calls. 

If I had more time to work on the bots, I’d have tried using Slack’s Block Kit to make the messages more interactive. For example, I could have added a button or a dropdown to inform the team who tested the rig during this testing period. I also would have added tests to ensure the bot works correctly.
