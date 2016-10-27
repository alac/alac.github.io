---
layout: default_post
longtitle: "testing for statistical significance"
title: "significance and the t-test"

categories:
- Statistics
---

`[Insert Image of Tom Jones]`  

It's not unusual? Prove it.  

There are two major parts to this:  

  * What does statistical significance mean? How do we test for it?  
  * Untangling the options you have for doing so.  

<!--more-->


Statistical Significance
===========================

Your Experiment
---------------

Suppose you're a runner and you're trying to improve your 100m dash. Because you been well informed by Nike commercials, you know that the best way to prove your time is to buy a pair of Air Jordans. But, you want to be sure of your improvement. That stuff ain't cheap.  

Now, you need to measure. Get some samples of how fast you are with your janky Sketchers and some samples with your new Jordans. There's a lot to be said about _how_ you should take these samples. We don't want to screw up the data by giving an advantage due to you being fatigued or warmed up. Something like, every day for a week, you get one sample of each, alternating which one comes first, with an hour break between.  

The goal is to say that there's definitely a difference between the numbers you get from your Sketcher and your Jordans. 'definitely' means *95% certainty*.  

What happens to that other 5%? No one knows. It is worth noting that the fine print for statistical significance is that you can only claim it _if your results are reproducable_.  

The Bell Curve
--------------

We compute the certainty by assuming that our data follows the bell-curve and then applying something called a T-Test.  

We can use a bell curve for two reasons:  

  * It's the most common distribution in nature. It's also called the normal distribution for a reason. So, normal until proven guilty.  
  * "The Central Limit theorem". In short, even if your samples don't follow a bell curve, you can turn them into something that does. How? Instead of using the samples themselves, group them into buckets and the averages of the buckets will be normally distributed. [Ref](http://blog.minitab.com/blog/understanding-statistics/how-the-central-limit-theorem-works)  

We can identify the right bell curve to use quite easily: through the mean/average and standard deviation.  

The mean is easy: sum the values and divide by the number of values.  

The standard deviation is square root of the sum of the squares of the difference between each value and the mean. The formula is gross, but the meaning is quite literal: roughly how much the values deviate from the mean.  

There's some useful properties of the bell curve:  

  * The total area under the curve is 1.  
  * -1 std devs to 1 std devs contains 68% of the curve.  
  * -2 std devs to 2 std devs contains 95% of the curve.  

So, what we want is a means of checking whether our samples are in the part of the curve _beyond two standard deviations away_.*

*Or slightly less with a one-tail test.


Student's T-Test
-------------

The result of Student's T-Test is the likelyhood that both sets of samples came from the same distribution. That is, if we want 95% certainty that they're different, then we actually want Student's T-Test to give us a value *under 5%*.  

I'd give an overview of how the computation works, but it's [widely implemented](https://en.wikipedia.org/wiki/Student%27s_t-test#Software_implementations), which takes the fun out of it.  

I personally use Google Sheet's TTEST function.


Variations on Student's T-Test
==============

Tests on different kinds of data
--------------
The *'Independent Samples'* T-Test is used when we believe that the samples are unrelated. This is the most common case.    

The *'Paired Samples'* T-Test pairs off samples from each set of data. There are two cases where we can use this:

  * Before/After testing. Typically, this is appropriate when you want to judge the effectiveness of some treatment across a group. So, we could use this to test Sketchers vs Jordans for a hundred people. The upside here is that we can look at the *improvement* while ignoring any noise from differences resulting from each person's natural ability.  
  * In theory, you can form pairs using variables other than the one measured. So, in our sneaker example if you couldn't get a hold of a pair, you might compare your Sketchers samples to the Jordan's samples of someone with a similar height. This is a terrible example for a reason: you don't want to do this unless you need to.

Unlike the other tests, the *'One Sample'* T-Test doesn't test across two sets of data. Instead, it tests for whether one set of data matches a particular mean. So, you'd use it if Nike provided some average 100m dash improvement and you wanted to check if it was correct for you.


The Null Hypothesis and One or Two Tails
--------------
The aim of this endeavor is to be able to look at our data and answer with confidence: is this any different?

In formal literature, we do this by testing the Null Hypothesis: "The two things we're comparing are the same".

So, someone that's really picky would ask: what does it mean to not be the same? Well, there's:

  * Just better.
  * Just worse.
  * Either better or worse, just not the same.

Mathematically, "just better" corresponds to testing the situation where the 5% that we want are allocated at one extreme of the distribution.  That is, it's one *tail* of the distribution.  Because of symmetry, you can say the same about "just worse".

"Either better or worse" allocates 2.5% of the amount we're testing at each *tail*. So, it's two tailed.

Because a two-tailed test checks for values being further from the center (e.g. the tail starts further away), anything that passes a two-tailed test will pass a one-tailed test.  

But, anything that passes a one-tailed test won't neccessarily pass a two-tailed test.  

So, we have a choice between a false positive ("a type I error") or a false negative ("a type II error").  

*TL:DR* Two-tailed tests are a higher bar than a one-tailed test. To avoid false positives, it's safer use the two-tailed test.


Welch's T-Test
----------
Student's T-Test checks both data sets come from the same distribution (e.g. mean and variance).  

You may have good reason to believe they don't have the same variance (or, you're just a cautious person), but still want to check if they have the same mean.  

In this case, you use Welch's T-Test which has adjustments for dealing with different variances.  

At the same time, Welch's test performs well for the same variance across data sets and handles a case, which, quite frankly can't be ruled out for most data.  

Summary
==========

We can test for statisical significance using Student's T-Test.  

There are three Student T-Tests to choose from:  

* _Independent Samples_ for comparing two independent data sets.  
* _Paired Samples_ for comparing related data sets (e.g. before/after).  
* _One Sample_ for checking against a known mean.  

The _tails_ of a T-Test refer to where you're allocating significance. A two-tailed test splits significance evenly and therefore has a lower risk of giving you a false positve.  

_Welch's T-Test_ should be used in the _Independent Samples_ case because it doesn't care whether or not the data sets have the same variance.  


Sources/Further Reading
==========

[Wikipedia ANOVA - Alternative to T-Tests](https://en.wikipedia.org/wiki/One-way_analysis_of_variance).  
Notably, it can handle more sample groups.  

[Wikipedia Welch's Test](https://en.wikipedia.org/wiki/Welch%27s_t-test)  
  
[Wikipedia Paired Difference Test](https://en.m.wikipedia.org/wiki/Paired_difference_test)  
  
[Wikipedia One and Two Tailed Tests](https://en.m.wikipedia.org/wiki/One-_and_two-tailed_tests)
  
[Student's T-Test vs Welch's T-Test](http://stats.stackexchange.com/questions/305/when-conducting-a-t-test-why-would-one-prefer-to-assume-or-test-for-equal-vari)  
  
[Bite Size Bio - Time For T](http://bitesizebio.com/8048/time-for-t-how-to-use-the-student%E2%80%99s-t-test/).  
A lower level look at the T-Test and how we use it.  
  
[One vs Two Tailed Tests](http://conversionxl.com/one-tailed-vs-two-tailed-tests/)
