const http = require('http');

const server = http.createServer();
const pipeline = require('./app'); //.js is redundant when doing require, but you do have to specify other file exrtensions.

//use db here: gets db connection and registers recipients model
const db = require('../db');  

//sync db before turning on server: 

db.sync() //don't force: true here or you will drop tables every time your server restarts!
	.then(() => {

	server.listen(
		1337, 
		() => console.log('server listening on 1337'));
	})
	.catch(console.error);

//could do `server.on('request', pipeline);` to pipe all reqs through that 

//how do we listen for reqs on a server?
// server.on('request', (req, res) => {
// 	//an event listener
// 	//you can process server reqs w/o express like this. but it's hard to scale. 
// 	if (req.url === '/' && req.method === 'GET') {
// 		//tells browser what type the response is
// 		res.setRequestHeader({ 'Content-Type': 'text/html' });
// 		res.write('<h1>Hello</h1>');
// 		//ends the stream 
// 		res.end();
// 	}
// });

