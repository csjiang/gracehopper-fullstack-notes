//Obj by reference vs obj by value

var scott {
	name: "Scott", 
	last: "Dallas"
}

scott;
//Object {name: "Scott", last: "Dallas"}
var referenceToScott = scott;
//undefined

referenceToScott;
//Object {name: "Scott", last: "Dallas"}

scott.name = "Zeke";
referenceToScott;
//Object {name: "Zeke", last: "Dallas"}

//if you refer to an obj in JS and the thing being ref'd is an obj it is like a library card 
//not a copy of the obj

scott = "Scott";
referenceToScott;
//Object {name: "Zeke", last: "Dallas"}
//if you change scott the reference stays teh same bc it still points to that obj
//even if the way you got to that obj has changed. so in above example var assgmt changed but 
//obj reference did not. 
//passing by reference- this only happens for objs 
//so JS doesn't make reftoscott point to scott var; just points directly to the obj. 



//By value vs by reference notes: JS the definitive guide, 4th ed. 
//in JS as in all prgrming langs: 3 impt ways to manipulate a data val 
//1) copy it, e.g. by assignment to a new var
//2) pass it as arg to fx or method
//3) compare it w another val 

//2 ways of sorting the above: 
//1) by VALUE: when a val is manipulated by value, c'est la valeur qui s'importe; 
// a) la valeur actuelle is copied; copy stored in var, obj prop, or array elmt. 
//copy and original end up being two completely indpdnt vals stored separately. 
//b) datum passed by value to a fx --> COPY of datum is passed. If fx changes val, 
//only the copy is changed, not the original. Changes to the copy have no effect outside of the fx. 
//c) compares two distinct values; 
//when datum is compared by val, two distinct pieces of data must reprsnt exact same value
//i.e. equal in a byte-by-byte comparison.

//2) by REFERENCE: 
//only one actual copy of value exist and references are manipulated. 
//If assigned to var, the var does not hold that value directly; only hold references to it. 
//the REFERENCES are copied and passed and compared. 
//a) only REFERENCE to val is copied, not a copy of the val ni la valeur soi-meme. 
//post-assgnmt the new var refers to THE SAME VALUE that the orig refers to. 
//both refs are valid + can be used to manipulate value. references will update to reflect changes
//b) reference is passed and modifications to the value through the passed reference will 
//be visible outside the fx. 
//c) two REFERENCES ARE COMPARED to see if they 
//REFER TO THE SAME UNIQUE COPY of a val. 
//i.e. if they are refs to two distinct vals w/ same bytes, they are still NOT treated as === 

//kind of like pointers, except JS does not support pointers. 

//Primitive types & reference types
//primitive types are manipulated by VALUE. eg numbers, booleans - small easily manipulable fixed # of bytes
//reference types are manipulated by REFERENCE. eg objects, arrays, functions - can contain arbitrary #s of props or elmts; less easily manipulable. 
//by val manipulation for ref types would be inefficient bc would req copying and comparing of large amts of memory. 

//strings dont fit into this dichotomy. 

//copying by value 
var n = 1;
var m = n; //copy by val: var m holds distinct value 1. 

function add_to_total(total, x) {
	total = total + x; //only changes internal copy of total
}

//passing by value
add_to_total(n, m); //val of n is copied and that value is named total within the function
//fx then adds copy of m to copy of n. but since adding sth to a COPY of n doesn't affect orig val of n
//which exists outside fx, this fx call doesn't accomplish anything. 

//comparison by value
if (n ==1) m = 2; //literal 1 is a distinct numeric val encoded in program; bytes of two #s are checked 
//to see if they are the same. Since n contains same bytes as literal 1, m is now 2. 

//copying by reference 
var xmas = new Date(2001, 11, 25);
//copy by ref- get a new ref to orig obj. 
var solstice = xmas; //both vars refer to same obj value. 

