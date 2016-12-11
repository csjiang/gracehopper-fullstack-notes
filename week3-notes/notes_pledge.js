//Mechanics of Promises 

// Promises are one solution to the problem of asynchronicity. 
// Async: continuation(callback) passing
	//Express & old/imaginary Sequelize, if it took callbacks like fs.readfile takes callbacks

	Page.findOne({
		where: {name: 'Promises'}}, function(err, page) { //takes a node-style error-first callback; if no error, error is null
			if(err) return res.status(500).end();
			res.json(page);
		} //this callback is registered to invoke when the async operation is complete. think of asynchronicity as handled by a background process 
	});
	//node was built for the reason of async, not JS. 

	//Express and new Sequelize: 
	Page.findOne({where: {name: 'Promises'}})
	.then(
		function(page) {res.json(page)}, 
		function(err) {res.status(500).end();
	}) //saves us from the dangling async callback- 

//A promise is portable and can be passed around. 

	//We can put it in a variable!
	var pagePromise = Page.findOne({where: {name: 'Promises'}});
	pagePromise.then(function(page) {}, function(err) {});

	//export to other modules: 
	var presidentPromise = User.findOne({where: {role: 'president'}});
	module.exports = presidentPromise;

	//make a cache out of them: 
		//fetch makes an http req to another server: 
		//cache: {[url: String], Promise<Blob>}
		const cache = {}

		//get(url:String) -> Promise<Blob>
		function get(src) {
			if(!cache[src]) {
				cache[src] = fetch(src).then(res => res.blob())
			}
			return cache[src] //if get is called again w same source, you just return the result that was stored in the cache. No need to register a listener before fulfillment; you can do it after. 
		}

		get('http://someweb.com/some_data')
		.then(data => show(data))

	//construct arrays out of promises and pass into functions: 
	var dayPromises = [];
	for (var i = 0; i < 7; i++) {
		var promiseForDayI = Day.findOne({where {dayNum: i}});
		dayPromises.push(promiseForDay);
	}

	Promise.all(dayPromises).then(days => res.render('calendar', days));

	//and much more: 
	promiseForUser
	.then(user => get()
		.then(messages)
		.then(comments) 
		)
		.catch(err) //can chain promises and don't have to check for errs at every turn.

//Promises are objects: a schematic for a JS object and how that object is created.

	//properties (hidden)
		// state (pending (async op that this promise represents hasn't finished yet), fulfilled, or rejected), 
		//information (value or a reason (error, why it rejected)) --> both are hidden if possible, implemented in internals of promise object. never interacted with directly.

	//public interface
		// .then()
		// .catch() -- these two are public interface, that is how we interact with state and information of promise. 

		//one very important property: the function .then() 
		// they encapsulate (ideally via closure) two more crucial variables: 
		// - a current state, which starts as pending and ends up as one of - fulfilled/rejected
		// - eventual information, which ends up being one of the following - fulfilled value/rejection reason 

	aPromise.then(successHandler, failureHandler) //as promise is pending, hand it a successhandler and failure handler to react to the event of fulfillment/rejection. 

//Promises, unlike callbacks, are timing-ambivalent.

	//if we have a promise 
	userPromise.then(welcomeUser) //query db to get user
	//if operation is pending we can add a handler while its pending; when it fulfills/settles the handler will call.

		1) add handler
		2) promise settles
		3) handler is called once

	userPromise.then(showCart); //even though promise is already completed and fulfilled, and has contacted welcomeUser with resolved value, we can still add a handler later and the handler will get called (essentially immediately) with what the fulfilled value of the query was earlier. 
		1) promise settles 
		2) add handler
		3) handler is called 

	// w callbacks, if event has already happened there's no way to go back and get the value again. if a promise has completed it is possible to go back to it and register more listeners to access that info again. 

	// cf module.exporting out a promise: the operation of resolving the promise is not repeated 

	// getting a resolved value or rejection reason for any promise the only way you can do it is through .then. This is a consistent interface. 

	// settimeout 0 - dont set timer but still runs async - calling .then on a fulfilled promise is like this. 

	// storing fulfilled promise values in a variable vs continuing to access it through a promise: 
		// it depends when you want to use it - if you store it in a var you can't use it as a .then anymore. 

	//once a promise is resolved, the place the value is stored:
		// is dependent on how promise is implemented- eg as a directly accessible property, or a private property or sth that is closed into the promise. .then is not a pure function, but it does have a consistent interface- you give it two functions. 

