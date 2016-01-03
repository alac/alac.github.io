---
layout: default_post
title: "Code Checklist"

categories:
- Programming
---

A midnight list of programming mistakes.

    There’s a brilliant quote by Tony Hoare in his Turing Award speech about how there are two ways to design a system: “One way is to make it so simple that there are obviously no deficiencies and the other way is to make it so complicated that there are no obvious deficiencies.”
	
	Joshua Bloch (from: Coders At Work)

<!---
<!–end_preview–>
-->

Does my code make sense?
-----------

Are names accurate?

- Precision is also nice, but mainly you don't want future you/someone else misinterpreting a name _or changing the behavior to match the name_,

Are names distinct?

- Common example: ghosting a variable named 'error' because the same error checking code is copy pasted.


Planning Phase: Are my ideas terrible?
-----------

- Are my metaphor consistent?

--- E.g. Don't call something a queue unless things get processed and remove from its.

- Are you programming in the language you're using?

--- If you need data from a SQL database, write the correct query instead of grabbing all the data and writing code to do the join/whatever.

- Are you replacing/extending a system instead of making a separate one?

--- There's an intense urge to make 'isolated code changes' and avoid modifying other peopler's code.

--- This usually results in problems maintaining two systems or synchronizing them.


Is my design terrible? P1: Subclasses
-----------

    Inheritance is one of the primary mechanisms for sharing code in an an OO language. But this idea is so problematic that even the keenest advocates of OO discourage this pattern. [source](https://blog.pivotal.io/labs/labs/all-evidence-points-to-oop-being-bullshit)

Are my subclasses [substitutable](https://en.wikipedia.org/wiki/Liskov_substitution_principle)?

Does my subclass actually fit the definition of the superclass?

Is there a way to do this better via [composition](https://en.wikipedia.org/wiki/Composition_over_inheritance)?


Is my design terrible? P2: Class Design
------------

Is this class simple enough?

- Does it have too many responsibilities?

--- If there are subsystems that can be pulled out, then do so because you'll end up with an easier to understand class.

- Is it NOT a 'centralized thing'?

--- Centralized things tend to present a nice external API, but you look inside and it's a mess.

--- It's better pull out as many behaviors as possible and have a well defined minimal API.

--- The middle ground is something like: a facade for external use, a factory for getting particular behaviors and an internal manager that can execute the behavior.

Are class interactions reasonable?

- Are interactions between subsystems limited?

--- If not, you've probably broken it down incorrectly.

- Are _extendable_ interactions between objects via protocol?

--- When an interaction isn't mediated by protocol, then you're not going to be able to generalize that interaction later.