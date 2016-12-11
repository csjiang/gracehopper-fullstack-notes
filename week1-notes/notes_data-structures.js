//abstract data type: 
	// an ADT is a description of info, how that info is connected, and performable
	// operations on that info. 
	// eg. a list is an ordered collxn of elmts that you can add to or read from.
	// dictionary is set of key-value pairs where you can get or set value. 
	// 
//data structure
	//a DS is a concrete programmatic solution for storing, referencing, and accessing
	//data in computer memory. 
	//exists to implement some ADT -- for instance to take concept of a 'list' and realize it in actual code
	//often an ADT can be implemented via more than one DS. 
	//knowing right one can dramatically impact performance 


//stack: 
	//has top and bottom, add and remove only from top.
	//add = push
	//remove = pop
	// elmts are sorted by insertion order
	// last elmt is first out (LIFO)
	// elmts have no index
	// can only add to top and remove from top 
	//useful applications:
		//when you want to reverse order of elmts (eg. undo button)
//queue ADT: 
	//handles multiple elmts, ordered, repetition OK 
	//have a front and a back
	//add only from the back (enqueue) and remove (dequeue) only from the front
	//middle elmts can't be accessed directly
	// elmts are sorted by insertion order
	//first in, first out (FIFO)
	//useful application: 
		//managing resources- eg a print queue
		//or a queue for people who are trying to access a website. 

	//operations: 
		//enqueue: add value to queue. Respects existing order and only adds to back.
		//dequeue: removes value from queue. Obeys FIFO, and handles underflow (dequeueing an empty queue = could throw error or do nothing etc)
		//size: reports # of items in queue

	//possible implementations: 
		//array DS (JS arrays are not true arrays, but rather variations on Object built-in data type, implemented in V8 engine by both real arrays and hash
		// tables on a dynamic bases. NB that node buffers and ES6 typed arrays do implement true arrays. )

//list: 
	// - an ordered collection of values (items/entries/elmts)
	// - where a value may occur more than once (duplicates allowed) (vs set)

	// - behavior: 
	// 	- can add elmts
	// 	- remove elmt
	// 	- find elmts
	// 	- other operations incl concat etc 
	// - array implementation: 
	// 	take a block of memory and put diff elmt in each location
	// 	- disadvantages
	// 		- add elmt is an expensive operation: all elmts have to be shifted downward or upward
	// 		- size is fixed when you correct it. you can run out of space (or allocate too much and then 
	// 			that's inefficient, too)
// - linked lists
	// 	a sequence of NODES such that each node contains a reference to the next node. 
		//nodes: wrapper structures which encapsulate a value and one or more pointers (references) to other nodes. 
		//typically a LL instance only has a ref to a so-called 'handle' node (head/first node) and no direct knowledge of other nodes in the list.
	// 	- every elmt has 2 parts: one has data (info) and another to reference (next) 
	// 	- data part could be anything- string, obj, integer
	// 	- next has some memory address containing ref to next list
	// 	- when new list comes along you update reference of first one to point to memory address of second one. 
	// 	- reference part of last one always points to null or undefined, so you know it is the end. 
	// 	- head is first part of linked list.
	//	- starting from a handle and visiting nodes in sequence = 'traversing' a LL.

	// 	- good for memory allocation issues: 
	// 		to insert something new, just change next pointer of elmt to be added to head of elmt that follows it,
	// 		then change next pointer of elmt that precedes it to head of elmt to be added.
	// 		things must be done in this order or else you lose the reference to following elmt(s). 

	// 		to delete: update next address of previous thing to head of next thing 
	//	- LL can come in diff't flavors: in doubly-linked lists, each node can point both to next node and previous node. 
	//	- in other variations parent LL instance might maintain both head and tail references. 
	//	NB: in JS, an obj is maintained in memory so long as there exist references to it. Once an obj has no refs pointing to it, 
		//automatic garbage collection will eventually free that memory so the program can use it for other variables 
		//so the only real way to "delete" an obj in JS is to remove al references to it!!
//binary search tree (binary sorted tree) 
	//defn: each node N is such that the value at N is greater than every value in the left sub tree adn greater 
	//than every value in the right sub tree. 
		//all left child nodes of a node are smaller than parent node
		//all right child nodes of a node are greater than parent node. this applies down the tree. 
	// creating a BST from a list of random numbers: 
	// 	go down list and compare each number with parent node and then child node if it is greater or less than both parent or child then 
	// 	put it on the end. 
	//  for each next number compare with first parent node, then with next node and move to L or R accordingly. 

//Hash tables
	//array: each elmt associated with an index or location, so elmts of a single data type can be stored contiguously in memory 
			//we can access each elmt in a single step by indexing into the array. 
			//algorithms like binary search depend on random access (with indices eg) so this is an advantage of arrays.
		//downside: because things are fixed, we must specify an array size when we declare the array, 
		//asking OS to reserve appropriate amt of memory for array elmts. No guarantee that more memory will be available for array later if it wants to grow.

	//linked lists: can grow because their elmts are not contiguous in memory. 
		// each node contains elmts we want to store as well as pointer to subsequent elmt in list.
		// we pay the price for dynamic size in terms of random access- you have to traverse entire elmt until desired elmt is reached. 
		// in worse case, lookup is O(n) which is not great. 

	//hash tables: when speedy inertion, deletion and lookup of elmts are a priority 
		//hash table = array coupled with hash function which takes a piece of data ss input (key) and outputs an integer, 
		//commonly referred to as a hash value. 
		//hash value maps key to a partic index in the table. 
		//use hash function to determine where in the table to store a particular key, initially. 
		//later on you use hash function to determine where in table to search for the given key
			//so the hash function has to behave consistently and always spit out same value for a key. 
		//can be used to store data of all types 
			//eg table1: a hash fn to convert a string to an index based on 
			//alphabetical position of first letter. so apple will go in 0, banana in 1, cat in 2. 
			//dog would go to 3 and that's the only place it could go so when we look to see if it is contained
			//we only need to check index 3. 
			//however, if we want to place ant in the has table as well, we run into 
			//COLLISION: trying to put two elmts in same place in hash table. 
				//2 ways to resolve collision: 
				// 1) linear probing
				// 	if a key hashes to same index as prev stored key, it is assigned next slot in table (ant = index 3, since 1 2 and 0 were all in use.)
				// 		but once a collision occurs you seriously increase changes that another collision will occur, because you are using up more spaces.
				// 		this is called CLUSTERING. 
				// 		and now worst-case scenario lookup and addition times have gone to O(n). 
				// 2) separate chaining
				// 	hash table is actually an array of pointers to linked lists. 
				// 	- if collision occurs, key can be inserted in O(1) time by inserting at head of linked list for that index. 
				// 	- but worst-case lookup time is now O(n/k), where size of list is k. Could be better or just like a linked list. 
			//choose hash fn that minimizes chance of collisions occuring 
				//make use of all info provided by key to maximize # of possible hash values
					//eg make sure 'cat' and 'caterpillar' are handled diff'tly
				//uniformly distributes output across table: 
					//minimize size of linked lists if they occur 
				//map similar keys to very difft hash values, making collisions much less likely
				//use only very fast operations -- hash fn will be called frequently in lookup and insertion and deletion, so make it fast to minimize processing time. 
//Other ADT and DS to look up: 
	// Queue ADT
	// Stack ADT
	// Array DS
	// Circular Buffer DS
	// Linked List DS
	// Association List DS
	// Associative Array / Map / Dictionary ADT
	// Hash Table DS
	// Binary Search Tree DS




