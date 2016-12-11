//testing


//=========Pre-reading notes
//TDD in practice
//traditional devt writes code until a concept is represented 

//example of testing w mocha and chai: 
	//index.js
	var uniqueRandomArray = require('unique-random-array');
	var starWarsNames = require('./starwars-names.json');

	module.exports = {
		all: starWarsNames,
		random: uniqueRandomArray(starWarsNames)
	};

	//index.test.js
	var expect = require('chai').expect;
	var starWars = require('./index');

	describe('starwars-names', function() {
		// it('should work', function() {
		// 	expect(true).to.be.true;
		// });
		describe('all', function() {
			it('should be an array of strings', function() {
				expect(starWars.all).to.satisfy(isArrayOfStrings); //expect(starWars.all).to.not.satisfy(isArrayOfStrings);

				function isArrayOfStrings(array) {
					return array.every(function(item) {
						return typeof item === 'string'; 
					});
				}
			});

			it('should contain `Luke Skywalker`', function() {
				expect(starWars.all).to.include('Luke Skywalker');
			});
		});

		describe('random', function() {
			it('should return a random item from the starWars.all', function() {
				var randomItem = starWars.random();
				expect(starWars.all).to.include(randomItem);
			})
		});
	});

//=========Lecture notes

//the ability to write good tests, write code in a way that facilitates testing, and do testing - what separates a good dev from a great one - Joe. 
//write tests for capstone proj! 
//testing keeps a proj w some longevity away from technical debt (incurred when you cut corners, thereby dinting maintainability of code)

//tests
	//drive interfacing of code + how to access it

//history of testing: manual -> automated. 
	// developers testing their own code -> dedicated testers following written scripts (cf QA) -> capture/replay testing -> scriptable unit tests (write code to test smaller units of program) -> test pyramid, TDD, continuous integration 
//tools:
	//JS has Jasmine + Mocha/Chai 

//mocha 
	//is a test runner: handling for creating specs, creating tests 
	describe() //comes from mocha: not a node default.

	//expect that calc is imported from another file + its existence is asserted. 
	const Calculator = require('./calc')
	//create new calc to test with
	const c = new Calculator();

	describe('Calculator', function() {
		it('should do something', function() {}) //give 'it' function a label and provide a fn. 
			if (typeof Calculator === 'function') {

			} else {
				throw new Error('Calculator is not a function'); //if calc is an obj or sth else, it will fail because error is thrown. Failure occurs because error is thrown, NOT because calc is not a function. 
				//A test only fails if an error is thrown. 

				//it is feasible to use mocha without chai, but you have to manually write your tests and conditions for error. 
			}
	//nested describe: describe calculator's add function. If you nest things correctly, the spec report will also have nice and intuitively ordered 
	//make tests pending by adding x in front of 'it' functions 
		describe('add function', function() {
			it('should exist', function() {
				if (typeof c.add !== 'function') {
					throw new Error('Add function does not exist');
				}
			});

			//now that you know it exists, add another test: 
			it('should add two numbers', function () {
				const result = c.add(2, 2);
				if (result !== 4) {
					throw new Error(`Unexpected result from add function: ${result}`); //template string is a feature of ES6! You can just concatenate if you are doing ES5 formatting. 
				}
			})
		});
	});
	//in bash: mocha calc_test.js

	//cf mocha cli options 

	//in calc.js: 
	const Calculator = function() {};
	Calculator.prototype.add = function(a, b) {
		return a + b;
	}; //in ES6: calculator class 

	//mocha gets installed globally bc we interact w it from the CLI

