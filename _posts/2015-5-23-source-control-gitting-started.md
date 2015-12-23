---
layout: default_post
title: "Git Good: Source Control"

categories:
- Programming
---

In this post:

* Source Control/Git Intro
* Tools for Git
* Super Useful Command-Line Commands!

<!---
<!–end_preview–>
-->


What is source control?
-----------
Think back to high school: it's two a.m. and you're writing an essay in Word'98. You get to the end of your conclusion and realize that you've missed the page requirement. You start thesaurousing as hard as you possible can, you change the margins and font size. But alas, you don't make it. Now, you start rewriting things to make them longer. You read it again and decide, 'wow that was a mistake' and hold CTRL-Z until everything is fine again.

Now, suppose you wanted CTRL-Z for code. It would need to occur for more than one line at a time, each 'logical change'. It would need to handle multiple people working on the same code at the same time. And so on. That's basically source control.

For more see:

* [Joel on Software wiki](http://discuss.joelonsoftware.com/default.asp?W190)
* [Wikipedia - Revision Control](http://en.wikipedia.org/wiki/Revision_control)


Git?
------------
There's infinity solutions to this problem, but right now the clear winner for source control software is [Git](http://en.wikipedia.org/wiki/Git_(software)).

The most common place to host a Git project is [GitHub](http://www.github.com). Almost all hosting providers have a 'free' tier of service with the caveat that your repository will be public. Private github accounts start at 5 repositories @ $7/month. If you're too cool for that, you can use a [local remote repository](http://treeleafmedia.be/blog/2011/03/creating-a-new-git-repository-on-a-local-file-system/) or set up your own git server (supposing you have a [DreamHost account](http://wiki.dreamhost.com/Git) or something) 

There's two ways to use git:

* Command Line ([tutorial](https://try.github.io/levels/1/challenges/1))

   Recommended! It'll often be faster to use a GUI for most operations. However, when things go awry there's no way that debugging with a GUI will be faster than the spamming 'uhh what if I do this' commands at the prompt.

   Also, enable [git rerere](https://git-scm.com/blog/2010/03/08/rerere.html).

   You can also enable [rebase by default](http://stevenharman.net/git-pull-with-automatic-rebase), if you're into that.

   More options [here](https://git-scm.com/book/tr/v2/Customizing-Git-Git-Configuration). Highlighting and a merging tool are both recommended.

* GUI tools. 

   Github has a free client for each major platform. Because it errs on the side of being user friendly, it isn't quite as efficient to use other options.

   For OS X, I've personally used the free [SourceTree](https://www.sourcetreeapp.com/) and [GitX-dev](http://rowanj.github.io/gitx/). Both offer more industrial layouts that make it faster to work with branches, tags and submodules. GitX-dev 

   Be careful to download GitX-dev instead of GitX, only the former is still being maintained and the latter lacks many great features.


Ignoring files
-----------
You're going to want to ignore certain files in your git repo.

Common files to ignore are:

* per-user configurations (not to be shared with teams) and
* temporary files (from the editor of whatever you're doing).

Open the .gitigonore file in your repo to include the files you want to exclude.

You can also get .gitignore templates for tools (IDEs, environments, etc) [here](https://www.gitignore.io/).


Less Obvious Commands
----------
Many of these you may want to ALIAS into a macro in your bash_profile / zshrc. In order of most obvious to least:

* `git checkout -- filename`.

   Undo changes for a particular file.

* `git reset HEAD filename`.

   Unstage changes for a particular file.

* `git add -A`.

   Stage all changes to the current repo. Suppose you ran a script that modified or deleted hundreds of files in the repo.

* `git clean -fd`.

   Delete all files in your repo that are not already a part of your repo or staged.

* `git reset --hard head`.

   Undo all unstaged changes to files that are a part of your repo.

* `git submodule foreach --recursive git reset --hard`.

   The above, but recursive. useful for reverting overly agressive changes (e.g. find and replace).

* `git rebase -i refA`. Rebase on top of a branch interactively. Use this to combine, throw out or rename commits.

* `git reflog`.

   Shows the history of changes. Useful when, say, you accidentally delete a branch.

* `git log refA...refB`.

   Show the log of differences between two branches.

* `git log --pretty=format:"%h - %an : %s"`.

   Show an abbreviated log. More options [here](http://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History).


Handling Multiple Github Accounts
----------
An advanced topic and probably not an issue for most people. Disclosure: I didn't find a way to master this, but was able to get what I needed to done.

A gist on the topic [here](https://gist.github.com/jexchan/2351996).

Commands that will probably help you:

* `ssh-add _path_to_your_rsa_key`. adds an identity.
* `ssh-add -l`. lists available identities.
* `ssh-add -d`. deletes an identity.


Appendix
---------
Some other stuff that may be useful:

* [GitHub's command cheat sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
* [Git Hooks](http://git-scm.com/docs/githooks) can be used to enforce rules and behaviors within the repo (e.g. Minimum commit message length, automatically dumping saving the hash of a particular file, etc).
* [Using Git Patches](https://ariejan.net/2009/10/26/how-to-create-and-apply-a-patch-with-git/).