//Promises can get you out of callback hell. 
	//basic async callback pattern
	//asyncfetchuser asks server for some name 
	//you get a response and then you react to that response 
	asyncFetchUser(/**/, function (err, /**/) 

	getUserData(userID, function got(userData) {
		if(err) console.log(err);
		else getMessage(userData.messageIDs[0], function got(err, message) {
			if (err) console.log(err);
			else getComments(message, function got(err, comments) {
				if(err) console.log(err);
				else console.log(comments[0])
			}
		});
	}); //you can get very horizontal, ugly code.


//with promises: everything is vertical.
	//errors can all be caught at the bottom.

	promiseForUser
	then(function(userData) {})
	.then(function(message) {})
	.then(function(comments) {})
	.catch(err);

//black holes: 
	//asynchronicity messes up the following: 
	var person;
	asyncGetGroup(123, function got(group) {
		person = group.users[0];
	}); //person is set to be uesr in group

	var headine = person.name; //cannot get prop of undefined! doesn't work because async is still running 

	//fantasy solution: 
	var containerA = new Container();
	asyncGetdata(function got( data ) {
		containerA.save( data ); //once async completes
	});

	//somewhere else... a function to handle the async, but it is dangling.
	containerA.whenSaved(function use( data ) {
		console.log(data); //once container.save() happens
	}); 

	//a promise is basically a more intuitive version of the fantasy solution.
	//you have a real thing, a promise, like a container, that you can hold on to and interact with.

//A+ specification: 
	//a written description plus a gigantic test suite to confirm that a promise library adheres to this spec. This is like a certification you can apply for once you build a library. 

	//The promises standard- Promises/A+
	//ES6 promises work natively in most browsers
	//created w new Promise constructor

	new Promise((resolve, reject) => resolve(10))
	new Promise(resolve,reject) => reject(new Error('aah!'))

//real promises- where do they come from? (Popular since ~3y ago)

	//existing libraries may return promises: 
		//fetch in the browser, 
		//sequelize/db actions and queries
	//wrap async calls in promise-makers
		// ES6/bluebird constructor
	//promise libraries can wrap for us any async fn that returns a callback, for instance in Node: 
		//Bluebird.promisifyAll(fs)

// Promisification in Node.js
	fs.readFile('foo.txt', 'utf-8', function (err, text) {
		//use the text
	});

	//Promisified: 
	Bluebird.promisifyAll( fs );
	fs.readFileAsync('file.js', 'utf8').then(function (text) {
		//use the text
	});

	//Promisified version will take all the arguments until the callback fn (always the last parameter) that the original fn takes. So it cuts off the callback, and instead at that point returns a promise. 

	//it is always more costly to promisifyAll bc it's an O(n) operation- has to go through every object in order to promisify it. Less costly to pull them out and promisifying one at a time. But consider that promisifying one at a time or w/e will require more complexity and possibly more lines in the code. 
	//but the performance tradeoff might be minimal- always err on the side of making your code as short and clear as possible over performance optimization. 

// .then on same promise (not chaining!)
	//Pending: promise1 (fA)
		//.then(fA) 
		//you can also listen again for the same promise: NOT a chain. 
		//.then(fB) 
		//kind of like registering a listener for sth before it is fulfilled and then also after is ok. 
		//you can receive and work w the successful value/failed reason in multiple ways. When it's fulfilled the value will go to each of the .thens on it. 

	//this is another reason why promises > callbacks-- allows you to reuse. 

//Secrets project w sequelize + promises: 

const db = new Sequelize('url');
const SecretModel = db.define('secret', {
	text: {
		type: Sequelize.TEXT
	}
});
const CommentModel = db.define('comment', {
	text: {
		type: Sequelize.TEXT
	}
});


//the following is redundant: what this does to db structure is, if you had either on its own it would change db in exactly the same way, putting secretId on the comment table. So why have both? Because of association methods. It's useful to have associations in both directions, so that's why people do this, usually.

CommentModel.belongsTo(SecretModel); //adds a secretId on the comments table to hold a primary key value for secret
	//so when we have a comment, we can do comment.getSecret(), comment.setSecret() which associates comment w a secret. 

SecretModel.hasMany(CommentModel); //adds a secretId attribute to comments table and instances of comment will get accessors getSecret and setSecret. 
	//here, we have same relationship set up in db but we have association methods set up on other entity: secret.getComments(), secret.addComments(), secret.setComments() 


module.exports = {Secret: SecretModel, Comment: CommentModel};

//in app.js: 
const models = require('./models');
const Secret = models.Secret;
const Comment = models.Comment;

const syncingSecrets = Secret.sync();

//Every .then fn returns a promise and what that promise resolves to depends on what you've chained off of and what happens in the .then: 

//a composite promise: depends on the first promise in syncingSecrets; doesn't do anything until secrets table is finished syncing. 
const syncingSecretsThenReturning2 = syncingSecrets
	.then(function () {
		return Comment.sync();
		//the return statement here is tricky: 
		//there are 3 things you can do inside a .then function: 
			//1) return a non-promise value 
			//2) return a promise
			//3) throw an error
		return 2;
		});

//1) return a non-promise value --> value
syncingSecretsThenReturning2
	.then(function (v) {
	console.log(v); //1) if you return a non-promise val (any non-promise val!) that promise will resolve to that value that you returned from the previous .then -- in this case, 2. 
	})
	.catch(console.error);

//2) return a promise --> resolved value of returned promise. 
const syncingSecretsThenFindAllSecrets = syncingSecrets
	.then(function () {
		return Secret.findAll();
		});

syncingSecretsThenFindAllSecrets
.then(function(v) {
	console.log(v); //not the promise, but all secrets: it is the resolved value of the promise returned. This is called promise assimilation. 
})

//most likely format: a linear chain.
Secret.sync()
	.then(function() {
		return Secret.findAll();
	})
	.then(function(v) {
		console.log(v);
	});

//3) throwing an error: 
Secret.sync()
	.then(function () { //could be any type of error: typeerror, eg.
		expect(true).to.be(false) //assertion error
		throw new Error('World exploded'); //custom error
	})
	.then(function(v) {
		console.log(v);
	})
	.catch(err);
	//throw is like a return statement in itself: it cuts off everything following it. So it will reject the promise with error given. What will happen is that none of the .thens after that get called: it will just go to the first catch function. 

// w/o promises: could do .catch instead
// Secret.sync(function (errWithSyncing) {
// 	if (errWithSyncing) return;
// 	Comment.sync(function (errWithSyncingComments) {
// 		if (errWithSyncingComments) return;
// 	});
// })

//comment table can't be created before secret table exists. This is because comments refer to secret table in one of the columns. 

Secret.sync()
	.then(function () {
		return Comment.sync();
	})
	.then(function () {
		//by returning promises, you can control what happens and so you know that by this point, all the promises have been resolved -- both tables have synced.

		return Secret.create({
			text: 'I let the dogs out'
		});
	})
	.then(function (createdSecret) {
		return Secret.findAll();
	})
	.then(function(secrets) {
		console.log(secrets);
	})
	.catch(err);

//you can also nest .then statements, BUT the reason we have .then chaining and returning promises is so we can have linear chains. 
Secret.sync()
	.then(function () {
		Comment.sync()
		.then(function() {
			Secret.create({
				text: 'I let the dogs out'
			});
		});
	});
//also, returning a promise will let the .then function know that its contents are async and that it must wait for the async process inside complete before going on. 

Secret.sync()
	.then(function () {
		return Comment.sync();
	})
	.then(function () {
		return Secret.create({
			text: 'I let the dogs out'
		});
	})
	.then(function (createdSecret) {
		return Comment.create({
			text: 'Who?',
			secretId: createdSecret.id
		})
		.then(function() {
			return createdSecret; //here, you hijack the .then return and return instead the createdSecret that you still have access to because of scope. 
		});
	})
	.then(function(createdSecret) {
		console.log(secrets);
	})
	.catch(err);

//refactored for clarity: this pattern is very common, albeit seldom presented this clearly. 

Secret.sync()
	.then(function () {
		return Comment.sync();
	})
	.then(function () {
		return Secret.create({
			text: 'I let the dogs out'
		});
	})
	.then(function (createdSecret) {
		const creatingComment = Comment.create({
			text: 'Who?',
			secretId: createdSecret.id
		});

		const creatingCommentThenResolvingSecret = creatingComment.then(function() {
			return createdSecret; //reacts to comment being created. Result value of this promise depends on what is returned here. 
		}); //createdSecret is not a promise; it is a sequelize instance. 

		return creatingCommentThenSecret;
	})
	.then(function(createdSecret) { //so you can receive it here. 
		console.log(secrets);
	})
	.catch(err);

//Thinking about the lifecycle of any promise: 
	//cf graph in slides: 
	//a promise represents some async operation. it fulfills or rejects. If it fulfills with a value and doesn't have a success handler (but has an error handler) it creates a new promise that resolves directly to what the previous promise resolved to. 

	const creatingComment = Comment.create({
		text: 'asdsd', 
		secretId: '2'
		});

	const creatingCommentAndListeningForError = creatingComment.then(null, function(err) {
		console.log(err);
	}); //if creatingcomment goes successfully and doens't have a success handler, the success 'bubbles down' and the resolved value of creatingCommentAndListeningForError will resolve to the same value. 

	//a success will bubble through until it finds a valid success handler 
	promise0
	.then(null, function(err) {
		console.log(err);
	}) //p1
	.then() //p2
	.then() //p3
	.then(null, function(err) { //p4
		console.log(err);
	}
	.then(function(resolvedValue) { //the success will bubble down to here
		console.log(resolvedValue);
	}, function(err) {
		console.log(err);
	});

//bubbling down until finding the right handler also happens with errors: 

	//promise0 rejected with 'sorry!' 
	promise0
	.then() //p1
	.then() //p2
	.then() 
	.catch(null, logYell)

	//.catch is just a .then call with null as its first value ('no success handler') and the error handling fn as the second value (the error handler). 

	.catch(function(err) {
		console.log(err);
	}); //is the same as 

	.then(null, function(err) {
		console.log(err);
	});

//an error gets to the bottom of the chain -- not through skipping the .thens, but by going through the .thens, which create a new promise each time that resolves to error. 

//if a handler doesn't have its own instructions for handling sth, it will just mimic the functionality of the previous one and pass the promise along. 

//done 
	//tells mocha when we're done; it doesn't have anything to do with promises. it was how to do async in mocha before promises became mainstream- now you can just return a promise. done is invoked w/o any parameters to let mocha know there were no errors and the func is done. 
	//.catch(done) will give you the error that has bubbled down. 
	// w/ an error thrown in a fn w done but no error handler, error is thrown in a line before done() and bubbles down but doesn't reach anything bc done is never called w error in an error handler --> this means that mocha will have a test timeout. 

//=====WORKSHOP NOTEs
	//build a deferral-style promise library similar to AngularJS's $q service: pledge.js
	//of multiple proposed CommonJS promise standards, Promises/A+ is the leading standard. 
	//$q has two ways to generate promises: 
	//streamlined ES6 constructors
	//using q as a constructor which takes a resolver fn as the first argument - like the Promise class in ES6. 
		function asyncGreet(name) {
		// perform some asynchronous operation, resolve or reject the promise when appropriate.
		return $q(function(resolve, reject) {
		    setTimeout(function() {
		      if (okToGreet(name)) {
		        resolve('Hello, ' + name + '!');
		      } else {
		        reject('Greeting ' + name + ' is not allowed.');
		      }
		    }, 1000);
		  });
		}

		var promise = asyncGreet('Robin Hood');
		promise.then(function(greeting) {
		  alert('Success: ' + greeting);
		}, function(reason) {
		  alert('Failed: ' + reason);
		});

	//deferring shit is like splitting apart the promise into several parts of a pizza. Then it is an exposed promise instance that you can work with in other places: you can specify different actions to do when you call deferred.notify, deferred.resolve, and deferred.reject. After you do that you can make it back into a promise by doing deferred.promise which has resolve(value) and reject (reason) methods -- but it also has a notify (value) method, which means it isn't quite the same promise that went in before becoming a deferred. 

	function asyncGreet(name) {
	  var deferred = $q.defer();

	  setTimeout(function() {
	    deferred.notify('About to greet ' + name + '.');

	    if (okToGreet(name)) {
	      deferred.resolve('Hello, ' + name + '!');
	    } else {
	      deferred.reject('Greeting ' + name + ' is not allowed.');
	    }
	  }, 1000);

	  return deferred.promise;
	}

	var promise = asyncGreet('Robin Hood');
	promise.then(function(greeting) {
	  alert('Success: ' + greeting);
	}, function(reason) {
	  alert('Failed: ' + reason);
	}, function(update) {
	  alert('Got notification: ' + update);
	});

//workshop: 
	//name promises $promise to avoid triggering browser code
	//pledge.js uses public variables and is not standards-compliant

	//install testem globally

//ch1

	//a promise starts out w pending state + no value. at some point the promise can become fulfilled w data or rejected w a reason. once settled (fulfilled/rejected), a promise is stuck in that state and cannot be changed again. 

	//the deferral obj is a kind of promise parent/manager, which can resolve or reject its associated promise. 

//ch2
	//a promise's then method adds groups of handlers ( as {successcb, failurecb}) to promise's _handlergroups property

	//if a value already exists - promise calls each group in order if it has not been called yet (called property on handlers group object in array) and if there exists a success handler, it calls that success handler w the value that has been resolved.

	//if a value does not already exist-  

// var nextPromise = new Deferral();
// nextPromise.resolve(this)
// return nextPromise || nextPromise.$promise

//callhandlers should also go in resolve 

//==========REVIEW/Q&A Notes

	//Promise assimilation: 
Deferral.prototype.assimilate = function(promise) {var self = this;
	promise.then(function(value) { //could do => (context doesn't change) and use this instead of declaring it
		self.resolve(value); //if promise a has a .then listener that returns promise c, then promise b which returns what a resolves to should resolve to promise c. 
	}, function(reason) {
		self.reject(r);
	});
}; //or use bind - cf notes
//dealing w return value of handler- if typeof result === promise --> downstream.assimilate(result)

//cf: 
Secret.sync()
.then(function() {
	return Secret.findAll();
})

const pA = Secret.sync();
const pB = Pa.then(function() {
	const pZ = Secret.findAll();
	return pZ;
}

//pB.then is return all secrets 
//this is possibility #2 of .then callback- 
	//promise assimilation.
//the following doens't work bc it changes object but not REFERENCE to it, which breaks things. you have to assimilate it- output promise should be listened for; whatever it resolves to, the other promise should resolve to it. 
	if (output instanceof $Promise) {
		downstream.$promise = output; 
	} 

executeHandler(fn, downstream) {
	try {
		let returnValue = fn(this._value);
		if ($Promise.isPromise(returnValue)) {
			returnValue.then(function(v) {
				downstream.resolve(v);
			}, function(e) {
				downstream.reject(e);
			});
		} else {
			downstream.resolve(returnValue);
		}
	} catch(e) {
		downstream.reject(e);
	}
}

//try/catch: one of the oldest JS programming but doesn't have many use cases in JS; has broader use cases in other languages.

	// sometimes there might be code that is dangerous to execute- function will throw error to what caught it or upwards until you get to top of stack, and if nothing has caught it at that point it is an uncaught error. 

	//In some cases, eg what we do in Pledge, we have some bit of code, in this case, the handler might throw an error - might have sth wrong that happens in there. There might be a bug in the function that is being provided to us so we need to safely run it in a try block - 

	//anything that happens in a try block might throw an error. If so, we provide a catch block. It is only executed if try block throws an error and the e there is what is thrown. 

	try{y()} catch(e) {console.error(e)};

	//uncaught error would crash program but here since we catch it in a try block, and not letting it bubble all the way up and being an uncaught error, it doesn't crash the program. It gets rejected and processed normally downstream for the promise. 

	Secret.sync()
		.then(function() {
			return Secret.findAll();
		})
		.then(function() {
			return Secret.possibleClassMethod();
		})
		.catch(function(err) {
			console.error(err);
			return Secret.findById(1);
		}) //you can handle error and then continue to resolve down the chain as well! 
		.then(function(secretWithId1) {
			//do something
		});