//CHAI is an assertion library. 3 dialects: assert, should, and expect. 

	//chai is sth that gets installed per package (locally) bc it is run per file. 
	//require chai at the top of the test specs js file
	const chai = require('chai') 	
	const Calculator = require('./calc')
	const c = new Calculator();

	describe('Calculator', function() {
		it('should exist', function() {
			expect(Calculator).to.be.a.('function');
		});

		describe('add function', function() {
			it('should exist', function() {
				expect(c.add).to.be.a.('function'); //chai also creates a very descriptive message about why the test failed: what was expected vs what was actual result.
				// eg AssertionError (a custom error that comes from Chai): 'expected undefined to be a function' vs TypeError (type mismatch- eg you had sth that wasn't a function and you tried to invoke it like a fn- JS throws this naturally) 
			});

			it('should add two numbers', function () {
				expect(c.add(2, 2)).to.be.equal(4);
			})
		});
	});

	module.exports = Calculator;

//test-driven devt - a workflow tool. Test at the same time you write your code- code doesn't exist until the tests are written. 
//a practice where you write your automated unit tests BEFORE you write your implementation code. benefits include: 
	// - focus on what code is supposed to do
	// - have a goal (more instant feedback on code w short iterations)
	// - ensure you don't blow off automated testing
	// - improves design and modularity of code (good unit test coverage) 
	// - refactorability

//workflow 

	//think of a feature that doesn't exist
	//write a test for it, run the test and wait until it fails (if you try a test for sth new and it passes, you're writing the wrong test.)
	//write some code in order to pass the test you've just written. 
	//if you run the test and it fails, keep writing. once you pass it, refactor the code you wrote to make it polished, and then move on- add a new test. 

//automated testing =/= TDD! TDD is people who write tests before writing code. 
//sth to think about in pairing: one person writes tests, another person implements code.

//Things to always test in Sequelize: 
	// instance methods, 
	// class methods, 
	// hooks, 
	// virtuals/getter methods, 
	// custom validations.

//iffy/no: 
	// validations (built-in) 
	// structure of the data itself
//Testing models in sequelize

//coverage: ideally you want 100%, but it's not the best approach to aim for 100% all the time bc code will be changing as you go along. 

//in models/index.js:
var Sequelize = require('sequelize');
var db = new Sequelize('dburl');

var Student = db.define('student', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	cohort: {
		type: Sequelize.STRING
	},
	campus: {
		type: Sequelize.ENUM(
			'Fullstack Academy', 
			'Grace Hopper Academy', 
			'Fullstack Academy Chicago'
			)
	}
}, {
	classMethods: {
		findByCampus: function(campusName) {
			return Student.findAll({
				where: {
					campus: campusName
				}
			});
		}
	}, 
	//To test, creating an instance is faster than checking db for properties on class because it doesn't require accessing the db. 

	//What is worth testing? Maybe that columns exist in db. However, it's explicit from the code that those properties already exist. Better is methods. cf. testing our own code, vs testing Sequelize's library. 

	instanceMethods: {
		getClassmates: function() { //this query is fairly complex so you should prob test this. 
			return Student.findAll({
				where: {
					cohort: this.cohort, 
					campus: this.campus,
					id: {
						$ne: this.id
					}
				}
			});
		}, 
		changeCohort: function(newCohort) {
			this.cohort = newCohort;
			return this.save();
		}
	}
});

module.exports = {Student: Student};

//testing model: tests/student.model.test.js
const models = require('../models')
const Student = models.Student;
const chai = require('chai');
const expect = chai.expect;

