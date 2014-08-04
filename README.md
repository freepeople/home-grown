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

Utilities are stored in the root folder but are symlinked to
node_modules folder to avoid [relative path](https://github.com/substack/browserify-handbook#avoiding-)
hell: ../../...

The utilities can be required like so `require('utils/nameOfUtil');`


<sup>*</sup>Touch events not pointers, which means no current
support for windows.
