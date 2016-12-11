//sequelize is the most important workshop in the world 

// ACID: used to describe databases- four separate properties. an acid-compliant db will have transactions w the following properties: 
	// - atomicity - all or nothing- transaxns will fail all the way, or succeed all the way. 
	// - consistency - must bring us to a valid state - transaction should follow any constraints, cascades, triggers that we've set for our database (eg we don't want a column to store a certain type of value; the transaction shouldn't succeed if it tries to make a column w a null value )
	// - isolation - concurrent execution that mirrors serial execution results - if we have two transaxns executing at the same time, the end result should be the same as if one had run and then followed by the other  
	// - durability - transactions persist- results of transactions persist 

// transaction: a sql command that will 
//postgres is 99% acid-compliant; a lot of nosql dbs are not bc they trade off some acid-compliance for difft benefits (esp for scalability). 

//CAP theorem: a kind of trilemma. 
	//consistency: all clients see the same data
	//availability: each client can always read or write 
	//partition tolerance: system works even if network splits 
	//'pick 2': reality is more complex 

//classic ACID databases choose consistency over availability; nosql dbs commonly choose availability over consistency. 
	//cf visuals from lecture for visualization of CAP theorem trilemma 

//sequelize: an ORM- object-relational mapper. 
	//access SQL objs from node.js
		//features: 
		//schema modeling/validation
		//data casting (convert sql types to js types)
		//query building
		//hooks (code that runs pre/post save/delete/update)
		//getter methods (a fn that you run when you want to access some instance's property), setter methods, and virtual fields (properties on the object; not actually saved in db)
		//class vs instance methods of models
	//postgres: tables and rows
	//sequelize: models and instances (cf classes and instances) 

	//sequelize basics:
		// make a Model (interactive blueprint object)
		// extend Model w hooks, class and instance methods, virtuals, etc
		// connect/sync the completed model to an actual table in an actual sql database - define how you want table to look in your js; sequelize communicates w db and creates table if there is not one that looks like this
		// use the Model (table) to create instances(row)
		// use the instances to save/update/delete 
		// methods will return a promise that you can resolve 

	//create a Model: 
	const Sequelize = require('sequelize');
	const db = new Sequelize('postgres://localhost:5432/twitter');
	const User = db.define('user', {
		name: Sequelize.String(); 
		//cf slides for rest of notes 
	})
	//sync model to table
	User.sync().then(/*...*/) //you can use force option to drop whatever db is on hand and create a new one 
	
	//model & instance usage: 
	const person = User.build({
		name: "Emily",
		pictureUrl: "#"
	}); //build is a synchronous method: doesn't return a promise. it only constructs a sequelize obj, an instance of a user that inherits methods and properties from User class; doesn't save to db yet. 

	person.save().then(function() {/*...could redirect, do stuff w object etc*/})

	User.findAll().then(function(users){/*...*/}); //finds all user rows in table; each one is an object. 
	//there's also findById(numIdToFind), findOne() //finds first matching one, .findOrCreate, etc. 
	//when promise resolves it will be an array w each row as an obj in that array. we can do stuff with it then 
	//sequelize uses bluebird for its promises 

	//sequelize lives inside of node.js process
	//typically we write sequelize methods and interact w instances and Methods in our express routes 
	//a user's req made from some client will trigger a req from our server to the db - before we used node pg; now we use sequelize. 
	//sequelize can also communicate w some other dbms such as postgres, mysql, sqlite 

	//sequelize is one more layer on top of the node/postgres driver, creates sql queries programmatically 

	// when we use sequelize ORM: walkthrough- 
		// express callback for a certain route has a sequelize method called: 

		// sequelize: ORM- 
		// 	read the js code User.create({name:'Emily'}) => sequlize creates string sql (postgres dialect) query 'INSER INTO users...' => 
		// 	passes that sql query to node 'pg' - 

		// node/postgres: protocol/dialect - 
		// 	connects via TCP/IP to postgres server running in bckgd on computer; 
		// 	uses postgres protocol to tell postgres it has an incoming sql query, sends sql query to postgres

		// postgres: db - parses query, changes data on disk, sends reqponse to node pg using postgres protocol on tcp connection 

		// node /postg: receives raw string data from postgres, perhaps sth like "create 1 row in ..." and turns raw string intoa n array of row objs and hands to sequelize

		// sequelize: mutates the returned data and constructs new, poswerful objects w prototypal methods eg 'save'
		// resolves promise it returned from 'create' w newly created sequelize instance obj (may be an array of objs too depending on method)

		//w express we can do res.json(User) and that will send json back to client 

	//an orm models (represents) your data as objects w properties and methods
	//added functionality facilitates data manipulation in JS app-- abstracts and simplifies the act of reading and writing to SQL dbs

	// npm install sequelize pg pg-hstore --save 

	//create a db named wikistack: w psql suite of CLI tools installed, use createdb from CL: createdb wikistack 
	//use new module in codebase to encapsulate sequelize init code: mkdir models touch models/index.js

	//require sequelize and connect it to currently-running db process: in models/index.js, insert: 
	var Sequelize = require('sequelize');
	var db = new Sequelize('postgres://localhost:5432/wikistack');
	//create schemas: 
	var Page = Sequelize.define('page', {
		title: {
			type: Sequelize.STRING
		}, 
		/*...Sequelize.ENUM(option1, option2) is like boolean but w 2 user-defined options
		- you put each column as a key w its own obj to facilitate doing getter and setter fns later on 
		*/
	});

	module.exports = {
	  Page: Page,
	  User: User
	};
