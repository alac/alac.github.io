---
layout: default_post
longtitle: "A Metaphor: Simple Computers"
title: "simple computers"

categories:
- Metaphors
---


Someone once asked me to explain how a computer works as non-technically as possible.  
So, let's say that the CPU is a chef... 


<!---
<!–end_preview–>
-->

In the same way that a CPU can run a program, a chef follows a recipe.  

A recipe is a list of instructions for how to do something; which is all a program is anyways.

And lets suppose that this chef is incapable of remembering things, so he'll cross off things to keep track of what he's done. For a Computers, this is called a PC (program counter); it's basically a bookmark that points to where the program currently is.

Now, recipes often have a lot of ingredients and, correspondingly, a lot of bowls. The bowls hold food in all sorts of states - they can be chopped, sauted, whatever - but always with the intention of coming back to it later. CPU's have bowls as well, except they're called registers.

So, the average instruction might be something like `chop whatever is in bowl 1` or `combine bowls 1 and 2, then dump it into bowl 3`. For a CPU, the instruction might be more like `copy`, `add`, etc; but it's about the same.

We've established what a chef does with food and how he knows to do so. Where does he get the ingredients?

Here it gets weird. So, he has a fridge that's nearby. Then a bunch of fridges that are further away. Then finally a supermarket, which is ... really far away. That is, there's a chain of places he can get food from fridge, further fridges, and finally the supermarket. Each one takes more time to get to, but has much more stuff.

This is analogous to how memory works in a computer:  
register (tiny, but instant)  
L1 cache (very small, very very fast)  
L2 cache (bigger, but still very small and fast)  
RAM (much bigger, kinda slow)  
HARD DISK (insanely big, insanely slow)  

The last thing is: where does the food go? Well, anywhere. But in a computer, it can go to any `output device`: screen, speaker, back to the hard disk, the internet, etc.

And now you know (a metaphor for) how a computer works.