solstice.setDate(21);
//change to obj through one ref is visible through others: 
xmas.getDate(); //returns 21, not orig val of 25. 

//passing by reference
//w objs and arrays passed to functions, references are passed, not copies. 
//therefore, fx can change contents of array through the reference, and 
//those changes will still be visible afted fx returns and gets off call stack. 

function add_to_totals(totals, x) {
	totals[0] = totals[0] + x;
	totals[1] = totals[1] + x;
	totals[2] = totals[2] + x;
}

//comparison by ref: 
(xmas == solstice) //evals to true bc they refer to same obj

//but in the case of distinct obj w the same date, they are not equal. 
var xmas = new Date(2001, 11, 25);
var solstice_plus_4 = new Date(2001, 11, 25);

(xmas != solstice_plus_4) //evals to true

//impt: passing by ref here does not mean function invocation that assigns new vals to args and has 
//modified vals still visible outside fx. 

function add_to_totals2(totals, x) {
	newtotals = new Array(3);
	newtotals[0] = totals[0] + x;
	newtotals[1] = totals[1] + x;
	newtotals[2] = totals[2] + x;
	totals = newtotals; //this doesn't work bc this line has no effect outside of the fx; 
	//instead of changing array itself, it only changes reference to it. 
}

//STRINGS: copied and passed by ref; COMPARED by value. 

//strings are arbitrarily long but technically primitive as non-obj type. 
//strings are IMMUTABLE - no way to change chars. 
//strings are compared by value: two distinct strings containing same chars will be 
//equal. BUT in C, C++ and Java strs are compared by reference. 
//but for efficiency JS strings are copied and passed by reference. 

//Classical model of OOP: 
//3 ways to create objs:

//1
var newObj = {};
//2
var newObj = Object.create(Object.prototype);
//3
var newObject = new Object(); //obj constructor here can 
//create obj wrapper for specific val; or it can create and return an
//empty obj when no val is passed. 

//4 ways for assignment: 
//1. Dot syntax: 
//set props
newObject.someKey = "Hello";
//get props
var value = newObject.someKey;

//2. bracket syntax:
//set props
newObject["someKey"] == "Hello";
//get props
var value = newObject["someKey"];

//in ECMAScript 5: others, see 
//https://addyosmani.com/resources/essentialjsdesignpatterns/book/#constructorpatternjavascript 
//for more

//Basic constructors: 
//no classes in JS but has special constructors for objs
//new keyword before call to constructor fx --> allow fx
//to behave like constructor; instantiate new obj w members defined by that fx

this //keyword: inside constructor, this references new obj being created. 
//basic constructor exmple but bad for inheritance: 

function Car(model, year, miles) {
	this.model = model;
	this.year = year;
	this.miles = miles;
	this.toString = function() {
		return this.model + " has done " + this.miles + " miles";
	};
}

//usage - instantiation: 
var civic = new Car ("Honda Civic", 2009, 20000);
console.log(civic.toString());

//Constructors with prototypes: 
function Car(model, year, miles) {
	this.model = model;
	this.year = year;
	this.miles = miles;
}

Car.prototype.toString = function() {
	return this.model = " has done " + this.miles + " miles";
}//now this is shared between all Car objects. 

//usage
var civic = new Car("Honda Civic", 2009, 20000);
console.log(civic.toString());


//Prototype vs __proto__
//every fx Foo has __proto__ reference to Function.prototype which has
//__proto__ reference to Object.prototype. Object.prototype.__proto__ is null. 
//but the Foo.prototype.__proto__refers to Object.prototype, not Function.prototype. 

//__proto__ is the actual obj used in the lookup chain to resolve methods, etc. 
//prototype is the obj used to build __proto__ when you create an obj with keyword new. 
(new Foo).__proto__ === Foo.prototype
(new Foo).prototype === undefined
//Therefore, prototype is not availb on instances themselves (or other objs), 
//but only on functions bc it is derived from Function. __proto__ availb everywhere. 


