//Intro to higher-order funx

var funcThatReturnsFunc = function() {
	var newFunc = function() {
		console.log("Function Ran!");
	}
}
var loggerFunction = funcThatReturnsFunc();
loggerfunction; 
//[Function]
loggerFunction();
//Function Ran!

var functionDecorator = function(func) {
	var newFunction = function() {
		console.log("We ran the func you gave us");
		func();
	}
	return newFunction;
}

var outputCurrentTime = function() {console.log(new Date());}
outputCurrentTime;
//current time outputs Friday asdmskdmkm
var decoratedoutputcurrenttime = functionDecorator(outputCurrentTIme);
decoratedoutputcurrenttime;
//[Func]
decoratedoutputcurrenttime();
//We ran the func you gave us!
Fri, 06 Feb etc


//Notes from Eloquent JS ch 5
//Abstraction is useful: abstract array traversal example
function forEach(array, action) {
	for (var i=0; i< array.length; i++) {
		action(array[i]);
	}
}

//passing in a fxn created on the spot
var numbers = [1, 2, 3, 4, 5], sum = 0;
forEach(numbers, function(number) {
	sum += number;
});

//forEach is actually an array method: 
array.forEach(function);


//higher-order fx examples
function greaterThan(n) {
	return function(m) {return m > n; };
}
var greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
//true

//decorator fx
function noisy(f) {
	return function(arg) {
		console.log("calling with", arg);
		var val = f(arg);
		console.log("called with", arg, "- got", val);
		return val;
	};
}

noisy(Boolean)(0);
//calling with 0
//called with 0 - got false

//fxn to change control flow 
function unless(test, then) {
	if (!test) then();
}
function repeat(times, body) {
	for (var i=0; i<times; i++) body(i);
}

repeat(3, function(n) {
	unless(n % 2, function() {
		console.log(n, "is even");
	});
});
// 0 is even
//2 is even (b/c n % 2 = false if it is even; 0 is false in JS)

//Closure: inner fxns that live inside envt of outer fxn can access variables and parameters in outer fxn. But 
//not the other way around.

//for passing in variable arguments: 
f.apply(fxn, [arrayLikeObjOrArray])
function transparentWrapping(f) {
	return function() {
		return f.apply(null /* used to simulate a method call*/ , arguments);
	};
} //this fxn is useless but passes all args to fxn w apply. 

/* JSON */ 
//JavaScript Object Notation - like JS obj/array syntax but 1) all prop names must be surrounded by double qts 
//and 2) only simple data exprsns allowed; no fxn calls or var or anything w computation. No comments either. 

//Data conversion to JSON: JSON.stringify and JSON.parse
var string = JSON.stringify({nane: "X", born: 1980});
console.log(string);
//{"name":"X", "born":1980}
console.log(JSON.parse(string).born);
//1980

var ancestry = JSON.parse(JSON_FILE);
console.log(ancestry.length);

//FILTERING an array

