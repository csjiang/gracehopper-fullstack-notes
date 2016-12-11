#JAKE WARY

DOM - document object model - browser's representation of HTML - all elmts in tree (server-side)

client-side: JS executed in the browser
 	- usu can't interact w db 
 	- can't call require (bc it is a diff module system than node js)
 	- to bring in extra files from fs, you have to use script tags and add things to global scope to get access

selectors: how to select specific groupings or elmts 

frontend apps = UIs (vs node, which has no gui)

when you make a GET req to a remote server:
- the server will usu be configured to handle the req 
eg 
```javascript
app.get('/', function(req, res) {
	res.send('hello.html');
})
```
- received by browser/whatever machine is on the client side. 
- browser parses the html response line-by-line
```html 
<link rel="stylesheet" ...> <!-- will do GET /style.css -->
```
- server gets req and sends back appropriate response
- browser continues going down and makes requests for whatever 
- when it gets to `<script>` tag, it will do GET /scripts/something.js 
	- at this pt, the js file is just text. the server sends it back as text - a description of the program.
- then the browser executes it!!! the client frontend does not share any code or functionality w the server itself!!! 
- code is being sent from server, sent over wire but it doesn't know who it's sending to - could be a browser on a computer, but it could also be a tessel or curl. And you don't know which browser is on the client side. That is why the server sends it as text! 

### backend node stuff: keeping code updated/compatible is easier than w frontend - you have five mainstream browsers to work with, and then mobile browsers, and you have to worry about versions + screen sizes etc

##Using JS to get classes of an elmt
- modern browser: call a dom elmt and call `getComputedStyle()` - returns array or string of what is in the elmt
- some older browsers: `currentStyle()` - use this as a fallback method - if first method doesn't work, then use this one. 
- older: `runtimeStyle()` 
- Other browser: get class elmts as a string and parse it yourself 

``` javascript
if (DomElement.getComputedStyle) {
	classes=DOMElement.getComputedStyle();
} else if (DOMElement.currentStyle()) {
	classes= DOMElement.currentStyle();
} //etc
```

##Browsers do everything differently! 
- elmt selection, setting styles, and everything else. 
- some decide *not* to support a certain browser - and put it on the site. depends on audience
##jQ is magical bc it abstracts over cross-browser shit (but can get soupy)
- allows us to do stuff while it takes care of implementing stuff 
- released in 2006- changed industry's attitude twd JS and the web 

- cheerio allows us to interact w dom as html; frequently used for scraping. 
- use node to send req to websites, get html and get info out of text
- http-server cli allows us to open files on a static server - localhost:8080/ (in lieu of building out an express backend) 
- jQ has nothing to do w backend 

#jQuery brings in 2 global vars
- has `jQuery` object -> `jQuery.each`, etc
- `$` 
	- it brings in both bc some other libs use $ and jQ wants to not conflict w that shit 
- jQ has to be imported BEFORE any `<script>` tags! 

``` javascript
const h1 = $('h1');
console.log(h1);
```
##manipulation with jQuery
- in console: 
	`jQuery.fn.init` - a jQ wrapper around our jQ obj. Has mad methods 
	- but since no document ready fn is called the DOM hasn't loaded yet- jq imported in header, but <h1> elmt comes after!
	- so you have options- 
		- put all html tags at bottom (but if you use nunjucks or other dynamic rendering engine, this can cause issues) 
		- so: make script stuff timing-agnostic and location-agnostic.
		```javascript
		$(document).ready(function() {
			//do shit
		});
		```
		- you can also use shorthand: 
		```javascript
		$(function() {
			const h1 = $('h1');

			$h1.color('red');

			$h1.animate({
				left: 500;
				fontSize: 200; //jumps to the right and expands
			}, 2000); 
		});
		```
		--> jQ basically appends a style="red" to the h1 elmt. You will not see this in 'view source' bc that is the source as it comes from the server! 


##interactivity: event listening!

	```javascript
	$(function() {
		const h1 = $('h1');

	$h1.on('click', function() {
		$h1.animate({
			left: 100;
			}, 1000)
		});
	});
	```

	- be aware of CACHE - it can preserve stuff from showing up 
	- disable cache in devtools 

	- in jQ- take DOM elmt and pass it back into jQ func 
	because callback fn has `this` that is not the DOM elmt it was invoked on


	```javascript
	$(function() {
		const h1 = $('h1');

	$h1.on('click', function() {
		$h1.animate({
			left: 100;
			}, 1000)
		});
		console.log(this); //not $h1

		$h1 = $(this);
	});
	```

