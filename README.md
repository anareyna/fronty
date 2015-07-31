# Fronty

> Basic structure for front-end projects.

## Installation
To get started, make sure you have [node.js](http://nodejs.org/) installed.
Open the terminal and change directory to `fronty/`.
* Install npm dependencies. 
    ```
    npm install
    ```
* Install bower dependencies. 
    ```
    bower install
    ```
* Execute all the default gulp tasks. 
    ```
    run gulp
    ```
* Open project in browser and watch for file changes. 
    ```
    run gulp watch
    ```

## Start coding

You need to work in the `src` folder, where all your source files should be located following a folder structure something like this:
```
fronty/
├── fonts/
├── img/
│   ├── sprite/
│   └── logo.png
└── preprocessors/
    ├── glyphicons-halflings-regular.eot
    ├── glyphicons-halflings-regular.svg
    ├── glyphicons-halflings-regular.ttf
    ├── glyphicons-halflings-regular.woff
    └── glyphicons-halflings-regular.woff2
```
* `fonts`
* `img` : You have to add all the images that will be used in your project here, a copy of the optimized images will then be exported to the `dist/img` folder.
    * `sprite` : Here you can add separated image files that will be part of your sprite which will be created with automatically from here with a gulp task. These images need to be in `.png` format.
* `js` : If you want you can add `*.js` files that will be concatenated to the main script `app.js`.
* `preprocessors`
    * `coffee` : This folder contains a file named `app.coffee` which has a basic module structure to get you started and should contain all your application logic.
    * `jade` : This folder contains all your `.jade` files separated in nice individual folders for future project scalability and better debugging. The `index.jade` file is your starting point.
        * `_config` : place all your configurations and jade variables here.
	    * `_mixins` : add mixins in the `mixins.jade` file.
	    * `_partials` : Contains scripts placed at the head and footer
	    * `_render` : Contains the structure for the head, header and footer sections of your application.
        * `_layout` : File structure that concatenates all the other jade files hence it generates the layout.
    * `stylus` : This folder contains all the `.styl` files organized in subfolders for better file organization and code scalability.

.
.
.

## Gulp tasks 

## Resources
* [Coffescript](http://coffeescript.org/)
* [Jade](http://jade-lang.com/)
* [Stylus](https://learnboost.github.io/stylus/) also uses [Jeet (Grid System)](http://jeet.gs/) and [Rupture (Media queries)](https://github.com/jenius/rupture) 