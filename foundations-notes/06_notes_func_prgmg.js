//Functional Programming 

//Normal for loop in a functional way: 

//for loop 
var names = ["nimit", "scott", "david"]
var bigstring = "";

for (var i = 0; i < names.length; i++) { 
bigstring == names[i];

};
//"nimitscottdavid"

// w func progrming the primary part of loop (what happens on the loop)
//you dont have to write the looping part again and again. 
//functionally: 
 
 function forEach(array/*that we iterate over, */, 
 	iteratorFunction /* what we want to happent o each element in array*/) {
 	for (var i = 0; i < array.length; i++) {
 		iteratorFunction(array[i]); 
 		/*funciton passed in as a variabel */
 	}

 }


var names = ["nimit", "scott", "david"];
var bigstring = "";
forEach(names, function(name) {
	bigstring += name;
}); //is anonfunction that comes in as iteratorFunction

function appendToBigString(name)  {
	bigstring +=name;
}
var appendToBigString = function(name) {
	bigstring +=name;
}
//both types of the above can be passed in as variables

//Reduce is another way to iterate through arrays
// should have been called snowball? 
var nums = [20, 30, 40, 100];
[20, 30, 40, 100]
[50, 40, 100]
[50+40, 100] //[90, 100]
[190]
//reduce is like a snowball the first numbers the snoball and it 
//gets bigger as you go 
//reuces size toward the answer 

var reduce = function(array, /*starting value- snowball that you manually pack. sometimes is 0 or emptyArray or emptyString*/
startVal, reducerFunc /*how you pack snow */) {
	var currentVal = startVal; /* initial snowball set */
	/* next go through array and add each new val to snowball*/
	/*assume reduceFunc takes current and next val and gives you new snowball*/
	for (var = 0; i = array.length; i++) {
		currentVal = reducerFunct(currentVal, array[i] /*next value to be combined*/)
	};

	return currentVal;
}


//example: using reduce to sum up a list of numbers

var nums = [20, 30, 40, 100];

var sum = reduce(nums, 0, function(current, next) {
	debugger; //adding this will allow you to see how current changes w each iteration of reduceF
	//debugger: highlighted is where it pauses; scope vars: local vars = what current state of vars is 
	//skip over next func call buttton; also play button which also does that (??)
	return current+next;
});

sum
//190

//By value vs by reference notes: JS the definitive guide, 4th ed. 