function Point(x, y) {
	this.x = x;
	this.y = y;
}
//this is a constructor fxn.

var myPoint = new Point();
//myPoint is an obj constructed by Point() so Point.prototype
//gets saved to myPoint.__proto__ at the time of construction. 


//prototype is a property of a Function obj. it is created when fx is declared. 
//It is the prototype of objs constructed by that function. 
//__proto__ is an internal property of an obj pointing to its prototype. 
//comparing a function's prototype to an object's __proto__ chain can find instanceOf relationships. 
//break these relationships by changing prototype: 

myPoint.__proto__ == Point.prototype //true
myPoint.__proto__.__proto__ == Object.prototype//true

myPoint instanceof Point; // true
myPoint instanceof Object; //true

//adding props to prototype that are then shared by instances : 
function Person(dob) {
	this.dob = dob
};

//adds new method age to Person.prototype object: 
Person.prototype.age = function() {return date - dob};
//Person.prototype is an Object literal by default but can be changed. 
//Every instance of new Person() has a __proto__ property pointing to 
//Person.prototype. That creates the chain to find properties of an obj

var person1 = new Person(somedate);
var person2 = new Person(somedate);

//__proto__ is not standard for accessing prototype chain;
//use instead
Object.getPrototypeOf(obj)

function instanceOf(Func) {
	var obj = this;
	while(obj !== null) {
		if (Object.getPrototypeOf(obj) === Func.prototype) {
			return true;
		}
		obj = Object.getPrototypeOf(obj);
	}
	return false;
}
//can be called as the following to return true if obj is an instance of class:
instanceOf.call(object, Class)

//using prototypal inheritance is an easy way to implement inheritance 
//prototype obj is used as a blueprint for each obj created by constructor. 
//real prototypal inheritance requires use of Object.create()

//example: 
var myCar = {
	name: "Ford Escort",
	drive: function() {
		console.log("I'm driving!");
	}, 
	panic: function() {
		console.log("Oops");
	}
};

//use obj.create to instantiate new car: 
var yourCar = Object.create(myCar);
//myCar is a prototype of yourCar. 

var vehicle = {
	getModel: function() {
		console.log("The model is" + this.model);
	}
};

var car = Object.create(vehicle, {
	"id": {
		value: MY_GLOBAL.nextId(), 
		//writable: false, configurable: false by default
		enumerable: true
	}, 
	"model": {
		value: "Ford", 
		enumerable: true
	}
});

//prototypal relationships can cause trouble when enumerating 
//props of obj. You should wrap contents of loops
// in a hasOwnProperty() check. 

//Simulate Object.create() pattern with prototypes: 

var vehiclePrototype = {
	init: function(carModel) {
		this.model = carModel;
	}, 

	getModel: function() {
		console.log("The model is" + this.model);
	}
};

function vehicle(model) {
	function F() {};
	F.prototype = vehiclePrototype;

	var f = new F();

	f.init(model);
	return f;
}

var car = vehicle("Ford Escort");
car.getModel();

//also an alternative implementation of prototype pattern: 
var beget = (function() {
	function F() {}

	return function(proto) {
		F.prototype = proto; 
		return new F();
	};
})();

//MDN Object.create() 
//Syntax:
//Object.create(proto[, propertiesObject])

//args:

//proto: obj that should be proto of new obj. 
//propertiesobj: optional. If specified, 
//properties from this arg (not along its prototype chain) 
//will get added to newly-created obj. 

//returns new obj w specified prototype obj and properties. 

//Classical inheritance example: 

//shape - superclass
function Shape() {
	this.x = 0; 
	this.y = 0;
}

//superclass method
Shape.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	console.info("Shape moved");
};

//rectangle- subclass
Function Rectangle() {
	Shape.call(this); //calls superconstructor
}

//subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.construtor = Rectangle; 

var rect = new Rectangle();