describe('Student model', function() {
//when testing a db, use a testing db: you typically don't want to test off of your actual db. Review how to implement this. 

	//Since we want our tests to be isolated and always start on a blank slate, we want force: true. Don't have tests that depend on results of a previous test. Scaffold tests w a beforeEach fn: 
	//beforeEach comes from mocha; before every it function this block of code will run. 
	beforeEach('Sync and empty student table', function() {
		Student.sync({force: true}) //sync will try to create a table. if table already exists, and you have force: true as an option, it will drop everything inside table and recreate it. 

		//any query on db will return a promise - bc those operations are async and thus run outside of the flow of the program. 

// Asynchronicity and mocha: before every test, mocha will run the beforeEach fn. Once it gets to the end, it will consider itself done w the scaffolding and move on. 
	//But we want mocha to finish student.sync before we move on-- mocha doens't know it is an async operation. 
	//To make sure it knows, we have two options: 

	//1) done parameter: tell mocha that fn will take a while to be done.
		beforeEach('Sync and empty student table', function(done) {
			Student.sync({force: true})
			.then(function() {
				done();
			})
			.catch(function(err) {
				done(err); //"I'm done; here is the error that resulted."
			}) //can be rewritten as .catch(done); cf. promises in express and .catch(next) 
		});
	//2: return a promise: 
		beforeEach('Sync and empty student table', function() {
			return Student.sync({force: true}) //mocha will wait for that promise to resolve or reject before moving onto the next test. 
		});

	beforeEach('Populate information', function() {
		// Student.bulkCreate() --> provide an array of many objects and it will create them over and over. BUT unfortunately, bulkCreate doesn't run your beforeCreate hooks. Therefore you might want to create things separately and then use Promise.all: 
		//(You can also seed w arrays and mapping but the below approach will do for now)

		var creatingStudent1 = Student.create({
			name: 'Mariana', 
			campus: 'Grace Hopper Academy', 
			cohort: '1610GH'
		});
		var creatingStudent2 = Student.create({ //mix and match info so your class and instance methods work w variety
			name: 'Ali', 
			campus: 'Fullstack Academy', 
			cohort: '1607FSA'
		});
		var creatingStudent3 = Student.create({
			name: 'Emily', 
			campus: 'Grace Hopper Academy', 
			cohort: '1607GH'
		});

		return Promise.all([
			creatingStudent1, 
			creatingStudent2,
			creatingStudent3
		]); //will return once all 3 are resolved
	});

	it('should exist', function() {
		expect(Student).to.be.an('object');
	}); //mocha tests/student.model.test.js

	//use sub-describe block to describe sth else on sth 
	describe('findByCampus class method', function() {

		it('should exist', function() {
			expect(Student.findByCampus).to.be.a('function');
		});

		it('should return Emily and Mariana when called with GHA', function(done) {
			//you need return or done here: an it fn runs the suite and fails the test if an error occurs. 
			//if you don't specify that the fn inside is async, mocha will finish running (in this case, just specifying all the promises to be resolved) and then believe that the test has passed. 
			Student.findByCampus('Grace Hopper Academy')
			.then(function(foundStudents) {
				const justNames = foundStudents.map(function(student) {
					return student.name;
				});
				expect(justNames).to.be.deep.equal(['Emily', 'Mariana']); //deep equal means that this array and array2 have the same information inside, as opposed to being the same array. This line has problems, however; one is that the order might not be the same. 
					//Cf. Object reference. 
						//var a = [1], b = [1] -> a === b //false
				//workarounds: sort the array: 
				expect(justNames.sort()).to.be.deep.equal(['Emily', 'Mariana']);
				done();
			})
			.catch(done);
			});
		})

	describe('getClassmates instance method', function() {

	});

	describe('changeCohort instance method', function() {

	});

	});
});

//Validity. Well-written tests confirm your implementation works (or they deny it and you fix the bugs).
// Easy Maintenance. Other developers (including the future version of yourself) can understand their constraints as they maintain the software. For complex applications, it is difficult to consider the global ramifications of small changes—having automated comprehensive tests makes such butterfly effects more obvious.
// Documentation. Tests frame the responsibilities of your program and even provide examples of its use.
// Understanding. Testing necessitates a re-analysis of the code—you can't test what you don't understand.
// Business Logic Considerations. Writing tests forces you to consider many possible usage scenarios, even edges cases, and in doing so you will likely come across holes in the business logic. (The "business logic" of an application is a non-technical—though often very thorough—description of what it does.)

//categorize or group tests: describe
//common code or data across difft tests- beforeEach
//declare an indiv test- it
//assert results w/in a test- expect

//--save-dev --> edits devDependencies of package.json instead of dependencies. 
//add a test command to package.json 'scripts' -> 'mocha' -> testing script fires up mocha by default - mocha looks by default in test dir

//before/beforeEach/after/afterEach - can use done

