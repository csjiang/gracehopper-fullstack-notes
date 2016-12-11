element.addEventListener(<event-name>, <callback>, <use-capture>);
//event-name (string) --> name or type of event to listen to-- could be 
	//standard DOM event like click, mousedown, touchstart, transitionEnd or even custom event name
//callback (fn) - gets called when event happens. First argument is the event obj, which contains data about event.
//use-capture (boolean) --> declares whether callback should be fired in capture phase. 

var element = document.getElementById('element');
function callback() {
	alert('Hello');
}
//add listener
element.addEventListener('click', callback);

//removing listeners: a best prac once they are no longer needed
element.removeEventListener(<event-name>, <callback>, <use-capture>);
//removeEventListener has a catch- must have ref to callback fn that was originally bound. 
//you can't just call element.removeEventListener('click');
//you need to keep a handle on your callbacks- which means you can't use anon fns. 

//=======Review=========

//create helper fns and store in own obj to handle operations in step fn 

var gameUtils = {
	//best practice: to not have a lot of global variables - don't pollute the global scope. 
	//name-spacing 
	getNeighbors: function(cell, x, y){ 
		var neighbors = [];
		//use nested for loops to generate all ids (performance dint is negligible b/c of paucity of items)
		for (var i = x-1; i <=x+1; i++) {
			for (var j = y-1; j <= y+1; j++) {
				if (i === x && j === y) continue; //goes on to the next iteration thr loop 
				neighbors.push(document.getElementById(`${i}-${j}`));
			//for testing: gameoflife is global var and can use for in-browser testing
			//as is gameUtils
			}
		}
		//bc these loops return a lot of null values, filter them out: 
		return neighbors.filter(function(neighbor) {
			return neighbor; //returns if callback fn returns a truthy value 
		});
	},
	countLiveNeighbors: function(neighbors) {
		return neighbors.filter(function(neighbors) {
			return gameUtils.isAlive(cell);
		}).length;
	},
	/* countLiveNeighbors: neighbors => neighbors.filter(neighbor) => neighbor.getAttribute('data-status') === 'alive').length;
	*/

	isAlive: function(cell) {
		return cell.getAttribute('data-status') === 'alive';
	}, //naming convention: isX --> returns a bool 
	setCellStatus = function(cell, status) {
		cell.setAttribute('data-status', status);
		cell.className = status;
	} //add this to the onCellClick function to set status if cell is not alive 
}