#$ does: 

- find: use w a string- will consider it an elmt selector.
- also to create: if you pass it a string that looks like html it will create a new elmt for you as a jQ obj that you can append to pg in difft ways

```javascript
$(this) //this being a DOM elmt - in an event handler

$(document.getElementById('jukebox')); 

$($('#jukebox')); //you'd never really do this 


## color palette picker 
$('input').on('change', function(e) {
	const $input = $(this);
	console.log($input.val());
}) //sliding bar for color picker 
```

if you put a span elmt under sliding bar w/ 0 there- at the same level in div - `<input>` and `<span>` - they are siblings. 
```javascript
const $spanToUpdate = $input.siblings('span'); 
$spanToUpdate.text($input.val());
```

```javascript
$(function() {
	const $logo = $('#logo');
	flashColors($logo, 5000);
});
```
- to set RGB slider identities without assigning ids - use jQ to select first child as red, second as green, third as blue 

```javascript
$(function() {
	const $logo = $('#logo');
	flashColors($logo, 5000);

	const colors = [0, 0, 0];

	const updateMyColor = function() {
		$('my-color').css({
			background: `rgb($(colors.join(', ')))`;
			});
	}

	$('input').on('change', function(e) {
	const $input = $(this);
	console.log($input.val());
	const value = $input.val();
	const $spanToUpdate = $input.siblings('span');
	const elemnetIndex = $parentDiv.index();
	const $parentDiv = $input.parent();
	$spanToUpdate.text(value);
	colors[elementIndex] = value;
	updateMyColor();

}); //sliding bar for color picker 

	$('save-color').on('click', function() {
	const $newColor = $('<div class="favorite-color" style:"background: `rgb($(colors.join(",")))`;"></div>')
	}); //constructed, but not placed on the DOM yet 
	const $newLi = $("<li></li>");
	$newLi.append($newColor);
	$favoriteColorsList.append($newLi);
});
```

- client-side JS lib
- good for DOM selection, event handling, managing event properties
- jQ still has large slot in industry but for some things, better to use Angular/React/etc. 

# Tripplanner LIVE notes

- In a full-fledged full-stack application, we would use AJAX to fetch the data as JSON… 
- how to cheat: <script>
  var hotels = {{ hotels | dump | safe }};
  var restaurants = {{ restaurants | dump | safe }};
  var activities = {{ activities | dump | safe }};
</script> - pass in nunj variables as frontend json vars 

- for the add buttons: 
	- for each attraction of any type, 1) DOM select appropriate add button
	2) when button is clicked, find data selected, construct itinerary item, attach to proper location in DOM, and update map. 

- To attach an event listener to a DOM element, the DOM element needs to exist when we attach it. This proves a problem since we attach the itinerary elements dynamically. To solve this, use event delegation: 
	- option A) use 'on' event listener attached to parent (1st arg) to listen for some event on child matching the given selector (2nd arg), and execute the function attached (3rd arg).  
	```javascript
	$('#itinerary').on('click', '.remove', function () {
	  // handle it here        
	});
	```
	- option B) alternatively, assign the event to the itinerary item when you attach it, e.g. by calling the event listener function in the callback for the 'on' event listener for the add button. 

- needing a correspondence between the itinerary list + map view --> this speaks to the need to maintain a relationship btw "model" (data computer deals w) and "view" (interface the user interacts w). 
	- jQ methods for this: .index() and .data()
		- .index() tells you the index of a child elmt in parent elmt (??) - So the first item you add will be index 0. Second will be index 1. When you remove that first added item, it will also be index 0. BUT... now the index of the second item (which was index 1 when we added it) is index 0, because there is only one child for that parent. Hmm. Maybe there is some way to add an index that is persistent. 
		- .data() ?

//////

- 
Switch Days

Switching is tricky business. You'll have to keep track of at least each day's itinerary items.

Depending on your implementation up to this point, there are probably two distinct — though blendable — paths moving forward. 

"model"-driven approach

You could keep the data for all days stored as an array of objects with itinerary items listed for each attraction type. As days are added, you would make sure to update this array store as well as the DOM. Then, when the day switches, maybe some index would change, then the relevant parts of the DOM would be wiped and repopulated with the newly current day's data.