function filter(array, test) {
	var passed = [];
	for (var i= 0; i < array.length; i++){
		if (test(array[i]);
			passed.push(array[i]);
	}
	return passed;
}
//this is a PURE fxn bc it builds up a new array and returns it instead of modifying what it was given. 

console.log(filter(ancestry, function(person) {
	return person.born > 1900 && person.born < 1925;
}));
//[{name: "Blah Blah", ...}, ...]
//Filter is also a standard method on arrays: 

console.log(ancestry.filter(function(person) {
	return person.father == "Me";
}));

//MAP 

//Map applies a fxn to all elmts of an array and builds new array from returned vals.
// New array length is same as input array. 
function map(array, transform) {
	var mapped = [];
	for (var i=0; i<array.length; i++)
		mapped.push(transform(array[i]));
	return mapped;
}

var overNinety = ancestry.filter(function(person) {
	return person.died - person.born > 90;
});
console.log(map(overNinety, function(person) {
	return person.name;
}));

//map also a standard array method: 
console.log(overNinety.map(function(person) {
	return person.name;
}));

//REDUCE/"fold":  computing a single value from elmts of array. eg summing a collecxn of nums; finding person w earliest dob 
//params are an array, a combining fxn and a start value (index of where to start):
function reduce(array, combine, start) {
	var current = start;
	for (var i=0; i<array.length; i++)
		current = combine(current, array[i]);
	return current;
}

console.log(reduce([1, 2, 3, 4], function(a, b) {
	return a+b;
}, 0));
//10

//reduce as a std array method: if array.length > 0 START is optional; method will take array[0] as start 

console.log(ancestry.reduce(function(min, cur) {
	if (cur.born < min.born) {return cur;}
	else {return min;}
}));
//returns obj of most ancient ancestor.

//Higher-order fx are useful for composing fxns. 

function average(array) {
	function plus(a, b) {return a+b;} //we define it bc operators in JS cant be passed in as args whereas fx can 
}
function age(p) {return p.died - p.born;}
function male(p) {return p.sex == "m";}
function female(p) {return p.sex =="f";}

console.log(average(ancestry.filter(male).map(age)));
//60

//Unfortunately doing it as above is very costly in terms of efficiency -
//** fxn calls in JS are costly compared to simple loop bodies. 
//e.g. nested loops- code inside inner loop will run N*M times- 
//N = # times outer loop repeats and M = # times inner loop repeats. 
var byName = {};
ancestry.forEach(function(person) {
	byName[person.name] = person;
});
//builds an obj with {name: "Name"}

function reduceAncestors(person, f, defaultValue) {
	function valueFor(person) { //this handles a single person
		if (person == null) 
			return defaultValue;
		else
			return f(person, valueFor(byName[person.mother]), //results passed to f, which returns actual value for person
				valueFor(byName[person.father])); //calls itself to handle father and mother
	}
	return valueFor(person);
}
//goes recursively thr family tree and applies fxn to each one 

//following fxns find percentage of person's known ancestors who lived past 70 (may count ppl mult times)
function countAncestors(person, test) { //count ancestors who pass test
	function combine(current, fromMother, fromFather){
		var thisOneCounts = current != person && test(current);
		return fromMother + fromFather + (thisOneCounts ? 1 : 0);
	}
	return reduceAncestors(person, combine, 0);
}

function longLivingPercentage(person) {
	var all = countAncestors(person, function(person) {
		return true;
	});
	var longLiving = countAncestors(person, function(person) {
		return (person.died - person.born) >= 70;
	});
	return longLiving/all;
}

console.log(longLivingPercentage(byName["Emile Haverveke"]));
//0.129


//BIND
//a method which all fxns have. Creates a new fxn that will call orig fxn but with some of args fixed. 

//following fxn tells us whether a perosn is in a given set of strings. 
var theSet = ["a", "b", "c"];
function isInSet(set, person) {
	return set.indexOf(person.name) > -1; //index is -1 if person not in set
}
console.log(ancestry.filter(function(person) {
	return isInSet(theSet, person);
}));
//[{name: "b",...}, {name: "c", ...}]
console.log(ancestry.filter(isInSet.bind(null, theSet)))
//same as above;
//call to bind returns fxn but with first arg set to theSet. first arg which here is null is used for method calls. 

//Extra array methods: every, some

//Array.every(predicateFunction --> predFunc is one that takes array as arg and returns T or F. 
//every returns true when pred returns true for all elements of array. 
//some returns true when pred returns true for any of the elements. Short-circuiting applies. 

//EJS EXERCISES CHAPTER 5
//Flatten array (2 deep):
var arrays = [[1, 2, 3], [4, 5], [6]];

var flattenArray = function(array) {
  var flatArray = [];
	for (i = 0; i < array.length; i++) {
//  if (Array.isArray(array[i])) {
//    return flattenArray(array[i]);
//  } else {
    flatArray = flatArray.concat(array[i]);
  }
  return flatArray;
};
console.log(flattenArray(arrays));
// → [1, 2, 3, 4, 5, 6]

//given solution: 
console.log(arrays.reduce(function(flat, current) {
	return flat.concat(current);
}, [] /* this is optional arg and gets passed in as 
value to use as first arg to first call of callback fxn*/));

//#2: Finding average age of mother 

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});
//my code below

var findAgeDiff = function(person) {
  if(byName[person].mother !== undefined && byName[person].mother in byName) {
    var mother = byName[byName[person].mother];
    return byName[person].born - mother.born;
	};
};

console.log(byName["Carel Haverbeke"].mother);
var ageDiffs = Object.keys(byName).map(findAgeDiff).filter(function(age) {
  return age !== undefined;
});

console.log(average(ageDiffs));
// → 31.2

//given solution:
var differences = ancestry.filter(function(person) {
	return byName[person.mother] != null;
}).map(function(person) {
	return person.born - byName[person.mother].born;
});

console.log(average(differences));

//Average age per century: 

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

// Your code here.
var byCentury = {};
var centuryAdder = function(person) /* takes person obj*/ {
  century = Math.ceil(person.died / 100);
  if (century in byCentury) {
      byCentury[century].push(person.died - person.born);
//    console.log("entry pushed");
	} else {
      byCentury[century] = [person.died - person.born];
  //    console.log("new century entry created");
    }
};
//ancestry.map(centuryAdder);

