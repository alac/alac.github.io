---
layout: default_post
longtitle: "unix part 1: in short"
title: "part 1: getting around"

categories:
- Unix
---

Unix is a cool guy. You should be friends with him. Here are things he can help you with.  

That said, I've only tested these in OSX.  

<!--more-->

Command line
===============

Shortcuts
--------------
`up/down`  
Command history.  

`ctrl-w`  
Delete the part of the current word that is before the cursor.  

`ctrl-a/ctrl-e`  
Jump to the start/end of the current line.  

`ctrl-k`  
Delete from cursor to end of line.  

`ctrl-u`  
Clear line.  

`ctrl-r`  
Search backwards in history.  
Press again to get the next match.  
Arrows to dump the current match into the commandline.  

Filepaths
-------------
`*Drag file/folder into command prompt*`  
Puts the path of the file/folder at the current cursor location.  


History
==============

input history
------------
`history N`  
Dump the last N commands typed into the terminal.  
Leave out N for all history.  

`!!`  
Apply the last command.  


History Expansion
------------
`!`  
"!git" then TAB results in the most recent statement with 'git' in it.  
Escape it with single quotes when you just want a `!` character (you can do `"a"'!'"b"`).  


Folders
===============

Make folders  
---------------
`mkdir FOLDER`

Delete a folder  
---------------
`rmdir FOLDER`

Delete a folder and everything in it  
---------------
`rm -rf FOLDER`  

|----------|:-------------:| 
| `-r` &emsp; | recursive | 
| `-f` | remove all files without asking permission | 
| `-i` | ask before deleting each file  | 

List contents of a folder  
---------------
`ls [optional FOLDER]`  

|----------|:-------------:| 
| `-a` &emsp; | show hidden files | 
| `-1` | one entry per line | 

Move a folder  
---------------
`mv FOLDER DESTINATION`  

Go to a folder  
---------------
`cd DIRECTORY_NAME`  

Go to previous folder
---------------
`cd -`

Special folder names  
---------------
`..`   = up a directory  
`...`  = up 2 directories  
`.`    = here  
`~`    = user home directory  
`/`    = root folder  

Show current folder  
---------------
`pwd`  

Compare folders  
---------------
`diff -q FOLDER_A FOLDER_B | sort`  

|----------|:-------------:| 
| `q` &emsp; | If this isn't there, it'll compare each file too | 

Copy a folder
-------------
`cp -R SOURCE DESTINATION`  

Synchronize folders
------------
`rsync -a SOURCE DESTINATION`  
Copies any missing files.  
Apply the diff to altered files.  
Add `-P` for progress.  
Add `-v` for verbose.

Synchronize folders EXCEPT
------------
`rsync -a --exclude='*.html' SOURCE DESTINATION`  
You can chain multiple `--exclude`s.  
Or provide them in a file `--exclude-from exclusions.txt`.  


Files
===============

Rename or move a file  
---------------
`mv SOURCE_FILE DESTINATION_FILE_OR_FOLDER`  

Copy a file  
---------------
`cp ORIGINAL_FILE COPY_FILE_NAME`  

Find a file anywhere  
---------------
`ff FILENAME`  

|----------|:-------------:| 
| `-p` &emsp; | search with a prefix instead of a full name | 

Find a file in a particular directory [ref](https://kb.iu.edu/d/admm)  
---------------
`find DIRECTORY -name FILENAME_OR_PATTERN`  

Use a filename for an exact search.  
Use 'Potato*.png' to match all .png files starting with 'Potato'  

`-print`

> Displays their paths (not needed on OSX)

`-exec cmd`

> Executes a command on each result.  
> Use `{}` as a placeholder for where the filename goes in the command.  
> End the command with `\;`

`-ok cmd`

> Executes a command, but confirms 

ex. Delete all .mp3 files  

> `find . -name '*.mp3' -exec rm {} \;` |

ex. Find a file and check if it contains a string (John)  

>`find . -name '*.txt' -exec grep "John" {} \; -print`  


Populate a file with output  
---------------
`COMMAND > FILENAME`  

Append output to the end of a file  
---------------
`COMMAND >> EXISTING_FILE`  

Send a file into a command  
---------------
`COMMAND < FILENAME`  

Change permissions (usually, make executable)  
---------------
`chmod OPTIONS FILENAME`  
* go look it up  



Text files
===============

Edit with VIM  
---------------
`vi FILENAME`  

Edit with EMACS  
---------------
`emacs FILENAME`  

View a file  
---------------
`less FILENAME`

|----------|:-------------:| 
| arrows | Go up and down | 
| space | Go to the next page | 
| `q` | Quit  | 
| `/pattern`&emsp; | Search for a pattern | 

View the end of a growing file  
---------------
`tail -f FILENAME`  

Dump a file to the console  
---------------
`cat FILENAME`  

Comparing files [reference](http://www.computerhope.com/unix/udiff.htm) 
--------------- 
`diff A B`

|----------|:-------------:| 
| `-b`&emsp;&emsp; | Ignore changes to amount of whitespace | 
| `-w` | Ignore whitespace | 
| `-c` | Show context (3 lines default; can provide # as argument) | 
| `-y` | Show two columns | 

Comparing sorted files  
---------------
`comm A B`  
Shows 3 columns: lines only in A, lines only in B, lines in A and B.  

|----------|:-------------:| 
| `-i`&emsp;&emsp; | Case insensitive sorting | 
| `-1` | Supress column 1. | 
| `-2` | Supress column 2. | 
| `-3` | Supress column 3. | 

ex: Show the lines only in B.

> `comm -13 A B` 


Symlinks
===============

Create a symlink
---------------
`ln -s /path/to/original /path/of/link`


See where a symlink goes
---------------
`readlink -f /path/of/link`

See which files are actually symlinks in a folder
----------------
`ls -ln`


Chaining
===============

Chaining commands  
---------------
`FIRST_COMMAND | SECOND_COMMAND`  

Dumping a file into a command  
---------------
`cat FILENAME > COMMAND`  

Use a file as input/output  
---------------
`COMMAND [OPTIONS & ARGUMENTS] < INPUT_FILE`  

Variations [more here](http://sc.tamu.edu/help/general/unix/redirection.html)  
---------------

|----------|:-------------:| 
| `>&`&emsp;&emsp; | Includes standard error  | 
| `>!` | Overwrites if it exists   | 

Redirect to `/dev/null` = suppress it  


Processes
================

show all running processes  
---------------
`ps`  

show your running processes  
---------------
`ps -u USERNAME`  

kill a process  
---------------
`kill PROCESS_ID`  
*use PID from `ps`  


Commands
================

run in background thread
----------------
Follow the command with a `&`, e.g.
`rm -rf . &`
* note that the process id is returned

run in background, mute STDOUT/STDERR
`rm -rf &>/dev/null &`

run independent of logout
----------------
Prefix the command with `nohup`.  
`nohup rm -rf . &`  
  
HUP means 'hangup signal'.  
This is how dependent processes are killed on logout.  
Automatically redirects output to a `nohup.out` file.


measure execution time
----------------
Prefix the command with `time`, e.g.  
`time grep "asdf" les_mis.txt`
* dumps the total time, user time and system time taken after the command completes.

To get the run time of an ongoing command, you can press CTRL-T during.