console.log("Is rect an instance of Rectangle?", rect instanceof Rectangle); //true
console.log("Is rect an instance of Shape?", rect instanceof Shape); //true
rect.move(1, 1); //"Shape moved"

//mixins to inherit from multiple objects:
function MyClass() {
	SuperClass.call(this);
	OtherSuperClass.call(this);
}

MyClass.prototype = Object.create(SuperClass.prototype); //inherit
mixin(MyClass.prototype, OtherSuperClass.prototype); //mixin

MyClass.prototype.myMethod = function() {
	//do sth
};

//mixin fxn, which is like jQuery.extend() and which 
//must be supplied by user, copies functions from superclass prototype to subclass prototype. 

//Using propertiesObj argument with Object.create(): 

var o; 

//create obj w null prototype 
o = Object.create(null);

o = {};
//is equivalent to: 
o = Object.create(Object.prototype);

//creating an obj w sample properties: 
o = Object.create(Object.prototype, {
	//foo is a regular 'value property' 
	foo: {writable: true, configurable: true, value: "hello"}, 
	//bar is a getter-and-setter (accessor) property
	bar: {
		configurable: false, 
		get: function() {return 10;},
		set: function(value) {console.log("Setting o.bar to", value);}
	}
});

function Constructor () {}
a = new Constructor();
//is equiv to 
a = Object.create(Constructor.prototype);
//but if there is actual initialization code in Constructor fxn, 
//Object.create() cannot reflect it. 

//creates new obj whose prototype is a new, empty obj 
//and adds single property 'p' with value 42. 
o = Object.create({}, {p: {value: 42} });

//by default props are NOT writable, enumerable or configurable. 
o.p = 24;
o.p;//42

//Classical inheritance in JS ES5: 

//Shape - superclass
//x, y = location of shape's bounding rectangle. 
function Shape(x, y) {
	this.x = x;
	this.y = y;
}

//superclass method
Shape.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
}

//circle- subclass. 
function Circle(x, y, r) {
	//call constructor of superclass to initialize superclass-derived members.
	Shape.call(this, x, y);

	//initialize subclass's own members
	this.r = r;
}

//Circle derives from Shape
Circle.prototype = Object.create(Shape.prototype);
//first line sets up prototype chain: 
//object prototype and .prototype prop of obj are different. 
//technically: prototype of objs created w circle constructor is an instance whose prototype is prototype of objs created by shape constructor. 
//that is, each circle has shape as its prototype. 

Circle.prototype.constructor = Circle;
//while not strictly necessary, this line preserves useful invariants. 
//assignment to circle.prototype in first line kills existing Circle.prototype.constructor 
//which was set to Circle when Circle constructor was created, so we restore it. 

//important because then we can do this: 

cir.constructor === Circle //true
//create new Circle obj based on existing circle instance: 
var new_cir = new cir.constructor(3, 4, 1.5) 
new_cir
//Circle {x: 3, y: 4, r: 1.5, constructor: function, area: function}





var shp = new Shape(1, 2)
[shp.x, shp.y]
//[1, 2]
shp.move(1, 1)
[shp.x, shp.y]
//[2, 3]

var cir = new Circle(5, 6, 2)
[cir.x, cir.y, cir.r]
//[5, 6, 2]
cir.move(1, 1)
[cir.x, cir.y, cir.r]
//[6, 7, 2]
cir.area()
//12.5...

var shape_proto = Object.getPrototypeOf(shp) 
var circle_proto = Object.getPrototypeOf(cir)
Object.getPrototypeOf(circle_proto) === shape_proto
//true

cir instanceof Shape //true
cir instanceof Circle //true
shp instanceof Shape //true
shp instanceof Circle //false



//Subclass methods: add after Circle.prototype is created with Object.create
Circle.prototype.area = function() {
	return this.r * 2 * Math.PI;
}

//Plain English guide to JS prototypes: 

