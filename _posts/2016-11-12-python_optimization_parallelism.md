---
layout: default_post
longtitle: "python 2.7: profiling and parallism"
title: "profiling and parallism"

categories:
- Python27
---

#scriptLyfe:  

1. devise a 15 minute process.  
2. get annoyed.  
3. replace with a 3 minute script.  
4. get annoyed.  
5. optimize down to 20 seconds.  

This post will go over:  

  * How do we measure performance?  
  * When and how to use Threading vs Multiprocessing in Python 2.7?  

<!--more-->


Measuring Performance
===========================
There are an infinite # of ways to optimize code. But, first we want to profile to:  

  * Determine where our efforts should go. 
  * Get data so that we can verify later that we improved things.  


Unix Time Command
---------------
To time a script in Unix, instead of  
```python myScript.py -flag arg1 arg2```  
use  
```time python myScript.py -flag arg1 arg2```


Running your script with the unix `time` command will net you three numbers: user, system and real.  

  * system = time spent in system calls  
  * user = time spent outside of system calls  
  * real = wall clock time  
  * user + system = total execution time  

In a single threaded app, real ~= user + system.  
In a multi-threaded app, (user + system) / real ~= core usage!  

This is good for getting an overall baseline measurement, but we need to get more specific to know _what_ to optimize.  

