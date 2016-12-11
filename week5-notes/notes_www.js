//websockets - a feature of client/server 

//In this workshop, we will be exploring really exciting concepts and technologies, including the HTML5 <canvas> element, EventEmitters and, best of all, socket.io!

// Our application is called the World Wide Whiteboard — a whiteboard you can draw on with other people ... on the internet! Now, that sounds pretty baller.

//browser/event-emitter.js: a publisher/subscriber or observer pattern: 
	// - allows an obj to register listeners for difft events (using .on) and to signal whne an event has hapened w some kind of payload (using .emit)

var game = new EventEmitter();

var giantsFanAtSportsBar = {
	cheer: function (playerName) { console.log('YEAH ' + playerName); },
	boo: function (playerName) { console.log('BOO! ' + playerName); },
};

game.on('giantsTouchdown', function (player) {
	giantsFanAtSportsBar.cheer(player);
});
game.on('eaglesTouchdown', function(player) {
	giantsFanAtSportsBar.boo(player);
});

setTimeout(function() {
	//runs .cheer w 'football mcfootbally' as playerN
	game.emit('giantsTouchdown', 'Football mcfootbally');
}, 200000);

setTimeout(function() {
	//runs .cheer w 'football mcfootbally' as playerN
	game.emit('eaglesTouchdown', 'Football mcfootbally');
}, 200000);

//whiteboard.js - draw in browser, uses canvas api - html5 and javascript api allowing for painting - 

// socket.io allows for a browser to connect to a server on a persistent connection, by which both the client AND server can push data to each other arbitrarily. This contrasts HTTP in which only the client can initiate communication.

// A helpful way to think of web sockets (or TCP sockets implemented in browsers) is to think of them as event emitters over a network.

//to make whiteboard collaborative: implement socket.io on our server and in our client-side js 
// 1) let each browser make a socket connxn to server- this connxn will allow us to send data from client and to client at any given time 
// 2) when client draws on wb, send draw data up from client's socket to server
// 3) when server receives draw data from client, give that data to each of the other connected clients, each of which will use their client-side code to take data and draw it on theri respective wbs. 

//A) connecting the socket: 
//1) install w npm i -S socket.io 
var socketio = require('socket.io');
//implemetn into server: several ways to do this. make this below the server.on('request', app) line: (so express app can take precedence over socket server for typical http reqs)
var io = socketio(server);

//this creates a new connection server for web sockets and integrates it into our http server
//then use socket server as an event emitter to listen for new connections: 

io.on('connection', function(socket) {
	//fn receives the newly connected socket, will be called for each browser that connects to server
	console.log('new client connected!');
	console.log(socket.id);
}); //!!! put this before server.listen! 

// io.on('connection', function(socket) {
// 	socket.emit('news', { hello: 'world' });
// 	socket.on('my other event', function (data) {
// 		console.log(data);
// 	});
// });

//B) update clientside JS so browser can initiate socket connxn w server: 
	// from browser's POV htis happens when 1) index.html page server to browser, 2) browser parses index.html and makes reqs for scripts, namely socket.io client lib and app.js; 3) app.js executes, running code to contact server and requesting a new socket connxn; 4) when socket connxn is est'd, browser's socket reference will emit a 'connect' event! 

	//in index.html, place new <script> tag linking to "socket.io/socket.io.js" -- this has to be above the one for app.js. no need to use express.static to serve up this js lib as with frontend stuff w bower, BECAUSE var io = socketio(server) places the socket.io/socket.io.js route on server. 

	//in app.js: 
	//window.location is an obj that describes the url of the page we're on
	var socket = io(window.location.origin); 

	socket.on('connect', function() {
		console.log('I`ve made a persistent two-way connxn to the server!');
	});

	//now when we run server and visit page, both the browser and node process will console.log the connection info. 
	//opening the page in another tab will est'blish a diff socket connxn w difft id. 
	//finding IP: ifconfig | grep 'inet 192.168'  --> IP :1337 

	//track when sockets become disconnnected: 
	//when a socket disconnects, it emits a 'disconnect' event. 

	io.on('connection', function(socket) {
		console.log('new client connection!');
		console.log(socket.id);
		socket.on('disconnect', function() {
			console.log('I thought we had a connection, but I guess I was wrong.');
		});
		socket.on('draw', function() {
			//do shit
		});
	});

