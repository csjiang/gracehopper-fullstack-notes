//express.js

//computers on the Internet communicate via a series of protocols - rules for how machines communicate.
//sometimes protocols are layered on top of one another

//HTTP protocol - like the postal service - identify which machine and process to communicate to.
	// - identify IP (internet protocol) -- lower-level protocol for identifying computers on network
	// - any given cpu has different processes that can accept and initiate requests (TCP port # to reach correct server port)
	//TCP and IP are like post office- get msg where it needs to go. 
	// - HTTP: how message is formatted. like etiquette for addressing envelopes.

	// HTTP
	// client			'the internet': TCP/IP 			server 
	// client makes requests; --------------> server responds
	// 						<------------- //express is code we write so server accepts and responds to requests 
	// requests and responses go through the internet. 


	//rules for HTTP 
		//every req gets exactly 1 response. err gets thrown if we break this rule
		//HTTP protocol is a set of rules, like JS specification. Not an implementation (eg V8 engine). 
		//often used for communication
			//node library http is an implementation of these rules. 

	//servers, clients
		//a server is 'remote' but may not necessarily be on a separate machine: you can have a server on your machine and interact w it on your machine. 
		//a server doesn't necessarily imply a remote machine; it just implies a separate process. 

		//you can also have multiple clients on the same machine. 
	//request
		//cycle begins when a client sends a request.
		//an HTTP request is a message with a certain format. 
		// components: 
			//URI: uniform resource identifier. Unique identifier for sth on the server eg /docs/1/related
			//verb: what user wants to do: eg POST (adding new info); GET (requesting info on server) 
			//headers: metainfo about what we are sending eg "accept: image/gif, image/jpeg, */* (which means you can accept anything)", 'accept-language: en-us', 'accept-encoding'
			//body (put and post requests have bodies; not all requests have bodies. get requests dont necess have body, but may have sth else attached that goes to server. 
	//CRUD!!!!
			//CRUD apps: 'create, read, update, delete' = have HTTP verbs POST, GET, PUT, DELETE functionality. 

	//sample response components: 
		//status: '200 ok' - reports how the processing of request went. 200OK means everything was ok 
			//common statuses: 200, 201, 304, 400, 401, 404, 500 (OK, created, cached, bad request, unauthorized, not found, server error)
		//headers: date, server (tells you what serves response), content length, content type, etc
		//body:  Response also has a body - an HTML body, so if you open it in a browser it gets rendered.  

//EXPRESS: a node library for request handling. 
//node actually has built-in HTTP library; express is not necessary. 
	//HTTP implementation: 
	var http = require('http');
	var server = http.createServer(function(request, response) { //creates HTTP server with callback that takes any request and gives back this one response only: 
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("Welcome to the example page!"); //this will always send back this response. 
		response.end();
	});

	server.listen(1234); //tells server to listen on a specific TCP port. 
						//so if you use browser and go to localhost:1234, you will get HTML with 'Welcome to the example page!'



	var http = require('http');
	var server = http.createServer(function(request, response) { //creates HTTP server with callback that takes any request 
		if (request.url === '/example') {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("Welcome to the example page!"); //this will always send back this response. 
			response.end();
		} else if (request.url === '/about') { //localhost:1234/about accessed on browser will return this page. This is a GET request. 
			response.writeHead(200, {"Content-Type": "text/html"}); 
			response.write("Welcome to the <b>About</b> page!");
			response.end();
		}
	});

	server.listen(1234); //tells server to listen on a specific TCP port. 
						//so if you use browser and go to localhost:1234, you will get HTML with 'Welcome to the example page!'

	//to make a post request: curl http://localhost:1234/example -X POST (curl by default makes get request; this makes a post request.)
		//will get same response bc url doesn't care about verb used. 

		//if you specify 		
		if (request.url === '/example' && request.method === 'GET') 
			//curl will just keep waiting for that request. 

		//logic can get complicated, so we use express. 

var express= require('express');
var app = express(); 
//express gives you a callback fn that replaces fn taking request and response 

app.listen(1234, function() {
	console.log('server listening for connections on port 1234');
});

//response handlers 
app.get('/example', function(request, response) {
	response.send('<i>Welcome to the example page!</i>') //no need to set headers and write to response and response.end()
});

