//scope - only functions create scope. 

//global scope- if a fxn doesnt find sth in its own local scope it will 
//look for it in global scope. 
//if you dont put var before a variable it will be defined in the GLOBAL scope. 
//
//order in fxns is executed 
// when fxn is invoked it is placed on the call stack. 
//in console when you call a fxn with debugger; you can see the call stack on the right. 
//fxn itself must fully execute before return value gets to call stack 

//baz f1- puts f1 on call stack. 
//if f1 calls f2 it puts f2 on top of f1 on call stack. 
//f2 calls f3 and that goes on top of call stack 
//variables only exist in scope of fxn they are in. 
//call stack dodesnt define scope- JS scope is defined lexically- where i am defined not where i am called.

//Closure
var incrementerCreator = function() {
	var numTimesCalled = 0;
	var incFunction = function() {
		numTimesCalled++;
		console.log("Times called: ", numTimesCalled);
	};
	return incFunction;
	};

	var incrementer  = incrementerCreator();

	incrementer //[Function]
	incrementer()//times called: 1
	incrementer () //times called: 2
	incrementer() //times called: 3

	//incrementer does incfunction and returns incfunction
	//when fn is defined it uses variables outside - it consumes variables outside- closes over them. that is closure. when incfunction comes out and closes over numTimesCalled variables in parent scope. 
	//numTC remembers it and keeps it around - in HEAP. 
	//things can exist in call stack and in heap. 


} 

//use console to show: scope variables: can see local, closure, global 
//anytie you define fxn, it will use anything insdie defined . call stack goes away but bc it closes over them the closed vars don't go away. 
//scopes - defined purely by fxns. if not in fxn scope in gloval scope. 
//remmeber to use var 
//closure- define a fxn in another scope and it can consume anything inside and above that scope. and that fxn will tell JS to keep it around
//heap= memory where stuff exists outside of call stack. 

//SCOPE notes from JS playground: 
//1) global scope: in a browser it is the window object so 
var x = 9; 
//is basically doing 
window.x = 9;
//2) local scope: JS scopes at a function level. 
function myFunc() {
	var x = 5;
};
console.log(x);//undefined

//best practice is to nnever add stuff to global and always use var keyword. 
//even libraries will do this: 
(function() {
var jQuery = {/* all methods */};
window.jQuery = jQuery. 
})();

//if you wrap everything in a function which is immediately invoked (as above) all the vars w/in 
//that fxn are bound to local scope. then you can expose your methods by binding jQuery obj to window object. 

//THIS Keyword
$("myLink").on("click", function() {
	console.log(this); //points to myLink, as expected. 
	$.ajax({
		//ajax set up
		success: function() {
			console.log(this); //points to the global object.
		}
	});
});

//why?

$("myLink").on("click", function() {})
//the above when done means when elmt is clicked fx is fired. 
//but since this fx is bound as an event handler this is set to the reference to DOM element myLink. 
//since success method defined within Ajax req is a regular fxn this is set to global obj when it is invoked. 

//this is a var that is automagically set for you when a fx is invoked. 
//val it is given depends on how a fx is invoked: 
//JS has three main ways of invoking functions -- 
//1) as a method; 
//2) on its own 
//3) as an event handler. 

//fx on its own
function foo(){
	console.log(this); //global object; this is what happens in any fx that isnt an event handler or obj method. 
};

//fx as a method
myapp = {};
myapp.foo = function() {
	console.log(this); //points to myapp object
}

//fx as event handler: 
var link = document.getElementById("myId");
link.addEventListener("click", function() {
	console.log(this); //points to link
}, false);

//it is often desirable to reference elmt from which event handler was fired,
//such as when using a generic handler for a series of similar events. 
//when attaching a fx using addEventListener() the val of this is changed, passed to a fx from the caller. 


//so people will do 
var _this = this //or 
var that = this //to store current value. 

$("myLink").on("click", function() {
	console.log(this); //points to myLink, as expected
	var _this = this; //store reference
	$.ajax({
		//ajax set up
		success: function() {
			console.log(this); //points to global obj so we replace it with
			console.log(_this); //still points to myLink which was stored ref 
		}
	});
});