//prototypes in JS are simpler and more flexible object model than class-based langs. 
//best prac: don't make prototype inheritance chains go too long.  

//link __proto__ of obj to another obj to make it its prototype and inherit props
//prototype lookups are dynamic; you can add props at any time and protoype chain lookup will find new prop
//new/updated props are assigned to obj, not prototype. instance props override prototype props

//__proto__ is not a well-supported way of assigning prototypes to objs
//Object.create() is the next simplest way to do it. 

var person = {
	kind: "person"
};
var zack = Object.create(person, {age: {value: 13} });
console.log(zack.age); //13

var zack = Object.create(person);
Object.getPrototypeOf(zack); //person
//no Object.setPrototype exists. 

//Constructor functions: the most used way in JS to construct prototype chains. 
//functions used w keyword new behave like factories, creating new objs. 
//obj created is linked to fx by its prototype. 

function Foo() {}
var foo = new Foo();
//foo is now an instance of Foo
console.log(foo instanceof Foo) //true

//this is assigned implicitly: 

function Foo() {
	//behind the scenes, this happens: 
	//var this = {}
	//this.__proto__ = Foo.prototype;
	this.kind = 'foo' 
	//return this;
}
//if you forget to use 'new' this will be set to global obj. 

var foo = new Foo();
foo.kind // 'foo'

//the 'function prototype'
//every fx in JS has a special prop called 'prototype': 

function Foo() {

}
Foo.prototype 
//the function prototype property !== real prototype (__proto__) of the fx.
Foo.__proto__ === Foo.prototype //false

//prototype property of fxns points to obj that will be 
//assigned as prototype of instances created with that fx when 
//using 'new'.

function Person(name) {
	this.name = name;
}

//the function Person has a prototype property 
//to which properties can be added. 
Person.prototype.kind = 'person'

//when we create a new obj using new 
var zack = new Person("Zack");

//the prototype of the new obj points to person.prototype
zack.__proto__ == Person.prototype //true

//in the new obj we have access to props defined in Person.prototype
zack.kind //person


//One more example of classical inheritance

//Parent class constructor
function Parent() {
	this.a = 42;
}

//Parent class method
Parent.prototype.method = function method() {};

//Child class constructor 
function Child() {
	Parent.call(this);
	this.b = 3.14159
}

//Inherit from parent class
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

//Child class method
Child.prototype.method = function method() {
	Parent.prototype.method.call(this);
}

//Instantiate 
this.instance = new Child();


//ObjectPlayground notes

//this keyword depends on obj, not where something was defined. 
//in practice, deletion of property with 
delete object1.c 
//and with
object1.c = undefined;
//is basically the same. 

//Prototypal Model 

//even if sth uses function method from PARENT
//if it is invoked for child, this is set to child 
//and other variables will be looked for in child scope. 

//Polymorphism: same method, diff result: 
//child methods override parent methods

var answer = {
	get: return function fn1() {
		return this.val;
	},
	val : 42
};

var firmAnswer = Object.create(answer); 
firmAnswer.get = function fn2() {
	//return answer.get() + "!!" 
	//doesn't work because 
	//this is set to answer when you call answer
	return answer.get.call(this) + "!!";
	//this here is set to firmAnswer still
};

firmAnswer.val = 3.14159;
firmAnswer.get(); //"3.14159!!"

var AnswerPrototype = {
	get: function fn1() {
		return this.val;
	}
};

var lifeAnswer = Object.create(AnswerPrototype); //extend
lifeAnswer.val = 42; //initialize, but duplicated logic 
//here violates encapsulation. 
lifeAnswer.get(); //42

//initialization: Prototypal model. 


var AnswerPrototype= {
	constructor: function fn0(value) {
		this._val = value; //underscore before a prop 
		//indicates that it is private and shouldnt be modified
	}, 
	get: function fn1() {
		return this._val;
	} //as an object. 
};

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


