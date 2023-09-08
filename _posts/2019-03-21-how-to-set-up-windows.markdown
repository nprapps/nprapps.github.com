---
layout: post
title: "How to setup Windows to develop news apps"
description: "What you need to work on our new, Node-based projects"
author: Thomas Wilburn
email: twilburn@npr.org
twitter: thomaswilburn
---

Traditionally, the NPR news apps team has worked on Macs, and we've always been [open about how to set those up](http://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html) and use our tools. Now that we've begun moving some of our apps to a Node-based foundation, it's possible to also run them on Windows. Here’s how to set up a Windows machine for development the NPR way.

## Chapter 0. Prerequisites

Just as with our OS X setup, you will need to have admin privileges. If it's not a personal computer, talk to your IT department about getting access, or having them help you through the installation process. However, it's a good idea to be a permanent administrator in case you need to install additional tools or upgrade any of the installed components.

## Chapter 1. Editors

As on a Mac, you can edit code from the command line using Vim or Nano. However, you may be better off using a graphical editor that provides syntax highlighting, formatting plugins and Git integration. A few choices that are available:

* [Atom](https://atom.io/) - Free and open-source, from GitHub.
* [Visual Studio Code](https://code.visualstudio.com/) - Free and open-source, from Microsoft.
* [Sublime Text](https://www.sublimetext.com/) - A classic, this editor isn't free, but it is fast, well-supported and regularly updated.

Whichever editor you choose, we recommend installing a few plugins if the functionality isn't already built in:

* Syntax highlighting for LESS styles and EJS templates
* Code formatting using [Prettier](https://prettier.io/) to match our [best practices](https://github.com/nprapps/bestpractices/blob/master/javascript.md)
* A terminal view for the Bash shell (which brings us to our next step!)

## Chapter 2. Git yourself a shell

Windows works a lot differently from a UNIX-like system (such as OS X or Linux). While that's not necessarily a bad thing, our first task is going to be normalizing the basic user experience. In this case, that means installing a Bash shell, instead of using Powershell or the Windows command line. The easiest way to get that done is by installing Git, since we'll find that useful anyway.

From [Git's download page](https://git-scm.com/download), you can get an installer (use the top set of links, not one of the GUI clients). Accept the default options when you run it, except for a couple of changes:

* If you're not familiar with Vim, pick Nano or your editor of choice when it asks for the default text editor.
* Choose the option to install additional UNIX tools. It will warn you that the default find/sort utilities will be overridden, which is fine.

Once the process completes, you should have a start menu option for Git Bash, which will open a shell window just like the OS X terminal. This is a normal Bash shell, which means that it can be configured in the same way (say, by editing your `.bashrc` and `.bash_profile` files), and it even comes with a number of useful utilities (such as AWK, sed, grep, and ssh). You can also open this by right-clicking in a folder and choosing "Git Bash here."

Inside the Bash shell, Windows will work similarly to a standard UNIX environment, but there are still some exceptions to be aware of:

* Dotfiles (such as `.bashrc`) will not be hidden, because Windows uses a file attribute to indicate file visibility instead.
* Your home directory (aliased as `~` in the shell) will be the same as your Windows user directory, located by default at `C:/Users/USERNAME`.
* Git Bash doesn't understand Windows drive letters, so it mounts them as folders off the root instead. For example, `C:\Users` will be at `/c/Users`.
* Environment variables set from Windows will be inherited when you enter the shell. This means you can set AWS tokens or Google OAuth creds for both Windows and UNIX environments using a tool like [RapidEE](https://www.rapidee.com/en/about).

Although this shell will technically cover your Git needs, I also like to install the [GitHub Desktop](https://desktop.github.com) application, which makes it a lot easier to sign into your account and perform basic tasks (cloning, push/pull and merges). You can still drop down to the command line if you need to (and often you will).

## Chapter 3. Node

We install Node on Windows using the [official package](https://nodejs.org). The “current” version  will be more advanced (vs. the “stable” version) and may include new syntax or features that can be useful. When it's time to upgrade, just install a new version over the old one. Unfortunately, there isn’t a Windows equivalent of [nvm](https://github.com/creationix/nvm) for switching between Node versions.

Node should add itself to the system PATH automatically, but existing shells and terminals won't pick up on that until you close them all and re-open them (it may be easiest to reboot after installing Node, just to be sure). Once you do, you should be able to run `node --version` and `npm --version` to verify that everything is working correctly.

Installing modules globally has gone out of fashion in the Node community, but if you're going to be working with our tools you may want to have a few utilities available. To install the Grunt build command, its template system, the Prettier source linter, and the LESS stylesheet compiler, you can run:

    npm i -g less grunt-cli grunt-init prettier

With Node and those packages installed, you're mostly good to go! However, you may want to take one more step for the complete NPR news apps experience.

## Chapter 4. Python

Historically, Python on Windows has been kind of a mess, and it still doesn't always fit cleanly into the ecosystem. Our newer tools aren't based on Python, so you can consider this an optional step. That said, there are a lot of news nerd utilities, like [Elex](https://github.com/newsdev/elex) that make it worth installing--plus many data cleaning tasks are naturally suited to it.

There are several ways to install Python on Windows, but the easiest is probably to use Miniconda, a minimal version of the data-oriented Anaconda project. Miniconda lets you switch easily between Python 2/3 environments. It also includes an installer for precompiled packages.

Run the [installer on the project page](https://docs.conda.io/en/latest/miniconda.html), either the Python 2 or 3 version. Make sure to **check the box that adds it to your path**. This is marked as "not recommended," but without it you'll have to run Python from its own dedicated shell, which is cumbersome when using it with other languages or tools. Also add the following line to your `.bashrc` file, which will initialize the `conda` command:

```sh
# add to your .bashrc file
. ~/Miniconda/etc/profile.d/conda.sh
```

Once Miniconda is set up, you can create an environment for whichever Python version didn't come with the installer. For example, I usually install Python 3 as the default, so I want to set up a secondary environment that runs Python 2. To do this, we'll use Miniconda's `conda` tool to create and activate it:

```sh
# -n sets the name for the environment
conda create -n python2 python=2.7

# switch to that environment when we need to run Python2 code
conda activate python2

# deactivate to go back to the base install
conda deactivate
```

If you installed Python 2 as the default package, you can use the same basic commands, but set `python=3.4` when creating the environment to get access to Python 3.

Within these Conda environments, you should still use `virtualenv` to manage and isolate your dependencies, just as in [the OS X instructions](http://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html#chapter-2-install-python-2-and-virtualenv). Make sure you run `pip install virtualenv virtualenvwrapper` from the base Conda environment, and then add the following line to your `.bashrc`:

```sh
source ~/Miniconda3/Scripts/virtualenvwrapper.sh
```

Finally, for either environment, you may need the correct Visual C++ compiler installed for some libraries to install correctly from pip:
[Visual C++ compiler for Python 2.7](https://aka.ms/vcpython27)
[Visual C++ compiler for Python 3.4](https://visualstudio.microsoft.com/downloads/) (download the "Build Tools for Visual Studio 2017" under the "Tools for Visual Studio 2017" section)

## Happy hacking!

There are some additional tools on a Windows machine that you may want to look into, such as the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/faq), which will let you run Linux programs (such as Ruby, web servers, or analysis tools). You can also use our Vagrant configuration, [Cypher](https://github.com/nprapps/cypher), to run a Linux VM pre-configured for our older, Python-based tools. However, the above instructions are enough to get you started and ready to use our [Dailygraphics Next rig](https://github.com/nprapps/dailygraphics-next) or [the interactive template](https://github.com/nprapps/interactive-template). Good luck!

