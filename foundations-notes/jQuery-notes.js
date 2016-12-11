//common uses
	// find elmts in HTML doc
	// change HTML content 
	// listen to what user does and react accordingly
	// animate content on pg
	// talk over network to fetch new content (eg get stuff from server)

//DOM
	//treelike structr created by browsers to quickly find HTML objs
	//HTML object = the DOM. 

	//browser loads stuff piece by piece into DOM as nodes. 

	//HTML elements inside DOM become 'nodes' that have relationships w one another. 
	//HTML is a child of 'DOCUMENT' node. 
		//node types: 1) element 2) text

	//JS is how we interact w the DOM. 

	//finding things using DOM
		//1- web browser requests a webpage from server (which contains HTMl and JS for a page). 
		//2- web server sends HTML + other files needed to load page 
		//3- web browser loads HTML into DOM and JS to interact with DOM. 

//why do we need jQuery? 
	//1 piece of code to communicate w all modern web browsers. 

jQuery(document); //document = DOM 
jQuery("h1"); //select h1 element
jQuery("p"); 
//shorthand: 
$("h1"); //returns h1 element. 
	$("h1").text("string for new text"); //replaces text
		//text method accesses text in element. 
$("p");

//JS may execute before DOM loads, thus creating the awk situation where you're trying to select w/ jQ an element that hasn't been 
//loaded yet in the DOM. 
	//--> make sure DOM is finished loading BEFORE trying to interact w HTML on page.
	//listen for 'i'm ready' event from DOM
	jQuery(document).ready(function() {
		<code>
	}); //executes code inside only AFTER dom is ready. 

	jQuery(document).ready(function(){
		$("h1").text("replacement text");
	});

//loading jQ into HTML: 
	<script src="jquery.min.js"></script>
		//loads jQuery 
	<script src="application.js"></script> 
		//loads jq file: has to be before script is loaded. 
		//best place to put it is before </body> tag (???)


//changing multiple elmts at once
	$("li"); //returns jQ obj of all the <li> elmts in page 
	$("li").text("Orlando"); //changes text of every <li> selected. 

//finding elmts by ID or class
	$("#container"); //select by ID
	$(".articles"); //select by class

//searching the DOM
	//descendant selector: whitespace
	$("#destinations li"); //selects ALL li descendant elmts inside destinations
	//child selector: > - to select only direct descendants. 
	$("destinations > li"); //"parent > child"
	//select multiple items: comma 
	$("#france, .destinations"); //comma allows selection of mult items
	//pseudoselector to select only first/last item in list
	$("#destinations li:first");
	$("#destinations li:last");
	//select every other item (indexed from 0):
	$("#destinations li:odd"); //odd indices
	$("#destinations li:even");

//sometimes, traversing the DOM to filter is easier than selecting 
$("#destinations li"); //slower than below code: 
$("#destinations").find("li"); //finds all list elements using traversal ("find") 
	//traversal has first selection ($("#destinations")) and then traversal ("find("li"))

//find first: 
	//replace li:first and li:last pseudoclasses
	$("li").last();
	$("li").first();
	//find middle element: walking the DOM - chaining multiple methods. 
	//in 3 element list find middle by using:
	$("li").first().next();
	$("li").first().next().prev(); //selects first again

	//walk UP the dom to get parent: 
	$("li").first().parent(); 

	//walk DOWN to get child: 
	$("#destinations").children("li"); //selects only direct desc w/ name specified 
		//compare w 
			find()//, which selects ALL descendants. 


//manipulating the DOM: 
	//append nodes to the DOM: 4 ways
		//1) before: puts new node BEFORE another node specified. 
			$(document).ready(function() {
				//create new <p> with price 
				//send HTML into jQ function: 
				var price = $('<p>From $399.99</p>');
				$('.vacation').before(price);
			});

			//with diff syntax, ref pt at end 
				price.insertBefore('.vacation');

		//2) after
				$('.vacation').after(price);
				//^ ref pt node 		^ node to append after

			//diff syntax: 
				price.insertAfter('.vacation');

		//3) prepend// adds as the first CHILD of ref pt node 
				$('.vacation').prepend(price);
			//diff syntax: 
				price.prependTo('.vacation');

		//4) append //adds as last child of ref pt node
				$('.vacation').append(price);
			//diff syntax: 
				price.appendTo('.vacation');


	//remove nodes from DOM
		//fetch node and call 'remove' method
			$('button').remove();

//acting on interaction: 
	$(document).ready(function() {

	});
	//basically we pass event handler f in to ready method and it runs when DOM is ready

	//on method: 
		//on(<event>, <event handler>)
		$('button').on('click', function() {
			//runs when any button is clicked
		});

	//when button is clicked, price appears and button disappears
	$(document).ready(function() {
		$('button').on('click', function() {
			var price = $('<p>From $399</p>');
			$('.vacation').append(price);
			$('button').remove();
		});
	});

//refactor using traversing
	$(this) //inside event handler, refers to item that triggered the event.
			//you have to wrap this in jQ to make it a jQ object. 

		//ex.remove button only when clicked, and put price only afer current clicked button:
		$(document).ready(function() {
			$('button').on('click', function() {
				var price = $('<p>From $399.99</p>');
				$(this).after(price);
				$(this).remove();
			});
		});

		//.closest(<selector>)
		$(this).closest('.vacation').append(price);
		//walks up dom to find ancestor with class of '.vacation'. Finds 0 or 1 node w proper clas and returns it

		//parents(<selector>) name returns ALL of the ancestors with that class. 

//traversing and filtering
	//add data tag : HTML5 attribute to add to elmts to get addtl info
			//call .data(<name>) //fetch: 
			//.data(<name>, <value>) --> sets 
			$(document).ready(function() {
				$('button').on('click', function() {
					var amount = $(this).closest('.vacation').data('price');
					var price = $('<p>From $'+amount+'</p>');
					$(this).closest('.vacation').append(price);
					$(this).remove();
				});
			});

	//reusing jQ objects: 
		$(document).ready(function() {
			$('button').on('click', function() {
				var vacation = $(this).closest('.vacation'); //only querying the DOM once for this elmt makes it faster. 
				var amount = vacation.data('price');
				var price = $('<p>From $'+amount+'</p>');
				vacation.append(price);
				$(this).remove();
			});
		});

	//on with a selector
	$('.vacation').on('click', 'button', function() {});
	//add on to a class and then do event, and class you within that first selector class, that you want to listen for. 
	//third elmt is event handler function. This is called event delegation. 

	//filtering HTML
	.filter(<filter>);
	.addClass(<newClass>);
	.removeClass(<delClass>);

		$('#filters').on('click', '.onsale-filter', function() {
			//find all vacations on-sale
			$('.vacation').filter('.onsale')
			//remove highlighted class before adding it back to make sure we're highlighting correct elmts. 
			$('.highlighted').removeClass('highlight');
			//add a class to these vacations
			$('.vacation').filter('.onsale').addClass('highlight');
		});

		//expiring filter
		$('#filters').on('click', '.expiring-filter', function() {
			$('.vacation').filter(.'expiring').addClass('highlight');
		});

//Listening to DOM events
	//in CSS class: 
	















