//#React is a JS lib for building UIs!

//history of the internet
	// way back when, the internet was a series of documents- mostly static html w/inline styling, eventually css, some images, interactivity thr linking to other pages. = 'brochureware' 
	// then: web 2.0 - the internet as a series of truly interactive applications. was mostly powered by growing speed and versatility of JS in the browser, and AJAX. apps do not refresh and facilitate tons of user events; also interact w hardware. the browser becomes a maturing app platform -> 'software'
	// cowboy coders, spaghetti code 
	// enter js framework/libraries: backbone (closest to react), angular (has own modularity/ajax/page mgmt and routing/dom manipulation solutions), ember (built for ror devs to feel comfortable on the frontend - super large and even has cli for scaffolding and its own ORM) 

//what is react? 
	//react is designed to solve the problem of dom manipulation. 
	//problems react doesn't solve: 
		//- client-server communication (AJAX);
		//- page management; 
		//- modularity (we use module.exports on both back and front end through webpack and node)
		//angular and ember are frameworks; react is a library. 
		//a framework is large and gives you tools to solve most platform problems (eg DOM manipulation, ajax, modularity, page mgmt). React is focused on one specific problem. But the distinction is pretty arbitrary. 
			//app framework: provide generic functionality and envt, establishes reusable patterns + architecture, allows focus on product-specific code, solves problems of the platform 
			//problems that persist: 
				//1) portability and reusability
					//esp when working w opinionated frameworks, and given the breakneck pace of change in the industry, code can be difficult to move and reuse 

				//2) performance and managing states
					//the DOM was never meant for this scale. therefore mutating the DOM is an expensive operation...working directly w the DOM is v expensive bc each interaction requires things like redraws, stylesheet recalculation, etc. Angular uses 'dirty-checking' - it brute-forces view updating, which caused performance issues on mobile platforms (w weaker processors)

					//STATE! - properties that can change dynamically over time, usu based on some user interactivity
						//most web frameworks up until recently have been built on the MVC pattern (model-view controller)
							//separation of three separate responsibilities: 
								//view- where templates are, what gets visualized. it would respond to user actions and do event handling. user actions broadcasted and shared w the controller.
								//controller- basis of all logic, receiving events from UI (view) and reacted in some way. reaction would determine and update the view + model
								//model- storage of data - description of data and how it is updated - kind of like a db. if the model changes, it notifies the controller and changes the view. 
							//but this set up the structure as independent elmts across pages - difficult to keep track of things when everything was stitched together: 'too many buckets for the state' 
						//the intro of shared mutable state makes the state of your app difficult to predict - sort of addressed by react, but addressed by redux (has 'one-way data-binding')
						//existing patterns of data-binding in the DOM can make reacting to a change difficult to predict 

				//3) asynchronicity 

	// - React has no data-binding: instead, data flows in one direction, being propagated and flowing downwards
	// - state produces a view
	// - minimize DOM manipulation by rendering to a virtual DOM before rendering to the real DOM (react was first to do this; now most frameworks do this) -> also enables server-side rendering and facilitates testing


	// serious sofware should be easily understood, maintained, and scalable 

