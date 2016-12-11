//Static UI: - set up a small, single-user server app (which will mostly send static files for now) + design frontend w HTML+CSS and embedded Google map. this incorporates node/express/sequelize app work. also integrates use of 3rd-party Google API. 

//======Pre-reading notes

// Express middleware : any # of funcs invoked by the express routing layer before final req handler is invoked. invoked in the order added. 
	// - useful for logging
	// - a func like route handlers, invoked in same way, add before route handlers, same params as route handlers (but you need next) 
	// - sample functions cookie parsing/body parsing, building JS modules 
	// - mw can access req and res objs and may modify or add properties
	// - you MUST call next to pass along for processing; letting fn finish execution is insufficient. (bc of async etc, express has no idea when middleware is finished so you have to call next) 
	// - mw can be used to limit or record total response time if you want to timeout 

// - w/ no mount path, code is executed for every req to router (this vs app.use?)
	router.use(function(req, res, next) {
		//do sth
		next()
	})
// error-handling middleware takes 4 args
// built-in middleware: just express.static 
express.static(root, [options])
	// root is root dir from which to serve static assets. options:
	var options = {
	  dotfiles: 'ignore',
	  etag: false,
	  extensions: ['htm', 'html'],
	  index: false,
	  maxAge: '1d',
	  redirect: false,
	  setHeaders: function (res, path, stat) {
	    res.set('x-timestamp', Date.now())
	  }
	}
	// - you can have more than 1 static dir per app: 
		app.use(express.static('public'))
		app.use(express.static('uploads'))
		app.use(express.static('files'))

app.use(express.static('public', options))

Routing - defining application end points (URIs) and how they respond to client requests.
	var express = require('express')
	var app = express()

	app.get('/', function(req, res) {
		res.send('Hello World');
	})

	//route paths: can be strings, string patterns, or regexps 
	// - string patterns: 
		app.get('/ab?cd', function(req, res) {
			//matches acd and abcd 
		})

		app.get('/ab+cd', function(req, res) {
			//matches abcd, abbcd, abbbcd, etc
		})

		app.get('/ab*cd', function(req, res) {
			//matches abcd, abxcd, abRANDOMcd, ab123cd etc
		})

		app.get('/ab(cd)?e', function(req, res) {
			//matches abe and abcde
		})

	// - regexp paths: 
		app.get(/a/, function(req, res) {
			//matches anyth w 'a' in route name
		})
		
		app.get(/.*fly$/, function(req, res) {
			//matches butterfly and dragonfly, but not butterflyman etc 
		})

	//w route params: 
		app.get('/users/:userId/books/:bookId', function (req, res) {
		  res.send(req.params)
		})

	//response methods: 
		//res.download(), res.end() (ends response process), res.json(), res.jsonp(), res.redirect(), res.render(), res.send(), res.sendFile() (sends as octet stream), res.sendStatus()

	app.route() //for chainable route handlers: 
		//example:
		app.route('/book')
		.get(function(req, res) {
			res.send('Get a random book')
		})
		.post(function(req, res) {
			res.send('Add a book')
		})
		.put(function(req, res) {
			res.send('Update the book')
		})

	express.Router() //is a class that is used to create modular, mountable route handlers - also middleware etc - like a 'mini-app'
	//example: 
		var express = require('express')
		var router = express.Router()

		router.use(function timeLog(req, res, next) {
			console.log('Time: ', Date.now())
			next()
		})

		router.get('/', function(req, res) {
			res.send('birds home page route')
		})
	//load router module in main app: 
	var birds = require('./birds')

