---
layout: default_post
longtitle: "metaphor #2 simple automatic reference counting"
title: "simple automatic reference counting"

categories:
- Objective-C
---

Memory management is an interesting topic because there's two major ways of thinking about it: garbage collection and malloc/free.  
  
Garbage collection is a really intuitive concept, and yet malloc/free is what is "natural". It's what mirrors the literal behavior of the compiler closest.  
  
Objective C's ARC starts from a malloc/free type system (retain counts) and attempts to emulate garbage collection.  
  
And it gets weird because it isn't garbage collection.  
  
Here's what it is instead.

<!--more-->

The preferred way of thinking about it is the concept of 'ownership'. An object is alive for as long as at least one other living object is 'owning it'.

While it's a useful pattern, ownership isn't how things really work. Just a useful way of thinking of it.

Instead, let's think about tickets. You are an object - in the programming sense - and you're alive as long as you hold one or more tickets.

Whenever 'retain' is called, you get a ticket.

Whenever 'release' is called, you lose a ticket.

Whenever 'autorelease' is called, you get a _self-destructing_ ticket that goes away when the current autorelease pool flushes. (Usually, the flush happens at the end of a run loop.)

You get an implicit 'retain' when you're initialized; this is why _before arc_ it was common to call autorelease on an object when it was initialized. That way, you don't have to remember to release it when you're actually done. 

ARC does this _for you_, and - in release mode - cancels out the implicit retain and the autorelease, as a performance optimization in `[[OBJECT alloc] init]`.

This is why, in DEBUG mode, assigning a new object to a weak variable before assigning it to something else will work. But it doesn't in RELEASE mode.

When else do retains and releases happen?

Assigning to a strong property or a non-__weak local variable triggers a retain.

Assigning something else to the property, or the object being deallocated triggers a release.

Assigning something else to the local variable triggers a release. But, the release also occurs when the variable stops being used. Like immediately. At least in RELEASE mode.

That's actually about it.

The only thing beyond that worth saying is... calling method on an object _doesn't_ trigger a retain. This means that if an object calls code (say, a block) that triggers it's own release... you can get a segmentation fault. GG.