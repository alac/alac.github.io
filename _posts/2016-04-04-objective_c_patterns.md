---
layout: default_post
title: "comparing patterns"

categories:
- Objective-C
---

             ^
             | D
    Verbose  |
             |              N
             |              B
             |
             |                              K
    Subtle   ------------------------------------->

	D = Delegate patterns
	B = Block patterns
	N = Notifications
	K = Key Value Observation

Principle forms of interactions in Objective-C are delegate relationships, setting callback blocks, the notification system, and the observer pattern.

You can find real explanations of what they are in [short here](http://nshipster.com/key-value-observing/) and in [long here](https://www.objc.io/issues/7-foundation/communication-patterns/#delegation).

This post will - in an effort to be useful - demonstrate _misuses_ and potential _problems_.

<!---
<!–end_preview–>
-->


Trade-Offs
---------------
For any of these patterns, you can expect that they'll vary in the following ways:

* Boiler plate code ('verbose'), making your final implementation noisy.
* Tendency to bizarre interactions ('subtle'), leading to tough debugging down the line.
* Awkwardness of memory-management and cleanup.
* Ability to abuse them.


Key Value Observing
----------------
If you're completely green to KVO, go ahead and read [this](http://nshipster.com/key-value-observing/) to get a sense of it.

The ideal case for KVO is one of simple systems where each layer only needs to read data from the one below it. 

Imagine a view KVO-ing the properties of a model for updates. Or, [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel).

But with how lightweight KVO is, it can be appealing to use it within a system as well. There's two problems with this:

* EZ infinite loops.

* Suddenly, the timing of setting a property becomes very _intentional_.

   Setting it too early might trigger a KVO that changes _the assumptions of the rest of the current function call_.

   _Or_  it gets set too early and the KVO gets triggered _before some state change completes_, leading to the KVO callback's behavior being incorrect.

* It can _create a reliance on_ implicit assumptions.

   Ex: 1    

   Suppose you have an object `Thing` with a property `Stuff` and that `Stuff` has a property `Junk`.

   You know that `Stuff` is readonly, so it's safe for a consumer of `Thing` to KVO `Stuff`'s `Junk`.

   You commit, then a co-worker decides to make `Stuff` readwrite. Now your code has _subtly_ broken.

   Ex: 2

   You're inserting a new feature into a pre-existing system. There are two relevant pre-existing components `A` and `B`.

   You need a callback to occur at a particular time. This happens to be when `A` and `B` are in a specific state. You KVO the relevant properties to check the states of `A` and `B`.

   You commit, then a co-worker changes implementation of `B`. _Your co-worker can't tell that the specific timing of `B`'s state changes are important to you_, and now your code has _subtly_ broken.


KVO Takeaway
-------------
KVO allows you to write loosy coupled code by enabling the dependency to be one-way. However, it also allows you to write _implicitly_ tightly coupled code.

Situationally, KVO may also be slow. Luckily, unabusive use of it is inheriently sparse and shouldn't result in performance issues.

The default implementation of KVO is [not popular](http://khanlou.com/2013/12/kvo-considered-harmful/); it has a fugly api, and some weird lifecycle behaviors. 

Notable alternative implementations:

* Facebook's [KVOController](https://github.com/facebook/KVOController)

* Mike Ash's [MAKAVO](https://github.com/mikeash/MAKVONotificationCenter).


Delegate Patterns
-----------------
The delegate pattern takes issue with subtlety and _does away with it entirely_.

The message sender has a reference to a delegate object that it knows conforms to a particular protocol and it calls those methods as needed.

This works well for hiding the sender from the delegate and separating out the necessary details of the delegate from the rest of it's implementation. 

So, where does it go wrong?

* The delegate pattern doesn't make sense in situations where the objects are _by definition tightly coupled_ and therefore don't need the flexibility. Instead it obfusicates an otherwise straightforward relationship. 

   The easy example is a class that does a large scale computation, with enough steps to warrent being split into other objects. Since a step is inheriently an implementation detail of the computation, defining that relationship as a delegate relationship is unlikely to have any value.

* It doesn't scale well to multiple delegates.

   For simulatenous delegates, you'll need to add some sort of boilerplate to track them (likely, a weak collection). The upside here, compared to other patterns, is that you'll be able to do things like have a priority system for when the updates occur.

   For multiple kinds of delegates, you'll likely have a lot of _optional protocol methods_ or a lot of empty implementations in the delegate classes.

* Ownership relationships and delegates.

   In general, the delegate should be kept around via a `weak` (or `assign`) reference rather than a `strong` reference to prevent retain cycles.

   Stick to this since _happening to know_ that delegates aren't retained elsewhere is a _subtle_ implementation detail.

   If the delegates aren't retained elsewhere, then at the very least the class that hooks them up is likely an _okay_ (read: less bad) place to retain them.


Block Patterns
-----------------






upsides:
* places the callback code close to the invocation.
* allows for arbitrary dependencies via block retains.
* easily return share/values with __block type local variables.

downsides:
* retain cycles.
* subtle retains (_ivars, _any_ reference to a variable)
* possible to screw up by not checking that the block exists before calling it
* very subtle that the block object retains things, bad if the block is deallocated while running it
* block syntax is incredibly confusing.






Notifications
------------------


* unregister or crash
* untyped payload




Further Reading
------------------
In addition to the references inline, [this article on NSNotificationCenter](http://nshipster.com/nsnotification-and-nsnotificationcenter/) has a sweet chart about audience vs coupling of these patterns.
