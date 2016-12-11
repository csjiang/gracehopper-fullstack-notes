- Babel (which exists for many diff envts, including Node) takes ES6 code, interprets it, and rewrites code as ES5-compatible JS. (transpiling = taking source code written in one lang, transforming it into another lang w a similar level of abstraction) (also check out Traceur)
- to transpile code: in cli- 
`babel --presets es2015 index.js --out-file app.js`
- tells B to grab es6 code in index.js and transpile it to app.js
- either do this every time you add code to index.js, or use the --watch flag to tell B to watch and transpile as code is added: 
`babel --presets es2015 index.js --out-file app.js --watch` 

- We'll be building a basic fighting game simulator, utilizing classes, native templating, arrows, enhanced object literals, default / rest / spread as well as a fair dose of magic spells and stuff.

#ES6 classes
- classes mostly syntactic sugar over existing JS prototypical inheritance and objects. 
- ES6 class syntax: 
```javascript
class someClass {
	constructor(name, age) {
	this.name = name; 
	this.age = age;
	}

	sayName() {
		alert(this.name);
	}

	sayAge() {
		alert(this.age);
	}
}

var myInstance = new someClass('dwayne', 27);
myInstance.sayName();

//ES5 way

function someClass(name, age) {
	this.name = name; 
	this.age = age;
}

someClass.prototype.sayName = function() {
	alert(this.name);
}

someClass.prototype.sayAge = function() {
	alert(this.age);
}

var myInstance = new someClass('dwayne', 27);
myInstance.sayName();

```
- so instantiation is the same, but inheritance is difft
##inheritance
```javascript
class Child extends someClass {
	constructor(name, age) {
		super(name, age);
	}

	//override the someClass method above
	sayName() {
		//this calls someClass.sayName(), triggering the old alert which displays name
		super.sayName();

		//this triggers new alert w labels and age
		alert('Name:' + this.name + ' Age:' + this.age);
	}
}

```

- classes can easily override parent methods 
- `super()`
	- this fn calls the parent fn depending on context, and then returns the result. 
	- in ES5 and before it required use of `call` or `apply` to achieve this functionality. 

	- many classes use super() method inside of a class constructor. 
	- calling `super.parentMethodName()` from w/in a child class will call the base class yoou inherited. 
		- eg: parent class is 'Boss' and child class is 'Emp' - calling super.Emp() from w/in the Emp constructor will call the Boss constructor first. 

- why to use ES6 classes 
	- clarity and concision 
	- more OOPness a la Java and C
	- classes now are cosmetic, but in ES7 there might be more OOP syntax like static, public, and private
	- IDEs like WebStorm support classes in ES6 and can make tracing methods more powerful

- more examples
```javascript
	class View {
		constructor(options) {
			this.model = options.model;
			this.template = options.template;
		}

		render() {
			return _.template(this.template, this.model.toObject());
		}
	}

	class Model {
		constructor(properties) {
			this.properties = properties;
		}

		toObject() {
			return this.properties;
		}
	}

	var jack = new Model({
		name: 'jack'
	});

	var view = new View({
		model: jack,
		template: 'Hello, <%= name %>'
	});

	console.log(view.render()); //'Hello, jack'
```

- class instantiation is with the `new` keyword- no change from ES5 and before world. `constructor` fn called automagically when an instance is created. 

```javascript
//extending: 
	class LogView extends View { //} here would just make LV the same as V
		render() {
			var compiled = super.render(); //calls parent class's render() method and returns the result 
				//so super allows us to access methods and props on parent class.
			console.log(compiled);
	}
}
```
- cf ES6 specification requirements, goals, means and themes: http://wiki.ecmascript.org/doku.php?id=harmony:harmony#goals
	- enable experimental JS in chrome from chrome://flags/
- one of the goals is to be a better lang for creating 	
	- complex apps
	- libraries
	- code generators

##arrow fns w map
```javascript
//expr bodies
var odds = evens.map(v => v+1);
var nums = evens.map((v, i) => v+i);

//stm bodies
nums.forEach(v => {
	if (v % 5 === 0) 
	fives.push(v);
});

//lexical this
var bob = {
	_name: 'bob',
	_friends: [],
	printFriends() {
		this._friends.forEach(f => 
			console.log(this._name ' knows ' + f));
	}
};

//lexical args
function square() {
	let example = () => {
		let numbers = [];
		for (let number of arguments) {
			numbers.push(number * number);
		}
		return numbers;
	};

	return example();
}

square(2, 4, 7.5, 8, 11.5, 21); // returns: [4, 16, 56.25, 64, 132.25, 441]
```










