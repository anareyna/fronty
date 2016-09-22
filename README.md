# Fronty

> Basic front-end structure for small projects.

## Installation

To get started, make sure you have [node.js](http://nodejs.org/) installed.
Open the terminal and change directory to `fronty/`.

* Install npm dependencies.
    ```
    npm install
    ```
* Run all the default gulp tasks.
    ```
    gulp
    ```
* Open project in browser and watch for file changes.
    ```
    gulp watch
    ```

## Start coding

You need to work in the `src` folder, where all your source files should be located. The project structure looks something like this:
```
fronty/
└── src/
    ├── fonts/
    ├── icons/
    ├── img/
    │   ├── sprite/
    │   └── logo.png
    └── preprocessors/
        ├── coffee/
        │   └── app.coffee
        ├── pug/
        │   ├── _config/
        │   ├── _mixins/
        │   ├── _partials/
        │   ├── _templates/
        │   └── master.pug
        └── stylus/
            ├── _config/
            ├── _helpers/
            ├── _layouts/
            ├── _mixins/
            ├── _normalize/
            ├── fonts.styl
            ├── ie.styl
            └── layout.styl
```
* `fonts` : Here you can add font files grouped in folders according to the font-family `(*.eot,*.ttf, *.woff, *.svg)`.
* `img` : You have to add all the images that will be used in your project here, a copy of the optimized images will then be exported to the `dist/img` folder.
    * `sprite` : Here you can add separated image files that will be part of your sprite which will be created  automatically from here with a gulp task. These images need to be in `.png` format.
* `preprocessors`
    * `coffee` : This folder contains a file named `app.coffee` which has a basic module structure to get you started and should contain all your application logic.
    * `pug` : This folder contains all your `.pug` files separated in nice individual folders for future project scalability and better debugging. The `index.pug` file is your starting point.
        * `_config` : Place all your configurations and pug variables here.
	    * `_mixins` : Add mixins in the `mixins.pug` file.
	    * `_partials` : Contains `header`, `footer`, `head`, `header_scripts` and `footer_scripts` sections.
        * `_templates` : File structure that concatenates all the other `*.pug` files hence it generates the master file.
    * `stylus` : This folder contains all the `.styl` files organized in subfolders for better file organization and code scalability.
    	* `_config` : Place all your configurations and stylus variables here.
    	* `_helpers` : A collection of files containing the main elements that make your website.
    	* `_layouts` : Contains the `header.styl` and `footer.styl` styles
    	* `_mixins` : Contains the `sprite.styl` file when you run the gulp tasj for generating sprites. You can also add the mixins you need in the `mixins.styl` file.
    	* `_normalize` : The `normalize.styl` version created by [@necolas](https://github.com/necolas/normalize.css/).


## Gulp tasks
In the terminal make sure you are in the `fronty/` directory.


### Compile Stylus
```
	gulp stylus
```
This will compile all the `.styl` files in `src/preprocessors/stylus` and concatenate them to a single file located in `dist/css/layout.css`, except for `fonts.styl` and `ie.styl` which will be compiled to separared css files `dist/css/fonts.css` and `dist/css/ie.css`.

### Compile pug
```
	gulp pug
```
This will compile to html all the `.pug` files in `src/preprocessors/pug` and place them into the folder located in `dist/`.

### Compile Coffee
```
	gulp coffee
```
This will compile all the `.coffee` files in `src/preprocessors/coffee` and concatenate them to a single file located in `dist/js/app.js`. If you want to use any js plugin it's recommended that you do so by using [bower](http://bower.io).

### Generate sprites

```
	gulp sprite
```
This task will create the `sprite.png` located at `dist/img/` which will also be the optimized (minified) image version.
In order to use the mixin that this task creates you have to follow this structure in any of your `.styl` files.
```
.ico
	sprite($ico1)
```
Which will render to css. Notice that the `$ico1` variable name has to be the same as your image file name `src/img/sprite/img1.png`.

## Generate icons

```
    gulp icons
```
This task will generate the `iconFont` font for the icons that you can place in the `src/icons/` with the `*.svg` extension.

## Generate font styles
```
    gulp fonts
```
This task will generate the styles for the fonts placed in the `src/fonts/` folder.

### Minimize images
```
	gulp imagemin
```
This task will create a copy of all your image files located in `src/img/` and create an optimized and lighter version in the folder `dist/img/`.


## Resources
* [Coffescript](http://coffeescript.org/)
* [Pug](http://pugjs.org/)
* [Stylus](https://learnboost.github.io/stylus/) also uses [Lost (Grid System)](https://github.com/peterramsing/lost) and [Rupture (Media queries)](https://github.com/jenius/rupture)
* [Pleeease](http://pleeease.io/) (comes with Autoprefixer, fallbacks for rem unit and CSS3 pseudo-elements, packs same media queries & more...)
* [Gulp](http://gulpjs.com/)
* [Bower](http://bower.io)