//sending back a specific response: chain methods: 
response.status(404).send('404 not found');

app.post('/example', function(request, response) {
	response.send('Thank you for the post request!');
});

//two handlers on same URI (example) but make different responses for different requests: post or get. 
//only specific URIs and verbs

app.all('/example', function(req, res) {
	res.send('Thanks for your request to "/example"!');
}); //now you will get the same response no matter what request you send. 


//when you type stuff in in the browser it's always a get request. to send diff requests, 1) use curl 2) use postman 

//ordering is important: file is like a pipeline and request goes from top of code through it to try to find things it matches in method and URI: 
//so if app.get was first in the file it would match that and callback fn for that would fire and we would never get to app.all! 
//make sure to be vigilant when you have handlers matching the same verb and URI. 


/*Beautiful create-read example! */
var dumbledores = [], id = 0;
//in this app, users can create new dumbledores with post. 
app.post('/data', function(req, res) {
	dubledores.push({
		name: 'dumbledore', 
		id: id++
	}) //common to send back newly created thing
	res.status(201).json(dumbledores[dumbledores.length-1]) //sends back last elmt in array. 201 means new resource created. 
});

app.get('/data', function(req, res) {
	res.json(dumbledores) //express's json method sets headers appropriately and you just pass it teh object to send back as json and it sends that back! magic!@!!!
});
//curl localhost:1234/data -X POST ------> will increment dumbledores. 
//curl localhost:1234/data ------_> will get dumbledores. 
//nodemon package stops and starts server every time it detects changes! 


//callback fns for requests have a third possible parameter: 
	function(req, res, next) //next gives control to the next matching route handler. 

app.get('/example', function(req, res, next){
	if(req.headers['user-agent'].split('/')[0] === 'curl') {
		res.status(403).send('this is as far as you get to go, curl!!!!'); //will stop req if it comes from curl
	} else {
		next(); //will go onto next route handler, so browser doesn't hang. 
	}
});

//middleware: use matches all verbs w this URI and anything that is /example + sth else on URI. 
app.use('/example', function(req, res, next) {
	console.log(req.method), 
	console.log(req.url);
	next(); //only pass args to next if there is an error to be handled. 
}); //for everything this will log this req info out before passing control onto the next req handler!! 

app.get('/example', function(req, res, next){
	res.send("Hello, browser user!"); //allows you to get response if you send req through browser. 
});

//req.params : variable section of the URI. 
app.get('/times2/:number', function(req, res, next) {//w/ colon, this tells express that following thing is a variable in URI. 
	var result = req.params.number * 2 ; 
	res.json(result);
	console.log(req.params) //logging out req.params itself will show it to be an obj w various properties on it. 
		//'/times2/:number/:var2/:var3' will put more params on that req object. 

}); //localhost:1234/times2/15 will give you this. 

//req.query - when we define sth that can handle query strings in URL, we don't have to specify anyth in the URI when writing the route handler. 
//however, we do have access to req.query object 
app.get('/times2', function() {
	var result = req.query.number * 2;
	res.json(result); //localhost:1234/times2?number=10 --> this in URL will add number = 10 to req.query object. 
	//even works with multiple parameters: localhost:1234/times2?number1=111&number2=3 (just update var names in var result assgmt)
});

//accepting payload with POST request: we need BODY PARSING MIDDLEWARE to access any body with express
// npm install --save body-parser 
var bodyParser = require('body-parser');
//adding this as middleware
//typically, use the .use method bc you want it to apply to multiple types of incoming requests. 
//if you dont specify a URI it will match for any URI
app.use(bodyParser.urlencoded({extended: true})); //extended true lets you have a query string w nested objects
app.use(bodyParser.json());
	//this is standard stuff that you can include at start of your document 

app.post('/example', function(req, res, next) {
	var msg = 'Thank you for this: ' + req.body.message;
	res.send(msg);
}); //we write this to expect that req.body is some json obj w a message property on it. 

//use postman to make req w message body on it: 

//enter in body tab: json type, {'message': "you look great today!"}
//you can also do this in curl with the correct syntax: -X POST
// and then you set the header -h and set content-type json and -d for data that you want to be the JSON. 

//app.use vs app.all: both apply to all verbs. BUT: 
	//app.use matches anything that starts with example and anything that has example/ after it as well.
	//app.all is exact match for uri and nothing that starts with uri: 
		//so it will match example/ but not example/more/

