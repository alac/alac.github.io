---
layout: default_post
longtitle: "tools: regexes"
title: "regexes"

categories:
- Tools
---


There's a saying:  
"Trying to solve a problem with regexes? Now, you have two problems."

Complex expressions that are nearly impossible to validate.

*Regular Expressions* are a great tool for searching and manipulating text.  
The standard from unix tools like `grep`, `find`, and `sed` to Excel.

So, let's get finding.


<!---
<!–end_preview–>
-->


What Is A Regex
--------------
Regular expressions are a pretty natural concept.

Suppose you're the king of nerds, and you wanted to find the word 'color' in a story. You'd write a thing to handle that.

Now, suppose you were slipping in and out of British English and had to search for 'color' or 'colour'.

How would you generalize that to make that type of search easier in the future?

You'd probably allow for specifying 0 or 1 `u`'s like this:  
`"colou?r"`


Metacharacters
--------------
With regexes, we give special meaning to certain characters. In the above example, the `?` character didn't search for a question mark, but made the 'u' optional.

Note that metacharacters aren't completely standardized between regex implementations.


GREP & EGREP
-------------
grep is the _commonest_ use case for regexes, so take note:  
**without the `-E` flag, some metacharacters need to be prefixed with `\`.**  

e.g. `"colou?r" becomes "colou\?r"` and would be used as  
&emsp;&emsp;`grep "colou\?r" FILENAME`

By default, grep uses **BRE** (Basic Regular Expressions).  
The **-E** flag switches to **ERE** (Extended Regular Expressions).

In **ERE**, `\` will match a literal \\ character.  
e.g. `"colou\?r"` would match 'colour\\?r' (i.e. it would be wrong).

Using `egrep` is equivalent to including the **-E**, so the following are equivalent:  
&emsp;&emsp;`grep "colou\?r" FILENAME`  
&emsp;&emsp;`grep -E "colou?r" FILENAME`  
&emsp;&emsp;`egrep "colou?r" FILENAME`


Positional Metacharacters
------------
`^` = beginning of the line/string  
`$` = end of the line/string  
`\b` = start or end of a word  
`\B` = middle of a word  
`\<` = start of a word  
`\>` = end of a word  

Example: Matching against "`I'm the real shady.`"  
![Example](/assets/posts/regex/regex_positional.png)


Amount Metacharacters
------------
Amount specifiers match modify the preceding character _or parenthesized unit_.

`?` = 0 or 1 times  
`+` = 1 or more times 
`*` = any number of times (including 0)  
`{AMOUNT}` = exactly AMOUNT times  
`{MIN, MAX}` = any time of times from MIN to MAX (inclusive)  
`{MIN, }` = at least MIN times

Example:  
![Example](/assets/posts/regex/regex_amount.png)

Subtle notes...  
1. The `"p*"` example matches everything because there's _at least 0 p's in everything_.  
2. The `e{1}` example matches both e's in the second line _independently_.


Character Classes
------------
Now, what if we have a "or" situation. Say, you know you often mispell `catagory` as `category`.  
We would use this `"cat[ae]gory"`.

Example:  
![Example](/assets/posts/regex/regex_characterClass1.png)

A _character class_ lets us denote a group of characters and match against one of them.

Ranges
------------
Character classes allow us to use a **`-`** to denote a range.  
`[a-c]` = `[abc]`  
`[A-D]` = `[ABCD]`  
`[0-4]` = `[01234]`  

Character classes can mix ranges and individual characters:  
`[0-4A-D!]` = `[01234ABCD!]`  


Negation
------------
They also allow us to negate with **`^`**.  
`[^abc]` = match all characters that are not a, b, c.  

This only applies if it's the first character after the bracket!

Shorthand
------------
Common character classes have special shorthand:  
`.` = Any character  
`\d` = `[0-9]` # digits  
`\w` = `[a-zA-Z0-9_]` # alphanumeric & underscore  
`\s` = `[ \r\t\n\f]` # whitespace  
`\n` = `[\n]` # newline  

And their negations  
`\D` = `[^0-9]` # not digits  
`\W` = `[^a-zA-Z0-9_]` # not whitespace or underscore  
`\S` = `[^ \r\t\n\f]` # not whitespace  


  LOGICAL
    | matches either it's argument on the left or the right
      ex. (art)|(jazz) will match either 'art' or 'jazz'


EGREP

  COMMAND LINE ARGUMENTS
    "-i" the regex searched will be case insensitive.