var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
// You can create a "spyable" version of any function by capturing the return value of chai.spy(theFunction). Or you can even "replace" a function with a spy imposter with chai.spy.on. For example:

var obj = {
  foobar: function () {
    console.log('foo');
    return 'bar';
  }
}
chai.spy.on(obj, 'foobar');

//tests should be as small and isolated as possible
//hile also applying to a range of representative examples
//test your own code, NOT the libraries it depends on
//be as lightweight/fast as possible

//virtuals don't need anything to be saved to the db 

//look up how to create a db for testing purposes

//setter fn (cf tags: set) runs when you do 'create' or when you call 'save' (when physically writing to db). but postgres doesn't have an array data type so it stores it as a string. 

//enum validation only happens when it exists inside the db. - prob not implemented in postgres node module- Jola. 

//testing for validation: 
var page;
beforeEach(function () {
  page = Page.build();
});
it('errors without title', function (done) {
  page.validate()
  .then(function (err) {
    expect(err).to.exist;
    expect(err.errors).to.exist;
    expect(err.errors[0].path).to.equal('title');
    done();
  });
});

//supertest library enables us to test route handling: 
//npm install --save-dev supertest
//require it in new test file: page.routes.spec.js
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

//agent is a dummy HTTP client that can make requests and receive responses. A supertest agent has its own expect method that is very diff't from the global expect. 
//remember that all HTTP reqs are async, so tests will have to be too. 

describe('http requests', function () {

  describe('GET /wiki/', function () {
    it('responds with 200');
  });

  describe('GET /wiki/add', function () {
    it('responds with 200');
  });

  describe('GET /wiki/:urlTitle', function () {
    it('responds with 404 on page that does not exist');
    it('responds with 200 on page that does exist');
  });

  describe('GET /wiki/search/:tag', function () {
    it('responds with 200');
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist');
    it('responds with 200 for similar page');
  });

  describe('POST /wiki', function () {
    it('responds with 302');
    it('creates a page in the database');
  });

});

//=============Review notes
	var Promise = require('bluebird');
	var chai = require('chai');
	chai.use(require('chai-things'));
	var expect = chai.expect;
	var Page = require('../models').Page;
	var User = require('../models').User;

	describe('Page model', function() {
		beforeEach('wipe and recreate tables', function(done) { //the done func can be called anything 
			//.length property of a fn is the number of parameters listed. 
			//so mocha checks the .length property of beforeeach; if length > 0, mocha knows it's an async function. 

			//that is also how error handling middleware in express knows that it is an error handler- it has 4 arguments: (err, req, res, next)
			Page.sync({force: true}) 
					//*async without 'done': return Page.sync({force: true}) is a near one-liner that has the same functionality of alerting mocha to asynchronicity. 
			.then(function() {
				done(); //done invocation makes mocha move on
			})
			.catch(done); 
			//Model.sync({}) synchronizes model w db. If called without a force option, sequelize attempts to create a new table w page model, but if pages already exist it will not do anything. Sometimes you want to synchronize without replacing anything. But here, you will use the force: true option to drop all the existing tables and then recreate them.
			//returns a promise, which represents that an asynchronous operation is currently running
			//all synchronous code, eg console.log('123'), below the async call will run until call stack is empty 
		});

		describe('Virtuals', function() {
			let page; 
			beforeEach('Set up a test page instance', function() {
				page = Page.build({ //builds and returns an object in JS memory 
					urlTitle: '1610GH'
				}); 
				//this is synchronous bc it doesn't access the db. This is adequate for testing virtuals bc testing virtuals doesn't require us to have anything in the db. virtuals: implemented like a fn but not called-- accessed like a property, which calls fn behind the scenes.

				//create takes the extra step of going to the DB and creating it there.
					//Model.create = Model.build(values, {}).save(options); 
				//things that interact w the database all return promises bc they are async - Model.sync, Model.findAll, Model.create, Model.save

				//only one db operation doesn't return a promise- instantiating new Sequelize('postgres://path/to/db'). 
			});

			it('should return the url title with /wiki/ prepended', function() {
				//use virtuals when you have a convenient use case for them but you don't need to store the info - in this case, route is almost exactly the same as urlTitle. This is derived info from existing info, so putting it in db would create massive redundancy.
				expect(page.route).to.be.equal('/wiki/1610GH');
			});
		});

		describe('Class methods', function() {
		//move page.sync beforeEach here 
			describe('findByTag', function() {
				beforeEach('Populate db with some pages', function() {
					// Page.bulkCreate([
					// 	{title: 'whatever'}, 
					// 	{title: 'whatever2'}
					// 	]) 
					//unfortunately, Model.bulkCreate doesn't run hooks, which we need for generating urltitle. We can just specify urlTitle manually if we want to use this method. But then we will have to account for all new hooks added, which makes code unmaintainable. 

					const creatingFirstPage = Page.create({
						title: 'Page1', 
						content: 'Page1content', 
						tags: ['else', 'test', 'star-wars']
					});
					const creatingSecondPage = Page.create({
						title: 'Page2', 
						content: 'Page2content', 
						tags: ['misc', 'fsa', 'star-wars']
					});

					Promise.all([creatingFirstPage, creatingSecondPage]) //returns a new promise that resolves when both promises inside succeed. 
					.then(function() {});
				}) //you can't chain off beforeEach bc it doesn't return anything; you have to chain off promises inside. 

				//when you get lost in a chain, it may be useful to put every promise into a new variable. 
				it('Should return the page w the test tag', function() {
					return Page.findByTag('test')
					.then(function(pages) {
						expect(pages).to.have.lengthOf(1);
						expect(pages[0].title).to.equal('Test Page 1');
					});
				});
			});
		});
		describe('Instance methods', function() {
			describe('findSimilar', function() {

			});
		});	
	});

