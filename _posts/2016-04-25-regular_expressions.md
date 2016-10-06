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

<!--more-->

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
e.g. `"colou\?r"` would match 'colou\\r' (i.e. it would be wrong).

Using `egrep` is equivalent to including the **-E**, so the following are equivalent:  
&emsp;&emsp;`grep "colou\?r" FILENAME`  
&emsp;&emsp;`grep -E "colou?r" FILENAME`  
&emsp;&emsp;`egrep "colou?r" FILENAME`

Topics that only apply to `egrep` will have a *.

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

`?` = 0 or 1 times (egrep only)  
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

A _character class_ lets us a single character match against many.


Ranges
------------
Character classes allow us to use a **`-`** to denote a range.  
`[a-c]` = `[abc]`  
`[A-D]` = `[ABCD]`  
`[0-4]` = `[01234]`  

Character classes can mix ranges and individual characters:  
`[0-4A-D!]` = `[01234ABCD!]`  

Some implementations support...  
1. exclusion (e.g. `[A-Z-[AEIOU]]` non-vowel captial letters)
2. character class intersection


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


Alternation*
------------
A fancy word for 'or', alternation allows you to match between two _alternatives_ with a |.

Ex. The following match against weekdays:  
(Monday|Tuesday|Wednesday|Thursday|Friday)  
(Mon|Tues|Wednes|Thurs|Fri)day  


Escaping
------------
Characters that need to be escaped to be used not as metacharacters are:  
`\`, `^`, `$`, `.`, `*`, `[`, `]`

Ex.  
The pattern `folder\\file` would match `folder\file`  
The pattern `taytay\.mp3` would match `taytay.mp3`  


'Capturing' Groups*
-------------
Suppose you had a list of filenames and wanted to separate out the name from the extension.

You could write a hand-parser or just do something like:  
`(.*)\.(.{1,})`

And dump them like:  
`file: \1, ext: \2`

_Capturing groups_ allow saving off parts of a regular expression.

Group `\0` usually refers to the entire expression, while `\1` through `\9` are for any parenthesized parts.

If you're using a parenthesis for _alternation_, you can opt out of that being a capturing group by turning the `(` into `(?:` [reference](http://stackoverflow.com/questions/3512471/what-is-a-non-capturing-group).

You can nest capturing groups. The indexes are always based on left to right ordering.


Greping Harder
-------------
Basic grepping...
`grep PATTERN FILE`
* show matches to the regex PATTERN in FILE

Specifying context
`grep -C 3 PATTERN FILE`
* show 3 lines before and after each match

`grep -B 3 PATTERN FILE`
* show 3 lines before each match

`grep -A 3 PATTERN FILE`
* show 3 lines after each match


Further Reference
-------------
For the most concise cheatsheet ever, [a Stack Overflow answer on Regex in Excel](http://stackoverflow.com/questions/22542834/how-to-use-regular-expressions-regex-in-microsoft-excel-both-in-cell-and-loops)

For more on _any of these topics, [The Stack Overflow Regex FAQ](http://stackoverflow.com/questions/22937618/reference-what-does-this-regex-mean/22944075#22944075).

For interactive exercises, [RegexOne](http://regexone.com/). Try not to cheese them with `.*`.

For an explanation of greedy vs lazy that I couldn't simplify, [MSDN Regex Quantifiers](https://msdn.microsoft.com/en-us/library/3206d374(v=vs.110).aspx)

Unicode is also too hard to cover, but [character classes for code point ranges are a thing](http://www.regular-expressions.info/unicode.html)