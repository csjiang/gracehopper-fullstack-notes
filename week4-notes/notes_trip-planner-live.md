# Tripplanner LIVE notes

- In a full-fledged full-stack application, we would use AJAX to fetch the data as JSON… 
- how to cheat: 

``` html 
<script>
  var hotels = {{ hotels | dump | safe }};
  var restaurants = {{ restaurants | dump | safe }};
  var activities = {{ activities | dump | safe }};
</script> <!--pass in nunj variables as frontend json vars -->
```

- for the add buttons: 
	- for each attraction of any type:
	1. DOM select appropriate add button
	2. when button is clicked, find data selected, construct itinerary item, attach to proper location in DOM, and update map. 

- To attach an event listener to a DOM element, the DOM element needs to exist when we attach it. This proves a problem since we attach the itinerary elements dynamically. To solve this, use event delegation: 
	- option A) use 'on' event listener attached to parent (1st arg) to listen for some event on child matching the given selector (2nd arg), and execute the function attached (3rd arg).  
	```javascript
	$('#itinerary').on('click', '.remove', function () {
	  // handle it here        
	});
	```
	- option B) alternatively, assign the event to the itinerary item when you attach it, e.g. by calling the event listener function in the callback for the 'on' event listener for the add button. 

- needing a correspondence between the itinerary list + map view --> this speaks to the need to maintain a relationship btw "model" (data computer deals w) and "view" (interface the user interacts w). 
	- jQ methods for this: `.index()` and `.data()`
		- `.index()` tells you the index of a child elmt in parent elmt - So the first item you add will be index 0. Second will be index 1. When you remove that first added item, it will also be index 0. BUT... now the index of the second item (which was index 1 when we added it) is index 0, because there is only one child for that parent. Hmm. Maybe there is some way to add an index that is persistent. 
		- `.data()` ?

////// need to edit/update the following, which is currently just copy/pasted from review material:  

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