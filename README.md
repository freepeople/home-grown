Home Grown
===============
Tools & Utils built locally

Slider
-----------
Tiny responsive slider built with plain js
- Testing done with tape + testling
- Browserify for modular development
- Depends on a small set of utils such as pubsub, etc

Utils
------
Utilities include:
- Pubsub
- DOM Manipulation
- Swipe - touch events<sup>*</sup>  
- Collection abstractions 

Utilities are stored in the root folder but are [symlinked](#symlink-utilities) to
node_modules folder to avoid [relative path](https://github.com/substack/browserify-handbook#avoiding-)
hell.

The utilities can be required like so `require('utils/nameOfUtil');`


<sup>*</sup>Touch events not pointers, which means no current
support for windows mobile.


Getting Started
---------------

####Setup

Get [Browserify](https://www.npmjs.org/package/browserify) if you already don't :)
and add [Testling](https://www.npmjs.org/package/testling) to the mix.

`npm install -g browserify testling`

This will add the two npm packages to your global node_modules dir.

####Next run:

`npm install`

to get all of the local packages setup.

####Symlink utilities 

Symlink to the node_modules dir like so:

`ln -s ../utils node_modules/utils`

now you have the proper setup.