//C) emitting draws from client: hook into event when whiteboard is drawn, and when event fires send payload up to server. 
//sockets are basically event emitters over a network, so they themselves have .emit and .on methods that can fire off events and send payloads- from server to client, and vice versa. 

//in server.js: 
io.on('connection', function(socket) {
	console.log('new client connection!');
	console.log(socket.id);
	socket.on('disconnect', function() {
		console.log('I thought we had a connection, but I guess I was wrong.');
	});
	socket.on('draw', function(logData) {
		console.log(logData);
	});
});
//in app.js: 
window.whiteboard.on('draw', function(start, end, strokeColor) {
	console.log(start, end, strokeColor);
	socket.emit('draw', start, end, strokeColor);
});

//D) broadcast data to all other connected sockets: 

//in server.js, get access to all sockets connected to a server with console.log(io.sockets) -- but we want to only emit ddraw data to sockets that are not teh one that originated the data. 
//cheatsheet: 
	// sending to sender-client only
	socket.emit('message', "this is a test");

	// sending to all clients, include sender
	io.emit('message', "this is a test");

	// sending to all clients except sender
	socket.broadcast.emit('message', "this is a test");

	// sending to all clients in 'game' room(channel) except sender
	socket.broadcast.to('game').emit('message', 'nice game');

	// sending to all clients in 'game' room(channel), include sender
	io.in('game').emit('message', 'cool game');

	// sending to sender client, only if they are in 'game' room(channel)
	socket.to('game').emit('message', 'enjoy the game');

	// sending to all clients in namespace 'myNamespace', include sender
	io.of('myNamespace').emit('message', 'gg');

	// sending to individual socketid
	socket.broadcast.to(socketid).emit('message', 'for your eyes only');

//lesson learned: you need to name the draw event different things (im drawing vs otherdraw) in order to avoid confusion between the sockets and make it work. 

//in server.js: 
io.on('connection', function(socket) {
	console.log('new client connection!');
	console.log(socket.id);
	socket.on('disconnect', function() {
		console.log('I thought we had a connection, but I guess I was wrong.');
	});
	socket.on('selfDraw', function(start, end, strokeColor) {
		console.log('Draw event is being caught here');

		socket.broadcast.emit('otherDraw', start, end, strokeColor);
	});
});

//in app.js: 
socket.on('connect', function() {
	console.log('I\'ve made a persistent two-way connxn to the server!');

	//hook into draw event being emitted from whiteboard: 
	window.whiteboard.on('draw', function(start, end, strokeColor) {
		// console.log(start, end, strokeColor);
		socket.emit('selfDraw', start, end, strokeColor);
	});

	socket.on('otherDraw', function(start, end, strokeColor) {
		window.whiteboard.draw(start, end, strokeColor);
	});

});

//previously I was trying to just do 'draw' events. 

//ec: - maintaining board state
// make difft paths - /turing-hall, /grace-hopper-atrium, /the-kitchen
// - whiteboard rooms or namespaces. 

//key takeaways: 
	//event emitters are objs in JS with two main methods, .emit and .on. 
		// - an .emit method takes 2+ args: event name (as string) and payload, which can be 1+ args to pass along to event's listeners. 
		// - .on method takes 2 args: an event name (as string) and callback fn, which takes whatever payload args passed along by .emit method.
	//socket.io lib abstracts over websocket implementation so we can implement real-time interaction in our web apps. 
		// - socket.io needs to be integrated into both server-side and client-side code. 
		// - both the io instance (socket-handling server) and instances of sockets are event listeners, with .on and .emit methods
		// - communicating: 
		// 	- from server to any connected sockets: server emits an event and sockets listen for that event.
		// 	- from client to server: - client side of socket emits an event and server listens for that event.
		// 	- socket.io has other methods to control which sockets  to hear, like socket.io.broadcast, namespaces/rooms 

//refactoring for es6: 
	//var -> const, => if fns don't rely on 'this'

	//immediately invoked f expr in eventemitter file- usu used because dev wants it to have private methods etc

	//server-side es6 can be run w latest version of node; the browser can handle it bc it is supported. in cases where there is not support, we use webpack and babel, etc. to transpile to ES5- supported code. webpack also allows us to have frontend modules. 
	//chrome does not currently support the es6 module system!!!! oh no! so webpack allows us to use import and export statements that are part of it. 

	//in whiteboard.js: 
	//el.addeventlistener can be changed to => by swapping out this with e.target. (cf game of life)  = event object target property 

	//default args: we can supply 'black' in strokeColor for whiteboard.draw