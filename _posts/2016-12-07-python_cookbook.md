---
layout: default_post
longtitle: "python 2.7: reminders"
title: "reminders"

categories:
- Python27
---


This post collects the things about Python that I regularly forget:

  * Inspecting object/scope.  
  * Static vs Class Methods.  
  * `is` vs `==`.
  * Empty Containers are Falsy.
  * Distant Imports.
  * Pip and Dependencies.
  * Partial Functions.


<!--more-->


Scope Inspection
==============
`globals()` = namespace of the current module.  
`locals()` = current namespace.  
`vars()` = same as locals.  
`vars(obj)` = namespace of the object (e.g. __dict__()).  

These have _interesting_ behavior around mutability. [Detailed reference](http://stackoverflow.com/questions/7969949/whats-the-difference-between-globals-locals-and-vars).  


Inspecting Objects
================
`obj.__dict__()` = mapping from object's properties to values. Mutations flow both ways.  
`dir(obj)` = list of properties and methods.  


Static vs Class Methods
==============
_Do you need the class?_  
Class methods take the class object implicitly as an argument.  
Static methods can be called via the class object _or_ an instance, but take neither as an arg.  
[Reference](http://stackoverflow.com/questions/136097/what-is-the-difference-between-staticmethod-and-classmethod-in-python).

```
class Example(object):
    @classmethod
    def class_method(cls, real_arg):
        pass
    @staticmethod
    def static_method(real_arg):
        pass

e = Example()
e.class_method(1)
e.static_method(1)
Example.class_method(1)
Example.static_method(1)
```


'is' vs '=='
===============
`is` checks identity (e.g. pointer). `==` checks value.  

```
>>> a = ["a"]
>>> b = ["a"]
>>> a == b
True
>>> a is b
False

>>> b = a
>>> a is b
True

# String interning obfuscates this because in
# languages where a string is immutable, it's common
# to only generate one copy at compile time...
>>> "a" is "a"
True
>>> "ab" is "a" + "b"
True
>>> a = "a"
>>> b = "b"
>>> "ab" is a + b
False
```


Empty Containers are Falsey
===============
```
>>> not not None
False
>>> not not {}
False
>>> not not []
False
>>> not not set()
False
>>> not not ()
False
```
Also, when `___nonzero__()` returns `False` or when `__len__()` returns `0`.


Dictionary Comprehension Syntax
===============
```
>>> a = [(1,2), (3,4)]
>>> b = {k:v for k, v in a}
>>> b
{1: 2, 3: 4}

# But, for the above case...
>>> dict(a)
{1: 2, 3: 4}
```


Distant Imports
===============
Suppose you have a project structure like

```
AllProjects
|-- projectA
|   |-- myScript.py
|   |...
|
|-- projectB
    |-- library.py
    |...
```
And you want to `import library` in `myScript.py`.  

Symlinks are not a good idea because Python won't update the symlink `.pyc` files correctly.

What will work, however is adding `projectB` to your `$PATH` (your real path _or_ via programmatically).

```
# Adding to the end of your path
sys.path.append(PATH_TO_IMPORT_FOLDER)
# Inserting at 2nd spot to preempt a naming conflict.
# Don't insert at 1st spot since _some_ expect that
# to be the script folder.
sys.path.insert(1, PATH_TO_IMPORT_FOLDER)
```


Pip & Dependences
===============
A common idiom is to store the required modules in a requirements file via `pip freeze > req.txt`.  

Then to install them, `sudo pip install -r req.txt`.


Partials
================
This is pretty academic, but you can partially apply functions with functools.partial.

```
from functools import partial

def walk_dog(dog, duration):
  ...

short_walk = partial(walk_dog, duration = 20)
poop = map(short_walk, dogs)
```