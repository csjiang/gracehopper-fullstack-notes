//handling asynchronous operations effectively: practical promises 

//cf. slide from data structures pt 1 lecture: if a clock cycle were one second...
	//describes how long it takes to retrieve sth from a computer 
	//quick stuff in caches of CPU
	//other stuff in RAM
	//line: we experience a huge jump in time (relative time) below the line w SSD and HDD, optical drive etc 
	//above the line is ephemeral info that might change or not be needed by process for long 
	//below line, info needs to be stored for a long time: external to program itself, being used by program itself as a resource in some way

	//accessing external resources: eg disk (FS), child_process (another module, program running terminal CL command) eg curl, network (other servers, APIs, DB queries)
		//these are usually expensive (long) operations, w a lot of variance wrt amount of time they take depending on distance to resource accessed + size of resource payload 
		//these operations usually happen frequently, in particular db queries. typically every route in a web app will do some db query 

	//using node to access external resources 
	const fs = require('fs');
	//ex: asynchronously concatenating three files 
	fs.readFile('./one.txt', function(err, data) {
		//if err does not happen, the err received by this function is null. in case of an error, err is an Error obj and data = undefined 
		//anything you do asynchronously, by default, is an error-first callback 

	}); //readfile has optional argument of an object w config for reading file, has a callback fn that is not executed until file is read  
		//the callback fn won't execute until the program has nothing else to do. 
		//when an async operation (eg reading file, querying db, accessing network) starts a background operation: the main thread of the program is free to continue doing other things. so if we read multiple files, the callback fns won't be called until program is free
		
		//the following doesn't work: 
		var contents = fs.readFile('./one.txt', function(err, data) {});
		console.log(contents); //in order to put results of fs.readFile into variable before getting to the next line where contents is accessed, we need to STOP the program and wait for the file to be read completely into the variable before going on.
		//other languages can do this - PHP, C++, Java, Ruby, Python. But it is slower to have to depend on the completion of some operations when they have no stake in other operations. 

		//Node can do this much more quickly: 
		fs.readFile('./one.txt', function(err, data) {});
		fs.readFile('./two.txt', function(err, data) {});
		fs.readFile('./three.txt', function(err, data) {});
		//node program goes through these three lines and has three separate background file-read processes; no file has to wait for the one before to finish. This is much faster and a huge advantage of a non-blocking platform 
		//disparate responsibilities of a program are growing increasingly scattered between resources in different parts of the network. REST APIs

		//fns that are based on sth embedded in program usu aren't asynchronous: for instance, a foreach method on an array. in node, asynchronicity is denoted by error-first callback fn 
		//when you call an asynchronous readfile in node, node spawns a background C++ program to read the file, and then that sends a signal back to node which is processed by the callback 

		fs.readFile('./one.txt', function(err, data) {
			console.log(contentsOfFile); //logs undefined. you need to check if there is an error 
		})

		fs.readFile('./on.txt', function(err, data) {
			if (err) {
				console.log(err); //error: ENOENT (error no entry)-- no such file or directory 
				//why do we have to handle the error for an async function? Review. 
			} else {
				console.log(contentsOfFile); 
				//when this is done correctly, prints out a buffer, which can ve converted to string
				console.log(contentsOfFile.toString());
			}
		});
