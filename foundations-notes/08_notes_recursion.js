function recursiveExample() {
	recursiveExample();
}
recursiveExample()

//RangeError: maximum call stack size exceeded 

function addCount(num) {
	if(num===1) {
		//base case: returns val and does not recur. 
		return 1;
	}

	return num + addCount(num-1);
}

//when programming recursively, keep in mind the base case! 
//using debugger, we can walk through the 
//recursive calls and see in call stack that each 
//new invocation has its own num stored in local vars
//when hitting end of fxn, <return> is filled
//and after you hit base case
//stuff will exit out w return val filled in and 
//each call goes off call stack. 

