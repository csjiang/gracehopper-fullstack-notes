//review!
//week1 (not on checkpt)- Data structures, Selector.js, sorting, game of life  
//nodejs - a JS runtime envt - JS being able to run on a computer- pre-2009, this could only happen in a browser. - has stuff like fs, path, http, import and export. npm is a program that works w node - package mgr
	//npm init -y to create a package.json
		//name, version - facilitate publication to npm 
		//start scripts: npm build- where you put webpack -w
		//start script- node server/index.js 
	//npm i -S [packagename] -> into node_modules folder.
	//npm i -D [packagename] -> saves as a dev dependency. not needed for program itself to run. - nodemon, webpack, babel, build pack, testing, transforming, build stuff (but not stuff for executing your app.)
	//index.js - always what node defaults to if it is given a dir, both in require and in startup. (node server will run server/index.js)
	//file architecture: 
		//starting pt - should be how you start your server - should have its own responsibility like a file 
			//separate files for routes
			//possibly a separate file for express pipeline
			//only separate out app.js from other stuff if expected size facilitates it
			//models/db stuff can be in server if you think it belongs there, or it can be in its own dir
		//browser stuff should be separate 
		//server/app.js is usu a pipeline - req comes through pipeline and goes through middlewares - registered in turn by using app.use/app.get/app.[type of req]
		//use of import and export supported if transpiled through babel 
//express

	//types of post data in req.body- form-data, www-urlencoded,json, and binary (for files).
	//get reqs can't have body data- you need params or queries to convey extra info in a get req. delete reqs can have body data
//sequelize
	//postgres has no relationship to sequelize- it is a separate process. think of it as another node program (even though it is not) that is running. 
	//we install pg and pg-hstore bc sequelize doesn't include them by default- supports lots of difft dbs 
	//the ideal- don't import models anywhere. just import them all into the index.js for the db and require in the db and ask for the models by name. 
//sequelize-express

//frontend is just DOM elmts rendered by browser + JS interacting w them. we could have vanilla JS and vanilla HTML accessing DOM elmts and listening for things. Also, we could have jQuery, which facilitates that process and makes it available cross-browser. 
	// start w the index.html: put it in the main route 
	//add a public/ dir - typically where frontend stuff goes
	//add webpack config- it takes a codebase, starting at an entry file, bundle it together so require and module.exports work, and make it into a single thing called a bundle that can be used on the frontend. 
	//add "build" script to package.json: webpack -w
		//you need: npm i -D webpack babel-core babel-loader babel-preset-es2015 babel-preset-react
	//react 
		//steps for the lifecycle hook componentDidMount: 
			// 1. When the component mounts, we invoke this.props.onLoadPuppies(), which was passed as a prop from our AllPuppiesContainer to the AllPuppies component.
			// 2. Our action creator creates an action with our hard-coded puppies.
			// 3. We pass our action to the dispatch method, which sends the action to the reducer.
			// 4. The reducer executes with the action and returns the new state.
			// 5. The store alerts all connect components that the state has been updated.
			// 6. All of the connect components re-render with the new state.
	//redux
		//groups global state in one place and allows entire app to be responsive to that global state. react-redux binds the two together. 
		//The Provider component provides the redux store to all elements it contains. It does so via this.context.store—ultimately this is how all of our connect components will have access to the store.

		//flux is a pattern that we have so we can work at scale
		//thunk is a pattern so we don't have to grab dispatch into most of our components and mimic the way multiple actions might work w dispatch
		//constants is another pattern 
	//build: todolist - gifts