//turn off query logging: 
var db = new Sequelize('postgres://path/to/db', {logging: false}); 

//location of beforeEach affects what happens and when: anything that is nested in describe blocks will apply recursively- beforeEach outside will affect all the 'describe's inside. But the reverse is not true. 


//mocha lets you return promises from an it callback testing sth async: 
it('does something async with a promise', function () { // << no done!
  var promiseForThing = Thing.create();
  return promiseForThing;
});

//route testing:

//on route side: 
describe('Page routes', function() {
	before(function() { //this wipes the whole table itself. 
		return Page.sync({force: true});
	}); //beforeEach on model testing side means it will drop everything, recreate the table before each test.

	beforeEach(function() {
		return Page.truncate(); //this gets rid of the rows in the table. doesn't get rid of table itself. Between each assertion (it) it wipes contents of table. This is faster... possibly. In terms of time complexity it could be faster to remove whole table than to iterate through all the rows. 
	});

	//supertest: shows that express isn't building a server itself- just a pipeline you use w a server. 
	//no .listen in app.js: it's in index.js, which requires in app.js and then creates a server. app.js only creates an express pipeline and then exports it out. 
	//in index.js, when pipeline is required in, supertest takes this and interacts w it as if it was a server, without actually starting a server. When using a test you want to limit the amt of real servers and real http requests going out (to save time and prevent corruption of messages). 
	let agent;
	beforeEach('Create agent', function() {
		agent = supertest.agent(app); //agent mimics real http requests going into our http pipeline without a server being started and without sending real http reqs. Essentially, with the supertest library, the process is making requests to itself. So tests can run more quickly and we don't have to bother with ports and think about what is making the requests. 
	});

	describe('GET /wiki', function() {
		it('should respond with 200', function() {
			return agent.get('/wiki') //make get req to /wiki url
			.expect(200); //agent comes with assertions built-in
			});
		it('should respond with 404 for a gibberish route', function() {
			return agent.get('/ajsidjsiosj').expect(404); //reqs will log out in the express pipeline request logger. the express pipeline believes these requests to be genuine. 
		});
	});

	describe('POST /wiki', function() {
		it('responds with 302', function() {
			return agent.post('/wiki/')
			.send({ //this becomes req.body
				authorName: 'Dan', 
				authorEmail: 'Dan@dan.com', 
				title: 'title', 
				content: 'content'
			})
			.expect(302); //stands for redirect, which is what happens in our router. 
			//How redirects work: not exactly like calling another route handler. THe request goes up, server says redirect which responds back to browser with 302, which means redirect, and a header called location that tells it where to redirect to. There is a subsequent req that happens automatically that goes to a new url. Agent doesn't make the subsequent req; it only gets the 302. 
		});

		it('creates a page in the wiki', function() {
			return agent.post('/wiki/')
			.send({
				authorName: 'Dan', 
				authorEmail: 'Dan@dan.com', 
				title: 'title', 
				content: 'content'
			})
			.then(function() {
				return Page.findAll();
			})
			.then(function(pages) {
				expect(pages).to.have.length(1);
				expect(pages[0]).title.to.equal('title');
			});
		});
	});
});