//Sequelize

	//selecting only some attributes: use attributes option, most often passed as an array: 
	Model.findAll({
		attributes: ['foo', 'bar']
	}); //SELECT foo, bar

	//rename attributes with a nested array
	Model.findAll({
		attributes: ['foo', ['bar', 'baz']]
	}); //SELECT foo, bar AS baz

	//aggregating w sequelize.fn: you need to give it an alias to be able to access it from the model. 
	Model.findAll({
		attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
	}); //SELECT COUNT(hats) AS no_hats

	//to add aggregation in a less tiresome way: 
	Model.findAll({
		attributes: { include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']] }
	}) //SELECT id, foo, bar, baz, quz, COUNT(hats) AS no_hats...

	//remove selected few attributes: 
	Model.findAll({
		attributes: {
			exclude: ['baz']
		}
	}) //SELECT id, foo, bar, quz

	//filtering query with where object: 
		//takes an obj from attribute:val pairs where vals can be primitives for equality matches or keyed objects for other operators. 
		//generate complex AND/OR conditions by nesting sets of $or and $and

	Post.findAll({
		where: {
			authorId: 2
		}
	}); //SELECT * FROM post WHERE authorId = 2

	Post.destroy({
		where: {
			authorId: 12,
			status: 'active'
		}
	}) //DELETE FROM post WHERE authorId = 12 AND status = 'active';

	Post.findAll({
		where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
	}); //SELECT * FROM post WHERE char_length(status) = 6;

//operators: 
	$and: {a: 5} //AND (a = 5)
	$or: [{a:5}, {a:6}] //(a=5 OR a=6)
	$gt: 6 //>6
	$gte: 6 //>=6
	$lt: 6
	$lte: 6 
	$ne: 20 //!= 20
	$eq: 3
	$not: true //IS NOT TRUE
	$between: [6, 10] //BETWEEN 6 AND 10
	$notBetween: [6, 10]
	$in: [1, 2]
	$notIn: [1, 2]
	$like: '%hat', //LIKE '%hat'
	$notLike: '%hat'
	$iLike: '%hat' //ILIKE '%hat' (case insensitive, pg only) 
	$notILike: '%hat'
	$like: { $any: ['cat', 'hat']}

	$overlap: [1, 2] //&& [1, 2] - pg array overlap operator
	$contains: [1, 2] //pg 
	$contained: [1, 2] //pg
	$any: [2, 3] //pg 

	$col: 'user.organization_id' //= 'user'.'organization_id'

//range operators: cf docs

{
	createdAt: {
		$lt: new Date(),
		$gt: new Date(new Date() - 24 * 60 * 60 * 1000) 
	}
} //createdAt < [timestamp] AND createdAt > [timestamp]

//relations and associations: 
//find all projects with at least 1 task where task.state === project.task 
Project.findAll({
	include: [{
		model: Task,
		where: { state: Sequelize.col('project.state') }
	}]
})

//pagination/limiting 
	//fetch 10 rows
		Project.findAll({limit: 10})

	//skip 8 
		Project.findAll({offset: 8})

	//skip 5 and fetch 5 after that 
		Project.findAll({ offset: 5, limit: 5})

//Ordering: order takes an array of items to order the query by. 
something.findOne({
	order: [
	['username', 'DESC'], 

	//order by max(age) 
	sequelize.fn('max', sequelize.col('age')),

	//order by max(age) DESC
	[sequelize.fn('max', sequelize.col('age')), 'DESC'],

	//etc see docs
	]
})

//HTML <select> : 

	//represents a control that presents a menu of options. Options w/in menu are represented by <option> elmts that can be grouped by <optgroup> elmts. Options can be pre-selected for the user. 

	// <!-- second value will be selected initially --> 
	// <select name="select">
	// 	  <option value="value1">Value 1</option> 
	// 	  <option value="value2" selected>Value 2</option>
	// 	  <option value="value3">Value 3</option>
	// </select>

//Bower: a package manager for frontend that installs right versions of packages that project needs and their dependencies. 
	//vs npm: npm installs dependencies for each pckg separately so it makes a big pckg dependency tree where there can be redundancies- several versions of the same pckg. This is hard for client-side JS - you can't add 2 versions of jQ or any other lib to a single page. 
		//w Bower, each pck is installed once + bower avoids dependency conflicts 

//Google Maps API: 
	// - declare app as HTML5 using <!DOCTYPE html> declaration
	// - create div elmt named 'map' to hold the map
	// - define JS function that creates a map in the div 
	// - load Maps JS API using a script tag 



//======Lecture notes

// - jQ is good for manipulating but gives no good system of organization 

//starting from scratch: 
	//empty dir start: 
	//install node and npm : npm init - creates package.json (scripts, dependencies, info about app) npm init -y will give you all questions for setting up 
	
	//install packages: express, body-parser, nunjucks, morgan/volleyball, sequelize (bluebird is a dependency), pg, pg-hstore. dev dependencies (not part of app when it runs) - nodemon to create start script using it. mocha and chai if testing --> npm i -D
	//npm i -S saves time from writing npm install --save 

	//uninstalling globally does not remove from local packages 
	//start script in package.json: 
		// "start": "nodemon index.js" --package.json knows waht is installed locally for the package and will use nodemon even if it isn't installed globally. If app.js isn't in the same directory, then include path to it. 

	//semantic versioning/semver: in dependencies in package.json. ^ symbol means, if there is an update to that, then download that new version. aka it is safe to update numbers until the first number is updated. 

	//favicon is the little icon for site in tab 

//in app.js: 
//create our top-level express app 
//bring in our models/db, sync before opening server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const nunjucks = require('nunjucks');
const volleyball = require('volleyball');

//set up rendering engine
app.set('view engine', 'html');
app.use('html', nunjucks.render);
nunjucks.configure('views', {noCache: true}); //in nunjucks, {% extends layout %} etc will be replaced by react

app.use(volleyball);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', function(res, req, next) {
	res.render('index');
}) //view page source will show the way that HTML originally was, before DOM was changed by things

