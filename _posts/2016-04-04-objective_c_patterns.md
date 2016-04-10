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

There's a variety of ways to mediate the interactions between systems in your codebase. Principle forms in Objective-C are delegate relationships, setting callback blocks, using the notification system, and the observer pattern.

You can find real explanations of what they are in [this objc.io article](http://nshipster.com/key-value-observing/).

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

* It can lead to implicit assumptions.

   Ex: 1    

   Suppose you have an object `Thing` with a property `Stuff` and that `Stuff` has a property `Junk`.

   You know that `Stuff` is readonly, so it's safe for a consumer of `Thing` to KVO `Stuff`'s `Junk`.

   You commit, then a co-worker decides to make `Stuff` readwrite. Now your code has _subtly_ broken.

   Ex: 2

   You're inserting a new feature into a pre-existing system. There are two relevant pre-existing components `A` and `B`.

   You need a callback to occur at a particular time. This happens to be when `A` and `B` are in a specific state. You KVO the relevant properties to check the states of `A` and `B`.

   You commit, then a co-worker changes implementation of `B`. _Your co-worker can't tell that the specific timing of `B`'s state changes are important to you_, and now your code has _subtly_ broken.


Takeaway
-------------
KVO allows you to write loosy coupled code. It also allows you to write _implicitly_ tightly coupled code.

Situationally, KVO may also be slow. Luckily, unabusive use of it is inheriently sparse and shouldn't result in performance issues.

The default implementation of KVO is [not popular](http://khanlou.com/2013/12/kvo-considered-harmful/); mainly, an messy api, and some issues with lifecycle. 

Notable alternative implementations:

* Facebook's [KVOController](https://github.com/facebook/KVOController)

* Mike Ash's [MAKAVO](https://github.com/mikeash/MAKVONotificationCenter).


Delegate Patterns
-----------------
