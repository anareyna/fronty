# Fronty

> Basic structure for front-end projects.

## Installation
1. npm install
2. bower install
3. run gulp
4. run gulp watch

## Start coding

You need to work in the src folder, where all your source files should be located with the following structure:

coffee : Here you can code all your coffeescript stuff, this file has a basic module structure.
img : You have to add all the images that will be used in your project here, a copy of the optimized images will then be exported to the dist/img folder
	- sprite : here you can add separated image files that will be part of your sprite which will be created with automatically from here with a gulp task. These images need to be in .png format.
jade : This folder contains all your .jade files separated in nice individual folders for future project scalability and better debugging. The index.jade file is your starting point.
	- _config : place all your configurations and jade variables here.
	- _mixins : add mixins in the mixins.jade file
	- _partials : Contains scripts placed at the head and footer
	- _render : Contains the structure for the head, header and footer sections of your application.
	- _layout : File structure that concatenates all the other jade files hence it generates the layout.
stylus : This folder contains all the .styl files organized in subfolders for better file organization and code scalability.

.
.
.

## Gulp tasks 

## Resources
