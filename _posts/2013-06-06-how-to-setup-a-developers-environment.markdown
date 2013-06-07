---
layout: post
title: "How to Develop like NPR News Apps"
description: "(Almost) everything you always wanted to know about working from the command line, but were too afraid to ask"
author: Gerald Rich
email: grich@npr.org
twitter: gerald_arthur
---

Last year, NPR News Apps released an open source template for developing and deploying all of its news apps. But in order to use you'll need to get your computer setup to work on projects.

The following steps will help you get ready to use the template, assuming you're working on a new Mac with Mountain Lion OS X 10.8 installed. Each Mac operating system is a little different, so we're starting from scratch with the latest OS.

# Chapter 0: Prerequisites
## Are you an administrator?
We'll be installing a number of programs from the command line in this tutorial, so that means you've got to be and administrator on your computer, or have administrative privledges.

Click on the Apple menu > System Preferences > Users & Groups and check your status against this handy screenshot.

![Are you an admin?](/img/c0_admin.png)

## Update your software
Click on the Apple menu > Software update. Continue installing and rebooting until there is nothing left to update.

## Install Xcode and the Xcode's command line tools
Xcode is billed as Mac's one stop shop for developers wanting to make apps, but that's the same kind of apps we'll be making with this template. Specifically, the template is a basis for creating web apps that work on anywhere: desktop or tablet, Droid or iPhone. While it's not what we work with, Xcode still provides some code that we'll need later.

* Get [Xcode](https://developer.apple.com/xcode/) from the app store.
* Get the Xcode command line tools by going to Xcode > Preferences > Downloads and checking the "install" button next to the command line tools.

![Install Xcode's command line tools](/img/c0_xcode.png)

# Chapter 1: Install Homebrew

[Homebrew](http://brew.sh/) is a package manager for your Mac. It's like the Mac app store for programming tools. You can access Homebrew via the terminal, like [all good things](http://www.amazon.com/Beginning-was-Command-Line-Neal-Stephenson/dp/0380815931). Inspiration for this section comes from Kenneth Reitz's excellent [Python guide](http://docs.python-guide.org/en/latest/starting/install/osx.html).

1. Open your terminal application. All Macs come with an app called "Terminal." If you'd like something fancier, we like [iTerm2](http://iterm2.com/downloads/stable/iTerm2_v1_0_0.zip).
1. Install Homebrew by pasting this command into your terminal and hit "enter."

	ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"

**Note**: We'll be doing a lot of typing/pasting into the terminal. You'll want to right-click and choose "edit session" and make the background color and text color something comfortable. [Solarized](http://ethanschoonover.com/solarized) is one popular theme that's easy on the eyes. This is your new home, so put up some nice wallpaper.

Now, paste this this line.

	brew doctor

**Note**: If there are two lines inside any of the code blocks in this article, paste them separately and hit enter after each of them.

Next you'll want to edit a little something called your `PATH`. Basically, the command line is window to your computer that comes preloaded with a couple variables and functions. Editing your `~/.bash_profile` file allows you preload and access all these fun things we've been installing.

**Note**: There are many editors available on your computer. You can use a pretty graphical editor like [SublimeText2](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%202.0.1.dmg) or you can use one built-in to your terminal, like [`vim`](http://www.vim.org/docs.php) or [`nano`](http://www.nano-editor.org/dist/v2.2/nano.html). We'll be using `nano` for this tutorial just to keep things simple.

Open your `~/.bash_profile` with the following command.

	nano ~/.bash_profile

Then copy and paste this line of code at the very top. This lets Homebrew handle updating and maintaining the code we'll be installing.

	export PATH=/usr/local/bin:$PATH

Once you've added the line of code, you can save the file by typing pressing control + O, then control + X. You'll find yourself back at the command line and needing to update your terminal session like so. Copy and paste the next line of code into your terminal and hit enter.

	source ~/.bash_profile

# Chapter 2: Install Virtualenv

Working on multiple Python projects can be difficult. Virtualenv will isolate each of your Python projects in their own little sandboxes, keeping your environment variables and installed software neat and tidy.

First, you'll need to install `pip`, Python's very own package manager. It's like Homebrew, but it's specific to Python.

	sudo easy_install pip

1. Install virtualenv and virtualenvwrapper. We'll use pip to install this software for everyone who might use your computer.

	sudo pip install virtualenv virtualenvwrapper

**Note**: `virtualenv` is the actual environment that you'll be using, while `virtualwrapper` helps you access the environment and its variables from your `PATH`.

2. Edit your `~/.bash_profile` file again,

	nano ~/.bash_profile

and add this line below the line you just added:

	source /usr/local/bin/virtualenvwrapper_lazy.sh

**Sanity Check**: Double check your `~/.bash_profile` file, and make sure you've properly saved your `PATH` variables.

	less ~/.bash_profile

If you don't see the following bit of code in the file, run `nano ~/.bash_profile` and be sure to save it this time.

	export PATH=/usr/local/bin:$PATH
	source /usr/local/share/python/virtualenvwrapper_lazy.sh

# Chapter 3: Set up Node and NPM
To make styling our apps easier, we use a language called LESS which is then compiled into CSS with some handy Node.js. So, we'll need to install Node and its own separate package manager as well.

1. Install Node.js using Homebrew.

	brew install node

2. Install NPM, the Node Package Manager.

	curl https://npmjs.org/install.sh | sh

3. Finally, add Node to your `~/.bash_profile` like you did for Homebrew and virtualwrapper. Copy and paste the following line below the previous two.

	export NODE_PATH=/usr/local/lib/node_modules

Save and exit out of `nano` using control + O and control + X, and then type `source ~/.bash_profile` one more time to update your session. After that, you can treat yourself to a cup of coffee because you now have the basic tools for working like the NPR news apps team. Next up we'll be getting into the nitty gritty of working with the template, including things like [GitHub](https://help.github.com/articles/set-up-git) and [Amazon Web Services](http://aws.amazon.com/). Cheers!
