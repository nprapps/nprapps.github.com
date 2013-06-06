yout: post
title: "How to Setup a Developer's Environment"
description: "(Almost) everything you always wanted to know about working from the command line, but were too afraid to ask"
author: Gerald Rich
email: grich@npr.org
twitter: gerald_arthur
---

# Chapter 0: Prerequisites
## Are you an administrator?
Click on the Apple menu > System Preferences > Users & Groups and check your status against this handy screenshot.

![Are you an admin?](/img/posts/c0_admin.png)

## Are you up-to-date with your software?
Click on the Apple menu > Software update. Continue installing and rebooting until there is nothing left to update.

## Have you installed Xcode and the Xcode's command line tools?
* Get [Xcode](https://developer.apple.com/xcode/) from the app store.
* Get the Xcode command line tools by going to Xcode > Preferences > Downloads and checking the "install" button next to the command line tools.

![Install Xcode's command line tools](/img/posts/c0_xcode.png)

## Do you Git?
* Create an account on [Github](https://github.com/).
* Setup your [Git environment](https://help.github.com/articles/set-up-git) .
* Get [keys](https://help.github.com/articles/generating-ssh-keys) so you can download and upload to Github.

# Chapter 1: Install Homebrew
Inspiration for chapters 1 and 2 comes from Kenneth Reitz's excellent [Python guide](http://docs.python-guide.org/en/latest/starting/install/osx.html).

[Homebrew](http://brew.sh/) is a package manager for your Mac. It's like the Mac app store for programming tools. You can access Homebrew via the terminal, like [all good things](http://www.amazon.com/Beginning-was-Command-Line-Neal-Stephenson/dp/0380815931).

1. Open your terminal application. All Macs come with an app called "Terminal." If you'd like something fancier, the kids these days are using [iTerm2](http://iterm2.com/downloads/stable/iTerm2_v1_0_0.zip).
1. Install Homebrew by pasting this command into your terminal.

**Note**: We'll be doing a lot of typing/pasting into the terminal. You'll want to right-click and choose "edit session" and make the background color and text color something comfortable. [Solarized](http://ethanschoonover.com/solarized) is one popular theme that's easy on the eyes. This is your new home, so put up some nice wallpaper.

Back to the instructions. Paste this into your terminal and hit "enter" or "return."

	ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"

Now, paste this this line.

	brew doctor

**Note**: If there are two lines inside any of the code blocks in this article, paste them separately and hit enter after each of them.

1. Edit your `~/.bashrc` file and add this line at the top.

**Note**: There are many editors available on your computer. You can use a pretty graphical editor like [SublimeText2](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%202.0.1.dmg) or you can use one built-in to your terminal, like [`vim`](http://www.vim.org/docs.php) or [`nano`](http://www.nano-editor.org/dist/v2.2/nano.html). This decision is entirely up to you.

	export PATH=/usr/local/bin:$PATH

Update your terminal session with this new stuff like this.

	source ~/.bashrc

# Chapter 2: Install Virtualenv

Working on multiple Python projects can be difficult. Virtualenv will create tiny sandboxes for each of your Python projects, keeping your environment variables and installed software neat and tidy. 

1. Install virtualenv and virtualenvwrapper. We'll use pip to install this software for everyone who might use your computer.

	sudo pip install virtualenv virtualenvwrapper

2. Edit your `~/.bashrc` file to add this line below the bits you just added above:

	source /usr/local/bin/virtualenvwrapper_lazy.sh

**Sanity Check**: Your `~/.bashrc` file should look like this:

	export PATH=/usr/local/bin:$PATH
	export PATH=/usr/local/share/python:$PATH
	source /usr/local/share/python/virtualenvwrapper_lazy.sh

# Chapter 3: Set up Node and NPM
The app template uses some Node.js software to render CSS files from Less. Trust Danny DeBelius on this one: Less is more.

1. Install Node.js using Homebrew.

	brew install node

2. Install NPM, the Node Package Manager.

	curl https://npmjs.org/install.sh | sh
