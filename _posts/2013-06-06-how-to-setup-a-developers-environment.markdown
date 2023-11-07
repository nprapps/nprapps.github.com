---
layout: post
title: "How to Set Up Your Mac to Develop News Applications Like We Do"
description: "(Almost) everything you always wanted to know about working from the command line, but were too afraid to ask."
author: News Apps team
email: nprapps@npr.org
twitter: nprviz
---

_**Last updated Nov. 7, 2023.** We've overhauled our step-by-step guide to setting up your machine the way we do on the NPR News Apps team. This edition is by [Daniel Wood](https://twitter.com/danielpwwood), with notes from Ruth Talbot, [Rina Torchinsky](https://twitter.com/rinatorchi), [Nick Underwood](https://twitter.com/mulletmapping), Koko Nakajima and Brent Jones._

_First authored in 2013 by [Gerald Rich](https://twitter.com/newsroomdev), this page continues to be a living document, updated as systems and software update. [Geoff Hing](https://twitter.com/geoffhing), [David Eads](https://twitter.com/eads), [Livia Labate](https://twitter.com/livlab), [Tyler Fisher](https://twitter.com/tylrfishr), [Shelly Tan](https://twitter.com/Tan_Shelly), [Helga Salinas](https://twitter.com/Helga_Salinas), [Juan Elosua](https://twitter.com/jjelosua), [Miles Watkins](https://github.com/mileswwatkins) and [Thomas Wilburn](https://twitter.com/thomaswilburn) have contributed over the years._

The following steps assume you're working on a new Mac with macOS Catalina 10.15 or more recent. These directions should generally be applicable for anything more recent than Catalina as well.

_**Note:** If there are two lines inside any of the code blocks in this article, paste them separately and hit enter after each of them._

## Chapter 0: Prerequisites

### Are you an administrator?
We'll be installing a number of programs from the command line in this tutorial, so that means you must have administrative privileges. If you're not an admin, talk with your friendly IT Department.

Click on the Apple menu > System Preferences > Users & Groups and check your status against this handy screenshot.

![Are you an admin?](/img/posts/admin_dw.png)

### Update your software
Go to the App Store and go to the updates tab. If there are system updates, install and reboot until there is nothing left to update.

### Install command line tools
The command line tools from Apple provide a *crucial* suite of tools you'll need to use version control (git) and Python. The main commands you may come across that come from command line tools are `git`, `make`, `clang`, and `gcc`.

All Macs come with an app called "Terminal." You can find it under Applications > Utilities. Double click to open it, (or hit `cmd-space` and type "terminal"). Once it's booted, run this command:

```
xcode-select --install
```

Your laptop should prompt you to install the command line tools. The process should take about 5 minutes.

If it doesn't install, or there isn't an update for Xcode to install the tools, you'll have to download the command line tools from [developer.apple.com/downloads/index.action](http://developer.apple.com/downloads/index.action). You have to register, or you can log in with your Apple ID.

Search for "command line tools," and download the most recent package. Double click on the .dmg file in your Downloads folder, and proceed to install.

![Screen cap of command line tools download page](/img/posts/commandlinetools-132.png)

If you ever run into some variation of a 'user does not have permission' error when running a command in the terminal, you may want to prefix the command with `sudo`. For example, the above command would be run as:

```
sudo xcode-select --install
```

After you enter in your administrator password, these installations should proceed as normal. But using sudo is powerful magic, and should be used with caution. For example, generally you do not want to run `sudo pip` or `sudo npm`.

## Chapter 1: Install Homebrew

[Homebrew](http://brew.sh/) is like the Mac app store for programming tools. You can access Homebrew via the terminal ([like all good things](http://www.amazon.com/Beginning-was-Command-Line-Neal-Stephenson/dp/0380815931)). Inspiration for this section comes from Kenneth Reitz's excellent [Python guide](http://docs.python-guide.org/en/latest/starting/install/osx/).

Install Homebrew by pasting this command into your terminal and then hitting "enter."

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It will ask for your password, so type that in and hit "enter" again. Pay attention to any prompts at the end of the process to add Homebrew to your PATH.

Once that's done, paste this line to test Homebrew:

```
brew doctor
```

This will test your Homebrew setup, and any tools you've installed to make sure they're working properly. If they are, Homebrew will tell you:

```
Your system is ready to brew.
```

If anything isn't working properly, follow their instructions to get things working correctly.

Next you'll need to go in and edit  `~/.zshrc` to ensures you can use what you've just downloaded. `.zshrc` acts like a configuration file for your terminal.

_**Note:** There are many editors available on your computer. You can use a pretty graphical editor like [Sublime Text](https://www.sublimetext.com/), or you can use one built-in to your terminal, like [`vim`](http://www.vim.org/docs.php) or [`nano`](http://www.nano-editor.org/dist/v2.2/nano.html). We'll be using `nano` for this tutorial just to keep things simple. If you'd rather edit in Sublime Text, go to the [appendix](#appendix-2-supe-up-your-terminal-game) to learn how to open a file with the `edit FILE_NAME` command._

Open your `.zshrc` with the following command.

```
nano ~/.zshrc
```

_**Note:** On older MacOS systems, the shell was `bash`, but MacOS changed it to `zsh` in v10.15 (Catalina). If you're using an older OS, instead of editing `~/.zshrc`, you'll want to `nano ~/.bash_profile`._

Then copy and paste this line of code at the very top. This lets Homebrew handle updating and maintaining the code we'll be installing.

```
export PATH=/usr/local/bin:$PATH
```

Once you've added the line of code, you can save the file by typing `control + O`. Doing so lets you adjust the file name. Just leave it as is, then hit enter to save. Hit `control + X` to exit. You'll find yourself back at the command line and needing to update your terminal session like so. Copy and paste the next line of code into your terminal and hit enter.

```
source ~/.zshrc
```

You'll only need to source the `.zshrc` since we're editing the file right now. It's the equivalent of quitting your terminal application and opening it up again, but `source` lets you soldier forward and setup Python.

## Chapter 2: Installing Python and virtual environments with Anaconda

Python is notoriously tricky to install and manage on your machine. [XKCD did it justice](https://xkcd.com/1987/) with this cartoon...

[![](https://imgs.xkcd.com/comics/python_environment.png)](https://xkcd.com/1987/)

macOS comes with a system version of Python, and for a long time, we used this version. However, modifying the system Python is **a bad idea**: User alterations or installations may cause core macOS components to break, and macOS system updates may cause user projects to break.

Thus, we need to utilize virtual environments to select our Python versions, allow easy swapping between environments, and tidily maintain dependencies and packages. Modern tools and documentation tend to use **Python 3**. If you're on our team, you'll also need **Python 2.7.x** for legacy projects.

We're going to use [Anaconda](https://docs.anaconda.com/) to manage our virtual environments. Follow the instructions for the [graphical installer](https://docs.anaconda.com/anaconda/install/mac-os/). Here's a [cheatsheet](https://docs.conda.io/projects/conda/en/4.6.0/_downloads/52a95608c49671267e40c689e0bc00ca/conda-cheatsheet.pdf) for Anaconda commands.

Once you've run through those steps, open Terminal to verify installation. (If you already have a terminal window open, restart terminal or type `source ~/.zshrc`.)

Then, type `conda env list` to see a list of environments. At this point, the only environment should be your base environment. Next create an environment to run python 2.7.x in. I used 2.7.18 because that's what worked for me.

```
conda create --name py2 python=2.7.18
```

If you're working with an M1- or M2-based Mac, you may get a `PackageNotFound` error when installing Python 2.7.X.

To solve this ([per Stackoverflow](https://stackoverflow.com/a/67569068)), explicitly specify the environment by prefixing the command with `CONDA_SUBDIR=osx-64`

The full command is:

```
CONDA_SUBDIR=osx-64 conda create --name py2 python=2.7.18
```

You can name it whatever you want. I went with `py2`. This will take a moment. When prompted type `y` to proceed. Next, activate this environment.

```
conda activate py2
```

To test that the correct python version is being used, type `python --version`. The result should be `Python 2.7.18 :: Anaconda, Inc.` or similar. If you see 3.x, something has gone wrong.

Deactivate this environment by running `conda deactivate`.

### Installing Jupyter Notebook and pandas

It may be useful to install [Jupyter Notebook](https://jupyter.org/index.html) for data analysis. Before doing this, let's create and and activate environment for this to live in. You can create a single environment to always run Jupyter notebook, or you can create a new environment each time you start a new Jupyter notebook project.

```
conda create --name jupyterExample python=3.9
conda activate jupyterExample
```

Now if you type `conda env list` you should see the following (paths may be slightly different):

```
# conda environments:
#

base                 /Users/username/opt/anaconda3
jupyterExample	  *  /Users/username/opt/anaconda3/envs/jupyterExample
py2                  /Users/username/opt/anaconda3/envs/py2
```

Now it's time to [install Jupyter](https://jupyter.org/install). I'm installing notebook here but feel free to experiment with JupyterLab as well. I followed this [installation guide](https://towardsdatascience.com/how-to-set-up-anaconda-and-jupyter-notebook-the-right-way-de3b7623ea4a).

```
conda install -c conda-forge notebook  
conda install -c conda-forge nb_conda_kernels
```

Hit `y` whenever prompted and let it run, which might take a moment. Then start up your notebook by running

```
jupyter notebook
```

This should allow you to load up a graphical user interface at `http://localhost:8888/`.

Next, install pandas for use within your notebook.

```
conda install pandas
```

Now you should be able to get started with pandas inside your notebook.

### Troubleshooting

Conda and conda-forge won't have every package you want for Python, but they will have most. Whenever installing Python packages inside an Anaconda environment, use `conda install` or `conda install -c conda-forge` whenever possible. If this isn't possible, use `pip`.

## Chapter 3: Set up Node and install LESS

Many of our tools require Node, which runs JavaScript on the desktop or server. For example, our older projects compile CSS from a dialect called LESS, and our newer projects are built entirely on top of Node. The best way to install Node is using `nvm`, which lets you easily upgrade and switch between Node versions.

Install `nvm` with this line. It will ask you to update your shell config, or close and re-open your terminal after it completes.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Once that's done, you can use `nvm` to install Node:

```
nvm install stable
```

You may want to install a couple of helper libraries for working with our projects. The `-g` flag means that they're globally installed, so that they become available as command-line executables:

```
npm install -g less grunt-cli grunt-init prettier
```

Next we'll set up [GitHub](https://help.github.com/articles/set-up-git).

## Chapter 4: Configure git

### Set up SSH for GitHub

GitHub has written a great guide for setting up SSH authentication for GitHub. You will want to do this so GitHub knows about your computer and will allow you to push to repositories you have access to.

[Read that tutorial here](https://help.github.com/articles/generating-ssh-keys), starting at "Step 1: Check for SSH keys".

### Configure the default identity

It's nice to have your name and email show up correctly in the commit log. To make sure this information is correct, run:

```
git config --global user.email "$YOUR_EMAIL@npr.org"
git config --global user.name "$YOUR_NAME"
```

You can also make your GitHub client try to rebase instead of merge when you commit before syncing, which helps prevent extraneous merge commits in the history.

```
git config --global pull.rebase true
```

You can also use the [GitHub Desktop](https://desktop.github.com) app to manage your repositories, since it will make it easier to check diffs or browse through repo history.

After that, you can treat yourself to a cup of coffee because you now have the basic tools for working like the NPR News Apps team.

## Appendix 1: The Text Editor
Since your code is stored entirely as text files on your computer, you'll want a nice text editor. Our instructions showed you how to use `nano`, a terminal-based text editor that you'll find on almost every computer. However, there are a few others that the team uses. Text editors are like the Microsoft Word of the programming world, except they come packed with all kinds of handy dandy features to make writing code a cinch.

### Sublime Text
[Sublime Text](https://www.sublimetext.com) is another GUI-based editor with a nice interface and some [customizations](http://net.tutsplus.com/tutorials/tools-and-tips/sublime-text-2-tips-and-tricks/) available. You'll likely want to learn some [keyboard shortcuts](http://docs.sublimetext.info/en/latest/reference/keyboard_shortcuts_osx.html) to make yourself more efficient. You can also prettify it with the [Flatland theme](https://github.com/thinkpixellab/flatland).

_**Note:** Speed up your use by making Sublime Text your default editor from the command line. See the terminal section below to see what to add to your `.zshrc`._

### Vim
Vim is a terminal based editor that requires you to type rather than point-and-click to work on files. vim and vi (vim stands for "vi improved") are likely to be available on any Linux server to which you may find yourself connecting, so it's not a bad idea to be familiar with how they work.

There's a lot of little keyboard shortcuts you'll need to get comfy with before you can just dive-in. Here's a resource to become more acquainted with vim: [Vim Tips Wiki](http://vim.wikia.com/wiki/Vim_Tips_Wiki).

A version of vim is already on your computer -- just type `vim` at in the terminal to get started. To get a more up-to-date version, install vim via Homebrew:

```
brew install vim
```

You can add all kinds of features with plugins. Former teammate Chris Groskopf recommends [nerdtree](https://github.com/scrooloose/nerdtree) and [surround](https://github.com/tpope/vim-surround). Here are [some videos](http://net.tutsplus.com/sessions/vim-essential-plugins/) to walk through those particular add-ons.

There's also [Janus](https://github.com/carlhuda/janus), a vim distribution that comes with a number of useful plugins preinstalled and with some useful configuration presets. Former teammate Geoff Hing has built up a vim configuration over the years, which you can find [here](https://github.com/ghing/vim-config/blob/master/vimrc). It uses [Vundle](https://github.com/VundleVim/Vundle.vim) to manage installing plugin packages. [Pathogen](https://github.com/tpope/vim-pathogen) is another popular option and Vim 8 has [built-in package management support](https://shapeshed.com/vim-packages/).

_**Note:** If you've found yourself stuck in a vim editor and just want to get out of it, here's [how to quit vim](https://stackoverflow.com/questions/11828270/how-do-i-exit-the-vim-editor?_ga=2.187389281.895596097.1641914029-1781576885.1641914029)._

### Configure your default editor for git

Regardless of which editor you prefer, you should [set the default editor used by git](https://git-scm.com/book/en/v2/Appendix-C%3A-Git-Commands-Setup-and-Config). This way, if you run `git commit` without the `-m` option, an editor will be opened so you can type a descriptive, nicely-formatted commit message.

You can do this with this command:

```
git config --global core.editor $PATH\_TO\_EDITOR
```

For example, you can use the `which` command to easily find the path to `vim`:

```
git config --global core.editor $(which vim)
```

## Appendix 2: Soup up your terminal game

Working in the terminal is a crucial part of our workflow. So soup it up to make it something that you enjoy using. Here are a few *optional* things to do to enhance your terminal experience.

### Add aliases to speed up your work

Adding aliases to your `.zshrc` files allows you to type short commands for commands you frequently use. Here are a few aliases I use, followed by their descriptions. Paste the following into your `.zshrc` and edit them to your file paths.

```bash
#Aliases
alias edit="open -a /Applications/Sublime\ Text.app"
alias ogit="open \`git remote -v | grep git@github.com | grep fetch | head -1 | cut -f2 | cut -d' ' -f1 | sed -e's/:/\//' -e 's/git@/http:\/\//'\`"
alias sites="cd /PATH/TO/ANY/FREQUENTLY/USED/DIRECTORIES"
```

* `edit`: To open any file or folder in Sublime Text, type `edit file-or-folder/path`. You can replace the path there with any text editor you want to use.
* `ogit`: If you're in a directory that is version controlled remotely on github, you can run `ogit` inside that directory to open up that github page in your default browser. For instance if I run `ogit` in my `dailygraphics-next` directory it will open up https://github.com/nprapps/dailygraphics-next.
* The final example above is a boilerplate example of how you can set up shortcuts to commonly accessed directories. I have one for my sites folder and one for my daily graphics folder.

You can also use something like [oh-my-zsh](https://ohmyz.sh/) to format your terminal in helpful ways and provide good tab completion. There are many [themes](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes) to choose from.

### Consider an alternative to the default terminal, like iTerm2
Alternatively, you can download an alternative terminal, like[iTerm2](http://www.iterm2.com/#/section/home). The built-in terminal application which comes with your Mac is fine, but iTerm2 is slicker and more configurable. One of the better features is splitting your terminal into different horizontal and vertical panes: one for an active pane, another for any files you might want to have open, and a third for a local server. ([There's an example in the dailygraphics-next repo,](https://github.com/nprapps/dailygraphics-next#getting-started-in-more-detail) under "terminal shortcut.")

[Solarized](http://ethanschoonover.com/solarized/files/solarized.zip) is a set of nice, readable colors for iTerm2. Unzip the `solarized.zip` file. Then, inside iTerm2 go to iTerm > Preferences > Profiles and select "Default." Choose "Colors" and find the "Color Presets…" button in the lower-right-hand corner of the window. Select "Import" and navigate to `solarized/iterm2-colors-solarized/` and double-click on `Solarized Dark.itermcolors`. After it's been imported, you can find "Solarized Dark" on the "Load Presets" list. Click and select "Solarized Dark" to change the colors appropriately.

![You can edit your theme from the Preferences menu](/img/posts/a2_solarized.png)

See? Much nicer.


## Appendix 3: More helpful software

These are by no means required and should be added as needed, but here are some things our team frequently uses.

Data Analysis:
- [Postgres and PostGIS](https://postgresapp.com/), great for heavy duty data analysis
- [csvkit](https://github.com/wireservice/csvkit), originally developed by former teammate Chris Groskopf, great for analyzing and working with large csvs
- [Tabula](https://tabula.technology/), great for extracting data from PDFs
- [SQLiteStudio](https://sqlitestudio.pl/) if you particularly enjoy parsing data with SQL

Maps:  
-   [QGIS](https://www.qgis.org/en/site/) of course!
-   [Mapshaper](https://mapshaper.org/) for simplifying geo layers
-   [Mapshaper command line](https://github.com/mbloch/mapshaper/wiki/Command-Reference), even more cosmic power than the web interface. A ton of utilities for creating maps and map layers from the command line.
-   PostGIS (see above)
-   [Blender](https://www.blender.org/) for hillshades or oblique views
-   [GDAL](https://gdal.org/index.html) command line tools. Much of this is packaged inside of QGIS, but the command line tool can be useful, separately for scripting. [Here](https://github.com/dwtkns/gdal-cheat-sheet) a cheat sheet of useful commands.
- [Imagemagick](https://imagemagick.org/script/command-line-tools.php) and [ffmpeg](https://ffmpeg.org/ffmpeg.html) command line tools, great for optimizing images and videos.

Design:
- [Color Oracle](https://colororacle.org/) for helping test the color accessibility of your screen.
- [ai2html](http://ai2html.org/) for getting .ai into....uh... .html....it's right there in the name.
- [svg crowbar](https://nytimes.github.io/svg-crowbar/) for getting d3 and other svg graphics out of the browser.  

## Conclusion
And with that you now have a sweet hackintosh. Happy hacking!