////QUESTIONS, BECAUSE THIS WORKSHOP sucks
	//resolved: we resolved promises and reassigned page1, page2, page3 variables to the actual resolved pages. in testing instance methods, we were able to call instance methods on page1, which suggests that page1 is actually a reference to the right page. however, we could not use expect(pages).to.include(page2) etc. WHY?
		//private properties on sequelize instances: eg _changed: these are properties that relate to the internal functionality of the db. 
		//instance.changed('propname') will give true or false 
		//sequelize instances have .id .prop but when you log them out you don't get the the props in the first layer: bc sequelize has (maybe too) much abstraction: 
		//when we res.send or w/e we actually get page2.toJSON() -- just the object w all props (& virtuals) -- don't work directly with console.log(page2) -- don't work directly w data values. 
		//when we create an instance in test and when we query for row in db later, it is NOT the same row -- so strict equality will not work and neither will deep equals bc many properties have changed! 

	//what is the proper way to reinitialize/populate the db?
		//an envt variable: the way a computer running a process can define to the process the envt it's working in : eg development, production (when deployed), testing - difft envs for app. Using that knowledge, instead of your app doing var db = new Sequelize('postgres://...') only, then it would have: 

		if (env === 'testing') {
			//connect to this db
		} else if (env === 'development') {
			//use this other connection to another named db
		} //can also write this file to receive an arg defining the name of db going to, and can call fn with thing required that has parameters. Could also be a process arg: process.argv2 = name of db to connect to. 

	//why doesn't beforevalidation hook actually run before validation? 
	//Joe: it should have...
	it('Sets the urlTitle of page in database', function() {
		page.content = 'valid content';
		page.title = 'valid title';
		page.status = 'open';
		return page.validate().then(function(result) {
			console.log(result);
			console.log(page.urlTitle);
		});
	});
	//urlTitle 
	it('Errors without a valid urlTitle');
		var page = Page.build({});
		return page.validate()
		.then(function(err) {
			expect(err).to.exist();
			expect(err.errors).to.contain.a.thing.with.property('path', 'urlTitle')
		})

	//enum: enum needs to contact db to throw error w an invalid value. this happens because enum values are saved as metadata in db; sequelize doesn't want to assume that the only enum values given here are the only ones in the model-- there might be more in the db. we should let enum values hit db before throwing that error. Some validations, eg allowNull, will happen through Sequelize. Another example, for user objects: isEmail: true. That is sequelize-only validation- happens before reaching DB. Email data type doesn't exist in postgres or sqlite so that's why this happens purely through Sequelize. 

	//for route testing: why do we limit ourselves to only testing http response codes rather than verifying the underlying functionality? for instance, for post to wiki, why do we check to see if page is created but not user? why don't we check to see that the correct relationship is established between page and user?
		//testing relationship between page and user should be more like a db test: it's about the db structure.
		//for the post route w a new author, it's fair to check to see that user was also created. You could also do it in the same page created test: expect(pages[0].authorId).to.equal(1) - this assumes that user table was empty before and now since there is a user associated, that user now exists. but you may want to test that discretely. 
