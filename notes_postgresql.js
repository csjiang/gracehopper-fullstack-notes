// Progression of DBS
// 	- navigational DBs (<1970s) - like linked lists, dbs on tapes
// 	- relational (>1970s) - to take advantage of RAM HDs
// 	- NoSQL (>2000s), which takes ACID NoSQL = not only SQL

//postgres process- waits for incoming SQL queries, knows how to read/write to 
//disk in a performant way, sends back results.

//cf image of how requests and responses are processed from
//browser -> node/express -> DBMS and back 

//query sources: 
	//psql CLI 
	//GUI like Postico , Datazenit
	//other apps

// Tooling
	//psql opens up a shell w/in shell and you can use CLI there
	
//postgres is a TCP server: listening on a TCP port (default 5432) for reqs
//does disk access, sends back TCP response to the client that originated the req
//it uses Postgres protocol, not HTTP protocol. 
	//transport: TCP/IP; requests: postgres://; data sent: SQL 


//we use node-postgres to communicate w server: 
//db driver- allows JS node backend to communicate w DBMS
	//a client written to bridge the gap btwn apps and DBMS. 
	//correclty implements the protocols to speak with postgres 
	//just like psql or any other client. but where psql 
	//exposes keyboard input method, drivers expose an API -
	//apps writen in their native lang can use API to send queries

	// node-postgres is teh client we use - avaliable on npm as pg. use JS to send queries to db
//npm install pg --save
//you have to start both node server nad postgres server in the bckgd: they are two separate processes. 

//implements postgres protocol in a Node module 
//gives 'client' obj that we can pass SQL to as a string and will send query to postgres
//asynchronously talks via postgres protocol over tcp to postgres
//gives us a callback w 'rows' array of resulting table 


//returning keyword: 
//inserts and returns successfully INSERT/UPDATEd row 

//psql cli: 
//basic commands 
// \l - list all databases 
// \d - list tables in DB. \d table1 describes the table public.table1
	//lists all tables, views, sequences in a db. 
	//views- a subset of info deemed relevant to serve to a user when they query the table
	//sequence: a way for pg to keep track of sequences of #s so it can autoincrement ids etc 
// \d+ - lists all tables in DB along with addt'l info 
// \c dbname - connect to another db 
// \q - quit and disconnect from postgresql 

//machine hosts a database cluster- a collection of named dbs. 
//dbc is like root dir from which you can access lal subdirs on machine (but you can also create new 
//dbc on local machine the same way you can have multiple users per computer)

//default dbs: postgres, template0, etc are templates or utilities stuff 

//dbcs also have a specific set ofusers- contorlled by admin + permissions set by admin 


// ====================

//create db with CREATE DATABASE dbname; 
//connect to it with \c dbname
// CREATE TABLE users (
// id SERIAL PRIMARY KEY,
// name TEXT DEFAULT NULL,
// pictureurl TEXT
// );

// CREATE TABLE tweets (
// 	id SERIAL PRIMARY KEY, 
// 	userid INTEGER REFERENCES users(id) NOT NULL,
// 	content TEXT DEFAULT NULL
// 	);

//serial is autoincrement - automatically increments primary key when new entry is added 
//so you don't have to add it manually

//seed db from file with random data: 
//psql -d dbname -a -f path/to/seedfile.sql

//OR 
//psql 
//\i path/to/seedfile.sql


//path for sql queries with our db
//sending db req: node app calls fn provided by pg, passing string SQ query 
// - then, pg driver conects to postgres as client and sends SQL query using correct protocol 
// - postgres server: translates query into executing series of fs operations

//receiving db response: 
//postgres server sends result of fs operations back to connected pg driver
//pg driver parses raw response and builds js array of row data
//node app receives array in a callback fn 

//instead of installing pg, you can sometimes do pg-native which is implemetned in C++ for speedier operations. 
//to use pg native bindings you need to change code in app

//router has to access db client. if we had many route files each might include dbc as a dependency. 
//to make things easier we abstract this client object to a module and then we can require it whenever we need it for a page.