//============================
		fs.readFile('./1.txt', function(err, data){ 
			if (err) return console.log(err);
			console.log(data.toString();});

		fs.readFile('./2.txt', function(err, data){ 
			if (err) return console.log(err);
			console.log(data.toString();});

		fs.readFile('./3.txt', function(err, data){ 
			if (err) return console.log(err);
			console.log(data.toString();});

			//differential processing times for diff file sizes (eg video vs text file) can make callback fns execute in the 'wrong' order (ie not the order that operations are called). 
		fs.readFileSync('./one.txt'); //this allows us to do in JS what we can do in other langs 

		//you can do this the dirty way with a counter of some sort to log how many fns have gotten called, or nested callbacks (but you could run into problems with errors from one fn overriding unless you name errs diff'tly); this artificial synchronization also comes with significant performance dints 

//============================

	const fs = require('fs');
	var readFilePromisified = function(path) {
		return new Promise(function(resolve, reject) {
			fs.readFile(path, function(err, data) {
				if (err) {
					reject(err); //rejects promise w that error
				} else {
					resolve(data); //resolve w the contents of file 
				}
			})
		});
	};

	var file1IsBeingRead = readFilePromisified('./one.txt');
	var file2IsBeingRead = readFilePromisified('./two.txt');
	var file3IsBeingRead = readFilePromisified('./three.txt');

	console.log(file1IsBeingRead); //Promise {<pending>}
	//promises don't 'skip' asynchronicity- we can't get a value right away and put it in a var 
	//but we can see that the promise is pending 

	//to hook into the success of an async operation, use then method: 
	file1IsBeingRead.then(function() { //like w a normal callback, you set this to get called later, but it only receives the successful promise obj -- no error 
		console.log(data.toString());
	}, //this fn handles the error
	function(err) {
		console.log(err);
	}); //now we can handle the unsuccessful path of an async operation separately from its successful path, without having to do them together with error-first handling 

	//to keep things DRY when handling multiple promises: 
	Promise.all([//returns a new promise that represents all 3 files being read at once 
		file1IsBeingRead,
		file2IsBeingRead,
		file3IsBeingRead
		]).then(function(arr) {
			console.log(arr);
			fs.writeFile('./fullsong.txt') //writefile should be promisified but it takes a long time to do it - so use a promise library like bluebird 
		}); //promise.all maintains order of array even if promises take different amounts of time to fulfill. 


//============================

	const fs = require('fs');
	const Promise = require('bluebird'); //overwrite global Promise variable 
	const readFilePromisified = Promise.promisify(fs.readFile); //promisifies the function passed
	const writeFilePromisified = Promise.promisify(fs.writeFile);

	const file1IsBeingRead = readFilePromisified('./one.txt');
	const file2IsBeingRead = readFilePromisified('./two.txt');
	const file3IsBeingRead = readFilePromisified('./three.txt');

	Promise.all([
		file1IsBeingRead,
		file2IsBeingRead,
		file3IsBeingRead
		]).then(function(arr) {
			writeFilePromisified('./fullsong.txt', arr.join('\n')).then(function() {
				console.log("all done!");
			}, function(writeFileErr) {
			console.log(writeFileErr);
		}, function(allFilesErr) {
			console.log(allFilesErr);
		}); 

//============================
	//when working w promises, we can do promise chaining: 

	const fs = require('fs');
	const Promise = require('bluebird'); //overwrite global Promise variable 
	const readFilePromisified = Promise.promisify(fs.readFile); //promisifies the function passed
	const writeFilePromisified = Promise.promisify(fs.writeFile);

	const file1IsBeingRead = readFilePromisified('./one.txt');
	const file2IsBeingRead = readFilePromisified('./two.txt');
	const file3IsBeingRead = readFilePromisified('./three.txt');

	var readingAllFiles = Promise.all([
		file1IsBeingRead,
		file2IsBeingRead,
		file3IsBeingRead
		]);

	readingAllFiles.then(function(contents) {
		const fullSong = contents.join('\n');
		const writingFile = writeFilePromisified('./fullsong.txt', fullSong); 
		return writingFile; //return that promise from the .then fn: this controls the chaining of promises. 
		//when you return a promise from a .then, the next .then will wait for this to complete before the next callback is called. 
	})
	.then(function() {
		console.log("All done!"); //this will only be called if writefile goes correctly 
	})
	.catch(function(err) { //if anything goes wrong anywhere up the chain, the error will end up here and we can log it out. 
							//so all errors are handled here. 
		console.log(err); 
	}); //very rarely will you want to put .catch in front of successful handlers. 

	//catch: if you try to invoke y and it doesn't exist, program will crash. the point of using a try-catch is to say, in case sth goes wrong w this block of code, we want to handle errors this way: catch and work w error safely w/o crashing the program. 
		try { 
			y();
		} catch (err) {

		}
//'big 4 things' that are important: express, promises, react, sequelize 

//promises primer
	// JS is single-threaded; two bits of script cannot run at the same time. 	

	//we can handle stuff w event listeners and callbacks-- which are great when things can happen multiple times on same obj (eg keyup, touchstart) and we don't care what happened before the event started
	var img1 = document.querySelector('.img-1');

	function loaded() {
		//image loaded
	}

	if (img1.complete) {
		loaded();
	} else {
		img1.addEventListener('load', loaded);
	}

	img1.addEventListener('error', function() {
		//broken
	});
	//this doesn't catch images that had an 'error' BEFORE we got a chance to listen for them. 

	//...  when it comes to async success/failure, you need promises: 

	img1.ready().then(function() {
		//loaded
	}, function() {
		//failed
	});

	Promise.all([img1.ready(), img2.ready()]).then(function() {
		//all loaded
	}, function() {
		//one or more failed
	});

	//promises vs event listeners: 
		//a promise can only succeed or fail once. it cannot succeed or fail twice; it cannot switch from success to failure or failure to success.
		//if a promise has succeeded or failed and you later add a success/failure callback, the correct callback will be invoked EVEN THOUGH EVENT TOOK PLACE EARLIER. 

	//a promise can be: 
		//fulfilled- action relating to promise succeeded.
		//rejected- action relating ot promise failed.
		//pending- hasn't fulfilled or rejected yet.
		//settled- has fulfilled or rejected. 
	//an object is 'thenable' if it is promise-like in that it has a .then method. 

	//promises in JS libraries - standardized to Promises/A+; jQ has 'deferreds' but these aren't compliant w P/A+ and a Promise type that has the same issues. Although Promises are a JS feature, all new DOM APIs w async success/failure methods will use promises. 

	//promise creation: 
	var promise = new Promise(function(resolve, reject) { //promise constructor takes one argument, a callback w args resolve and reject. 
		//do a thing, possibly async, then...

		if (/*things worked out*/) {
			resolve("Stuff worked!");
		} else {
			reject(Error("It broke")); //it is customary to reject w an Error obj (which is beneficial bc error objs capture a stack trace and facilitate debugging)
		}
	});

	//using the promise: 

	promise.then(function(result) {
		console.log(result); //stuff worked!
	}, function(err) {
		console.log(err); //error: 'it broke'
	});

	//then() takes two args: a callback for a success case, and another callback for failure case. both are optional- you can choose to only add a callback for the success or failure case. 

	//



	//a JS promise is a complex composition of fundamental JS elmts such as objects, properties, callbacks, closure etc; not a data type per see, but rather a high-level implementation of promises/A+ spec -- cf various promise libraries.
	//promises started becoming popular ~3y ago and have been added to language as Promise constructor in ES6. 

	//a promise handles asynchronicity: with callbacks alone, our async fns cannot return vals; they must call more fns. The inversion of control can lead to callback hell.
	//w promises, our fns now return OBJECTS which other parts of code can capture- eg in vars, arrays, or obj properties. the obj returned doesn't contain the async value right away, but upon completion, the value is 'delivered' to the promise. we can use it by calling the then method on a promise, and pass in callbacks to run when the promise 'settles.' 

	//a promise thus acts like a bridge between where an async thread starts and where you decide how to handle the result.
	//handlers can be added to run before OR after promise settles- if promise is settled, the handler will run immediately. If the promise is not yet settled, the promise will 'hold on' to the handler fn and run when it finally settles. 

//workshop notes 

	asyncFunctionThatReturnsPromise().then(function successHandler1 (result) {
	  // use the value inside this callback
	  console.log('async1 is done!', result);
	  return asyncFunctionThatReturnsPromise(); // woah, returning something async?
	}).then(function successHandler2 (result2) {
	  // use the next value
	  console.log('async2 is done!', result2);
	});

	//callling then method always returns a new promise when can also be thenned
	//if you return a val or promise for a val from a success handler, next part of chain receives the value -- avoid callback hell this way!

	//remember to handle errors! //node-style errbacks make yoou handle errors at EACH Step: 
		asyncFunction(function callback1 (err, result) {
		  if (err) console.error('ERR!', err);
		  console.log(result);
		  asyncFunction(function callback2 (err, result) {
		    if (err) console.error('ERR2!', err);
		    console.log(result2);
		  });
		})

	//w promises, handle at each step w error handler fn to then or just handle all erorrs by using catch at the bottom: 
		asyncFunctionThatReturnsPromise().then(function successHandler1 (result) {
		  console.log(result);
		  return asyncFunctionThatReturnsPromise(); // woah, returning something async?
		}).then(function successHandler2 (result2) {
		  console.log('async2 is done!', result2);
		}).catch(function errorHandler (err) {
		  console.error('ERR', err); // handles any errors from whole chain above
		});
	//combining promises: .all 
	//or .join, .spread, .each, .map, .reduce in bluebird library - basically promisified wrappers around array methods!

	// While .all is good for handling a dynamically sized list of uniform promises, Promise.join is much easier (and more performant) to use when you have a fixed amount of discrete promises that you want to coordinate concurrently. 

//Q&A notes

	//any fn without a return statement returns 'undefined'; to pass along content in a promise resolution then return content. 
	//when you return a promise as opposed to a promise value- promise is assimilated: if you return a promise, what you get back in the next .then is not the promise itself, but what the promise resolves to-- the eventual result. 
	//in a .then fn you can 1) return a non-promise value; 2) return a promise; 3) throw an error. 
	//throw is like a return statement: it stops the execution of the program - lines below are unreachable. unlike a return statement, which gives a value to sth below it, throw throws something up: 
		//you will not hit the next then statement --> you go to error or the first then fn with a non-success clause b/c then handles success cases. 
	//joe prefers promise.reduce to promise.each: 
	//exercise 2 problem D: if you return promisifiedReadFIle(filename).then(green) green will execute regardless; it will get applied to everything and if it fails you can catch later w red. .then(green) is not based on full promise.each resolving so it will get applied independently. //prmomise.each goes through making one promise at a time. 
	//cf typical use cases for promise.all and promise.each 
	





