---
layout: default_post
title: "Source Control: Gitting Started"

categories:
- Programming Tools
---

What is source control?
-----------
Think back to high school: it's two a.m. and you're writing an essay in Word'98. You get to the end of your conclusion and realize that you've missed the page requirement. You start thesaurousing as hard as you possible can, you change the margins and font size. But alas, you don't make it. Now, you start rewriting things to make them longer. You read it again and decide, 'wow that was a mistake' and hold CTRL-Z until everything is fine again.

Now, suppose you wanted CTRL-Z for code. It would need to occur for more than one line at a time, each 'logical change'. It would need to handle multiple people working on the same code at the same time. And so on. That's basically source control.

For more see:
[Joel on Software wiki](http://discuss.joelonsoftware.com/default.asp?W190)
[Wikipedia - Revision Control](http://en.wikipedia.org/wiki/Revision_control)


Git?
------------
There's infinity solutions to this problem, but right now the clear winner for source control software is [Git](http://en.wikipedia.org/wiki/Git_(software)) and the most common place to host a Git project is [GitHub](http://www.github.com).


There's two ways to use git:

* Command Line ([tutorial](https://try.github.io/levels/1/challenges/1))

   Recommended! It'll often be faster to use a GUI for most operations. However, when things go awry there's no way that debugging with a GUI will be faster than the spamming 'uhh what if I do this' commands at the prompt.

   Also, enable [git rerere](https://git-scm.com/blog/2010/03/08/rerere.html).

   You can also enable [rebase by default](http://stevenharman.net/git-pull-with-automatic-rebase), if you're into that.

   More options [here](https://git-scm.com/book/tr/v2/Customizing-Git-Git-Configuration). Highlighting and a merging tool are both recommended.

* GUI tools. 

   Github has a free client for each major platform. Because it errs on the side of being user friendly, it isn't quite as efficient to use other options.

   For OS X, I've personally used the free [SourceTree](https://www.sourcetreeapp.com/) and [GitX-dev](http://rowanj.github.io/gitx/). Both offer more industrial layouts that make it faster to work with branches, tags and submodules.

   Be careful to download GitX-dev instead of GitX, only the former is still being maintained and the latter lacks many great features.


Ignoring files
-----------
You're going to want to ignore certain files in your git repo.

Common files to ignore are
* per-user configurations (not to be shared with teams) and
* temporary files (from the editor of whatever you're doing).

Open the .gitigonore file in your repo to include the files you want to exclude.

You can also get .gitignore templates for tools (IDEs, environments, etc) [here](https://www.gitignore.io/).