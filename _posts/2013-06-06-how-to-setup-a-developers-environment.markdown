
---
layout: post
title: "How to Setup Your Mac to Develop News Applications Like We Do"
description: "(Almost) everything you always wanted to know about working from the command line, but were too afraid to ask."
author: Gerald Rich
email: grich@npr.org
twitter: gerald_arthur
---

After 8 years, and countless revisions, we're finally reposting our step by step guide to setting up your machine the way we do at NPR Apps. Like the [classic version](https://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html), first authored in 2013 by [Gerald Rich](https://twitter.com/newsroomdev), this will be a living document, repeatedly updated as systems and software update. 

[Geoff Hing](https://twitter.com/geoffhing), [David Eads](https://twitter.com/eads), [Livia Labate](https://twitter.com/livlab), [Tyler Fisher](https://twitter.com/tylrfishr), [Shelly Tan](https://twitter.com/Tan_Shelly), [Helga Salinas](https://twitter.com/Helga_Salinas), [Juan Elosua](https://twitter.com/jjelosua), [Miles Watkins](https://github.com/mileswwatkins), [Thomas Wilburn](https://twitter.com/thomaswilburn) and [Daniel Wood]() have also contributed to this post.

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

## Chapter 2: Installing Python and Virtual environments with anaconda

Python is notoriously tricky to install and manage on your machine. XKCD did it justice with this cartoon...

[![](https://imgs.xkcd.com/comics/python_environment.png)](https://xkcd.com/1987/)

macOS comes with a system version of Python, and for a long time, we used this version. However, modifying the system Python is **a bad idea**; user alterations or installations may cause core macOS components to break, and macOS system updates may cause user projects to break.

Thus, we need to utilize virtual environments to select our python versions, and allow easy swapping between environments, and tidy maintenance of dependencies and packages. Historically, many of our team's projects used **Python 2.7.x**, so if you're on our team, you will need to be able to access it for legacy projects. Modern tools and documentation tends to use **Python 3**, so it will be good to have that handy as well. 

To create well supported and fairly simple to install virtual environments, we're going to utilize [anaconda](https://docs.anaconda.com/). To start with, follow the instructions for the [graphical installer](https://docs.anaconda.com/anaconda/install/mac-os/). Here's a [cheatsheet](https://docs.conda.io/projects/conda/en/4.6.0/_downloads/52a95608c49671267e40c689e0bc00ca/conda-cheatsheet.pdf) for anaconda commands. 

Open terminal to verify installation. If you already have a terminal window open, you'll have to restart terminal or type `source ~/.zshrc`. Type `conda env list` to see a list of environments. At this point, the only environment should be your base environment. Next create an environment to run python 2.7.x in. I used 2.7.18 because that's what worked for me. 


	conda create --name py2 python=2.7.18


You can name it whatever you want. I went with `py2`. This will take a moment. When prompted type `y` to proceed. Next, activate this environment. 

	conda activate py2

To test that the correct python version is being used, type `python --version`. The result should be `Python 2.7.18 :: Anaconda, Inc.` or similar. If you see 3.x, something has gone wrong. 

Deactivate this environment by running `conda deactivate`.

### Installing Jupyter notebook and pandas

It may be useful to install [Jupyter notebook](https://jupyter.org/index.html) for data analysis. Before doing this, let's create and and activate environment for this to live in. You can create a single environment to always run Jupyter notebook, or you can create a new environment each time you start a new Jupyter notebook project.


	conda create --name jupyterExample python=3.9
	conda activate jupyterExample

Now if you type `conda env list` you should see the following (paths may be slightly different):


	# conda environments:
	#

	base				 /Users/username/opt/anaconda3
	jupyterExample	  *  /Users/username/opt/anaconda3/envs/jupyterExample
	py2  		 		 /Users/username/opt/anaconda3/envs/py2


Now its time to [install Jupyter](https://jupyter.org/install). I'm installing notebook here but feel free to experiment with JupyterLab as well. I followed this [installation guide](https://towardsdatascience.com/how-to-set-up-anaconda-and-jupyter-notebook-the-right-way-de3b7623ea4a). 

	conda install -c conda-forge notebook  
	conda install -c conda-forge nb_conda_kernels

Hit `y` whenever prompted and let it run, which might take a moment. Then start up your notebook by running

	jupyter notebook

This should allow you to load up a graphical user interface at `http://localhost:8888/`. 

Next, install pandas for use within your notebook. 
	
	conda install pandas

Now you should be able to get started with pandas inside your notebook. 

### Troubleshooting

Conda and conda-forge won't have every package you want for python, but they will have most. Whenever installing python packages inside a anaconda environment, use `conda install` or `conda install -c conda-forge` whenever possible. If this isn't possible, use `pip`. 

## Chapter 3: Set up Node and install LESS

Many of our tools require Node, which runs JavaScript on the desktop or server. For example, our older projects compile CSS from a dialect called LESS, and our newer projects are built entirely on top of Node. The best way to install Node is using `nvm`, which lets you easily upgrade and switch between Node versions.

Install `nvm` with this line. It will ask you to update your shell config, or close and re-open your terminal after it completes.

	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

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