You would have to make sure your models and views always stay in lock-step, and likely you'd want methods like setHotel, or removeActivity that could be triggered directly by an event, or indirectly through iteration over the newly current day's data.

"view"-driven approach

Instead, you might have the state "embedded" in the DOM itself. If you simply plop the itinerary view into an array every time you switch, then you can simply pull it back out again when you need to "reload" it.

If you follow this road, you'll likely find jQuery's .clone method very useful. On the other hand, you'll probably find the map a little harder to deal with. You could make a new map for every day, or you may choose to hybridize with the model-driven approach — for example, by storing markers.

Week 4 Concept Review
Event delegation: as per jQuery’s documentation, “event delegation allows us to attach a single event listener, to a parent element, that will fire for all descendants matching a selector, whether those descendants exist now or are added in the future.” We can take advantage of event delegation even without jQuery, as we saw in Game of Life - we could attach one event listener to the game board, for instance, and it was able to listen to events triggered by its child cell elements, because events on child elements “bubble” up the DOM tree, meaning that a click event on an element would trigger both that element’s click-handling function as well as the click handlers for all of its parent elements.


The module pattern and IIFEs: We’re used to using Node.js’s module loading system, with `require` and `module.exports`; however, because our front-end javascript isn’t being run by Node but by the browser, we don’t have that exact system available to us. Instead, we can utilize what is known as the module design pattern (referring to a software design pattern, rather than a visual design pattern). This design pattern is used extensively in the solution for Trip Planner Live. In short, the module design pattern utilizes immediately-invoked functions which return objects - using IIFEs, rather than just declaring objects, allows us to declare certain “private” variables which are only accessible within the scope of the IIFE, and to the object that is has returned (thanks to the miracle of closure). For more on the module pattern (and other common javascript design patterns), please refer to this text: https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript


AJAX: the ability to make background (i.e. asynchronous) HTTP requests, whose responses would trigger only a partial re-rendering of the view. There are a few different implementations of AJAX requests across browsers - however, jQuery takes care of a lot of cross-browser considerations under the hood with its `.ajax` method.


Serialization and deserialization of data: the encoding and decoding of data into a format that allows it to be transported and stored, as well as easily read by both humans and machines; for instance, JSON (JavaScript Object Notation) is an efficient data encoding format that enables fast exchanges of small amounts of data between client browsers and AJAX-enabled Web services.


RESTful API design: REST-compliant web services allow requesting systems to access and manipulate textual representations of web resources using a uniform and predefined set of stateless operations. Essentially, we want to write our routes in a way that makes them easily used by other developers who are familiar with REST. A good example of a RESTful API is this PayPal API: https://developer.paypal.com/docs/api/


Sequelize associations:
BelongsTo vs. hasOne: BelongsTo associations are associations where the foreign key for the one-to-one relation exists on the source model, whereas hasOne associations are associations where the foreign key for the one-to-one relation exists on the target model.
BelongsTo vs. belongsToMany: Belongs-To-Many associations are used to connect sources with multiple targets. Furthermore, the targets can also have connections to multiple sources. BelongsToMany associations must be made with a `through` option, which is equal to the name of the join table that is created.


Event listeners:
Event listeners are instrumental in Node, and instrumental in a common design pattern known as the “pub/sub” pattern (short for “publish” and “subscribe”). 
Event emitters have two main methods: `on` and `emit`. `On` allows an event emitter to register a callback function that will run when a specific event is emitted; and `emit` will emit a specific event, causing any subscribed listeners to fire off their associated callback functions.
We could create our own Event Emitter constructor, but Node has its own event emitter library.


Web Sockets: sockets are a web protocol that use TCP connections to create a persistent connection that allows for real-time communication between a server and a client. This connection is initiated by a client, who sends a regular HTTP request (known as the initial “handshake”) which includes a special header specifying that they would like to open up a socket connection. After the handshake is complete, both the server and client can send messages to one another (as opposed to only the client being able to initiate a request/response cycle, as in HTTP). In World Wide Whiteboard, we used the Socket.io library to implement the web socket protocol.


ES6:
In preparation for next week’s introduction to React, this week we took a look at the following features introduced in the latest Javascript specification:
Arrow functions
Destructuring assignment
The spread and rest operators: identical, but mean different things in different contexts.
Classes
Const and Let: two new keywords that replace var for variable declarations
Template literals
- Import and export
Default parameters