//create new folder db, touch index.js inside it.
//inside index.js: 
var pg = require('pg');
//NB: with normal postges installation w trust authentication, you can omit
//username and pw from connection string 
//callback to connect is optional; connect behaves synchronously and will throw an error if connection fails. 

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools


//docs example
var client = new pg.Client();

// connect to our database
client.connect(function (err) {
  if (err) throw err;

  // execute a query on our database
  client.query('SELECT $1::text as name', ['brianc'], function (err, result) {
    if (err) throw err;

    // just print the result to the console
    console.log(result.rows[0]); // outputs: { name: 'brianc' }

    // disconnect the client
    client.end(function (err) {
      if (err) throw err;
    });
  });
});

module.exports = client;

//fs solution
// setting up the node-postgres driver
var pg = require('pg');
var postgresUrl = 'postgres://localhost/___YOUR_DB_NAME_HERE___';
var client = new pg.Client(postgresUrl);

// connecting to the `postgres` server
client.connect();

// make the client available as a Node module
module.exports = client;

//next, import client module in the routes module so routes can use dbc to make queries

//eg 
client.query('SELECT * FROM tweets', function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
});

//query method takes a callback w the result of executing the query. 
//result obj has some metadata attached to it, but if we just want rows returned we can access them via result.rows. 

//insert query
INSERT INTO tablename (column1, coulmn2, column3, ...columnN) VALUES (value1, value2, value3...valueN);
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES (1, 'Paul', 32, 'California', 20000.00 ,'2001-07-13');
//default value if col is omitted 
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,JOIN_DATE) VALUES (2, 'Allen', 25, 'Texas', '2007-12-13');
//specify default val 
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES (3, 'Teddy', 23, 'Norway', 20000.00, DEFAULT );
//multirow values syntax for inserting multiple rows; 
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES (4, 'Mark', 25, 'Rich-Mond ', 65000.00, '2007-12-13' ), (5, 'David', 27, 'Texas', 85000.00 , '2007-12-13');

//optional RETURNING clause causes INSERT to compute and return value(s) based on each row actually inserted--
//useful when you want to obtain values supplied by defaults such as serial seq number. Any expression using table's columns is also allowed. 
INSERT INTO distributors(did, dname) VALUES (DEFAULT, 'XYZ')
	RETURNING did;

// 	CTRL-U: clear line
// CTRL-A: go to beginning of line
// CTRL-E: go to END of line
// Alt-MouseClick: Go to specific point in line

//string interpolation: 
//use numbers with $ in querystring, include array of args to passto query (arr[0] = $1)
client.query('SELECT name FROM users WHERE name=$1', ['Nimit'], function(err, data) {
	/*...*/
});

client.query('INSERT INTO tweets(userId, content) VALUES ($1, $2)', [DEFAULT, req.body.content], function(err, data) {
	/*...*/
});

// Implement a search input field that given a string of text finds relevant tweets.
// Try building out a tagging feature. Users should be able to add tags to their tweets, as well as filter the list of tweets based on a tag.
// Try creating a "retweet" button. It should do...whatever it is you do when you "retweet" something.
// Add a "delete" button for tweets. Clicking this button should trigger a request to the backend that will remove the tweet from the database. (Note that sending an HTTP DELETE from a HTTP form is not possible using what we know today. You will need to send a POST request.)
// Client.query takes a callback, so our routes are getting clogged up with double-nested callbacks. That kind of stinks. Why not write a function that will wrap that nasty callback in a reliable Promise?
// Create a tweet in your database and display it whenever #javascript is referenced in the twitter live stream

//=====================
//Twitter.sql review notes

//create db connect db create tables
//seed db
//index.js file in /db/
	//require pg 
	var pg = require('pg');
	//connect client
	var client = new pg.Client('postgres://localhost/twitterdb');

	client.connect();
	module.exports = client;

