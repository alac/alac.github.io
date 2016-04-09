---
layout: default_post
title: "Objective-C: Weighing common patterns"

categories:
- Objective-C
---

             ^
             | D
    Verbose  |
             |       B
             |              N
             |
             |                              K
    Subtle   ------------------------------------->

	D = Delegate patterns
	B = Block patterns
	N = Notifications
	K = Key Value Observation

You can find real explanations and how to use them in this objc.io article.

This post will - in an effort to be useful - demonstrate _misuses_ and potential _problems_.

You can expect that patterns options will be more work upfront, where subtle patterns lend themselves to misuse.

Delegate Patterns
-----------------
