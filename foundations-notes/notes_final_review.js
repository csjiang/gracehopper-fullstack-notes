//data structures
	//3 ways to manipulate a data value- copying (eg assgmt to new var), passing, and comparison. 
	//by value: copies actual value; passes COPY of value (original is not changed); byte-by-byte equality. 
		//primitive types- nums, bools manipulated by value.
	//by reference: manipulates references, not actual values. copies REFERENCE; both references 
	//now refer to same original value; reference is passed + changes visible outside modifying f; references aren't === unless 
	//they refer to same unique copy of a value. 
		//objs, arrays, fs manipulated by ref. 

	//STRINGS are copied and passed by ref but COMPARED by value. Also IMMUTABLE in JS. 


//constructors

	var myConstructor = function(prop1, prop2) {
		this.prop1 = prop1; 
		this.prop2 = prop2;
		this.method1 = function() {

		};
	}

	myConstructor.prototype.method2 = function() {

	};
	//methods added to prototype are available to all instances! 

	//creating a new instance: 
	var child = new Mammal("Baby" + this.name);

	//subclass instantiation: 
	var Cat = function(name, color) {
		Mammal.call(this, name) //name already belongs to mammal
		this.color = color;
	};

	//inheritance: 
	Cat.prototype = Object.create(Mammal.prototype);
	Cat.prototype.constructor = Cat;

	//__proto__ vs prototype:
		//for every f Foo:
		Foo.__proto__ === Function.prototype;
		Function.__proto__ === Object.prototype;
		Foo.__proto__.__proto__ === Object.prototype; // ==> Foo instanceof Object;
		Object.__proto__ === null;
		Foo.prototype.__proto__ === Object.prototype;

		//__proto__ is what is actually used on lookup chain 
		//prototype is the object used to BUILD __proto__ when instantiating an obj w keyword new. 
			//it is only available on functions bc it is derived from Function. 
				//not available on instances or objs. 

		(new Foo).__proto__ === Foo.prototype;
		(new Foo).prototype === undefined;

		//when creating a new obj 
		var myInstance = new myObj();
		//the following happens automatically:
		myInstance.__proto__ === myObj.prototype

		//but, because _proto__ is not standard for accessing the prototype chain, use instead the following:
		Object.getPrototypeOf(obj) //=== obj.__proto__

	//prototypal model:
	var AnswerPrototype = {
		constructor: function fn0(value) {
			this._val = value;
		}, 
		get: function fn1() {
			return this._val;
		} //functionality added in prototype object
	}; //prototype created as an object

	var lifeAnswer = Object.create(AnswerPrototype);
	lifeAnswer.constructor(42);
	lifeAnswer.get(); //42

	var FirmAnswerPrototype = Object.create(AnswerPrototype);

	FirmAnswerPrototype.get = function fn2() {
		return AnswerPrototype.get.call(this) + "!!";
	};

	var luckyAnswer = Object.create(FirmAnswerPrototype);
	luckyAnswer.constructor(7);
	luckyAnswer.get(); //"7!!"




	//classical model: 
		//uses new keyword, constructor f, and returns an obj. 
		//can define prototype obj and properties. 

	function Answer(value) {
		this._val = value;
	} //create constructor first as function obj. 

	Answer.prototype.get = function fn1() {
		return this._val;
	}; //functionality is tacked onto the prototype; access that with the prototype property. 

	var lifeAnswer = new Answer(42); //uses new keyword 
	lifeAnswer.get(); //42

	function FirmAnswer(value) {
		Answer.call(this, value);
	}

	FirmAnswer.prototype = Object.create(Answer.prototype); //define prototype obj
	FirmAnswer.prototype.constructor = FirmAnswer;

	FirmAnswer.prototype.get = function fn2() { 
		return Answer.prototype.get.call(this) + "!!";
	}; //modify properties on prototype obj

	var luckyAnswer = new FirmAnswer(7);
	luckyAnswer.get(); //"7!!"


//factory functions: 
var createCalculator = function() {
	var calculator = {};
	calculator.total = 0;
	calculator.value = function() {
		return this.total;
	};
	calculator.add = function(n) {
		this.total += n; 
	};
	calculator.subtract = function(n) {
		this.total -= n;
	};	
	return calculator;
};