var findCentury = function(person) {
  return Math.ceil(person.died/100); 
};

var groupBy = function(array, groupingFunc) {
	var groupMap = {};
  	for (i = 0; i < array.length; i++) {
      group = groupingFunc(array[i]);
      if (group in groupMap) {
        groupMap[group].push(array[i]);
      } else {
        groupMap[group] = [array[i]];
      }
    }
    return groupMap;
};

var centuryGroup = groupBy(ancestry, findCentury);
console.log(centuryGroup);

for (century in centuryGroup) {
  console.log(century + ": " + average(centuryGroup[century].map(function(person) {
    return person.died - person.born})));
}
// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94

//given solution
function groupBy(array, groupOf) {
	var groups = {};
	array.forEach(function(element) {
		var groupName = groupOf(element);
		if (groupName in groups) {
			groups[groupName].push(element);
		} else {
			groups[groupName] = [element];
		}
	});
	return groups;
}

var byCentury = groupBy(ancestry, function(person) {
	return Math.ceil(person.died / 100);
});

for (var century in byCentury) {
	var ages = byCentury[century].map(function(person)) {
		return person.died - person.born;
	});
console.log(century + ": " + average(ages));
}

//Every and some as functions: 

var every = function(array, predicate) {
  for (i = 0; i < array.length; i++) {
    if (!predicate(array[i])) {
      return false;
                              }
  }
  return true;
};


var some = function(array, predicate) {
  for (i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return true;
    }
    return false;
  }
};

//with map and filter: 
var every = function(array, predicate) {
  return array.map(function(i) {
    return predicate(i)
  }).reduce(function(a, b) {
    return a && b;
  });
};

var some = function(array, predicate) {
  return array.map(function(i) {
    return predicate(i)
  }).reduce(function(a, b) {
    return a || b;
  });
};


//given solution was identical to my first set of solutions! 

/* ARGUMENTS */

//from MDN: the arguments obj is a local var avbl w/in all funx. Contains an entry for each arg passed to fxn w 
//index starting @ 0. 
//referring to args
arguments[0]
arguments[1]

//setting args 
argumnets[1] = "new value";

//all JS funcs have arguments variable built in. 

var myFunc = function() {
	console.log(arguments);
};

myFunc("Hello", "Bye");
//{'0': "Hello", "1": "Bye"}
dir(myFunc("Hello", "Bye"));
//["Hello", "Bye"]

//__proto__ of arguments points to object even though it is an array. doesnt point to regular array prototype. 

//so while this arguments thing looks like an array it is not entirely an array - doesnt have methods like push or pop, 
//but it has length. 
//JS can take variable # of args. 

// ifyou have arraylke obj but without array methods you have seberal options. 
//1) loop over obj agument itself 
var argumentsLogger = function() {
	var argArray = p[;]
	for (var =0; i<arguments.length; i++){
		//bc arguments has length property you can use it
		console.log(arguments[i]);
		argArray.push(arguments[i]);
	}
	return argArray; //argarray is now a real array
};

argArray;
//["Hello", "Bye"]
argArray.__proto__;
[]
argArray.__proto__ === Array.prototype
//true
Array.isArray(argArray) //true

var argArray = argumentsLogger("Hello", "Bye");

//2) JS one-liner to change arguments into real array : 
var argumentsLogger function() {
	Array.prototype.slice.call(arguments);
	//slice returns new array with indices of all arguments
}
//3) use Array.from() method or spread operator for conversion
var args = Array.from(arguments); //from method converts array-like obj or iterable obj to array.
var args = [...arguments]; //spread operator: used for array construction + destructuring, and to fill func args from 
	//an array on invocation. Operator spreads the array (or iterable obj) elements. Opposite of the rest operator. It 
	//separates an array into 0 or more parameters. It is used to replace apply (which is like call but takes an array). 


//when to call arguments obj: 1) calling a func w more args than it is formally declared to accept; 
//calling a func w variable args
console.log(typeof arguments); //'object';
//determining type of indiv args
console.log(typeof arguments[0]);

//properties of arguments
arguments.callee //reference to currently executing fxn
arguments.caller //ref to fx that invoked arguments.callee
arguments.length
arguments[@@iterator] //returns new Array Iterator obj that contains vals for each index in args 

//examples
//concatenating several strings: 
function myConcat(separator) {
	var args = Array.prototype.slice.call(arguments, 1);
	return args.join(separator);
}


//Functions are like recipes not the thing the recipe makes. So we can combine functions and change them
//Secret object: array-like arguments 