//in index.js in routes
	//require client
	var client = require('../db');

	function respondWithAllTweets(req, res, next) {
		client.query('SELECT * FROM tweets INNER JOIN users ON users.id=tweets.userid', function(err, result) {
			if (err) return next(err); //next will pass to next error handling middleware, which is the next route handler with 
			//four arguments (err, req, res, next). since we don't have error-handling middleware here, it will go to express's default 
			//error-handling middleware. 
			var allTheTweets = result.rows;
			res.render('index', {
				tweets: allTheTweets,
				title: 'Twitter.js', 
				showForm: true
			});
		});
	};

	//single-user page 
	router.get('/users/:username', function(req, res, next) {
		client.query('SELECT name, content FROM tweets INNER JOIN users ON tweets.userid=users.id WHERE users.name=$1', [req.params.username], function(err, result) {
			if(err) return next(err);
			var tweetsForName = result.rows;
			res.render('index', {
				tweets: tweetsForName,
				title: 'Twitter.js', 
				showForm: true
			});
		});
	});

	//single-tweet page
	router.get('/tweets/:id', function(req, res, next) {
		client.query('SELECT tweets.id AS tweetid, * FROM tweets INNER JOIN users ON tweets.userid=users.id WHERE tweetid=$1', [req.params.id], function(err, result) { //somethig in the node postgres driver overwrites id columns 
			if(err) return next(err); //return here is like an implicit 'else'
			var theTweet = result.rows;
			res.render('index', {
				tweets: theTweet,
				title: 'Twitter.js', 
				showForm: true
			});
		});
	});

	//post a new tweet
	router.post('/tweets', function(req, res, next) {
		// client.query'insert into tweets(user_id, content) values ((select id from users where name=$1), $2)', [req.body.name, req.body.content], function() {

		// }); //assumes user already exists. make subquery in values 
		client.query('SELECT * FROM users WHERE users.name=$1', [req.body.name], function(err, result) {
			if(err) return next(err);
			if (!result.rows.length) {//create a user 
				client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [req.body.name], function(err, result) {
					if(err) return next(err);
					var user = result.rows[0];
					client.query('INSERT INTO tweets (userid, content) VALUES ($1, $2) RETURNING *', [user.id, req.body.content], function(err, result) {
						var newTweet = result.rows[0];
						io.sockets.emit('new_tweet', newTweet);
						res.redirect('/');
					};
					});
				});
			}	else //create tweet 
		});
	});

	//to avoid callback hell, wrap those callback fns in other fns
router.post('/tweets', function(req, res, next) {
	client.query('SELECT * FROM users WHERE users.name=$1', [req.body.name], checkUserId);

	function checkUserId(err, result) {
		if(err) return next(err);
		if (!result.rows.length) makeNewUser();
		else insertTweet(null, result);
	};
	
	function makeNewUser() {
		client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [req.body.name], insertTweet);


		// function(err, result) {
		// 	if(err) return next(err);
		// 	var user = result.rows[0];
		// 	insertTweet();
	};

	function insertTweet(err, result) { //you can access result b/c it is part of the enclosing fn 
		if (err) return next(err);
		var user = result.rows[0]; 
		client.query('INSERT INTO tweets (userid, content) VALUES ($1, $2) RETURNING *', [user.id, req.body.content], function(err, result) {
			var newTweet = result.rows[0];
			io.sockets.emit('new_tweet', newTweet); //cf previous workshop for io.sockets 
			res.redirect('/');
	});
};

//core takeaways: 
//this workshop serves as a conceptual bridge btwn working w database directly with SQL via a shell client,
//and programming an app with ORM (object-relational mapper) like sequelize. 

//pg database driver allows yoou to make sql queries from inside node app

//promises provide a good way to avoid multiple nested callbacks as in post route

//postgres DbMS process acts as a server (via TCP/IP) for postgres protocol- it converts incoming reqs to fs ops and sends back responses

//pg module is postgres driver written for node implementing the postgres protocol so we can use JS to send queries to postgres process.
//persistent DB lets us store data on disk so information persists through server restarts etc







