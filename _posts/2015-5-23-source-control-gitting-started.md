---
layout: default_post
longtitle: "tools: git / source control"
title: "git / source control"

categories:
- Tools
---

![Git Meme](/assets/posts/git/git-meme.jpg "Force pushing is for jedi"){: .center-image }

In this post:

* Source Control/Git Intro
* Tools for Git
* Super Useful Command-Line Commands!

<!---
<!–end_preview–>
-->


What is source control?
-----------
Think back to high school. Your essay is 10.5 pages instead of 11, so you thesaurous _real hard_. In the sobering morning light, you realize it was a mistake and hold down CTRL-Z.

Now, suppose you wanted CTRL-Z for code. It would need to occur for each 'logical change' otherwise it wouldn't compile. It would need to handle multiple people working on the same code at the same time. And so on. That's basically source control.

For more see:

* [Joel on Software wiki](http://discuss.joelonsoftware.com/default.asp?W190)
* [Wikipedia - Revision Control](http://en.wikipedia.org/wiki/Revision_control)


Git?
------------
There's infinity solutions to this problem, but right now the clear winner for source control software is [Git](http://en.wikipedia.org/wiki/Git_(software)).

The most common place to host a Git project is [GitHub](http://www.github.com). Almost all hosting providers have a 'free' tier of service with the caveat that your repository will be public. Private github accounts start at 5 repositories @ $7/month. If you're too cool for that, you can use a [local remote repository](http://treeleafmedia.be/blog/2011/03/creating-a-new-git-repository-on-a-local-file-system/) or set up your own git server (supposing you have a [DreamHost account](http://wiki.dreamhost.com/Git) or something) 

There's two ways to use git:

* Command Line ([tutorial](https://try.github.io/levels/1/challenges/1))

   It'll often be faster to use a GUI for most operations, but debugging with a GUI is needlessly difficult.

   You'll want an understanding of the command line for the sake of the spamming 'uhh what if I do this' commands at the prompt.

* GUI tools. 

   Github has a free client for each major platform. Because it errs on the side of being user friendly, it isn't quite as efficient to use other options.

   For OS X, I've personally used the free [SourceTree](https://www.sourcetreeapp.com/) and [GitX-dev](http://rowanj.github.io/gitx/). Both offer more industrial layouts that make it faster to work with branches, tags and submodules. GitX-dev 

   Be careful to download GitX-dev instead of GitX, only the former is still being maintained and the latter lacks many many great features.


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

* `git grep STRING`.

   Search all indexed files for STRING. Lifesaver if regular `grep` gives you unwanted results from gitignored filed.


Configuration
---------
Here's some things you can change with your git configuration:

* [Rerere: "reuse recorded resolution"](https://git-scm.com/blog/2010/03/08/rerere.html). That is, automatic handling of repeated conflicts.

   By turning rerere on with `git config --global rerere.enabled true`, git can remember every resolution to a merge conflict and recycle it. Useful for long rebases.

   If you end up screwing up a resolution, forget it with `git rerere forget FILE` and checkout the conflicted version again `git checkout -m FILE`.

   If you screw up _many_ files, you can nuke all resolutions with `rm -rf .git/rr-cache`.

* Always rebase when pulling.

  Use `git config branch.autosetuprebase always` to rebase when pulling. Useful if you work... with others. Although, you may as well make a bash profile shortcut for pulling that includes the `--rebase` flag.

  You can add `--global` to apply to all repos.

 More options [here](https://git-scm.com/book/tr/v2/Customizing-Git-Git-Configuration). Highlighting and a merging tool are both recommended.


Bisect To Find Breaking Changes
----------
Suppose you have a bug and can't determine the cause by inspecting the current codebase. Use a bisect to bruteforce your way to the code change that caused it.

    git bisect start
    git bisect bad KNOWN_BAD_COMMIT
    git bisect good KNOWN_GOOD_COMMIT

Git check out commits for you. You'll test each one, then tell git if the code was broken or not:

    git bisect good # that commit wasn't broken
    git bisect bad # that commit was broken

Then at the end (or when you've decided to give up), run reset:

    git bisect reset

Examples of other options (and automated testing) [here](https://git-scm.com/docs/git-bisect)


Handling Multiple Github Accounts
----------
An advanced topic and probably not an issue for most people.

Basically, you shouldn't authenticate to multiple github accounts with the same ssh key. So, you'll need to switch between ssh keys whenever you switch accounts. You'll run three commands:

    ssh-agent # start the ssh agent
    ssh-add -d # remove the current identity
    ssh-add ~.ssh/id_rsa_XYZ # add the new identity

I recommend adding a macro for this. I use this

    alias sshwork="ssh-agent; ssh-add -d; 
    ssh-add ~.ssh/id_rsawork"


A gist on the topic [here](https://gist.github.com/jexchan/2351996).


Git Faster
---------
If you're using git right, you're necessarily using git _a lot_. It would be wise to add shortcuts to your bash profile. Examples:

* Jumping to the root directories of you repos / submodules.

   E.g. adding `alias blog="cd ~/repos/blog"`

* Common general operations like pull, rebase, commit.

   `alias gst="git status"`
   `alias gpr="git pull --rebase"`
   `alias gac="git add -A; git commit"`

* Switching to popular branches, tags.

    `alias glatest='git checkout master; git pull --rebase origin master'`

* Nuking everything!

    `alias nuke="git clean -fd; git reset --hard head; git submodule foreach --recursive git reset --hard"`


Patches
---------
Suppose that you need to store off some commits outside of your repo. For example, debug changes.

You can do this by generating a _patch_ file.

For a patch for each commit since a hash:  
`git format-patch HASH`

You can specify a number of commits from that patch. E.g.  
`git format-patch -1 HASH`
Gives you patch for the exact hash.

For a patch that spans many commits...
`git format-patch -2 HASH --stdout > hash_and_previous_commit.patch`

To apply a patch  
`git apply PATCH_PATH`

For merge conflict instead of straight rejection  
`git apply -3 PATCH_PATH`


Appendix
---------
Some other stuff that may be useful:

* [GitHub's command cheat sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
* [Git Hooks](http://git-scm.com/docs/githooks) can be used to enforce rules and behaviors within the repo (e.g. Minimum commit message length, automatically dumping saving the hash of a particular file, etc).
* [Using Git Patches](https://ariejan.net/2009/10/26/how-to-create-and-apply-a-patch-with-git/).