* For Windows users, Powershell has `Measure-Command` or getting the [runtime from command history](http://stackoverflow.com/a/3516252).  


cProfile
---------------
To use cProfile, instead of  
```python myScript.py -flag arg1 arg2```  
use  
```python -m cProfile -s cumulative myScript.py -flag arg1 arg2```

This will run your script and at the end, dump each method call sorted by the total time spent inside of them.  

There are other options [described here](https://docs.python.org/2/library/profile.html#instant-user-s-manual) and [even ways to display the output with pretty charts](https://julien.danjou.info/blog/2015/guide-to-python-profiling-cprofile-concrete-case-carbonara).

You can also import cProfile as a module and [profile a single method](http://stackoverflow.com/a/4492582).


Threading vs Multiprocessing in Python 2.7
=============================
At some point, you'll be bottle-necked by an irreducible piece of code (e.g. tell a shell script to convert this list of audio files).  

Since I'm writing this a decade after multiple cores became a thing, you might be inclined to say "if I thread this, then I can get a 200%+ improvement."  

Unfortunately, the most common implementation of Python 2.7 has something called a `Global Interpreter Lock (GIL)`. cPython's interpreter state is not thread-safe, so it can't run instructions in parallel.  

Implications:

  * Threading in Python yields `concurrency`, but not `parallelism`.  
  * Threading, therefore, allows you to execute multiple tasks on one core. If those tasks are python-heavy instead of IO-heavy, you probably won't see much gain - if any.  
  * For parallelism, we instead need to use Python's Multiprocessing module.  

Python Multiprocessing side-steps the GIL by creating another process, which has it's own interpreter.  

[Pros & Cons @ Stackoverflow](http://stackoverflow.com/questions/3044580/multiprocessing-vs-threading-python). TL;DR is multiprocessing has higher memory/initialization cost, but is easier to get right than threading because multiprocessing makes it hard to share data where threading makes it hard to keep data safe.  

[Illustrated example @nathangrigg.com](https://nathangrigg.com/2015/04/python-threading-vs-processes).  


Threading Example
---------------
Reminder: threading is appropriate for tasks that spends a lot of time outside of python: calling a shell script, numpy, etc.  

This is a real example from weekend code I wrote to scan my audio library:

  * I use Queues for threadsafe input and output.  
  * I create worker threads to run the worker function, which processes the queue.  
  * The threads block on `fQ.get()`. When processing completes all worker threads will be alive-but-blocked.  
  * To prevent the alive-but-blocked threads from preventing the script from returning, I mark them as daemon.  
  * Finally, the main thread calls `fQ.join()` to wait for queue completion.  

```
from Queue import Queue
from threading import Thread

...

fQ = Queue()
# Populate the input queue
for root, dirs, files in os.walk(in_folder):
    for fn in files:
        absfn = os.path.join(root, fn)
        fQ.put(absfn)

resultQ = Queue()

"""
Worker thread function:
Infinite loop of polling the input queue
and dumping results to the output queue
"""
def worker(fQ, resultQ):
    while True:
        absfn = fQ.get()
        songData = SongData.from_file(absfn)
        if songData:
            resultQ.put((absfn, songData))
        fQ.task_done()

for i in xrange(8):
    t = Thread(target=worker, args=(fQ, resultQ))
    t.daemon = True
    t.start()

# Block until all tasks in the input queue have completed
fQ.join()

# Process result queue
while resultQ.qsize():
    absfn, songData = resultQ.get()
    sdi.add_song_data(songData, absfn)
```

Subtle things:  

  * You can use an alternative construction where the worker threads don't loop forever, but exit when the queue is empty.  

    _This breaks in the case that elements are added to the queue while it is being processed_.  

    Why? [There's no guarantee that `queue.isEmpty()` won't be followed by `queue.put()` on a different thread.](https://docs.python.org/2/library/queue.html#Queue.Queue.empty)

  * We pass fQ and resultQ to the thread to avoid race conditions around access.  

Further variations:

  * [Thread local storage](http://stackoverflow.com/questions/1408171/thread-local-storage-in-python): for the case where threads need to aggregate data instead of putting the results in a queue.
  * [You can subclass Thread to achieve the same thing](http://stackoverflow.com/questions/1408171/thread-local-storage-in-python). But, apparently there's no upside.


Multiprocessing Example
--------------
Reminder: multiprocessing is necessary for tasks that are python heavy, but _can_ handle IO bound applications as well.  

We just need to be sure that we aren't relying on side effects because each process has separate state.  

The main difference is we'll take advantage of Multiprocessing's support for the map function, which abstracts away almost everything.

```
from multiprocessing import Pool

# Populate the input list
input = []
for root, dirs, files in os.walk(in_folder):
    for fn in files:
        absfn = os.path.join(root, fn)
        input.append(absfn)

def getSongData(absfn):
    songData = SongData.from_file(absfn)
    return (absfn, songData)

pool = Pool(processes=8)
output = pool.map(getSongData, input)

# Cleanup
pool.close()
pool.join()

# Process results
for absfn, songData in output:
    if songData:
        sdi.add_song_data(songData, absfn)
```

Notes:  

  * The method that gets passed into `pool` [needs to be pickle-able](http://stackoverflow.com/questions/8804830/python-multiprocessing-pickling-error). That is, it needs to be a top level function and not a method.

    ```
    # Top-level workaround
    def process_image_hash(image):
        return image.pHash()
    ```

  * What if the function takes multiple arguments?

    If only one arg varies...  
    Use [functools.partial](https://docs.python.org/3/library/functools.html#functools.partial) to create a version of the method that has less inputs:  

    ```
    from functools import partial

    def walk_dog(dog, duration):
      ...

    short_walk = partial(walk_dog, duration = 20)
    poop = pool.map(short_walk, dogs)
    ```

    If many args vary...  
    Wrap the sets of args in a tuple and use a wrapper function to unpack them [link](http://stackoverflow.com/a/21130146):

    ```
    def wrapped_walk_dog(tup):
        return walk_dog(*tup)

    poop = pool.map(wrapped_walk_dog, [(dog1, 20), ...])
    ```

  * What happens if I don't call pool.close()/.join()? [Zombies](http://stackoverflow.com/questions/14429703/when-to-call-join-on-a-process).

More:  

  * [Print progress when multiprocessing](http://stackoverflow.com/questions/5666576/show-the-progress-of-a-python-multiprocessing-pool-map-call)

  * [Keyboard interrupt multiprocessing](http://bryceboe.com/2010/08/26/python-multiprocessing-and-keyboardinterrupt/)