models.db.sync({})
	.then(function() {
		app.listen(3000, function() {
			if(err) return console.error(err);
			console.log('Server listening intently on port 3000!');
		});
	})
	.catch(console.error);


//models: put each in a separate file.

	//models folder has an index.js and the goal is to export all tables as well as db connection itself
	const theDbConnection = require('./db');
	const Hotel = require('./hotel');

	module.exports = {
		db: theDbConnection
		Hotel: Hotel;
	};

	//also set up db connection in a single file by itself: db.js 
	const Sequelize = require('sequelize');

	const db = new Sequelize('postgres://localhost:5432/tripplanner');

	//in a model file: 
	const Sequelize = require('sequelize'); //needed in defining etc
	const db  = require('./db'); //we need db connection to be able to define tables

	const Hotel = dbConnection.define('hotel', { //always goes in singular but will be plural
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		place: {},
		hotel: {},
		activity: {}, 
		restaurant: {},
	}

	module.exports = Hotel;


//our app: Single-Page App (SPA) that not only stores and manipulates data on the server, but intelligently updates sections of the browser page using AJAX, DOM manipulation, and 3rd-party APIs.

// To be eligible, your layout must contain the Google Map and all of these other standard UI features (they don't actually have to do anything yet, but the interface must be there):

	// UI to navigate to hypothetical home, about, and contact pages
	// UI to select from the list of available hotels, restaurants, and activities
	// UI to select different days
	// A display of the day's selected attractions

	var { db } = require('./models'); //object destructuring = 
	var db = require('./models').db 

//for getting all hotels, restos, activities- promise.all  in route handler BUT do not return promise.all or the route handler will think it is done running and go on to error. 

//client-side dependencies: 
	// 1) CDN - user can always get latest ver of a pkg, pkgs cached on server close to client, pkg can use its own cache if lcient has used it before -- BUT creates additional dependencies for your app (depends on CDN AND your own server) and not all frontend pkgs have CDNs

	// 2) Bower- frontend pkg mgr - wild-used and can statically serve up whole bower_components folder. BUT you have to coordinate extra stuff. 
	// 3) npm - keeps things simple but it is not custom tailored for frontend and not all frontend libraries are available in npm. 
//bower install -g 
//bower init 
//bower install --save jquery bootstrap 

//this allows us to replace external dependencies (linking to bootstrap cdn in HTML) w an internal one 

//static routing: 
app.use('/bootstrap', express.static(__dirname + '/bower_components/bootstrap/dist'));

//npm scripts in pkg.json: 
{
    ...
    "scripts": {
        ...
        "start:production": "node theServerFilename",
        "start:dev": "nodemon -e html,css,js theServerFilename",
        "start": "npm run start:dev"
        ...
    }
    ...
}

//real gangsters (production apps) use PM2 to manage restarting the server if it goes down, not nodemon. 
//SASS compilation: 
	// 1) use command-line sass gem (ruby pkg) 
	// 2) use wrapper for libsass- like node-sass. 
	// 	- libsass is faster than ruby sass compiler. so install node-sass as a dev dependency. 
	// 	- insert build-css script into node pkg json:   "build-css": "node-sass -w -r assets/stylesheets -o public/stylesheets",

//include dependencies: 
	//touch views/layout.html; make index.html extend that. 
	//pull in dependencies: order can matter.
	//where to put <script> tags: if in head, DOM will not have loaded yet and you can't select elmts. If at the end of the body, DOM will be loaded but whole DOM will have been parsed already. Async/defer tags in head are another option. 
	//hrefs and srcs are uris that get handled by server as routes. server's static file middleware will attempt to resolve uris as file paths. 


//REVIEW NOTES

const Hotel = db.define({
	num_stars: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
			max: 5,
		}
	}
})

