const express = require('express');
const app = express(); //creates an express pipeline 
const bodyParser = require('body-parser');
const path = require('path');
// const giftRecipients = [
// 	'Mariana', 
// 	'Gladys'
// ]; 
//since this is embedded in the memory of the program, it will not exist when the process embedded in nodejs turns off. Info in the process is ephemeral and will go away really soon. 

//since we have provisioned the db in server.js, we can require in the db and models 
const db = require('../db');
const Recipient = db.model('recipient');

//allows us to parse out req.body for post reqs 
app.use(bodyParser.urlencoded({ extended: false }))
//w ajax requests, bodies are in json
app.use(bodyParser.json());

//serve up static files: 
app.use(express.static(path.join(__dirname, '../public')));

//mount the subrouter
app.use('/recipients', require('./routers/recipients-router'));
//useful bc you can reuse the same subrouters on a different path - useful to share same functionality on 2 separate paths if you, for instance, make an API or sth
app.use('/gift-receivers', require('./routers/recipients-router'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + './index.html');
});
//__dirname is a global var in node that provides the absolute path. 

// app.get('/', (req, res) => { //use a fat arrow fn- indicates that function body is independent of context + `this`*
// 	res.send('<h1>Hello</h1>'); //can also do `res.html('<h1>Hello</h1>');`
// });

	// * cf. 
	// ``` javascript
	// app.get('/', function (req, res) {
	// 	this.html('<h1>Helllo</h1>'); //lots of backend frameworks, eg. hapi, care about the execution context 
	// });
	// ```

// `app.listen(1337);` //builds a server under the hood and sets app pipeline as a handler on that pipeline. 
//express itself has nothing to do w the server- it is a req handler for servers. usu we will just export out the pipeline to our main file and set it as a pipeline for that- makes it easy to test w supertest bc you don't need a real server to turn on. 

//export out the pipeline so other modules can use it
module.exports = app;

//commonJS module exports usu only exports one thing unless you export an obj w multiple props or an array w multiple elmts. ES6 import/export can export difft stuff and specify a default export. 