//objects

	//3 ways to create: 
		var newObj = {};
		var newObj = Object.create(Object.prototype);
			//syntax:
			//Object.create(proto[, propertiesObject]) 
			//propertiesobj syntax can be weird; check docs 

			//NB: cannot reflect initialization code in Constructor f. 



		var newObj = new Object();

	//4 ways to assign: 
		//dot notation
		//bracket syntax 
		//other methods added in ES5

	//underscore before a prop indicates that it is private and should't
	//be modified:
	this._val = value; 

	//delete properties: 
	delete object1.prop1;
	//or
	object1.prop1 = undefined; 

	//looping with hasOwnProperty: 
	//for (var key in object) {
	//	if (obj.hasOwnProperty(key)) {...}
	//...}

	//looping with Object.keys(): 
	//Object.keys(obj) + array methods b/c keys is an array! 

	//Object.prototype.toString.call(input) will return [Object object] or [Object null] etc. is like typeof. 
	//split multiple times to get something in between two signs (in lieu of regex for now) 
	Object.prototype.toString.call(input).split(' ')[1].split(']')[0];

	//check inclusion:
	if (key in obj) {}


//arrays 
	//using an obj to track checking and assigning new names to duplicates in array: 
		//indexOf array method calls a for loop each time and 
		//thus for large arrays it is less efficient than object property lookup, which is immediate. 
var renameFiles = function(nameArray) {
	var tracker = {};
	return nameArray.map(function(name) {
		if (!tracker[name]) {
			return tracker[name] = name;
		}

		//var assgmt with multiple possibilities :     
			//var extension = nameTracker[name] || 0;

		var count = 1; 
		var newName = name + '(' + count++ + ')';
		//checks for whether name already exists
		while (tracker[newName]) {
			newName = name + '(' + count++ + ')';
		}
		return tracker[newName] = newName;
	});
};
	//methods
	Array.prototype.forEach(fx);
	//shift and unshift
	array.shift()//pops off the first one and returns it

	//map takes function with single parameter (usu)

	//filter takes function taking single parameter and returning boolean 

	//reduce takes starting value (NOT index) and function that takes 
		//current value and next value and combines them into one value. 
		//if array.length > 0 start is optional and method will take array[0] as start. 

		var countWordsInReduce = function(currentVal, nextVal) {
			return currentVal + countWords(nextVal);
		};
	//every and any check whether every or any value satisfy some boolean-returning function. 

	//array.concat(array2) returns 1 array concatenated. 
	
	//flatten example: 
	console.log(arrays.reduce(function(flat, current) {
		return flat.concat(current);
	}, [] /* this is optional arg and gets passed in as 
	value to use as first arg to first call of callback fxn*/));


//arguments
	//accessing arguments: (arguments.__proto__ points to object instead of array proto)
	Array.prototype.slice.call(arguments)
	//OR
	Array.from(arguments)
	//OR
	var args = [...arguments];

	//arguments properties
	arguments.callee //refers to currently executing f
	arguments.caller //refers to f that invoked arguments.callee
	arguments.length
	arguments[@@iterator] //returns new array iterator obj containing values for each index in args
	//(typeof arguments[1])
	arguments[i]




//closure 
	//often used in f factories
	//use console to show: scope variables: can see local, closure, global 

	//1) global scope: in a browser it is the window object so 
	var x = 9; 
	//is basically doing 
	window.x = 9;

	//when fn is defined it uses variables outside - it consumes variables outside- closes over them. that is closure. when incfunction comes out and closes over numTimesCalled variables in parent scope. 
	//numTC remembers it and keeps it around - in HEAP. 
	//things can exist in call stack (returned vals etc) and in heap. 

	//arg in outer function is closed over by inner func and 
	//functions declared inside can access them. So 
	//in the func with secret getting/setting, 
	//methods on the secretObj can access the secret that was used to initialize
	//the secret object in the constructor EVEN THOUGH it is not attached to the secretObj itself as a property.

	//closure for arguments in function; eg 'func that only runs once' 
var once = function(func) {
	var count = 0, counter = function() {
		if (count === 0) {
			count++;
			return func();
		}
	};
	return counter
};

//strings 
	//string.split(' ') splits on whitespace and returns array 

//recursion


//misc
//watch out for parentheses as in following line for nested loops: 
if ((r + c) % 2 !== 0) {

//functions
	//pure fs don't mutate original given parameters

	//scope: only created by fs. 
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

	//immediate invocation: calls a function w a number and immediatley call it: 
	(function(){adventureSelector(3);})();

//higher-order fxs
	var f = function() {};
	f;
	//[function]
	f()
	//runs fx

//function methods
	//call
	//syntax is almost identical to f.apply() but call() accepts an arg list, whereas apply accepts a single ARRAY of args. 
	f.call(thisArg[, arg1[, arg2, ...]])

	//apply
	f.apply(thisArg, iterableObj) //iterableobj can be array or obj

	//bind: creates new f that calls original f but with some args fixed. 
	var boundF = f.bind(thisArg, arg1 [, arg2 /* ... */ ])
	boundF();


//efficiency
	//f calls are costly in JS as compared to simple loop bodies. 

