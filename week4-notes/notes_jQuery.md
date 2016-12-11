#JAKE WARY

DOM - document object model - browser's representation of HTML - all elmts in tree (server-side)

### client-side: JS executed in the browser
 	- usu can't interact w db 
 	- can't call require (bc it is a diff module system than node js)
 	- to bring in extra files from fs, you have to use script tags and add things to global scope to get access
 	- selectors: how to select specific groupings or elmts 
 	- frontend apps = UIs (vs node, which has no gui)

when you make a GET req to a remote server:
1. the server will usu be configured to handle the req 
eg 
```javascript
app.get('/', function(req, res) {
	res.send('hello.html');
})
```
2. received by browser/whatever machine is on the client side. 
3. browser parses the html response line-by-line
```html 
<link rel="stylesheet" ...> <!-- will do GET /style.css -->
```
4. server gets req and sends back appropriate response
5. browser continues going down and makes requests for whatever 
6. when it gets to `<script>` tag, it will do GET /scripts/something.js 
	- at this pt, the js file is just text. the server sends it back as text - a description of the program.
7. then the browser executes it!!! **important: the client frontend does not share any code or functionality w the server itself!!!** 
8. code is being sent from server, sent over wire but it doesn't know who it's sending to - could be a browser on a computer, but it could also be a tessel or curl. And you don't know which browser is on the client side. That is why the server sends it as text! 

###Backend node stuff: 
- keeping code updated/compatible is easier than w frontend 
- you have five mainstream browsers to work with, and then mobile browsers, and you have to worry about versions + screen sizes etc

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

##jQuery brings in 2 global vars
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
	- but since no document ready fn is called the DOM hasn't loaded yet- jq imported in header, but the  `<h1>` elmt comes after!
	- so you have options- 
		- put all html tags at bottom (but if you use nunjucks or other dynamic rendering engine, this can cause issues) 
		- so: make script stuff timing-agnostic and location-agnostic.
		```javascript
		$(document).ready(function() {
			//do shit
		});
		```
		- you can also use shorthand: 
		``` javascript
		$(function() {
			const h1 = $('h1');

			$h1.color('red');

			$h1.animate({
				left: 500;
				fontSize: 200; //jumps to the right and expands
			}, 2000); 
		});
		```
		- jQ basically appends `style="red"` to the `<h1>` elmt. You will not see this in 'view source' bc that is the source as it comes from the server! 


##interactivity: event listening!
- here is how to set an event listener on an html element using jQuery: 

	``` javascript
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

	- in jQ - take DOM elmt and pass it back into jQ func 
	because callback fn has `this` that is not the DOM elmt it was invoked on


	``` javascript
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

##$ does: 

- find: use w a string- will consider it an elmt selector.
- also to create: if you pass it a string that looks like html it will create a new elmt for you as a jQ obj that you can append to pg in difft ways

```javascript
$(this) //this being a DOM elmt - in an event handler

$(document.getElementById('jukebox')); 

$($('#jukebox')); //you'd never really do this 


//color palette picker 
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
Const and Let: two new keywords that replace var for variable declarations
Template literals
- Import and export
Default parameters

