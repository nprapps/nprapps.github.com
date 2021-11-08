---
layout: post
title: "How to Setup Your Mac to Develop News Applications Like We Do"
description: "(Almost) everything you always wanted to know about working from the command line, but were too afraid to ask."
author: Gerald Rich
email: grich@npr.org
twitter: gerald_arthur
---

After 8 years, and countless revisions, we're finally reposting our step by step guide to setting up your machine the way we do at NPR Apps. Like the [classic version](https://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html), first authored in 2013 by [Gerald Rich](https://twitter.com/newsroomdev), this will be a living document, repeatedly updated as systems and software update. 

[Geoff Hing](https://twitter.com/geoffhing), [David Eads](https://twitter.com/eads), [Livia Labate](https://twitter.com/livlab), [Tyler Fisher](https://twitter.com/tylrfishr), [Shelly Tan](https://twitter.com/Tan_Shelly), [Helga Salinas](https://twitter.com/Helga_Salinas), [Juan Elosua](https://twitter.com/jjelosua), [Miles Watkins](https://github.com/mileswwatkins) and [Thomas Wilburn](https://twitter.com/thomaswilburn) have also contributed to this post.

The following steps assume you're working on a new Mac with macOS Catalina 10.15 or more recent. These directions should generally be applicable for anything more recent than Catalina as well. 

## Chapter 0: Prerequisites

### Are you an administrator?
We'll be installing a number of programs from the command line in this tutorial, so that means you must have administrative privileges. If you're not an admin, talk with your friendly IT Department.

**tktk update this section with my own screenshot**

Click on the Apple menu > System Preferences > Users & Groups and check your status against this handy screenshot.

![Are you an admin?](/img/posts/c0_admin.png)

### Update your software
Go to the App Store and go to the updates tab. If there are system updates, install and reboot until there is nothing left to update.

### Install command line tools
The command line tools from Apple provide a *crucial* suite of tools you'll need to use version control (git) and Python. The main commands you may come across that come from command line tools are `git`, `make`, `clang`, and `gcc`.

All Macs come with an app called "Terminal." You can find it under Applications > Utilities. Double click to open that bad boy up, (or hit `cmd-space` and type "terminal"). Once it's booted, run this command:

	xcode-select --install

Your laptop should prompt you to install the command line tools. Install the tools and move on once that process has completed (about 5 minutes).

If it doesn't install, or there isn't an update for Xcode to install the tools, you'll have to download the command line tools from [developer.apple.com/downloads/index.action](http://developer.apple.com/downloads/index.action). You have to register, or you can log in with your Apple ID.

![In my case, it was Command Line Tools (macOS Mavericks).](/img/posts/download_clt.png)

Search for "command line tools," and download the package appropriate to your version of macOS. Double click on the .dmg file in your downloads file, and proceed to install. In my case, I downloaded Command Line Tools (macOS Mavericks), which is highlighted in the screenshot above.

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

Next you'll need to go in and edit  `~/.zshrc` to ensures you can use what you've just downloaded. `.zshrc` acts like a configuration file for your terminal.

**Note**: There are many editors available on your computer. You can use a pretty graphical editor like [Sublime Text](https://www.sublimetext.com/) or you can use one built-in to your terminal, like [`vim`](http://www.vim.org/docs.php) or [`nano`](http://www.nano-editor.org/dist/v2.2/nano.html). We'll be using `nano` for this tutorial just to keep things simple. If you'd rather edit in Sublime Text like I often do, go to the [appendix](#appendix-2-supe-up-your-terminal-game) to learn how to open a file with the `edit FILE_NAME` command. 

Open your `.zshrc` with the following command.

	nano ~/.zshrc

Then copy and paste this line of code at the very top. This lets Homebrew handle updating and maintaining the code we'll be installing.

	export PATH=/usr/local/bin:$PATH

Once you've added the line of code, you can save the file by typing control + O. Doing so lets you adjust the file name. Just leave it as is, then hit enter to save. Hit control + X to exit. You'll find yourself back at the command line and needing to update your terminal session like so. Copy and paste the next line of code into your terminal and hit enter.

	source ~/.zshrc

You'll only need to source the `.zshrc` since we're editing the file right now. It's the equivalent of quitting your terminal application and opening it up again, but `source` lets you soldier forward and setup Python.

**Note:** On older MacOS systems, the shell was `bash`, but MacOS changed it to `zsh` in v10.15 (Catalina). If you're using an older OS, instead of editing `~/.zshrc`, you'll want to `nano ~/.bash_profile`.

## Chapter 2: Installing Python and Virtual environments.

Python is notoriously tricky to install and manage on your machine. XKCD did it justice with this cartoon...

[![](https://imgs.xkcd.com/comics/python_environment.png)](https://xkcd.com/1987/)

macOS comes with a system version of Python, and for a long time, we used this version. However, modifying the system Python is **a bad idea**; user alterations or installations may cause core macOS components to break, and macOS system updates may cause user projects to break.

Thus, we need to utilize virtual environments to select our python versions, and allow easy swapping between environments, and tidy maintenance of dependencies and packages. Historically, many of our team's projects used **Python 2.7.x**, and you are likely to need it at access legacy tools. Modern tools and documentation tends to use **Python 3**, so it will be good to have that handy as well. 

I used [this](https://opensource.com/article/19/6/python-virtual-environments-mac) tutorial and [this](https://opensource.com/article/19/6/python-virtual-environments-mac) and a lot of googling for getting `pyenv` and `virtualenvwrapper` running on my machine. Note that you probably need to change any references of `.bash_profile` to `.zshrc` if you're using macOS Catalina or more recent.

Here are the precise steps I used. **Hold onto your butts...**

### Install pyenv and python 3

First we will install [pyenv](https://github.com/pyenv/pyenv#command-reference) which will allow us to swap between python versions in a tidy way. Run:

	brew install pyenv pyenv-virtualenv pyenv-virtualenvwrapper

Next you'll want to add the following lines to .zshrc so pyenv will run whenever you open a terminal window.
```bash	
# put in your .zshrc or .bash_profile file
if command -v pyenv 1>/dev/null 2>&1; then
	eval "$(pyenv init -)"
	eval "$(pyenv virtualenv-init -)"
fi
```

To get this to work, run `source ~/.zshrc` or restart your terminal application. 

Next we'll brew install a few things that pyenv needs to run. 

	brew install openssl readline sqlite3 xz zlib

Then, run these exports in your terminal window to make sure the next couple steps work correctly. Run each sequentially in terminal:

**tktk look through command line history to copy other similar flag commands I used, in case the next person needs those specialized commands.**

**tktk also referenced these issues, https://github.com/pyenv/pyenv/issues/1643 and https://github.com/pyenv/pyenv/issues/1738**

```bash
export LDFLAGS="-L/usr/local/opt/zlib/lib -L/usr/local/opt/sqlite/lib"
export CPPFLAGS="-I/usr/local/opt/zlib/include -I/usr/local/opt/sqlite/include"
```

Next we'll install a version of Python to use by default. 

```bash
# download some version of 3.7.x or later. Whatever works ¯\_(ツ)_/¯
pyenv install 3.9.1
```
*Note, running this command on 3.7.3, 3.8.1 and 2.7.1 threw errors for me. 3.9.1 worked, not sure why! If you hit errors, try installing different nearby versions. For our purposes 3.7.x is as good as 3.8.x or 3.9.x. And for older versions, 2.7.1 is as good as 2.7.16.*

This will take a second. When that's complete, you can see the Python versions stored by pyenv by running:

	pyenv versions

After running this, the options available to me are "system" (which is 2.7.1 in my case) and 3.9.1. Let's update the global python environment to 3.9.1 by running

```bash 
pyenv global 3.9.1
```

You can always change back! 

At this time, also install a version of Python 2.7.x. I used 2.7.16, because 2.7.1 didn't compile. 
```bash 	
# download some version of 2.7.x. Whatever works ¯\_(ツ)_/¯
pyenv install 2.7.16
```

Now when you run `pyenv versions` you should see something that looks like the following:

```bash
  system
  2.7.16
* 3.9.1 (set by /Users/dwood/.python-version)
```
**tktk figure out what the difference between `pyenv global` and `pyenv local` are...not making sense at the moment**

To run  command with your set version of python, don't just run `python FILE.py`. This will simply use your system version of Python. Instead, you run 

`pyenv exec FILE.py`




### Install virtual environments

We've already installed `pyenv-virtualenv` and `pyenv-virtualenvwrapper`, two plugins for `pyenv` that give you access to the traditional commands that come with `virtualenv` and `virtualenvwrapper`. 

These tools give you the ability to create virtual environments where you can tidily and separately store requirements for various Python projects, using whatever Python may be required by that project. 

Practically speaking, these plugins give you access to the `mkvirtualenv`, `rmvirtualenv`, `lssitepackages` and `workon` commands, among others.

**tktk find a list of commands now available** 

Add the following line to your .zshrc

	pyenv virtualenvwrapper

This should give you access to the commands listed above, and others. 

**TKTK section on how to create a virtual environment**

To check if `virtualenv` is properly working, you can create a virtual environment to test it by running:

	mkvirtualenv my_virtual_env_name

After making a few python executables, this should create a new virtual environment for you. If you're in a virtual environment, you should see `(my_virtual_env_name)` inserted before each line in the terminal. Then, to exit out of the virtual environment, run:

	deactivate

This will deactivate but not delete the test virtual environment. To delete the virtual environment, use `rmvirtualenv my_virtual_env_name`. 


<!-- 
so we'll install that version instead of Python 3; following from this, we'll use the `python2` and `pip2` commands to invoke those tools in the terminal.

	brew install python2

You may have to update your `PATH` environment variable to tell your system to prefer the version of Python you just installed over the system version. The output of `brew install python2` should include some text like this:

> This formula installs a python2 executable to /usr/local/bin.
> If you wish to have this formula's python executable in your PATH then add
> the following to ~/.zshrc:
> `export PATH="/usr/local/opt/python/libexec/bin:$PATH"`

I updated my path in `~/.zshrc` so that `/usr/local/opt/python/libexec/bin` was at the beginning of the path list and then made my current shell use the updated path by running `source ~/.zshrc`.


**Note**: `pip2` is like Homebrew: it's sort of an app store but for [Python code](https://pypi.org/).

Next, we'll install `virtualenv` and `virtualenvwrapper`. These tools help us isolate Python projects into their own little sandboxes, keeping your installed software neat and tidy.

	pip2 install virtualenv virtualenvwrapper

**Note**: `virtualenv` creates the actual environment that you'll be using, while `virtualwrapper` makes the interface to these virtual environments even simpler.

Edit your `~/.zshrc` file again,

	nano ~/.zshrc

and add this line below the line you just added:

	source /usr/local/bin/virtualenvwrapper_lazy.sh

Save and exit out of `nano` using control + O, enter, and then control + X.

**Sanity Check**: Double check your `~/.zshrc` file, and make sure you've properly saved your `PATH` variables.

	less ~/.zshrc

It should look like this:

	export PATH=/usr/local/bin:$PATH
	source /usr/local/bin/virtualenvwrapper_lazy.sh

To exit `less`, press "Q".

To check if `virtualenv` is properly working, you can create a virtual environment to test it by running:

	mkvirtualenv my_virtual_env_name

After making a few python executables, this should create a new virtual environment for you. If you're in a virtual environment, you should see `(my_virtual_env_name)` inserted before each line in the terminal. Then, to exit out of the virtual environment, run:

	deactivate

This will deactivate but not delete the test virtual environment. To delete the virtual environment, use `rmvirtualenv my_virtual_env_name`. -->

### A note about virtual environments

*April 18, 2016*: We recently learned that if you installed `virtualenv` before installing the Homebrew version of Python (and possibly even if you installed Python first), the virtual environments you create will use the macOS system version of Python. This is not cool because that version of Python is compiled without key features and libraries.

To ensure you *always* are using your Homebrewed Python, always specify the `--python` flag when creating a virtual environment:

    mkvirtualenv --python "$(which python2)" my_virtual_env_name

This will make a virtual environment with the active Python version on your `PATH`.

## Chapter 3: Set up Node and install LESS

Many of our tools require Node, which runs JavaScript on the desktop or server. For example, our older projects compile CSS from a dialect called LESS, and our newer projects are built entirely on top of Node. The best way to install Node is using `nvm`, which lets you easily upgrade and switch between Node versions.

Install `nvm` with this line. It will ask you to update your shell config, or close and re-open your terminal after it completes.

	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

Once that's done, you can actually use `nvm` to install Node:

	nvm install stable

You may want to install a couple of helper libraries for working with our projects. The `-g` flag means that they're globally installed, so that they become available as command-line executables:

	npm install -g less grunt-cli grunt-init prettier

After that, you can treat yourself to a cup of coffee because you now have the basic tools for working like the NPR Visuals team. Next up we'll be getting into the nitty gritty of working with the template, including things like [GitHub](https://help.github.com/articles/set-up-git) and [Amazon Web Services](http://aws.amazon.com/).

## Chapter 4: Configure git

### Set up SSH for Github

Github has written a great guide for setting up SSH authentication for Github. You will want to do this so Github knows about your computer and will allow you to push to repositories you have access to.

Read that tutorial [here](https://help.github.com/articles/generating-ssh-keys). Start at "Step 1: Check for SSH keys".

### Configure the default identity

It's nice to have your name and email show up correctly in the commit log. To make sure this information is correct, run:

	git config --global user.email "$YOUR_EMAIL@npr.org"
	git config --global user.name "$YOUR_NAME"

You can also use the [GitHub Desktop](https://desktop.github.com) app to manage your repositories, since it will make it easier to check diffs or browse through repo history.

## Appendix 1: The Text Editor
Since your code is stored entirely as text files on your computer, you'll want a nice text editor. Our instructions showed you how to use `nano`, a text editor that you'll find on almost every computer. However, there are at least two others that the team uses. Text editors are like the Microsoft Word of the programming world, except they come packed with all kinds of handy dandy features to make writing code a cinch.

### Atom

While I prefer vim (see below) as my editor of choice, many people prefer an editor that is less dependent on memorizing keystrokes and has a user interface that you can interact with using your mouse or trackpad. If this is you, [Atom](https://atom.io/) is a good choice because it's free and intuitive to use with its defaults, yet highly customizable.

I have this installed on my system in case I'm pairing with someone who's not familiar with vim.

### Sublime Text
[Sublime Text](https://www.sublimetext.com) is another GUI-based editor with a nice interface and some [customizations](http://net.tutsplus.com/tutorials/tools-and-tips/sublime-text-2-tips-and-tricks/) available. You'll likely want to learn some [keyboard shortcuts](http://docs.sublimetext.info/en/latest/reference/keyboard_shortcuts_osx.html) to make yourself more efficient. You can also prettify it with the [Flatland theme](https://github.com/thinkpixellab/flatland).

**Note**: Speed up your use by making Sublime Text your default editor from the command line. Here's [how](http://stackoverflow.com/a/16495202/4548251). And [another way](http://olivierlacan.com/posts/launch-sublime-text-2-from-the-command-line/).

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

## Appendix 2: Supe up your terminal game

Working in the terminal is a crucial part of our workflow. So supe it up to make it something that you enjoy using. Here are a few *optional* things to do to enhance your terminal experience.

### Add aliases to speed up your work

Adding aliases to your `.zshrc` files allows you to type short commands for commands you frequently use. Here are a few aliases I use, followed by their descriptions. Paste the following into your `.zshrc` and edit them to your file paths. 

```bash
#Aliases
alias edit="open -a /Applications/Sublime\ Text.app"
alias ogit="open \`git remote -v | grep git@github.com | grep fetch | head -1 | cut -f2 | cut -d' ' -f1 | sed -e's/:/\//' -e 's/git@/http:\/\//'\`"
alias sites="cd /PATH/TO/ANY/FREQUENTLY/USED/DIRECTORIES"
```

* `edit`: To open any file or folder in Sublime Text, type `edit file-or-folder/path`. You can replace the path there with any text editor you want to use.
* `ogit`: If you're in a directory that is version controlled remotely on github, you can run `ogit` inside that directory to open up that github page in your default browser. For instance if I run `ogit` in my `dailygraphics-next` directory it will open up [https://github.com/nprapps/dailygraphics-next]().
* The final example above is a boilerplate example of how you can set up shortcuts to commonly accessed directories. I have one for my sites folder and one for my daily graphics folder. 

**TKTK section on .oh-my-zsh?**

### Consider an alternative to the default terminal, like iTerm2
Download [iTerm2](http://www.iterm2.com/#/section/home). The built-in terminal application which comes with your Mac is fine, but iTerm2 is slicker and more configurable. One of the better features is splitting your terminal into different horizontal and vertical panes: one for an active pane, another for any files you might want to have open, and a third for a local server.

#### Solarized
[Solarized](http://ethanschoonover.com/solarized/files/solarized.zip) is a set of nice, readable colors. Unzip the `solarized.zip` file.

Now, inside iTerm2 go to iTerm > Preferences > Profiles and select "Default." Choose "Colors" and find the "Color Presets…" button in the lower-right-hand corner of the window. Select "Import" and navigate to `solarized/iterm2-colors-solarized/` and double-click on `Solarized Dark.itermcolors`. After it's been imported, you can find "Solarized Dark" on the "Load Presets" list. Click and select "Solarized Dark" to change the colors appropriately.

![You can edit your theme from the Preferences menu](/img/posts/a2_solarized.png)

See? Much nicer.


## Appendix 3: Postgres and PostGIS

**TKTK... to add link to blog about my talk at NACIS?**

We occasionally make maps and analyze geographic information, so that requires some specialized tools. This appendix will show you how to install the Postgres database server and the PostGIS geography stack &mdash; which includes several pieces of software for reading and manipulating geographic data.

While you can install Postgres using Homebrew, the easiest way to manage Postgres on your Mac is with Postgres.app. This application provides a very basic GUI around the database, and sits in your menu bar to show whether the database is running. It also comes with useful extensions baked in, including PostGIS.

[Download and install Postgres.app from its website.](https://postgresapp.com/)


## Conclusion
And with that you now have a sweet hackintosh. Happy hacking, and if you haven't setup a [Github](https://github.com/) account, you can try out your new tools and [play with some of our code](https://github.com/nprapps). Github provides [a thorough walkthrough](https://help.github.com/) to get you setup and working on some open sourced projects.
