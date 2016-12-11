// schema- a representation of a plan or theory in the form of an outline or model. 
	//data modeling 
		//represent real-world relationships and properties in our program in a way that makes writing w the program easy while remaining flexible 
		//for future changes and also in a fast way 

	// .schema in sqlite will show schema of tables
	// roles table- pivot table, had description of relationship between actors table and other stuff 
	// movies, like actors, don't have any foreign keys and arent directly related with any info - 
	// some tables relate info directly on the table 

	//example: a journal 
	//program to keep journal in 
	//be able to enter text for each journal entry. 
		//for each entry, properties are date, text
		// entries table: default primary key - int id (unique characteristic), date_created: date, text: text 
	//addtl features: be able to put entries in multiple journals
	//be able to tag journal entries with some kind of string and find all entries with a particular tag

	// Normalization
	// 'process of organizing columns and tables of RDB to minimize data redundancy'
	// how many comparisons does DB have to do to find all entries for a given journal?
	//foreign key: how sql handles references to primary keys in other tables 

	//lots of optimization happens in sql DBs in relation to foreign keys 
	