//createAndShowBoard creates and sets up board
//this.setupBoardEvents binds event handler to board
//use DOM API to get all the cells: 
setupBoardEvents: function() {
	//...
var cells = document.querySelectorAll('td'); 
	//returns array-like obj called a node list 
	//turn this into an array: 
	cells = [].slice.call(document.querySelectorAll('td'));

cells.forEach(function(cell) {
	cell.onclick = onCellClick;
});

//onCellClick fn is passed to JS engine; fn is run when event happens.
//that is why onCellClick takes the argument e (event). 

//event obj has useful properties, incl where event was initiated 
	//event target
	//event delegation- we attach an event listener to a parent elmt; now this listener listens for 
	//events not only initated on parent but also on all child elmts. and that parent is the target of click events(?)

//therefore we can make the board the target and it will listen for events in all cells
var board = document.getElementById('board');

//...
this.board.onclick = onCellClick; //this here refers to whole board itself but td element is 
//child elemt that was clicked on itself
document.getElementById('step_btn').onclick = this.step; //we want 'this' here to be the gameboard, but it 
														//is instead set to the elmt that was clicked, i.e. the button. 
														//therefore, bind to 'this':
//correct implementation
document.getElementById('step_btn').onclick = this.step.bind(this);
	//onclick can only have one callback fn (?) per event 
//with an arrow fn: 
document.getElementById('step_btn').onclick = () => this.step(); //arrow fns look to their enclosing scope for that scope's this value + binds that, so bind is unnec here 
document.getElementById('play_btn').onclick = () => this.enableAutoPlay(); 
document.getElementById('reset_btn').onclick = () => this.reset(); 
document.getElementById('clear_btn').onclick = () => this.clear(); 

var cell = e.target; //replace 'this' in onCellClick with 'cell'

step: function() {
	var toggles = []; //toggle alive/dead

	//for each cell:
	this.forEachCell(function(cell, x, y) {
	//get neighbors
	var neighbors = gameUtils.getNeighbors(cell, x, y);
	//count live neighbors
	var numLiveNeighbors = gameUtils.countLiveNeighbors(neighbors);
	//apply game rules; see if cell lives in next gen
	//2 cases: if cell is alive or dead 
	if (gameUtils.isAlive(cell) {
		if (numLiveNeighbors < 2 || numLiveNeighbors > 3) { toggles.push(cell);//dies
		} else {
			if (numLiveNeighbors === 3) { toggles.push(cell);//lives 
		} 
	}
	toggles.forEach(function(cell) {
		//change cell status/class
			//NB: we have both status and class attributes b/c data-status is one source of truth about whether cell is alive or dead;
			//class is our check on that; it's convenient to have two sep measures. 
		var status = gameUtils.isAlive(cell) ? 'dead' : 'alive'; 
		gameUtils.setCellStatus(cell, status); 
	});
}

forEachCell: function(iteratorFunc) {
	//get all cells
	//apply iteratorFunc to each cell 
	//get each cell by tag name and convert to array
	cells = [].slice.call(document.querySelectorAll('td'));
	cells.forEach(function(cell){
		var idArr = cell.id.split('-'), //returns x and y array for cell coords
			x = Number(idArr[0]),
			y = Number(idArr[1]), //convert to num bc x y coords are in string with 'x-y'
		iteratorFunc(cell);
	})
}

enableAutoPlay: function() {
	//start auto-play by running 'step' fn 
	//automatically repeated every fixed time interval
	setInterval(this.step.bind(this), 500); //doesn't call it; simply sets it to be run later by browser.  
	setInterval(() => this.step(), 500); //in arrow fn you know this is bound correctly
	//stepInterval property on board is a place to store interval id returned by setInterval 
	if (!this.stepInterval) this.stepInterval = setInterval(() => this.step(), 200); 
	else { 
		//we have to set interval id to null ourselves
		clearInterval(this.stepInterval);
		this.stepInterval = null;

		//else clause code all be replaced by this.stop();
	}
	//quick nb on event loops:

	//setInterval(callbackFn, interval in ms) 
		//setInterval returns a timer id; if it returns a falsey val, clear interval.
	//setTimeOut takes callback fn and puts it in a queue; only executes callback fn once. setinterval browser API
	//repeats it over and over again on that interval 
},

reset: function() {
	this.forEachCell(function(cell, x, y) {
	var status = Math.random() > 0.7 ? 'alive' : 'dead';	
					//0.7 instead of 0.5 to end up with fewer live cells 
	gameUtils.setCellStatus(cell, status);
	})
}

//stop function 
stop: function() {
	clearInterval(this.stepInterval);
	this.stepInterval = null;
},

clear: function() {
	//set each cell to dead & turn off autoplay 
	this.forEachCell(function(cell, x, y) {
		gameUtils.setCellStatus(cell, 'dead');
	})
	if (!this.stepInterval) this.stop();
}

	gameOfLife.createAndShowBoard();
	
//refactoring for ES6: 
	//using const and let to replace var keyboard 
		//use const for functions b/c they don't get reassigned 
		//use const for arrays such as the neighbors array. const allows mutation but not reassignmt. 
		//const : also for goltable, board
		//let: tablehtml, vars in for loops b/c they keep changing 
	//spread operator instead of slice.call for array conversion 
		const cells = [...document.querySelectorAll('#board td'))];
		//or Array.from(document.querySelectorAll('#board td'));

	//arrow functions 

		/* always anon fns 
		arg => arg + 1 //sth we want to return goes on right; implicit return when written as one-liner w/o {}

		//block syntax doesn't feature implicit return: 
		arg => {
			return arg + 1
		}

		//when whole thing is wrapped in () return is also implicit
		//to return more than one arg, wrap in ()
		(arg1, arg2) ==> arg 1

		//arrow fns don't bind own this value: will look out in concentric circles from local scope for a this value.
			//and this isn't based on where they are invoked; what matters is where they are defined. 
		//also, arrow fns don't bind an arguments obj, so when you need to use that don't use arrow fns to construct. 

//ideas to extend: 
//tone.js for adding sounds to dying/living cells 
//colors etc for cells based on status 





