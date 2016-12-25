---
layout: default_post
longtitle: "the unicode post"
title: "the unicode post"

categories:
- Text
---

Before memes roamed the earth, text was an important form of communication. And yet, it was hopelessly complex.  

The guide to hating plaintext:

  * Why is Ascii awful?  
  * Why are there so many encodings?  
  * What's the right encoding?  
  * What are graphemes, glyphs, characters?  
  * How do we get by in such a cold an heartless universe?  

<!--more-->

Why is Ascii awful?
================
As usual, stackoverflow has a great concise answer [here](http://stackoverflow.com/a/19212812) while quora gets a bit [deeper](https://www.quora.com/Why-does-one-learn-ASCII-if-the-computer-compiler-converts-all-the-code-into-machine-code). But, I'll try to tl;dr it.

The `char` type is a 8-bits and ASCII defines half of the values (0-127). Because the rest (128-255) were undefined, very clever engineers decided to hijack those values. So many of these engineers were clever that there was an explosion of _extended ASCII encodings_ (see [Windows Code Pages](https://en.wikipedia.org/wiki/Windows_code_page)).  

So, what we have is a world with .txt files where it's unclear what the contents are unless you have a separate piece of data: which extended encoding it is.  

The main reasons why Ascii is awful:

  * It was just good enough to be useful for a lot of people (e.g. English speakers).  
  * It didn't account for a whole lot of other people _and_ left room for them to hack together a solution.


Why are there so many encodings? 
==================
The crux is that encoding all languages ever is a really hard problem and people needed to write a lot of very sad code to figure it out.  

Of particular note is this ongoing question: if we need more than 8-bits, do we go fixed width (always 16 or 32 bits) or variable width (8-bits, 16-bits or 32-bits) depending on the character?

Fixed width -> slightly simpler code.  
Variable width -> more efficent in storage/memory/bandwidth.  

Here's evolution afaik:

  * Ascii -> extended Ascii and false extended Ascii (e.g. not _quite_ backwards compatible).  
  * The Unicode character set is born with the intention of being able to represent every character. That is, for every character that exists, it assigns it a number to represent it (a "code point").  

    It's size eventually grows to exceed it's original 16-bit capacity.  
  
    Note that Unicode is _not an encoding_. It assigns code points BUT doesn't suggest how the bits are arranged. 

  * There are two major encodings for Unicode: UTF-16 (variable with 16- and 32-bit characters) and UTF-32 (constant with 32-bit characters).

    Different machines also order bytes differently, so we have little endian and big endian editions of each: UTF-16BE, UTF-16LE, UTF-32BE and UTF-32LE.  
  * But, we also wanted full backwards compatibility with Ascii: this gave birth to UTF-8.


What's the right encoding?
=================
As the last section suggests, Unicode is the universal standard character set and it's winning encoding is UTF-8.

Why?

  * UTF-8 is _more variable_ than other encodings - using 8, 16, 24, or 32-bit characters.  

  * UTF-8 fully supports Ascii. UTF-8 uses the same 8-bit encodings for each original Ascii character. So, a valid Ascii file is a valid UTF-8 file.
  * UTF-8 is _sort of_ supported by Ascii. As implied by the previous point, a UTF-8 file that only uses the 128 Ascii characters can be treated as Ascii.

    But when UTF-8 needs to use 16, 24, or 32-bits, it becomes _obviously invalid_ Ascii.  

For details on each point, see [Wikipedia's description of the actual bit layout](https://en.wikipedia.org/wiki/UTF-8#Description).

A last note, there's UTF-8 and UTF-8 BOM. BOM stands for Byte Order Marker. It doesn't have a function other than denoting that the file is UTF-8. Why? Because UTF-8 doesn't have endian-based variations.


What are characters, graphemes, glyphs?
====================
I've rather abusively used the word "character" to get my point across. As such a natural concept, it's meaning has been repeatedly hijacked.  

Is it the unit of thing that gets deleted when you press delete? Or is it smallest unit of writing? Or it the storage size of 8-bits? What about the exact sequence of bits that represent a unit in a character encoding?  

2deep4me, so I'll direct you [here](http://utf8everywhere.org/#characters) for a real definition. Just be aware that, at the end of the day, the existence of all these concepts is somewhat relevant for working with Unicode.


How do we get by in such a cold an heartless universe?
====================
First off, acknowledge how first-world encoding problems are. Then, get good.  

You can write quite a lot of code without worrying about encodings at all. But when you enter that world:

  * Be consistent about the encodings used in your code and be wary of behaviors at the boundaries of your code.  
  * Be aware of how your language and operating system might butcher encodings interally.

    16-bit encodings are very common in popular OSes and languages because it was the best option when they were developed (Java, Python, Windows, etc.)

  * Remember that how something appears and what it's represented as can be very different (e.g. always check the hex).

    From utf8everywhere:

    ```
    Some abstract characters can be encoded by different
    code points; U+03A9 greek capital letter omega and
    U+2126 ohm sign both correspond to the same abstract
    character ‘Ω’, and must be treated identically.

    Some abstract characters cannot be encoded by a single
    code point. These are represented by sequences of
    coded characters. For example, the only way to
    represent the abstract character ю́ cyrillic small
    letter yu with acute is by the sequence U+044E
    cyrillic small letter yu followed by U+0301 combining
    acute accent.

    Moreover, for some abstract characters, there exist
    representations using multiple code points, in addition
    to the single coded character form. The abstract
    character ǵ can be coded by the single code point
    U+01F5 latin small letter g with acute, or by the
    sequence <U+0067 latin small letter g, U+0301 combining
    acute accent>.
    ```

    So, there are many possible representations for something that is visually the same. You should be aware of this because an end user wants to be able to search for "ohm sign" using "greek capital letter omega".

    I would hope for your sake that the language you use has support for [Unicode Normalization](http://unicode.org/faq/normalization.html).