//Code School JS roadtrip pt 2 4.6 problem solving w functions

//counting Es in phrase: 
function countE() {
	var phrase = prompt("which phrase would you like to examine?");
	if (typeOf(phrase) != "string") {
		alert("that's not a valid entry!");
		return false;
	} else {
		var eCount = 0;
		for (var index = 0; index < phrase.length; index++) {
			if (phrase.charAt(index) == 'e' || phrase.charAt(index) == 'E') {
				eCount++;
			}
		} 
		alert("There are " + eCount + " E's in \"" + phrase + "\".");
		return true; //instantly exits the function. 
	}
}

//local vs global scope
//fxs always create a new local scope and vars declared there will stay in that function. 

//JS road trip pt 3 notes: function expressions
//declared fxn: 
function diffOfSquares(a, b) {
	return a*a -  b*b;
}
//built at program load time. 

//fxn exprsn: 
var diff = function diffOfSquares (a, b) {
	return a*a - b*b;
}; //needs semicolon bc it is an assignment stm. 
//executed only when that line of code is reached. 

//anonymous fxn: 
var diff = function(a, b) {
	return a*a - b*b;
};
//no need to name fxn a second time. 
//you can do console.log(func) to see what fxn body is. 

//var that holds a fxn can be passed into other fxns: 

var greeting = function() {
	alert("thanks!");
};

function closeTerminal(message) {
	message();
}
closeTerminal(greeting);

var greeting;
//code sets newCustomer to true or false
if (newCustomer) {
	greeting = function() {
		return "Hi!";
	} else {
		greeting = function() {
			return "Bye!";
		}
	}
}


//func exprs with arrays and map()
map()//method of an array that takes in a fxn as parameter and applies it to each cell in turn

//returning functions

array.shift()//pops off the first one and returns it
var firstFastPass = fastPassQueue.shift();//store the variable so you can refer to it later

//immediate invocation: calls a function w a number and immediatley call it: 
(function(){adventureSelector(3);})();

///
var puzzlers = [
  function(a) { return 8 * a - 10; },
  function(a) { return (a - 3) * (a - 3) * (a - 3); },
  function(a) { return a * a + 4; },
  function(a) { return a % 5; }
];
(alert(function(){
  puzzlers[function(){
    puzzlers[1](3);
  }](function(){
    puzzlers[3](9);
  });
}());

//CLOSURE
//often used in function factories 
//returning a fxn from a fn, complete w variables from an external scope. 
//raps up an entire envt, binding necessary variables from other scopes. 

function testClosure(){
	var x = 4; //local var only. if you try to access it from outside fxn it will be undefined.  
	//no longer available after that exprsn is finished executing and off the call stack. 
	function closeX(){
		return x; //the inner fxn can access outer fxn's variables bc they feel like global vars. BUT
		//the closed over vars are not stored anywhere in inner fxn, even as a parameter. 
	}
	return closeX; 
}


//closures make creation of very similar fns v efficient. 
function buildCoveTicketMaker(transport){
	return function(name) {
		alert("Here is your " + transport + name);
	}
}

var getSubmarineTicket = buildCoveTicketMaker("Submarine"); 
//examining a fxn's contents will not show variables that have been closed over (like in here, where
// "suvmarine" is closed over and referenced again in the return statmetn to getST.)
getSubmarineTicket("seagull"); 

//input = 5
//hidden = mystery2(multiplier) {...input  = 5} secret = 4 --> multiplier = 6
	//mulriplier = 30
	//return 120 
//hidden = param 
//param(6) = 120  

//CLosures can modify bound variables in the background. 

//Closure mistakes offen occur within loops.
//closures bind values at the very last moment- pay attention to when we return functions and final variable states. 
//stay mindful, for instance, of i values in loops
//function's actual return is realy when closure occurs- fi the final thing is returned several brackets out then 
//you can run itno issues. 
//ensure correct values by 
//1) automatically returning as soon as you find hte correct thing when looping and 
//not needing to allowing the loop counter to progress further;
//parameters are also closed in.
//2) if you put i in the local scope (i.e. in the returned function) it will exist ony in thatlocal scope. 


