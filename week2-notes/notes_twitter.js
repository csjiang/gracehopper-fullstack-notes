//setup: 
//create directory for proj, cd into it
//start repo with git init 
//to create package.json (describes proj, lists dependencies, defines scripts)
	// --> npm init 

//establish simple file structure: 
	// mkdir public public/stylesheets routes views
	// touch app.js public/stylesheets/style.css routes/index.js
	// touch views/index.html views/layout.html

	//app.js is the main app; static (unchanging) files in public are
	//automatically served when requested; files in routes and views define dynamic content.

//install express in project dir with 
	// npm install express --save
	//npm install --save chalk 

//create gitignore file : 
	// touch gitignore 

// add 'node_modules' to gitignore file to add this

//instantiate application: 
	//in app.js, 
	var express = require('express');
	var app = express(); //creates an instance of express app 

	//start a server: 
	//at bottom of app.js,
	app.listen(3000, function() {
		console.log('server listening');
	});

	//test with node app.js 
	//visit http://localhost:3000
	app.get('/', function(req, res, next) {
		res.send('Welcome!');
	}); //'/' is root URI, which is what you get when you enter http://localhost:3000/

	app.get('/news', function(req, res, next) {
		res.send('No news today!');
	}); 

	//logging middleware that will fire for every incoming request: 
	//put this at the top of app.js 
	app.use('/', function(req, res, next) {
		console.log(req.method, req.url);
		next(); //necessary to move on + process request
	});
	app.use('/special', function(req, res, next) {
		console.log('you\'ve reached the special area);
	});


// We've made a Node library called volleyball that does essentially what you've just built. 
//Volleyball is an example of application-level middleware. Passing it to app.use() makes it intercept all requests. 
//So every time a client communicates with the server, Volleyball logs a summary. 
//Volleyball also logs when your server sends a response, and related info like content-length and content-type.

// Volleyball is purpose-built for students to learn how HTTP servers work asynchronously, 
//but almost certainly isn't used in any production apps. Instead, the industry standard is 
//morgan, by the Express team. Morgan logs only upon response, merging in request info. 
//That's more compact, but somewhat misleading. Morgan is more powerful and configurable 
//than Volleyball, however.


// `request.query` vs `request.params`:

// *request.params* act like _parameters_ in that so long as there is a _string_ in the 
// appropriate location it will hit that route (e.g. both `/george` and `/sarah` will hit the
 // `/:name` route, where `name` is now a key on the `request.params` object)

// Whereas *request.query* represents an _object_ wherein you assign _specific_ 
// values to _specific_ keys via the URI (e.g. on `/?name=george` `request.query.name = george` 
// and this URI is distinct from, say, `/?firstName=george` or `/name=sarah`).


//w/ morgan: 
var morgan = require('morgan');

app.use(morgan('dev'));

//streamlining: 
	//use nodemon module: 

//define a start script: it is common practice to define a start script that handles launch of app.
//therefore npm start will work for any project

//one of package.json's roles is to define scripts.
//add a start property to scripts w the value of 'nodemon app.js'; test in terminal w npm start.

//having diff scripts can be useful. on prodxn server we might prefer node to nodemon; 
//we can have separate scripts for serve vs develop. test script runs our scrips, and so on. 

// WARNING: in larger collaborative Git projects, pushing and pulling to the master branch 
// is generally a bad idea as it will often lead to merge conflicts and other issues. Instead, collaborators 
// make feature branches and submit pull requests for inclusion in the master branch. This is beyond the scope of this
//  workshop, but for now just know to avoid merge conflicts by only working on one machine at a time,
//   pulling at the beginning of a coding session and pushing at the end.

//templating engine: 
	//renders final docs (eg HTML files) based on templates
	//template file + locals object --> rendering fn --> complete html

	//tepmlates let us reuse HTML and also add programmatic syntax such as if forEach etc to HTML.

	//nunjucks:
	//npm install --save nunjucks
	var nunjucks = require('nunjucks');

Take a look at the template markup. Expressions enclosed in {{ ... }} tags are variables, and expressions in {% ... %} are logic tags. When we pass Nunjucks some data to render this view with (which we call the local variables), it will interpolate (fill in) the values we want. We're almost ready to test our code…
//how to require modules 
//module built into node: 
var fs = require('fs')
//module installed via npm: 
var nunjucks = require('nunjucks')
//user-written module: use path.
var greeter = require('./greeter')

//relative paths and require
//to access a file in dir above: use '../'
//to access path in same dir, use './'
//to access path in subdirectory, use './subdir/'

//default module is index.js
//if you require a folder w/o specifying a file, Node will assume you want
//index.js (if there is one) in that folder.
//following expressions are equivalent: 
require('./routes')
require('./routes/')
require('./routes/index')
require('./routes/index.js')

//nonpersistent server-side data storage

//make tweetBank.js module in twitter-js directory:
//this holds all tweets and gives methods for interacting w those.

//Lodash.js : utilities library. install it. 
const _ = require('lodash'); //diff modules have diff dependencies.

//add data array to tweetBank module as var to store tweets: 
var data = [];

//defining tweetBank.js fns: 
function add(name, content) {
	data.push({name: name, content: content});
}
function list() {
	return _.cloneDeep(data); //recursively clones and returns data
}
function find(properties) {
	return .cloneDeep(_.filter(data, properties)); //filter filters an array and returns new filtered array.
}
module.exports = {add: add, list: list, find: find};

//sending tweetBank.js with sample data: 

const randArrayEl = function(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
};

const getFakeName = function() {
	let fakeFirsts = ['Nimit', 'David', 'Shanna', 'Emily', 'Scott', 'Karen', 'Ben', 'Dan', 'Ashi', 'Kate', 'Omri', 'Gabriel', 'Joe', 'Geoff'];
  	let fakeLasts = ['Hashington', 'Stackson', 'McQueue', 'OLogn', 'Ternary', 'Claujure', 'Dunderproto', 'Binder', 'Docsreader', 'Ecma'];
  return randArrayEl(fakeFirsts) + " " + randArrayEl(fakeLasts);
};

const getFakeTweet = function() {
  let awesome_adj = ['awesome', 'breathtaking', 'amazing', 'funny', 'sweet', 'cool', 'wonderful', 'mindblowing', 'impressive'];
  return "Fullstack Academy is " + randArrayEl(awesome_adj) + "! The instructors are just so " + randArrayEl(awesome_adj) + ". #fullstacklove #codedreams";
};

for (let i = 0; i < 10; i++) {
	module.exports.add(getFakeName(), getFakeTweet());
}

//run module node tweetBank and log out data. 
//_.cloneDeep makes a deep copy
// _.filter(arr, function(o) {
// 	return !o.name.includes('Nimit');
// })

//HTTP: Routing and views
	//HTTP is communications std driving the web; it uses the client-server model.
	//clients request resources from server and server responds with data.
	//reqs and resps have header fields that are technical metadata for the protocol to work.

//HTTP request properties eg
	//URI path (uniform resource identifier)-- eg string label (/tweets/123) -- NOT necessarily a real file path.
	//it's just an identifier.
	//method/verb: identifies what client wants to do with resource; 
		//GET (read), PUT (update), POST (create), DELETE 
	//optional message body containing data (JSON, XML etc)

// HTTP response properties eg
	// - status code indicating how server dealt w req
	// - optional message body containing data

//requesting resource: 
	//type address http://localhost:3000/tweets/5 in browser
	//browser sees it should use http protocol to make and send req 
	//sends VERB-URI request GET /tweets/5 (resource of interest)
	//server listening at that address and port receives the req
	//server code routes the request to the proper handler fn, based on the verb and URI.
	//handler fn runs adn builds response msg (eg status code 200, body <html> an html file showing tweet #5 </html>)
	//server sends response back to browser
	//browser decides what to do w response based on status and body (eg display successful HTML delivery)

//ROUTING
//depending on an HTTP req's method and URI path (eg POST /tweets/), server will
//route the req to a specific fn.

//eg route all requests to a single fn that sends response "under construction"
//eg route GET and POST reqs for /tweets/ to 2 diff fns: one to send HTML page of tweets, another to add tweet to data and send OK status back

//express routes: 
//routing is code that feeds an incoming HTTP req to a specific fn. 
app.METHOD(path, handler) //is how express routes requests.

//GET --> app.get('/', myFunc1);
//app.post('/tweets/', myFunc2);

//handler funcs receive 3 objs: a req obj, a res obj, and a next fn - 
//next fn sends req to next handler in a chain, which is needed for middleware and multi-step routing

//cf controllers in Rails, which handle the business logic and facilitate transfer between data and views. Node calls controllers 'routes'. 
//express can be set up as a basic router or a more complex model-view-controller (MVC) framework

//put routes in a module to avoid polluting app.js with complex routing and business logic.
const routes = require('./routes/');
app.use('/', routes); //this registers routes folder as middleware for everything

//routes/index.js
const express = require('express');
const router = express.Router();
//could use one line instead: const router = require('express').Router()
const tweetBank = require('../tweetBank');

router.get('/', function(req, res) {
	let tweets = tweetBank.list();
	res.render('index', {tweets: tweets});
});

module.exports = router;

//router.get instead of app.get: 
//express module can create a router entity configurable outside of any app instance.
//router is a BOX for routes; a mini-app capable only of performing middleware and routing fns.
//all the app.VERB fns can be written as router.VERB. We export this router
//so that app.js can use it as a middleware handler for all / routes and subroutes. 

//templates: add style.css to public/stylesheets/
//replace index.html and layout.html in views/
//top of index.html says {% extends "layout.html %}: this is inheritance. 
//when nunjucks goes to render index, it automatically embeds that template inside the layout template and renders both as a singel file.
//other pages will also be able to extend layout in this fashion, so we only have to worry about each page's unique content.
//automatic embedding of unique template is inside the {%block content %} tag. 

//link tags in HTML automatically trigger an HTTP get request to URL assigned to href attribute.
//so long as server responds with a CSS file, al the rules in CSS file are applied to html in our app.
//line 13 gets bootstrap template via BS's content delivery network(CDN). 
//w/no domain name provided when we do href = /stylesheets/style.css, we are make a req to the same server taht served up the index.html file-- our sever.

//writing own middleware for express.static: 
//for every incoming request:
// 1) use request.path to get route
// 2) see if that route maps to a valid file in the public directory 
// 3) if not, go defer to the next matching middleware
// 4) if the file matches, send over its contents

What's this new :name part of the URI? The colon : is a trick that Express provides to define particular portions of the URI string as variables. In other words, in users/:name, the :name portion can be anything. Such URL parameters are detected and stored as properties of the req.params object:

// say that a client GET requests the path /users/nimit
router.get( '/users/:name', function (req, res) {
  console.log( req.params.name ); // --> 'nimit'
});
Here are some more examples to make this clear.

router.get( '/store/:product/reviews/:id', function (req, res) {
  // use req.params here
});

//======REVIEW NOTES ============
//when we start a node program, we always start at one place: app.js eg
//nodemon does automatic refreshing and keeps process running 

//const is block-scoped, and you can never reassign variable. 
//so if you use it in if statement block it will just never be available outside that

//server/client 
	//at start of program, your server is a process that lives on a network and receives msgs via HTTP
	//your browser sends GET to remote server when you try to access a URL 
	//client: browser. browser receives response from server and goes through browser's embedded software and modules to render the HTML response from server and create it.
	//the server only serves up HTML; client takes it from there.
	//localhost is 127.0.0.1 -- for every unix computer, this means 'self' 
	//doesn't make the server less remote than if it was at a different IP. 
	//even though it's running on same computer and browser, it is very very far away. 
	//the browser and node process don't have any direct contact; their only communication is
	//through HTTP messages sent by browser or Postman. 

//app in express is like a pipeline. 
	//you can build a server w node without express: 
	//but it will be less abstracted and more raw: you need HTTP module 
	//and doing simple things will be harder than in express.

	//reasons to use node w/o express: optimize performance for a computer that can't handle expres
	//notwithstanding hardware constraints, it makes a lot of sense to use express
		//does simple things easily: establish routes, render data

	//after we use pipeline.listen, it takes the built-in HTTP library from Node and builds a server
	//cf express source code

	//express doesn't allow us to have servers; it just allows us to organize requests and responses in a more featureful way.

	//you attach an express pipeline to an HTTP server and you can specify that every request sent to 
	//that port will go through the pipeline in the order that you specify. 




	//all middleware fns like volleyball and morgan can be used like so:
	pipeline.use(function(req, res, next) {
		volleyball(req, res);
		next(); //this passes control to next handler in the pipeline. 
	}); 

	app.use(function(req,res, next) {
		if(req.method === "GET" && req.url === '/') {
			/*...*/
		} else {
			res.render(/*...*/)
			next(); //res.render is a more featureful implementation of res.send
			//res.render is not a return statement. but it does fulfill the response. 
			//if you reach end of pipeline and pop out, you get 404 
			//so you will get two responses generated: one to do res.render and one for 
			//404. Express has somethign implemented where you won't get a 404 if you have something already 
			//generated. 
		}
	});

	//above is the same as 
	app.get('/', function(req, res, next) {
		/*...*/
	});

	//404 handling:
	pipeline.use(function(req, res, next) {
		res.status(404).send('Cannot GET /');
	}); //if you apply this, you will get error "can't set headers after they are sent" -- 
	//this means generally that you are generating two responses for one request, which is 
	//outside the protocol for HTTP. 

	//express allows you to use subrouters to organize routes into categories
	//eg for ecommerce store, have separate cart operation route, user route, product route
//usually you will not have more than 4-5 subrouters for an app. 

	//in routes/index.js, create router and then export it to app.js
	//require('path') always uses relative path

	require('./routes/index.js') //.js is redundant; it's always assumed.
	//also, index is redundant; if you require a directory it will go by default to find
	//index.js file. But this only works for files named index.js

	//nunjucks and templating 
		//view configuration, not part of pipeline!
		nunjucks.configure('views', {noCache: true});
		pipeline.set('view engine', 'html'); //have res.render work with html files
		pipeline.engine('html', nunjucks.render); //when giving html files to res.render tells it to use nunjucks render to smash together stuff
		//end view configuration

		//bc we embed templates in frontend with react, this strategy is not our end goal.
	//nunjucks is an express-agnostic tool; we use it to describe a file with delimiters like {%%} - writing out for loop or interpolating data
	//res.render('name')... means find 'views/name' and render it using the specified rendering engine. 
	//nocache means don't reuse what you read before because you dont want changes to be cached and not reflected.
	//so in development it's better to use nocache. 

	// res.render specifies a template file and some data, nunjucks smashes together data, express renders it using nunjucks engine 

	//for _.cloneDeep we want to make a deep copy because we don't want to return the actual data object
	//in case it gets corrupted 
		//we do clone deep because it does recursive copying- can go deep within 
		//and produce an entirely new, contents-included, data set.
		//if we did just shallow copy the only new thing would be top-level array, so 
		//when we go deeper it's the same objects in original data array. 

	tweetBank.list() //gives list of data 

//built-in library path: 
	dirName = directory of filewe're authoring right now.
	subRouter.get('/stylesheets/style.css', function(req, res, next) {
		res.sendFile(path.join(__dirname, '../stylesheets/style.css'));
	}); //this can get laborious if you need to create a handler for EVERY SINGLE FILE.
	//that's why we use static routing

	//pipeline ordering: 
	//place first the elmts that are most likely to generate responses, so piepline doesn't get run down 
	//a lot inefficiently


	const theTweet = tweetBank.find({id: parseInt(req.params.id, 10)});
	//because params.id is a string and id is a number, you need to parseInt 


	//POST and PUT are two methods with PAYLOAD body- 
	// to convey extra info w a get request you need a query string or using req.params. 
		//form data payload: post request such as posting text to form includes this.
		//by default, with express, the payload is not parsed out. 
		//that's why we need to use bodyparser. 
	//use network tab in google dev tools to see status, pages and routes

	//add showForm: true to rendering to make form show

	//2 formats for payload: JSON (main way to send POST and PUT requests) and urlencoded
	app.use(bodyParser.urlencoded()); //parses to req.body; 
	//it never generates a request but it modifies the body 
		res.redirect('/');
	//use this after a post request to redirect to homepage. Express makes this a lot easier than it woudl be with just regular node.
	