//simplifying model defns: 

const columns = {};
columns.name = Sequelize.STRING;
columns.cuisine = Sequelize.STRING;
columns.price = Sequelize.INTEGER;

const options = {};

options.instanceMethods = {};

//no need to define object literals in the call to define; you can split things up into variables and pass them in. 

options.hooks = {};

const RestaurantModel = dbConnection.define('Restaurant', columns, options);


PlaceModel.belongsTo(HotelModel); 
//you get methods on the PlaceModel --> you always get association methods on the source model (left; the one you call the method on). 
place.getHotel(), setHotel(), createHotel() //to delete hotel setHotel(null)



//syncing the models: 
var Hotel = require('./models').Hotel;
var Hotel = require('./models/hotel');
//3rd way is one we haven't learned yet

db.sync({force: true}); //if you get 'db.sync is not a fn', it is because the seed file exports dbConnection as db, so you can't do db = require('./models'). You need db = require('./models').db -> the actual db connection. 

//seed file: in devt, you run this whenever you change what db structure looks like. so (almost) always do force: true. Don't do this when your app starts up. 

return Hotel.create(hotel, {include: [Place]}); //will include placeid and info for hotel --> include is available on both the query and creation sides. 
Hotel.findAll({include: [Place]}); // -> include this place and also associate it - like a left join. you can use include to replace association methods 


asyncfunction()
.then({})
.then({})
.catch({})
.finally //a bluebird thing - "do this regardless of whether the previous went correctly." 

//getting a sequelize db: 
//1) can get results of query, write to json, do json stringify and write it in a file that can be used to reseed later. 
//2) migration: change db structure, but don't get rid of old data. 
//supported by sequelize: 
	//up fn in migration tells you what needs to be updated: adding and removing of columns. down is the opposite- how to get that in again. that will allow sequelize to change db structure while retaining structure. 
	//can also handle transfer of columns 
	//like a 'git commit' for your db structure- joe. 
	//every up and down describes a change from one db to the next. 
//3) db dump: you can do via shell or try to do in node. if data already exist then Sequelize models can interact w data- datatypes should persist unless they are specific to Sequelize.

//Promise.spread or .spread : for any promise that resolves to an array. 
fetchingAllHotels.spread([hotel1, hotel2, hotel3]) // --> take elmts and make them separate args. 

//select option elmts - the display value and the real option value that you get are not necessarily the same. 

//production -> prob easier to use cdn but version control can be hard, and cdn servers going down could wreak havoc on your site. 