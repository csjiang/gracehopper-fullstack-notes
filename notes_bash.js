// console.log(process);
// console.log(Object.keys(process));
// console.log(process.env.PWD);
// console.log(Date.now());
// console.log(new Date().toString());
// var fs = require('fs');

//bash commands
//pwd
//date 
//cat: concatenate files and print on the standard output
//head: output the first part of files 
// | pipe: output of first command seq is used as input to second command seq. 

// And now run nodemon bash.js. 
//Nodemon watches files in a directory, recursively, 
//and if they change it stops the process and re-runs your original command. 
//Voilà, instant refreshing prompt during development!

//q to ask on Monday: 
//what is more idiomatic for exporting multiple things-- exports obj, or module.exports? 
//why does settimeout with 2 work for asynchronous stuff below but not 0 or 1?

	// var best = function() {
	// 	fs.readdir('.', function(err, files) {
	//   if (err) throw err;
	//   files.forEach(function(file) {
	//     process.stdout.write(file.toString() + "\n");
	//   })
	//   setTimeout(function() {process.stdout.write("prompt > ")}, 0); //defers it until stack is clear 
	// });
	// };
	// best();

var startTime = new Date;

setTimeout(function () {
  var endTime = new Date;
  console.log('Time elapsed: ', endTime - startTime, 'ms');
}, 500);

while (new Date - startTime < 1000) {};


//TAIL: 
	// As an aside, one of the most useful things 
	// that the real tail can do is watch log files; if you have a program outputting to a text file 
	// and you want to watch that file live, you can use tail -f logfile where -f means follow.




//Setting up npm and request module for project: 
// To install request into your project, you'll have to do a few things in your terminal:

// run npm init. This will take you through a quick step-by-step that will create a package.json file. Read a bit about what this file is here.

// run npm install request --save. This will contact npm and download the request library. A new directory in your project will be created called node_modules, this is where npm places all third-party modules to be used in your program. The --save is a command option that states that npm should save request at a specific version as a dependency to your project. Check out your package.json after your install has completed.

// In your commands.js, you can now use the statement require('request') to gain access to the request library. Sweet!

	request(url + '', function(error, response, body) {
		if (!error && response.statusCode = 200) {
			process.stdout.write(body);
		}
	});

	// request.get(url).on('response', function(response){
	// 	console.log(response);
	// }).on('error', function(err) {
	// 	console.log(err)
	// }); (??)


//Which is more idiomatic: the code above or below? 

// module.exports = {
// 	pwd: function(){
// 		process.stdout.write(process.env.PWD);
// 		process.stdout.write('\nprompt > ');
// 	},

// 	date: function(){
// 		process.stdout.write(new Date().toString());
// 		process.stdout.write('\nprompt > ');
// 	}
// }

//node-shell Q&A review
//using counter in fs.readFile - b/c it's an asynchronous fn 
	//synchronous computations- accessing variables or elmt in array or another file through module system- internal to program itself.
	//file system is external to program (just as database, or using HTTP to send req to server) - when you access things external to 
	//JS program, they are handled asynchronously. 
	//when operation starts, program continues to compute -- in forEach, each readFile will execute all at once. there is no guarantee
	//for how long it might take-- callback fn invoked when it finishes executing. 
	//once file is read, the callback is continuation of the execution-- where the content of the file is received.
	//counter keeps track of how many files were read in the first place, so when counter reaches the length of filenames we know everything is finished
	//executing and then we can call the done function. 
	//all other things in the program execute before the callbacks are executed. 

	//in other languages, eg you want to read three files and interleave them. 
	//steps: 1) read full text of files 1, 2, 3; //in PHP, when you read a file the program pauses: 
			//blocking I/O: blocks program from running any further until file is read and then contents are put into variable. 
	//2) take contents of that and call interleave //b/c contents are already in program variables, this will be faster than having to read from filesystem
	//3) take results and write to new file interleavedfiles.txt

	//will take time to read each 1, 2, 3 and then do 2) and 3) 

	//in JS, asynchronicity allows us to read all 3 files at the same time. this is faster, but we have to know when all 3 are read
	//before we go ahead and interleave. 

	fs.readFile('./1.txt', function(err, contents) {
		//this makes program read the file while rest of program goes ahead and executes

	});

	var contents = fs.readFileSync('./1.txt') //program will pause on this line until it is finished executing. 

