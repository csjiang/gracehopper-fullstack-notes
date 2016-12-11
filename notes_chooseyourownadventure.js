//finite state machine: 
	//modeling a system comprised of a limited # of modes
	//state transition diagram: 
		//states, transitions, events that serve as rules for those transformations. 
	//oven: has two states: off + heating. default state is off; 
	//off_pressed goes to off state; bake_pressed goes to heating state.
	//when element reaches desired temp, elmt switches on and off to maintain temp. 3rd state is idling- when too_hot/too_cool. 
	//one more transition from off_pressed to go between idling and off. 

//file structure of node project: 
	// test contains spec files to guide you in completing the workshop. Node projects often include test specs in a test folder.
	// src contains source code files you must write to implement the game engine. The main files for a Node project are often placed in a lib (library) and/or src (source) folder.
	// example contains an example game demonstrating how the engine is used. You should read this but not change it. Many software packages include examples, even when not explicitly mentioned in a README. It pays to glance at the code repository!
// In software, automated tests serve many purposes:

// When tests are written first ("Test-Driven Development"), they help with planning
// Serve as documentation
// Double-check that new code works properly
// Prevent regression (new code breaking old code)
// Ensure that code works in multiple environments