//ERROR HANDLING MIDDLEWARE
	//add route: 
	app.get('/roulette', function(req, res, next) {
		var n = Math.random();
		if (n > 0.5) { 
			res.send("Phew! No error this time...");
		} else {
			throw new Error(); //this will crash server and it wll not be able to handle more stuff. you have to handle error!
				//you can't just throw an error and have it end, even if you are doing error-first callbacks or promises etc where errors can fail silently. 
		}
	});

//to do error handling: 

	app.get('/roulette', function(req, res, next) {
		var n = Math.random();
		if (n > 0.5) { 
			res.send("Phew! No error this time...");
		} else {
			var err = new Error(); 
			next(err);
			fs.writeFile('text.txt', function(err, results) {
				if(err) {
				next(err)
				} //handle errors with asynchronous code! 
			})
		}
	});

app.use(function(error, req, res, next) {//if theres 4 arguments, you know this is an error handler middleware,
	//and so whatever error has been 'next'ed will be passed in as that error. 
	console.log(error); //will log out error to me
	res.send("Uh oh, something went wrong...") //now that you have added this you can handle future requests and won't crash!
});

//express has default error handling middleware, but for good practice, at the bottom of all the routes (because order matters!) make sure you have sth that looks like this. 
	app.use(function(err, req, res, next) {
		console.log(error);
		res.send("Error")
	});

//ROUTERS!!!!
	//req like a pipeline, will go through the file looking for route handlers that match method/URI of req that was sent. 
	//when it finds a match it will be nexted or can get a response back.
	//adding SIDE PIPELINES- routers can come off the side and reqs can go through those as well.
	//this is a way to organize things as you get more and more routes 

	var birdRouter = express.Router();
	//you can also have route handlers w specified method and URI for routers:
	birdRouter.get('/hens', function(req, response, next) {
		res.send('Cluck cluck!');
	})
	birdRouter.get('/crows', function(req, res, next) {
		res.send('Caw caw!');
	});
	//this router stands alone right now because it hasn't yet been hooked into the main express app. to 'hook it up', include this subrouter as middleware.

	app.use('/birds', birdRouter); //for any reqs starting with 'birds', use the birdRouter. 
	//localhost:1234/birds/crows will be handled by the birdrouter. 

	//these routes have been mounted on top of /birds. you can't do /crows 
	//because there is no route handler matching that url, but you can match birds/crows. 

//express
	//treats reqs as objects, created by event
	//matches on verb AND route to find appropriate handler callback fn
	//can chain handlers using next
	//enables modular layering with 'routers'

//client: sth that makes http requests.
//server: sth that processes reqs and responds to http reqs. 
//request: formatted msg the client sends, contains VERB, URI (route), headers, and body. 
//response: formatted msg the server sends in response to a req with status code and headers (eg content-type) and body.   
//request-response cycle: client always initiated by sending req, and server completes it by sending exactly one response. 
	//express throws an error if you try to send two responses: 'error- cannot set headers after...' //think of it as a formalized series of steps/protocol
//middleware: often written using use or all, depending on intended fn of middleware. A fun that handles responding to requests of the form function(req, res, next) {...}
	//does sth in the interim and passes on to other routers to provide a response. 
	//middleware: for handling things that should happen before the req is sent (eg logging out what was sent before req is sent; eg authentication middleware like stopping 
		//reqs sent from a certain user, or catching errors-- in this case, middleware is an endpoint.) 
//request query string: //a way to pas data from client to server: ?x=123&foo=that --> gets added to req.query object as properties
//request body: a way to pass data from client to server. bookId=12345&author=Nimit --> gets added to req.body object as properties
//request params : variable portion of URI. Has to begin with :variableName
//router - organizes different routes. Like a 'layer' of route handlers (middleware). 

//gotchas!
	//app.get vs app.get (to 'get a value that is part of settings for app', where you pass in one string.) If you pass in URI and then callback, you will get the right app.get.
	//routes are not file paths --> just strings. If we want a route serving up a specific file we have to map that URI to that specific file. 
	//order matters: if we have matching route handlers, first one will always send the response. 
	//req.params v req.query v req.body
	//app.use v app.all - both match on all verbs but only use does partial matching with routes. 
	

