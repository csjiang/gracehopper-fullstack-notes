//Node Shell Workshop

//intro material notes

	//video on Event Loop

		//JS runtime can do one thing at a time. 
		//browser can do things concurrently. 

	// CommonJS Basics
		module.exports = function() {
			return 'I am a dep'; //expose value to other stuff

			}; //usu modules expose a function
			//generally expose a single value. 
		
			//to expose multiple values, either wrap multiple vals in an object
			//or in an array. but that's not idiomatic; 
			//use exports obj directly. 

			//module: provided by node natively or by browserify. 

			//also an exports obj that is a ref to the exports obj on module obj: 
			//to expose multiple objects: 

			exports.foo = 'foo'; 
			exports.bar = 'bar'; // in dep file. 

		var dep = require('./dep'); 


	//module.exports in Node.js

	//asynchronous control flow 

//Lecture notes

	//Google V8 engine
		//systems software writen in C++
		//parses and compiles and executes JS
		//module of Chrome, but dev'd separately
		//open-source
	//node.js executes machine processes
		//as opposed to browser processes
		//runs directly in the content/envt of OS- not limited to DOM. 
		//access to file system, shell commands, netwk ports, virtually everything
			//given permissions and available APIs
		//laptops, traditional servers, microcontroller (Arduino, Raspberry, Tessel), satellites, airplanes, spacesuits, anything running an OS
		//electron lets you build desktop apps in Node

	//in terminal, type in node and press enter; then you can execute JS in terminal 
	//node program.js (will quit upon exit, but as long as sth is happening the process will compute-- can be fn executed or open request or server listening)

	//Platform API 
		//familiar globals shared w browser: 
			//console (goes to terminal or wherever else process was initiated)
			//setTimeout/clearTimeout/setInterval/clearInterval 
		//globals not in node: GUI stuff, mouse/keyboard event stuff
			//window (no browser)
			//document (no HTML)
			//alert/prompt
			//history (controls what browser remembers in back and fwd button etc)
			//etc 
		//new globals
			//global (replaces window)  --> the global object. 
			//process --> describes process itself- id, OS, what started it, directory started from
				//pid: process id - identifier given to this node process. can be used in terminal to kill it

			//__dirname, __filename --> describe the file you're in 
			//buffer --> a way to deal w raw data eg video files
			//require/module 
	//module system
		//organizable + maintainable vehicle for code splitting (which is good for many reasons, incl efficiency, readability, manageability, centralization, facilitating collaboration, reusability)
			//defined responsibility- each module has one feature /bundle of features
			//visible structure
			//testing
		//browser's module system: <script> tags in HTML (ordering is impt) 
			//browser has no module system
			//$ is variable created by jq on the global scope so it can be accessed from elsewhere. 
			//only 2 global vars: $ and (if $ is unavailb) jQuery. 
		//2 globals: require and module 

		//sources of modules in jode.js
			//author-defined
			//built-in to platform
			//third-party (npm) 

		//node always starts with one file- always start executing node filename.js -- can't put in other args. 
			//therefore you have to use module.exports: 
			module.exports = Square; //this line is like a verb: exports thing given to it (only exports 1 value: so you can export an object or array if you want to do more than 1.)
			module.exports = Circle; //file outputs the circle constructor function. put this in the files that you want to export to node 
										//now this is in the public interface and accessible from other file. 
										//but if you have for instance a helper fn that is private to this file, it can still help but it will not be public. 
			//in the file you actually run with node: 
			var Circle = require('./shapes/circle.js'); //point at the name of a file with relative path from filename.js
			var Square = require('./shapes/square');	//.js is implicit in require filename; you don't need it 
									//require will get an empty obj if nothing is passed to module.exports
			var c1 = new Circle(5);
			var s1 = new Square(10);
			console.log(`The circumference of circle 1 is ${c1.getCircumference()}`);
			console.log(`The circumference of square 1 is ${s1.getArea()}`);

			//contrast with PHP's export/module system 

		//built-in modules
			//url: toolset for parsing components of URLs
			//path: for parsing and creating file paths
			//fs: utilities for accessing a machine's file system
			//http: ability to create servers and send HTTP messages to other servers
			//crypto: toolset for hashing and encryption
			//net: creating raw TCP connections and servers for raw connections, setting up web sockets 
			//child_process: running shell commands and subprocesses

		//to import built-in modules:
		var urlTool = require('url'); //see docs on node js site 
		var url = 'https://www.gracehopper.com/student-tech-talks?page=2';
		console.log(urlTool.parse(url));

		//npm: a package manager for node. package managers drive the community 
			//a combo of CLI and a hosted repository of libraries managed by community 

		//package.json - saves some info about package 
		//chalk
			//npm install chalk --> placed inside library of node_modules --> chalk has dependencies so all those packages and their respective
				//dependencies will also end up inside that library. 

			var chalk = require('chalk'); //anything installed in node_modules can just be brought in by name as if it was a built-in module. 
			console.log(chalk.blue(`The circumference of circle 1 is ${c1.getCircumference()}`));
			console.log(chalk.magenta(`The circumference of square 1 is ${s1.getArea()}`));
		//express
			//npm install express
		//when creating packages, don't let node modules (that were not created by me and that are available elsewhere) don't get put onto github
		//create gitignore file: 
			//npm install --save [module to both download and save] 
				//save enters stuff into package.json as dependency; doesn't install it (?)
				//--> dependencies will get added as a field and chalk will be in that in package.json along with version of chalk required. 
				//^1.1.3 (anything up to = ^; check out semver - semantic versioning)
				//then you can just type npm install and npm will go into package.json and into dependencies and install all the dependencies. 
		//local vs global modules:
			//npm, testem are global modules
			//local modules are local to project 
				//redundant installation makes sense given version differentials etc 

	//wrap-up: lecture pt 1
		//node.js is a platform for running processes writen in JS on machines
		//while language is the same, the available tools (globals, modules) differ from browser programming
		//npm is a monstrous (+ ever-growing) ecosystem and often defines how node.js projects are formatted (package.json)

























		