//Classical model: 
//every time you define a function you also create a constructor
//associated with a little, do-nothing class called prototype. 

function Answer(value) {
	this._val = value;
} //in classical model create constructor first
//as a function object. 


Answer.prototype.get  = function fn1() {
	return this._val;
};
//functionality is tacked on to prototype and you access that directly with prototype prop

var lifeAnswer = new Answer(42); //instantiates + initializes w 42
//uses new keyword
lifeAnswer.get(); //42

// w subvlasses, is more complicated. 

function FirmAnswer(value) {
	Answer.call(this, value);
}

FirmAnswer.prototype = Object.create(Answer.prototype);
FirmAnswer.prototype.constructor = FirmAnswer;

FirmAnswer.prototype.get = function fn2() {
	return Answer.prototype.get.call(this) + "!!";
};

var luckyAnswer = new FirmAnswer(7); 
luckyAnswer.get(); //"7!!"


//ES6 syntax for classical model: check objectplayground.com 
//video from 23:17


//instanceof: tells you which class was used to instantiate an obj

//looks at prototype of constructor and compares it to obj

lifeAnswer instanceof Answer; //true
//first, looks at answer.prototype and then look at __Proto__ of lifeanswer 
//goes up prototype chain so grandchildren are instances







//Video lesson notes

//classical model uses new keyword, constructor fxn, and returns an obj. 
//can define prototype obj and properties

var User = function(firstName, lastName) {
	this.firstName = firstName;
	this.lastName = lastName;
} //a constructor fxn

var user1 = new User("David", "Yang"); //need new to return an obj from constructor fxn
user1;
//User {firstName: "David", lastName: "Yang"}

User.prototype 
//User {}

User.prototype.fullName = function() {
	return [this.firstName, this.lastName].join(" ");
} //adds method

user1.fullName();
//"David Yang"

//even though user1 was created before fullName method was 
//added, it gets that method by reference bc of copying by reference. 

Object.create() //always returns new obj and has references to what is passed in as prototype

var user_prototype = {
	school: "Fullstack Academy"
}

var user1 = Object.create(user_prototype);

dir(user1); //deep inspection
//	Object {}
//	__proto__: Object
//		school: "Fullstack Academy" 
//		--> __proto__: Object

//Object.create() is like using new keyword with constructor
//but we dont need new anymore. 

//Chaining prototypes with Object.create() 

var getFullName = function() {
	return [this.firstName, this.lastName].join(" ");
};

var user_prototype = {
	fullName: getFullName
};

var user1 = Object.create(user_prototype);
//instance of obj doesnt have anything on it yet but prototype poitns to 
//user_prototype.

user1.firstName = "David";
user1.lastName = "Yang";

user1.fullName();
//"David Yang"

var super_user1 = Object.create(user1);
//since superuser1's prototype is user1, it has all the same props
super_user1.fullName();
//"David Yang"
//if doing dir(super_user1)
//Object {}
//__proto__: Object --> this has firstName David etc
	//__proto__: Object w fullName function

var User = function(firstName, lastName) {
	this.firstName = firstName;
	this.lastName = lastName;
} 

User.prototype.fullName = function() {
	return [this.firstName, this.lastName].join(" ");
};

var SuperUser = function(firstName, lastName, userType) {
	User.call(this, firstName, lastName); //inheritance to DRY 
	this.userType = userType;
};
//superUser's prototype is not user's prototype; it has object prototype as its prototype. 
SuperUser.prototype.fullName;
//undefined

SuperUser.prototype = new User();
SuperUser.prototype; //instance of user: user also has prototype 
SuperUser.prototype.fullName;
//now has that 

SuperUser.prototype.deletePost = function() {
	console.log("deleting post");
}
 
SuperUser.prototype.deletePost;
//exists
User.prototype.deletePost;
//undefined

// we can add stuff to instances but it doesn't add UP the prototype chain. 

new SuperUser("Zeke", "n", "admin")

