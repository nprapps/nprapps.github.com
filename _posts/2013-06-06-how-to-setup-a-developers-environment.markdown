---
layout: post
title: "How to Setup Your Mac to Develop News Applications Like We Do"
description: "(Almost) everything you always wanted to know about working from the command line, but were too afraid to ask."
author: Gerald Rich
email: grich@npr.org
twitter: gerald_arthur
---

*Updated December 15, 2017*

*Hi! I'm [Geoff Hing](https://twitter.com/geoffhing), a news applications developer who was filling in for [Juan Elosua](https://twitter.com/jjelosua) while he was on family leave welcoming his child into the world. [Matthew Zhang](https://twitter.com/_mazhang) started as the team's intern around the same time, and as we wrap up our time out NPR, we're also adding a few notes about how we've set up our development environments. This guide helps you get a solid Python environment set up, which we use for daily graphics, data analysis and application development.*

*[David Eads](http://twitter.com/eads), [Livia Labate](http://twitter.com/livlab), [Tyler Fisher](http://twitter.com/tylrfishr), [Shelly Tan](http://twitter.com/Tan_Shelly), [Helga Salinas](http://twitter.com/Helga_Salinas) and [Juan Elosua](https://twitter.com/jjelosua) have also contributed to this post.*

I joined the News Apps team a week ago in their shiny new DC offices, and in-between eating awesome food and Tiny Desk concerts, we've been documenting the best way to get other journalists setup to build news apps like the pros.

The following steps will help you convert your laptop to hacktop, assuming you're working on a new Mac with OS X 10.12, or Sierra, installed. Each Mac operating system is a little different, so we're starting from scratch with the latest OS.

## Chapter 0: Prerequisites

### Are you an administrator?
We'll be installing a number of programs from the command line in this tutorial, so that means you must have administrative privileges. If you're not an admin, talk with your friendly IT Department.

Click on the Apple menu > System Preferences > Users & Groups and check your status against this handy screenshot.

![Are you an admin?](/img/posts/c0_admin.png)

### Update your software
Go to the App Store and go to the updates tab. If there are system updates, install and reboot until there is nothing left to update.

### Install command line tools
With the release of OS X 10.9, Apple decoupled its command line tools necessary for compiling some of the tools we use from Xcode, Apple's proprietary development suite.

All Macs come with an app called "Terminal." You can find it under Applications > Utilities. Double click to open that bad boy up, and run this command:

	xcode-select --install

Your laptop should prompt you to install the command line tools. Install the tools and move on once that process has completed (about 5 minutes).

If it doesn't install, or there isn't an update for Xcode to install the tools, you'll have to download the command line tools from [developer.apple.com/downloads/index.action](http://developer.apple.com/downloads/index.action). You have to register, or you can log in with your Apple ID.

![In my case, it was Command Line Tools (OS X Mavericks).](/img/posts/download_clt.png)

Search for "command line tools," and download the package appropriate to your version of OS X. Double click on the .dmg file in your downloads file, and proceed to install. In my case, I downloaded Command Line Tools (OS X Mavericks), which is highlighted in the screenshot above.

**Note**: If you ever run into some variation of a 'user does not have permission' error when running a command in the terminal, prefix the command with `sudo`. For example, the above command would be run as:

	sudo xcode-select --install

After you enter in your administrator password, these installations should proceed as normal. You shouldn't have to encounter this problem much in the following steps, but it's good to know just in case.

## Chapter 1: Install Homebrew

[Homebrew](http://brew.sh/) is like the Mac app store for programming tools. You can access Homebrew via the terminal, ([like all good things](http://www.amazon.com/Beginning-was-Command-Line-Neal-Stephenson/dp/0380815931)). Inspiration for this section comes from Kenneth Reitz's excellent [Python guide](http://docs.python-guide.org/en/latest/starting/install/osx/).

Install Homebrew by pasting this command into your terminal and then hitting "enter."

	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

It will ask for your password, so type that in and hit "enter" again. Now, paste this line to test Homebrew.

	brew doctor

This will test your Homebrew setup, and any tools you've installed to make sure they're working properly. If they are, Homebrew tell you

	Your system is ready to brew.

If anything isn't working properly, follow their instructions to get things working correctly.

**Note**: If there are two lines inside any of the code blocks in this article, paste them separately and hit enter after each of them.

Next you'll need to go in and edit  `~/.bash_profile` to ensures you can use what you've just downloaded. `bash_profile` acts like a configuration file for your terminal.

**Note**: There are many editors available on your computer. You can use a pretty graphical editor like [SublimeText2](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%202.0.1.dmg) or you can use one built-in to your terminal, like [`vim`](http://www.vim.org/docs.php) or [`nano`](http://www.nano-editor.org/dist/v2.2/nano.html). We'll be using `nano` for this tutorial just to keep things simple.

Open your `bash_profile` with the following command.

	nano ~/.bash_profile

Then copy and paste this line of code at the very top. This lets Homebrew handle updating and maintaining the code we'll be installing.

	export PATH=/usr/local/bin:$PATH

Once you've added the line of code, you can save the file by typing control + O. Doing so lets you adjust the file name. Just leave it as is, then hit enter to save. Hit control + X to exit. You'll find yourself back at the command line and needing to update your terminal session like so. Copy and paste the next line of code into your terminal and hit enter.

	source ~/.bash_profile

You'll only need to source the `bash_profile` since we're editing the file right now. It's the equivalent of quitting your terminal application and opening it up again, but `source` lets you soldier forward and setup Python.

## Chapter 2: Install Python && virtualenv

OSX comes with a system version of Python, and for a long time, we used this version. However, as Apple continues to update its operating system, system Python has gotten harder and harder to use with modern tools.

Thus, install the latest stable homebrewed version of Python. We get `pip` for free with this installation...yay!!

	brew install python

You may have to update your `PATH` environment variable to tell your system to prefer the version of Python you just installed over the system version. The output of `brew install python` should include some text like this:

> This formula installs a python2 executable to /usr/local/bin.
> If you wish to have this formula's python executable in your PATH then add
> the following to ~/.bash_profile:
>  export PATH="/usr/local/opt/python/libexec/bin:$PATH"

I updated my path in `~/.bash_profile` so that `/usr/local/opt/python/libexec/bin` was at the beginning of the path list and then made my current shell use the updated path by running `source ~/.bash_profile`.


**Note**: `pip` like Homebrew, it's sort of an app store but for Python code.

Next, we'll install `virtualenv` and `virtualenvwrapper`. These tools help us isolate Python projects into their own little sandboxes, keeping your installed software neat and tidy.

	pip install virtualenv virtualenvwrapper

**Note**: `virtualenv` is the actual environment that you'll be using, while `virtualwrapper` helps you access the environment and its variables from your `PATH`.

Edit your `~/.bash_profile` file again,

	nano ~/.bash_profile

and add this line below the line you just added:

	source /usr/local/bin/virtualenvwrapper_lazy.sh

Save and exit out of `nano` using control + O, enter, and then control + X.

**Sanity Check**: Double check your `~/.bash_profile` file, and make sure you've properly saved your `PATH` variables.

	less ~/.bash_profile

It should look like this:

	export PATH=/usr/local/bin:$PATH
	source /usr/local/bin/virtualenvwrapper_lazy.sh

To exit `less`, press "Q".

To check if `virtualenv` is properly working, you can create a virtual environment to test it by running:

	mkvirtualenv my_virtual_env_name

After making a few python executables, this should create a new virtual environment for you. If you're in a virtual environment, you should see `(my_virtual_env_name)` inserted before each line in the terminal. Then, to exit out of the virtual environment, run:

	deactivate

This will deactivate but not delete the test virtual environment. To delete the virtual environment, use `rmvirtualenv my_virtual_env_name`.

### A note about virtual environments

*April 18, 2016*: We recently learned that if you installed `virtualenv` before installing the Homebrew version of Python (and possibly even if you installed Python first), the virtual environments you create will use the OS X system version of Python. This is not cool because that version of Python is compiled without key features and libraries.

To ensure you *always* are using your Homebrewed Python, always specify the `-p` flag when creating a virtual environment:

    mkvirtualenv -p `which python` my_virtual_env_name

This will make a virtual environment with the active Python version on your `PATH`.

## Chapter 3: Set up Node and install LESS

Finally, we'll install a tool called LESS that we use to write CSS, the language that styles websites. LESS is a built with Node, so we'll need to install that and NPM, Node's version of `pip` or Homebrew.

Install Node using Homebrew.

	brew install node

Next, let's install globally a node module for compiling LESS into CSS

	npm install -g less

After that, you can treat yourself to a cup of coffee because you now have the basic tools for working like the NPR Visuals team. Next up we'll be getting into the nitty gritty of working with the template, including things like [GitHub](https://help.github.com/articles/set-up-git) and [Amazon Web Services](http://aws.amazon.com/).

## Chapter 4: Configure git

### Set up SSH for Github

Github has written a great guide for setting up SSH authentication for Github. You will want to do this so Github knows about your computer and will allow you to push to repositories you have access to.

Read that tutorial [here](https://help.github.com/articles/generating-ssh-keys). Do **not** download the native app. Start at "Step 1: Check for SSH keys".

### Configure the default identity

It's nice to have your name and email show up correctly in the commit log. To make sure this information is correct, run:

	git config --global user.email "$YOUR_EMAIL@npr.org"
	git config --global user.name "$YOUR_NAME"

### Optional: set up bash completion

I like to be able to tab-complete my branch names when doing `git checkout`.  The easiest way I found to do this is to install Homebrew's git instead of the default OSX one, as well as the bash completion package:

	brew install git bash-completion

Then add a line like this to your `~/.bash_profile`:

	[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion

## Appendix 1: Postgres and PostGIS
We occasionally make maps and analyze geographic information, so that requires some specialized tools. This appendix will show you how to install the Postgres database server and the PostGIS geography stack &mdash; which includes several pieces of software for reading and manipulating geographic data. We'll explain these tools a bit more as we install them.

### NumPy
First, we need to install a Python library called NumPy. We don't use NumPy directly, but PostGIS uses it for making geographic calculations. This may already be installed, but run this command just to double-check. You will be prompted for your password.

    pip install numpy

### Postgres
Next up: the Postgres database server. Postgres is a useful tool for dealing with all kinds of data, not just geography, so we'll get it setup first then tweak it to be able to interpret geographic data. Postgres will take about 10 minutes to install.

	brew install postgresql

Edit your `~/.bash_profile` to add a pair of commands for starting and stopping your Postgres database server. `pgup` will start the server; `pgdown` will stop it. FYI You'll rarely ever need to `pgdown`, but we've include the command just in case.

	nano -w ~/.bash_profile

Add these two lines:

	alias pgdown='pg_ctl -D /usr/local/var/postgres stop -s -m fast'
	alias pgup='pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start'

Save and exit out of `nano` using control + O, enter, and then control + X, and update your session one more time,

	source ~/.bash_profile

and let's initialize your Postgres server. We only need to do this once after installing it.

	initdb /usr/local/var/postgres/ -E utf-8

Finally, let's start up the Postgres server.

	pgup

### PostGIS
These deceptively simple commands will install an awful lot of software. It's going to take some time, and your laptop fans will probably sound like a fighter jet taking off. Don't worry; it can take the heat.

	brew install gdal --with-postgresql

Still hanging in there?

	brew install postgis

Now you can create your first geographically-enabled database. For more information on how to do that postgis [tells you how to do this](http://postgis.net/docs/manual-2.0/postgis_installation.html#create_new_db_extensions).

## Appendix 2: The Terminal
Since you're going to be working from the command line a lot, it's worth investing time to make your terminal something that's a little more easy on the eyes.

### iTerm2
Download [iTerm2](http://www.iterm2.com/#/section/home). The built-in terminal application which comes with your Mac is fine, but iTerm2 is slicker and more configurable. One of the better features is splitting your terminal into different horizontal and vertical panes: one for an active pane, another for any files you might want to have open, and a third for a local server.

#### Solarized
[Solarized](http://ethanschoonover.com/solarized/files/solarized.zip) is a set of nice, readable colors. Unzip the `solarized.zip` file.

Now, inside iTerm2 go to iTerm > Preferences > Profiles and select "Default." Choose "Colors" and find the "Color Presets…" button in the lower-right-hand corner of the window. Select "Import" and navigate to `solarized/iterm2-colors-solarized/` and double-click on `Solarized Dark.itermcolors`. After it's been imported, you can find "Solarized Dark" on the "Load Presets" list. Click and select "Solarized Dark" to change the colors appropriately.

![You can edit your theme from the Preferences menu](/img/posts/a2_solarized.png)

See? Much nicer.

## Appendix 3: The Text Editor
Since your code is stored entirely as text files on your computer, you'll want a nice text editor. Our instructions showed you how to use `nano`, a text editor that you'll find on almost every computer. However, there are at least two others that the team uses. Text editors are like the Microsoft Word of the programming world, except they come packed with all kinds of handy dandy features to make writing code a cinch.

### Atom

While I prefer vim (see below) as my editor of choice, many people prefer an editor that is less dependent on memorizing keystrokes and has a user interface that you can interact with using your mouse or trackpad. If this is you, [Atom](https://atom.io/) is a good choice because it's free and intuitive to use with its defaults, yet highly customizable.

I have this installed on my system in case I'm pairing with someone who's not familiar with vim.

### Sublime Text 2
[Sublime Text 2](http://www.sublimetext.com/2) is another GUI-based editor with a nice interface and some [customizations](http://net.tutsplus.com/tutorials/tools-and-tips/sublime-text-2-tips-and-tricks/) available. You'll likely want to learn some [keyboard shortcuts](http://docs.sublimetext.info/en/latest/reference/keyboard_shortcuts_osx.html) to make yourself more efficient. You can also prettify it with the [Flatland theme](https://github.com/thinkpixellab/flatland).

**Note**: In recent versions, installing Package Control (necessary for many customizations) assumes you have purchased Sublime Text, so consider getting a license first. Additionally, speed up your use by making Sublime Text your default editor from the command line. Here's [how](http://stackoverflow.com/a/16495202/4548251). And [another way](http://olivierlacan.com/posts/launch-sublime-text-2-from-the-command-line/).

### Vim
Personally, I prefer vim &mdash; a terminal based editor that requires you to type rather than point-and-click to work on files. I learned this editor at one of my first jobs when the sysadmin pointed out that it was good to know vi (vim stands for "vi improved") because it was likely to be available on any Linux server to which you may find yourself connecting. There's a lot of little keyboard shortcuts you'll need to get comfy with before you can just dive-in. Here's a resource to become more acquainted with vim: [Vim Tips Wiki](http://vim.wikia.com/wiki/Vim_Tips_Wiki).

A version of vim is already on your computer, but I prefer to install it using Homebrew to get a more up-to-date version. You can do this by running

	brew install vim

You can add all kinds of features by installing plugins, but our teammate Chris recommends [nerdtree](https://github.com/scrooloose/nerdtree) and [surround](https://github.com/tpope/vim-surround). Here are [some videos](http://net.tutsplus.com/sessions/vim-essential-plugins/) to help make vim and those particular add-ons.
i

Some team members use [Janus](https://github.com/carlhuda/janus), a vim distribution that comes with a number of useful plugins preinstalled and with some useful configuration presets. For better or for worse, I've built up a vim configuration over the years, which you can find [here](https://github.com/ghing/vim-config/blob/master/vimrc). It uses [Vundle](https://github.com/VundleVim/Vundle.vim) to manage installing plugin packages. [Pathogen](https://github.com/tpope/vim-pathogen) is another popular option and Vim 8 has [built-in package management support](https://shapeshed.com/vim-packages/).

**Note**: In your terminal, type in `vim` to begin using the editor.

### Configure your default editor for git

Regardless of which editor you prefer, you should set the default editor used by git. This way, if you run `git commit` without the `-m` option, an editor will be opened so you can type a descriptive, nicely-formatted commit message.

You can do this with this command:

	git config --global core.editor $PATH\_TO\_EDITOR

I used the `which` command to easily find the path to `vim`:

	git config --global core.editor $(which vim)


## Conclusion
And with that you now have a sweet hackintosh. Happy hacking, and if you haven't setup a [Github](https://github.com/) account, you can try out your new tools and [play with some of our code](https://github.com/nprapps). Github provides [a thorough walkthrough](https://help.github.com/) to get you setup and working on some open sourced projects.