//Using React (of course puppies)
	//npm i -S react react-dom 
	//webpack- reads source (from entry in webpack.config.js), bundles it into one file (and transforms it using babel (loader and query presets in module loaders in config)) and produces code (path also specified in config) to execute in browser. 
	//usu we would bring in libraries in html, but webpack will bring in the lib through commonJS so we only do <script> for built.js 

	//in index.js: (it's frontend code!)
		const React = require('react'); //you need this even if you don't require it directly bc webpack uses it to produce code 
		const ReactDOM = require('react-dom');
	//we can use jQ also- it works bc DOM is managed by React, but we prob shouldn't 
	//put components in their own files in a components folder; in each file, module exports out the constructed component. also, make sure you require in React in each component file. 
		//components that use each other should require e/o.
	//in the index.js file, import react, reactdom and components in and do ReactDOM.render() 

	//filename extensions: try to stick to .js bc require assumes .js. check the webpack config to see what filenames it looks for- it should do both. 

	//to support making AJAX requests - npm i -S axios 
		const axios = require('axios');
		//make the ajax request once the app actually enters the DOM: use a lifecycle method. 
		//define state in the constructor fn: 

		constructor() {
			super(); //always do this 
			this.state = {
				puppies: [],
			};
		}

		componentDidMount() {
			axios.get('/puppies')
				.then(res => {
					const puppies = res.data;
					this.setState({puppies: puppies}) //when setState changes, react does diffing btw DOM trees and then updates the necessary parts. But console.log("Rendering!"); console.count("Rendering") only logs 1! (renders once for each time setstate is called)
				}
		}

		//components that manage state are 'smart components'. stateless components are 'dumb components'
		//we can pass any JS val, incl fns, as props to components 
	<div onClick={function}> </div>//will call that fn when div is clicked

	//to preserve context: bind methods in constructor
	this.selectPuppy = this.selectPuppy.bind(this);

//===React Docs Notes

//hello, world in react
	ReactDOM.render(
	  <h1>Hello, world!</h1>,
	  document.getElementById('root')
	);

//jsx: 
const element = <h1>Hello, World!</h1>;
	//jsx is a syntax extension to JS. It is like a template lang w the full power of JS. 
	//jsx produces react 'elements', which are then rendered to the DOM. 
//embedding JS exprsns in JSX: 
	//use curly braces. also use parentheses to avoid automatic semicolon insertion. 
	function formatName(user) {
	  return user.firstName + ' ' + user.lastName;
	}

	const user = {
	  firstName: 'Harper',
	  lastName: 'Perez'
	};

	const element = (
	  <h1>
	    Hello, {formatName(user)}!
	  </h1>
	);

	ReactDOM.render(
	  element,
	  document.getElementById('root')
	);

//jsx is an expression too: after compilation, jsx exprsns become regular JS objs. 	
	- you can use jsx inside of if stms, for loops, assign to vars, accept as args, return from fns 
	function getGreeting(user) {
		if(user) {
			return <h1>Hello, {formatName(user)}!</h1>;
		}
		return <h1>Hello, Stranger.</h1>;
	}
//specify attributes w jsx -
	// use quotes to specify string lits as attributes. 
	const element = <div tabIndex="0"></div>;
	//use {} to embed a JS expresn in an attribute
	const element = <img src={user.avatarUrl}></img>;

//specify children w jsx: if a tag is empty, you can close it immediately w /> like xml 
	const element = <img src={user.avatarUrl} />;

//jsx tags may contain children 
	const element = (
		<div>
			<h1>Hello!</h1>
			<h2>Hi</h2>
		</div>
	);

	//nb: since JSX is closer to JS than HTML, react dom uses camelCase instead of HTML attrib names -> class => className in JSX; tabindex => tabIndex

//safe to embed user input in JSX bc it escapes any values embedded in JSX before rendering them- since everything is converted to a string before rendering, you never inject weird shit into app 
	const title = response.potentiallyMaliciousInput;
	// This is safe:
	const element = <h1>{title}</h1>;

//jsx represents objects: babel compiles jsx down to React.createElement() calls. 

	const element = (
	  <h1 className="greeting">
	    Hello, world!
	  </h1>
	);
	//is the same as 
	const element = React.createElement(
	  'h1',
	  {className: 'greeting'},
	  'Hello, world!'
	);

	//React.createElement creates obj - a description of what you want to see on the screen. React reads these objs and uses them to construct and update DOM. 

//Rendering elmts in React
	//elmts are the smallest building blocks of React apps. An elmt describes what you want to see on the screen. 
	//unlike browser DOM elmts, React elmts are plain objs and are cheap to create. React DOM updates the DOM to match react elmts 

	//in html: 
	<div id="root"></div>
	//this is a "root" DOM node bc everything in it will be managed by React DOM. 

	//apps built w just React usu have just one root DOM node. If integrating React into an existing app, you can have as many isolated root dom nodes as you like. 

	//render a react elmt into a root DOM node by passing both to ReactDOM.render():

	const element = <h1>Hello, world</h1>;
	ReactDOM.render(
		element,
		document.getElementById('root')
	);

	//Updating the rendered elmt: react elmts are immutable and you can't change its children or attribs once you have created it. 
	//Think of each react elmt as a single frame in a movie; it represents the UI at a certain point in time. 

	//to update the UI (for now), create a new elmt and pass it to ReactDOM.render():

	function tick() {
		const element = (
			<div>
				<h1>Hello, world!</h1>
				<h2>It is {new Date().toLocaleTimeString()}.</h2>
			</div>
		);
		ReactDOM.render(
			element,
			document.getElementById('root')
		);
	}

	setInterval(tick, 1000);
	//this calls ReactDOM.render() every second from a setInterval() callback. 
	//in practice, however, most React apps only call ReactDOM() once bc code is encapsulated into stateful components. 

	//ReactDOM compares the elmt and its children to the previous one and only applies the necessary DOM updates. 

	//Think about how the UI should look at any given moment, rather than about how to change it over time.

//Functional and class components

	//1) to define a component, write a JS fn: 
		function welcome(props) {
			return <h1>Hello, {props.name}</h1>;
		}
	//a valid React component accepts a single 'props' object arg w data and returns a React elmt. Components are functional bc they are JS fns. 

	//2) alternatively, use an ES6 class to define a component: 
		class Welcome extends React.Component {
			render() {
				return <h1>Hello, {this.props.name}</h1>;
			}
		}
	//react treats 1) and 2) as the same. Classes have some addtl features.

	//React elmts can represent DOM tags:
		const element = <div />;
	//and also user-defined components!
		const element = <Welcome name="Christine" />;

	//when react sees an elmt representing a user-defined cmponent, it passes JSX attribs to this component as a single obj, which is the props obj. 

	//example- to render "Hello, Christine" on the page: 
		function Welcome(props) {
			return <h1>Hello, {props.name}</h1>;
		} 
		const element = <Welcome name="Christine" />;
		ReactDOM.render(
			element,
			document.getElementById('root')
		);

	//when we execute this,
		//1) we call ReactDOM.render w the element <Welcome name="Christine" />
		//2) React calls the "welcome" component w {name: "Christine"} as props
		//3) our Welcome component returns <h1>Hello, Christine</h2> elmt as the result 
		//4) React DOM efficiently updates DOM to match this new elmt 

	//nb: Always start component names w a capital letter!!!
	//nb2: Components have to be in scope to be rendered

	//Composing components: components can refer to other components in their output
		//so we can use the same component abstraction for any level of detail- eg button, form, dialog, screen 

		//ex: an App component that renders Welcome many times: 
		function Welcome(props) {
			return <h1>Hello, {props.name}</h1>;
		}

		function App() {
			return (
				<div>
					<Welcome name="Christine" />
					<Welcome name="Other Christine" />
					<Welcome name="Coffee" />
				</div>
			);
		}

		ReactDOM.render(
			<App />,
			document.getElementById('root')
		);

		//Typically new React apps have a single App component at the very top. If integrating React into an existing app, maybe try componentizing a small part like Button and gradually move up the view hierarchy. 

		//Components have to return a single root elmt! That's why a <div> is added to contain all the <Welcome /> elmts.

	//Extracting components: you can split components up into smaller ones. Modularity is great. 

		//eg component to split up: 
		function Comment(props) {
		  return (
		    <div className="Comment">
		      <div className="UserInfo">
		        <img className="Avatar"
		          src={props.author.avatarUrl}
		          alt={props.author.name}
		        />
		        <div className="UserInfo-name">
		          {props.author.name}
		        </div>
		      </div>
		      <div className="Comment-text">
		        {props.text}
		      </div>
		      <div className="Comment-date">
		        {formatDate(props.date)}
		      </div>
		    </div>
		  );
		}

		//extracting Avatar: 
		function Avatar(props) {
			return (
				<img className="Avatar"
				src={props.user.avatarUrl}
				alt={props.user.name}
				/>
			);
		}
		//since the avatar doesn't need to know it is being rendered inside a Comment, we name its author prop the more generic term 'user':

		//it is better to name props from the component's own POV rather than the context it's being used in.

		//extracting UserInfo: 
		function UserInfo(props) {
			return (
				<div className="UserInfo">
					<Avatar user={props.user} />
					<div className="UserInfo-name">
						{props.user.name}
					</div>
				</div>
			);
		}

		//simplifying Comment: 
		function Comment(props) {
		  return (
		    <div className="Comment">
		      <UserInfo user={props.author} />
		      <div className="Comment-text">
		        {props.text}
		      </div>
		      <div className="Comment-date">
		        {formatDate(props.date)}
		      </div>
		    </div>
		  );
		}

		//extracting components can be annoying but for larger apps it pays off to have a palette of reusable components. 
		//rule-of-thumb: if a part of the UI is used several times (Button, Panel, Avatar) or is complex enough on its own (App, FeedStory, Comment), it should be a reusable component. 

	//props are read-only: components should NEVER modify their own props. All React components must act like pure functions wrt their props. 
		//to allow for dynamic app UIs w/o violating this rule, React uses state.

//State and Lifecycle

	//to encapsulate the ticking clock:

		function Clock(props) {
			return (
				<div>
					<h1>Hello, world!</h1>
					<h2>It is {props.date.toLocaleTimeString()}.</h2>
				</div>
			);
		}

		function tick() {
			ReactDOM.render(
				<Clock date={new Date()} />,
				document.getElementById('root')
			);
		}

		setInterval(tick, 1000);

		//the above does not incorporate the setting up of a timer + updating the UI dynamically as part of the Clock itself. To do this, we need to add "state" to the Clock elmt. 

	//State is like props but it is private and fully controlled by the component. 
	
	//local state is a feature available only to classes, and it is one of the addtl features available to components defined as classes!

	//Converting a fxnal component to a class: 

		// 1) Create an ES6 class w the same name that extends React.Component
		// 2) Add a single empty method to it called render()
		// 3) Move the body of the fn into the render() method
		// 4) Replace props w this.props in the render body
		// 5) Delete the remaining empty fn declaration

	//example: Defining Clock as a class allows us to use features such as local state and lifecycle hooks
		class Clock extends React.Component {
			render() {
				return (
					<div>
						<h1>Hello, world!</h1>
						<h2>It is {props.date.toLocaleTimeString()}.</h2>
					</div>
				);
			}
		}

	//move date from props to state in 3 steps: 
		// 1) replace this.props.state with this.state.date in the render() method: 
			class Clock extends React.Component {
				render() {
					return (
						<div>
							<h1>Hello, world!</h1>
							<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
						</div>
					);
				}
			}
		// 2) Add a class constructor assigning the initial this.state 
			class Clock extends React.Component {
				constructor(props) {
					super(props); //class components should always call the base constructor w props. 
					this.state = {date: new Date()};
				}

				render() {
					return (
						<div>
							<h1>Hello, world!</h1>
							<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
						</div>
					);
				}
			}
		// 3) Remove the date prop from the <Clock /> elmt in ReactDOM.render(): 
			ReactDOM.render(
			  <Clock />,
			  document.getElementById('root')
			);

		//Result: 
			class Clock extends React.Component {
			  constructor(props) {
			    super(props);
			    this.state = {date: new Date()};
			  }

			  render() {
			    return (
			      <div>
			        <h1>Hello, world!</h1>
			        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
			      </div>
			    );
			  }
			}

			ReactDOM.render(
			  <Clock />,
			  document.getElementById('root')
			);

	//Adding lifecycle methods to a class: 
		//in apps w many components, we should free up rsrcs taken by components when they are destroyed. 

			//Set up a timer whenever the clock is rendered to the DOM for the FIRST TIME: this is called "mounting" in React.
			//Also, clear that timer whenever the DOM produced by the Clock is removed: this is called "unmounting."

			//declare special methods, called 'lifecycle hooks,' on component class to run some code when a component mounts and unmounts: 
				class Clock extends React.Component {
				  constructor(props) {
				    super(props);
				    this.state = {date: new Date()};
				  }

				  componentDidMount() { //runs after the component output has been rendered to the DOM. 
				  	this.timerID = setInterval( 
				  	//timerID can be saved onto this. this.props is set up by React and this.state has a special meaning. But for any other fields you can add them to the class manually if you need to store sth not used for the visual output. (If you don't use sth in render(), it shouldn't be in the state.)
				  		() => this.tick(),
				  		1000
				  	);
				  }

				  componentWillUnmount() {
				  	clearInterval(this.timerID);
				  }

				  //implement the tick() method that runs every second. It uses this.setState() to schedule updates to the component local state.
				  tick() {
				  	this.setState({ //Clock schedules a UI update, React knows the state has changed and calls render() again to know what should be on the screen. 
				  		date: new Date()
				  	});
				  }

				  render() {
				    return (
				      <div>
				        <h1>Hello, world!</h1>
				        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
				      </div>
				    );
				  }
				}

				ReactDOM.render(
				  <Clock />,
				  document.getElementById('root')
				);

		//Using State correctly
			// 1) Do not modify state directly: the only place you can assign this.state is in the constructor. 
				//wrong: 
				this.state.comment = 'Hello';
				//right: 
				this.setState({comment: 'Hello'});
			//2) state updates may be async
				//React may batch multiple setState() calls into a single update for performance. Since this.props and this.state may be updated async, do not rely on their values for calculating the next state. 
					// Wrong
					this.setState({
					  counter: this.state.counter + this.props.increment,
					});

					//instead, use a second form of setState() that accepts a fn rather than an obj. That fn will receive the previous state as the first arg, and the props aat the time the update is applied as the second arg: 

					// Correct
						this.setState((prevState, props) => ({ //you can use arrow or reg fns here
						  counter: prevState.counter + props.increment
						}));
			// 3) State updates are merged: React merges the obj you provide to setState into the current state when you call it. Merging is shallow. You can update independent variables in your state independently w separate setState calls: 
			  constructor(props) {
			    super(props);
			    this.state = {
			      posts: [],
			      comments: []
			    };
			  }

		    componentDidMount() {
			    fetchPosts().then(response => {
			      this.setState({
			        posts: response.posts
			      });
			    });

			    fetchComments().then(response => {
			      this.setState({
			        comments: response.comments
			      });
			    });
			  }

			  //updating setState comments will replace the comments but not the posts. 

		//Neither parent nor child components can know if a certain component is stateful or stateless, and shouldn't care whether it is defined as a class or fn. That is why state is local or encapsulated -- it is inaccessible to any component other than the one that owns and sets it. 
		//If you want, you can pass a component's state down as props to its child components: 

		<FormattedDate date={this.state.date} />
		function FormattedDate(props) {
		  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
		} //but the child won't know if the date in the props is from its parent's state, or just manually inputted. 

			//this is 'top-down' or 'unidirectional' data flow: any state is always owned by some specific component, and any data or UI derived from that state can only affect comps that are below in the tree. 

			//you can use stateless components inside stateful ones and vice versa

//Conditional rendering
	//use JS operators like if or the conditional operator to create elmts representing the current state and let React update the UI to match them: 
	//example: display difft component based on login status 
		function UserGreeting(props) {
		  return <h1>Welcome back!</h1>;
		}

		function GuestGreeting(props) {
		  return <h1>Please sign up.</h1>;
		}

		function Greeting(props) {
		  const isLoggedIn = props.isLoggedIn;
		  if (isLoggedIn) {
		    return <UserGreeting />;
		  }
		  return <GuestGreeting />;
		}

		ReactDOM.render(
		  // Try changing to isLoggedIn={true}:
		  <Greeting isLoggedIn={false} />,
		  document.getElementById('root')
		);

	//elmt variables: you can use vars to store elmts 
		function LoginButton(props) {
		  return (
		    <button onClick={props.onClick}>
		      Login
		    </button>
		  );
		}

		function LogoutButton(props) {
		  return (
		    <button onClick={props.onClick}>
		      Logout
		    </button>
		  );
		}

		//the below stateful component renders the correct button depending on its current state.

		class LoginControl extends React.Component {
		  constructor(props) {
		    super(props);
		    this.handleLoginClick = this.handleLoginClick.bind(this);
		    this.handleLogoutClick = this.handleLogoutClick.bind(this);
		    this.state = {isLoggedIn: false};
		  }

		  handleLoginClick() {
		    this.setState({isLoggedIn: true});
		  }

		  handleLogoutClick() {
		    this.setState({isLoggedIn: false});
		  }

		  render() {
		    const isLoggedIn = this.state.isLoggedIn;

		    let button = null;
		    if (isLoggedIn) {
		      button = <LogoutButton onClick={this.handleLogoutClick} />;
		    } else {
		      button = <LoginButton onClick={this.handleLoginClick} />;
		    }

		    return (
		      <div>
		        <Greeting isLoggedIn={isLoggedIn} />
		        {button}
		      </div>
		    );
		  }
		}

		ReactDOM.render(
		  <LoginControl />,
		  document.getElementById('root')
		);

		//A) inline if - a shorter syntax to conditionally render a component. 
		//you can embed JSX exprns in {}: 

		function Mailbox(props) {
		  const unreadMessages = props.unreadMessages;
		  return (
		    <div>
		      <h1>Hello!</h1>
		      {unreadMessages.length > 0 &&
		        <h2>
		          You have {unreadMessages.length} unread messages.
		        </h2>
		      }
		    </div>
		  );
		}

		const messages = ['React', 'Re: React', 'Re:Re: React'];
		ReactDOM.render(
		  <Mailbox unreadMessages={messages} />,
		  document.getElementById('root')
		);

		//B) alternatively, use the ternary operator: 
		render() {
		  const isLoggedIn = this.state.isLoggedIn;
		  return (
		    <div>
		      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
		    </div>
		  );
		}

	//to hide a component even though it was rendered by another component: return null instead of its render output. 
	function WarningBanner(props) {
	  if (!props.warn) {
	    return null;
	  }
	/*...*/}

//Lists and Keys in React

	//rendering multiple components: 
		const numbers = [1, 2, 3, 4, 5];
		const listItems = numbers.map((number) => 
			<li>{number}</li> //use {} to include in JSX
		);

		ReactDOM.render(
			<ul>{listItems}</ul>,
			document.getElementById('root')
		);

	//usu, lists are rendered inside a component. 

	function NumberList(props) {
	  const numbers = props.numbers;
	  const listItems = numbers.map((number) =>
	  	//a key is a special string attribute you need to include when creating lists of elmts. 
	    <li key={number.toString()}>{number}</li>
	  );
	  return (
	    <ul>{listItems}</ul>
	  );
	}

	const numbers = [1, 2, 3, 4, 5];
	ReactDOM.render(
	  <NumberList numbers={numbers} />,
	  document.getElementById('root')
	);

	//Keys 
		//allow React to identify which items have changed/been added or removed. This helps when React does diffing among children- inserting in the front of an array would be expensive if we didn't have this. Keys need to be given to elmts inside array to give elmts a stable identity. 
		//pick keys that uniquely identify a list item among its siblings, eg. an id from data. Use key={index} as a last resort 
			const todoItems = todos.map((todo) =>
			  <li key={todo.id}> 
			    {todo.text}
			  </li>
			);

	//Extracting components w keys 
		//keys only make sense in the context of the surrounding array, so when extracting components that have keys, keep the key on the items where the array was instantiated. 

		function ListItem(props) {
		  // Correct! There is no need to specify the key here:
		  return <li>{props.value}</li>;
		}

		function NumberList(props) {
		  const numbers = props.numbers;
		  const listItems = numbers.map((number) =>
		    // Correct! Key should be specified inside the array.
		    <ListItem key={number.toString()}
		              value={number} />
		  );
		  return (
		    <ul>
		      {listItems}
		    </ul>
		  );
		}

		const numbers = [1, 2, 3, 4, 5];
		ReactDOM.render(
		  <NumberList numbers={numbers} />,
		  document.getElementById('root')
		);

		//rule of thumb: elmts inside a map() call need keys!

		//keys must be unique among siblings, but you can have keys that are not unique globally. 
		function Blog(props) {
		  const sidebar = (
		    <ul>
		      {props.posts.map((post) =>
		        <li key={post.id}>
		          {post.title}
		        </li>
		      )}
		    </ul>
		  );
		  const content = props.posts.map((post) =>
		    <div key={post.id}>
		      <h3>{post.title}</h3>
		      <p>{post.content}</p>
		    </div>
		  );
		  return (
		    <div>
		      {sidebar} 
		      <hr />
		      {content}
		    </div>
		  );
		}

		const posts = [
		  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
		  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
		];
		ReactDOM.render(
		  <Blog posts={posts} />,
		  document.getElementById('root')
		);

	//keys serve as a hint for React, but don't get passed to components. store the value in another prop w a difft name if you need it- components can't read props.key. Keys should be stable, predictable, and unique. Don't use Math.random() 

	//inline list creation by embedding map() in JSX, but make sure to keep code readable.  
	function NumberList(props) {
		const numbers = props.numbers;
		return (
			<ul>
				{numbers.map((number) => 
					<ListItem key={number.toString()}
					value ={number} />
				)}
			</ul>
		);
	}

//Lifting State Up

	//When components need to reflect the same changing data, lift the shared state up to their closest common ancestor: 


//Thinking in React
	//1) Mock the UI 

	//2) break the UI into a component hierarchy: draw boxes around every component and subcomponent in mock and give them all names. Each component should ideally do ONE thing (the single responsibility principle). 

	//3) build a static version in react : don't use state at all (state is reserved for interactivity only) - build top-down for simpler examples. for larger projects, do bottom-up and write tests as you build. 
		//by the end of this step, you have a lib of reusable components. each component only has a render() method since it's a static version of the app. component at top of hierarchy takes data model as a prop. 

	//4) identify minimal but complete representation of UI state - keep it DRY 
		//for each piece of data - to decide if it goes in state: 
			//if it is passed in from a parent via props/remains unchanged over time/can be computed based on other state or props in component, it should not be state 

	//5) identify where the state should live: based on one-way flow!!!
		//for each piece of state in app, 
			//identify every component that renders sth based on that state
			//find a common owner component 
			//either common owner or another component higher up in hierarchy should own that state.
			//if you can't find a component that should hold it in a way that makes sense, create another component to hold the state and add it in hierarchy somewhere above the common ancestor component. add the this.state = {} instance property to the constructor of that component 

	//6) add inverse data flow: allow elmts deep in the hierarchy to update the state. 

//===WORKSHOP NOTES

//webpack is a module builder! great 

	//module declarations 
	const React = require('react');

	class Main extends React.Component {
	  /** Hello world! **/
	}
	module.exports = Main;

	// use `import...from` instead of `require`
	import React from 'react';

	// say `export` or `export default` instead of `module.exports`
	export default class Main extends React.Component {
	  /** Hello world! **/
	}

	// use {} to extract the value, and separate any values with commas
	import React, {Component} from 'react';

	// now we can just say Component
	export default class Main extends Component {
	  /** Hello world! **/
	}

	/** ourExports.js */

	// we export foo and bar
	export const foo = 1;
	export const bar = 'hello world';

	// we export default baz
	const baz = () => console.log('goodbye world!');
	export default baz;
	/** ourImports.js */

	// we can import baz by default without using curly braces
	import baz, { foo, bar } from './ourExports.js';
	// foo and bar, however, need to be within curly braces

//create a div w id that you load stuff into : 
	<div id="app"></div>

//and load script tag w path to bundle.js : include below body tag or use defer attrib to make sure it loads after DOM 
	<script src="/bundle.js" defer></script>

// create and export component: 
	import React from 'react';

	export default class Main extends React.Component {
		render () {
			return (
				<div id="main" className="container-fluid">
				<h1>Hello world!</h1>
				</div>			
			);
		}
	}

//add state w default values like empty arrays and shit to guard against typeerrors!!!!! 
	constructor (props) {
	  super(props);
	  this.state = { kittens: [] } // no kittens yet
	}

	render () {
	  return (
	    <div>
	      { kittens.map(kitten => <div>{kitten.name}</div>) }
	    </div>
	  );
	}
	//we can use map without causing typeerror bc kittens is []. we couldn't do this if kittens was null
	//initialize state at least one level deep: TOM'S FIRST LAW: STATE MUST ALWAYS BE INITIALIZED WITH THE APPROPRIATE DATA TYPE


//the fruits of our labor: 
	render () {
    
    const someShit = this.state.fakeAlbums.map(function (album) {
      const arrayOfSongs = album.songs.map(function(song) {
          return <li key={song.id}>{song.name}</li>;
        });

      return <div key={album.id}>
              <img src={album.imageUrl}/>
              <ul>{arrayOfSongs}</ul>
              <h2>{album.name}</h2>
             </div>
    });

		return (
			<div id="main" className="container-fluid">
        <Sidebar />
        <div className="col-xs-10">
          {someShit}
        </div>
        <Footer />
			</div>
		);
	}

//destructuring: instead of this.props.album: 
render () {
  const { album, handleClick } = this.props;
  return (
    /* ...JSX... */
  );
}

//handleclick given to album component wants to receive an album directly- in this case, it is the album selected. there is no way to pass in the correct album (thr album map context) without passing in an anon fn. If we only passed in props.handleClick, we would have only a click event, without the album info on it. the fn wants to receive an album directly...
//were we to provide an arg to the onclick fn, that would be the event w al sorts of info (where clicked, when clicked etc) 
//w/o wrapping in an anon fn, the return value for onclick would be the return val of props.handleclick(album) invoked immediately. 
//onClick handler needs to be passed an anon fn bc or else it will be invoked immediately 
//synthetic event stuff? call prevent default manually


// multiline parteherneotasn! 
//

this.state = {
  albums: [],
};

//this2.props - webpack transpiles it and assigns this stuff. a crappy thing about the react ecosystem. 
//doens't change the reason it's breaking? 
//CHEcK THE NAMES!!! CHEcK THE NAMES 
//console log the props and see what the keys are!!!! 


//serving up the right song: 
// pass in url
//import : ES6. The only ES6 feature not supported by node in the browser! 

//React- unidirectional data flow- one thing maintains state and passes it down to its children! 

//export- name exports, or export a default one 
//export default Main; --> allows you to import as any name from './Main'
//react's default export is the entire library but it also exports named parts- such as: 
//import React, {Component} from 'react';
//allows you to do const Main = class extends Component {}, not React.Component
//named divs such as 'footer' are just semantic; they don't actually do anything special 

//react quirks: camelcase for attribs in HTML, react render must return one <div>

//must call super() before being able to work with this.state- must initialize whatever properties we expect to be on the object, inherited from the parent class. 


//necessary to stop song playing if you rerender and start playing a new one?

//this.props - like the args to your component's render fn 
//keep things from getting too hairy: create a method called renderAlbums and put the array mapping to HTML in there, instead of in the render fn inline. 


//this + context - if you use 'this' in the body of a method, you need to invoke it with a dot operator. if you don't call it as a method (eg if you save it into a variable and invoke it independently), you end up losing the context 
//as much as possible, use arguments rather than context

//http reqs: ajax, fetch, superagent etc. but ajax at its core is all doing the same thing- making a request and doing something with the response. 

import axios, {get} from axios; 
//when should we make the ajax request to get albums? - when the main elmt comes on the screen. (don't do it when render gets called, since that happens every time state is set. Therefore, put a componentDidMount hook on the Album component.)

//componentDidMount lifecycle hook- when you need to rerender stuff. ComponentWillMount is not really useful 

//w/ axios, you don't get the response of the data resolved- you get an obj w lots of metadata on the response itself, incl headers and the status code. therefore we have to parse it out to json.

//also we can do 

axios.get('/api/albums')
	.then(r => r.data) //yay implicit returns!
	.then(function(albums) { //we need an arrow fn here or else context will change- before this, devs would need to set self equal to this and do self.setState. 
		this.setState({albums});
	})
	.catch(error);
//arrow fns - don't define instance methods with them, as it breaks the context
//not using an arrow fn- a signal that a fn cares about its new context.

//treeshaking- webpack does this- if it is not imported, don't include it 

//whatever is used in onClick is evaluated 
onClick={add.bind(null, 2, 2)} //copies the add fn into another fn where the first two args, whenever it is invoked, are 2 and 2. but that is messy. so we can use an anon fn 

//the context of any map fn is the full array itself- so use an arrow fn to inherit the correct context. 

//always listen for errors, or else you end up with SILENT BUGS- the deadliest kind!

//include everything on an obj as part of the props: 
//adds one prop per key on state of obj and make balue equal to what is on state obj
	<Album return {...this.state} /> //check 