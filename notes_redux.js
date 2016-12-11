// Redux

//====== Docs notes (cf. mobx)
	//motivation
		// JS SPAs - more need to manage state (server responses, cachd data, locally created data not yet persisted to server, UI state (active route, selected tab, whether to show spinner or not, pagination control display, etc)) - plus need to handle optimistic updates, server-side rendering, fetching data before transitioning routes, etc. 

		// hard to do mutation and async at the same time- React manages this in view layer by removing asynchrony and direct DOM manipulation, but we still can't manage state of data.

		// Redux makes state mutations predictable by imposing restrictions on how and when updates can happen. 

	//three principles
		// - the state of the whole app is stored in an obj tree within a single store. 





//====== Lecture notes
	// state- info or values that an app contains at a single moment - dynamic and changes over time.

// eg game of pong- 
	// 	state includes
	// 		- score
	// 		- y-values of paddles
	// 		- vector that ball is following
	// 		- position of the ball itself
	// 		- showing a game or not (menu view vs game view)
	// 	not in state- stays constant.
	// 		- menu bar (most likely) 
	// 		- game board dimensions and constraints

// turt mcsquirt- 
	//  state- location of turt, maze itself and cells inside. 
	//  not state- position of the alfalfa, design of the board, turt's display, dimensions of the board

// youtube- 
	// state- size of the viewer, volume, whether video is playing, user logged in, duration played in video, how much viewer has watched, views, title, upvotes/downvotes (all info is part of some sort of templating that is processed either on frontend or backend)
	// not state - info of video, possibly (either/or), layout of the site, buttons that show actions, 

// gmail - 
	// state- number of emails unread, emails in inbox, number of people on buddy list + online (contacts could be state or not), user who is logged in 
	// not state- nav bar (logo, etc is either/or) 

// - anyth dynamic about the template that is used could be part of state.
// juke 
	// state- anyth retrieved from server using axios that is persisted in db
	// not state- functions like toggleOne - doesn't change, though the params it receives may. 
// building dumb components- impt to build stuff from purely arguments (props). 
// "presentational" component- implies that logic tied to that component is minimal - usu just event listeners, etc. 

// GLOBAL VS LOCAL STATE - in react
// some dynamic info generated + used by only a component; other info might be needed by app as a whole.
	// - eg game <Countdown /> - remaining time may be local state. but when time hits 0 locally it sets a global state gameOver: true. 
	// - eg2 <input /> - onChange- set to local state to hold and display val. onSubmit- send value to global state for processing. 
//redux solves for us the problem of global state - but we still have to decide what should be global vs local state. 

//how to affect state in a web app: 
	// - eg gmail- change amt + which msgs in inbox by sorting stuff, or deleting stuff, or getting a new email (interval is checking in background to update state w new msgs) 
	// - eg2 pong - location of paddle can be affected by key input of user (up/down). other things affected by game loops - logic running to know where stuff should be in the game display. this game logic is frontend if someone is playing on the same computer - it depends on whether it is networked. are game movements etc sent back to server?
// finite possible actions 

//REDUX: 
	// - a small tool for containing, accessing and affecting a set of info- often called 'state'
	// - an effective player in architecture of an app using react
	// - a gateway drug to functional programming 
	
	// - NOT: a react-specific tool (can be used w other frameworks or on its own or on backend), react-redux (an extra abstraction to join the two libs), very valuable in a small-scale app (like Juke), or the only game in town 

	//THE STORE - (what we refer to w 'redux', usu)
		// - the single source of truth, singular holder of info. everyth in global state of app belongs here 
		// - can receive dispatched, typed signals (axns) meant to affect state
		// -  provides an interface to access state, as well as to listen for state changes

		//THE REDUCER
			// - component of the store that decides, based on the signal (axn) received, what the new state should be 
			// - creates new states per axn, rather than modifying prev states.
			// - can be replaced and/or chunked (explored later)

		//cf. Array.prototype.reduce - a non-prototypical implementation
			function reduce(array, callback) {
				return reducedValue;
			}
			function callback(memo /*init or prev value*/, nextValue) {
				return memo; //how to combine initial and next val
			}

			[1, 2, 3].reduce((memo, next) => {
				return memo + next;
			});

		//REDUX reducer: 
		//goes through actions, w init state as the initial value, and produces new states as it goes through 
			let actions = [incrementCounter, updateUserName] 
			actions.reduce((state, action) => {
				return resultOfUpdatingOldStateWithAction
			}, oldState);

		//eg switch stm (how reducer is written): 
			const getCohort = function(name) {

				switch(name) {

					case 'Anna': 
						return '1610GH';

					case 'Tessa':
						return '1607GH';

					case 'Ali':
						return '1607FS';

					default: 
						return 'No cohort!';

				} //'fallthrough'/'break' necessary if you don't have returns, eg if you have an assignment statement as the thing for each case, in which case switch might check further cases. 
			}

//REDUX
//eg a gift-giving organizer app: 
	//in react/index.js 
	import React from 'react';
	import {render} from 'react-dom';
	import {Router, Route, hashHistory} from 'react-router';

	const sendActionToRedux = function() {
		store.dispatch({
			type: 'INCREMENT'
		});
	}

	render(
		<h1 onClick={sendActionToRedux}>OMGifts!</h1>,
		document.getElementById('app')
	);

	//2 important methods on store: 
	//dispatch (send actions into the store for the reducer to receive)
	//getState() (returns the state object) 
	
	import store from './store';

	store.dispatch({
		type: 'SET_BUDGET',
		newBudget: 500//the non-type info is called the payload
	});

	store.getState(); // Object{ budget: 500 }


	//in store/index.js
		//npm i redux

		import { createStore, applyMiddleware } from 'redux';
		import reducer from './reducer';
		import createLogger from 'redux-logger';

		export default createStore(() => {
			reducer,
			applyMiddleware(createLogger({collapsed: true})) //we get console.groups of the prev state, axn that came in, and next state.

		}); //gets invoked w at least 1 value, a fn- the reducer fn. Takes in our state rn, and the action received by redux, and calculates next state. keep this in another file, reducer.js


		const devTools = () => { //cf redux devtools chrome extension- hooks into store and tracks actions sent to it 

		}

	//in store/reducer.js: 
		const initialState = {
			budget: 0,
			counter: 0
		};

		export default function (state, action) {

			let newState;
			//typically written w a big switch statement.
			switch (action.type) {

				case 'SET_BUDGET':
					newState = Object.assign({}, state);
					newState.budget = action.newBudget; //axn is an obj w at least a type describing kind of action, and, depending on the type, add'l info that is needed.
					break;

				case 'INCREMENT':
					newState = Object.assign({}, state);
					newState.counter = newState.counter + 1;
					break;

				default: //return the prev state
					return state;
			}
			return newState;
		}

//NEW STATE 
	//it is imperative that the reducer produces + returns a NEW state rather than mutating the prev state. 
		// - impt to avoid side effects + info out of sync. 
		// - also important for maintaining history and time-traveling - if your entire component tree is based on the state that redux gives you, you can travel back through history 
	// - think of each state as like a git commit- you can revert.

	// - operations that will mutate the state:
			// - adding/removing/modifying any obj properties
			// - Array.prototype.push/shift/unshift/pop/reverse/splice 
			// - Object.assign (if used improperly)

//STAYING IMMUTABLE
	Object.assign({}, previousState, newProperties)
		// 	- an es6 feature that merges objs in order
		// 	- start w an empty obj literal, which will receive prevState props first, then newProperties in turn, overwriting properties as it goes

	listOfItems.concat([newItem])
		// - also, listOfItems.slice(0).push(newItem);
		// 	- an immutable alternative to .push, returning new array

	[...listOfItems, newItem]
		// 	- es6 feature called 'spread', spreads elmts of an array into another array. (Joe hates this because people apparently abuse this) 
		// 	- often used for argument lists as well (replaces use case of Function.prototype.apply)
		// 	- essentially equal to .concat 
		// - inverse is rest operator, which receives args and puts them into an array

	//other ancillary features of redux:
		// combineReducers
			//combine many reducers into a composite reducer, based on responsibility 
			//useful for categorizing per property or grouping on your state 
		// middleware 
			// helper fns to put in front of reducer- processes signals and can log or prevent stuff from hitting reducer based on the action received
			// components that act as a channel btw your dispatch and your reducer
			// useful for logging and async operations
			// most of the redux 3rd-party ecosystem is based on these 

//FUNCTIONAL PURITY
	//more formally called 'referential transparency'
	//makes testing much easier 

	//the same fn called with same args will always produce the same output
		//eg:  
		(x, y) => x + y;

		//NOT : 
		(x, y) => x + y + Math.random(); //or can change based on timing, etc. - less predictable.

	//no side-effects
		//eg:
		(x, y) => x + y;
		//NOT: 
		(x, y) => { z = y; return x + y } //or eg console.log

	//applied to comps in react: 
		//dumb components should be pure. supplied with the same props, should always render the same visualization.

		//common impurities in reducers
			// - AJAX calls or socket messages
				// 	- considered side effects
				// 	- these belong in action creators, so ajax reqs should happen before actions are dispatched.

			// - any randomization
				// 	- eg randomize the value that will be sent in the action

			// - usage of dynamic closure info
				// 	- belong in action creators. 
				// eg using a closure variable defined outside the reducer. 

		//anytime there is a computation in a reducer that is done on anything that is not the state or action objects themselves, it is impure!!!  

//REACT AND REDUX
	// - react does not try to solve the problem of app state/architecture
		//currently, we have AppContainer trying to be the puppeteer managing the state and props passed to all lower comps 
	// - redux is a good fit for a component-system based on unidirectional data flow ( state at the top, passed down as a prop) 
	// - components trigger signals (actions) to redux store, new state is produced, smart components listen and setState. 

//ACTION TYPES AND CREATORS
	//in react/containers/AppContainer.js
	import React, {Component} from 'react';
	import Budget from '../components/Budget';

	export default class extends Component {

		constructor() {
			super();
			this.state= store.getState();
			this.increaseBudgetBy100 = this.increaseBudgetBy100.bind(this);
		}

		componentDidMount() {
			this.unsubscribe = store.subscribe(() => { //get the unsubscription fn by calling it to store.subscribe()
				this.setState(store.getState()); //sets the app container's state to the store's state
			})

		}

		increaseBudgetBy100() {
			const newBudget = this.state.budget + 100;
			// this.setState({budget: newBudget}) : this is what we're used to doing- setting global state of component. but this doesn't account for the redux store, which means this state change isnt' getting percolated to other parts of our app. 
			store.dispatch({
				type: 'SET_BUDGET',
				newBudget: newBudget
			});
		}

		componentWillUnmount() {
			this.unsubscribe(); //unsubscribe when the component is unmounted
		}

		render() {
			return (
				<div>
					<Budget value={this.state.budget} />
					<button onClick={this.increaseBudgetBy100}>Increase</button>
				</div>
			);
		}
	}

	//in react/components/Budget.js
	//this is a pure functional component 
	import React from 'react'; 

	export default function (props) {
		return <h1>{props.budget}</h1>; //as long as you are rendering out one elmt, it doesn't need to be wrapped in a div. 
	}

//Connecting smart comps to the redux store
	//subscribe- works like an event emitter
		store.subscribe(() => this.setState(store.getState()));
			// - componentDidMount - this is the best place to listen for it bc you know comp has been rerendered on pg
			// - when redux produces a new state, registered listeners will be invoked
			// - returns an unsubscribe fn : important! if you don't unsubscribe you get memory leaks

	unsubscribe //returned from subscribe
		// - necessary for preventing memory leaks and errors 
			//memory leaks: - redux will be building a huge array of fns to call over the course of the runtime and that will exceed the capacity of your browser/node process. so you need to tell it when to stop listening
			//error: if you unmount a component but redux is still listening for it, it will cause an error bc the comp is no longer there.
		// - componentWillUnmount - call unsubscribe here. you can set it to the return value of store.subscribe when the component is mounted. 
		// - if we initiated unsubscribe earlier as a let variable and just set it instead of attachign it to the instance, we would run into problems if the container was being used more than once- unsubscribe might get overwritten by subsequent subscription calls. 

//ACTION CREATORS 
	//thus far we've been dispatching signals directly to the store- but with this, each independent dispatcher will have to remember the string for action type and the action payload. 
		//to get around this- have action creators. an action creator is a fn that receives sth and returns an action object.

	//in /store/actions/budget_actions.js

	export const setBudget = (newBudget) => {
		return {
			type: 'SET_BUDGET',
			newBudget: newBudget
		}
	}

	//in the container: 
	import { setBudget } from '../store/actions/budget_actions'

	increaseBudgetBy100() {
		const newBudget = this.state.budget + 100;
		store.dispatch(setBudget(newBudget));
		}

//CONSTANTS- a dictionary for all the action types.
	//constants.js
	export const SET_BUDGET = 'SET_BUDGET'; 
	export const INCREMENT = 'INCREMENT';

	//so, in the action creator, we 
	import {SET_BUDGET} from './constants';

	export const setBudget = (newBudget) => {
		return {
			type: SET_BUDGET,
			newBudget: newBudget
		}
	}

	//in container: 
	import {SET_BUDGET, INCREMENT} from './actions/constants';

	const getCohort = function(name) {

		switch(name) {

			case SET_BUDGET: 
				return '1610GH';

			case INCREMENT:
				return '1607GH';

			default: 
				return 'No cohort!';
		} 
	}

	// having a constants file - editor will autocomplete variables, but it won't autocomplete strings! so you could make typos if you just used strings over and over again.

//REDUX takeaways

	// reducer updates state contains state defines UI triggers actions sent to reducer - a virtuous cycle of statefulness 
	//everything in our app happens through a single channel!

	// djikstra- simplicity is a prereq for reliability.
	// redux is simple, which is powerful- scales well, all signals to change app state go through a single channel. this enforces/encourages programming tactics of immutability and functional purity. 


//==== REDUX WORKSHOP NOTES 

// once we add redux-
	 // what changes- 
		// state will no longer live in react components- will go in centralized Redux store. 
		// state changes will happen through redux store, and comp will setstate when store says it has been updated. setstate won't happen directly in response to actions 

	//what doesn't- 
		// - stateless components: should be reusable no matter what manages their state
		// - number of ways to trigger rerender of state - before it was just one, setstate- now it is just one, dispatch 


// just React
	import StatelessComponent from './StatelessComponent';

	class ContainerComponent extends React.Component {
	  constructor (props) {
	    super(props);
	    this.state = { counter: 0 };
	    this.increment = this.increment.bind(this);
	  }

	  increment () {
	    this.setState(prevState => ({ counter: ++prevState.counter }));
	  }

	  render () {
	    const {counter} = this.state;
	    return <StatelessComponent counter={counter} increment={this.increment} />
	  }
	}

// React with Redux
	import store from './store';
	import {incrementCounter} from 'action-creators';
	import StatelessComponent from './StatelessComponent';

	class ContainerComponent extends React.Component {

	  constructor (props) {
	    super(props);
	    this.state = store.getState();
	    this.increment = this.increment.bind(this);
	  }

	  componentDidMount() {
	      this.unsubscribeFromStore = store.subscribe(() => {
	         this.setState(store.getState());
	      });
	  }

	  componentWillUnmount() {
	      this.unsubscribeFromStore();
	  }

	  increment () {
	    store.dispatch(incrementCounter());
	  }

	  render () {
	    const {counter} = this.state;
	    return <StatelessComponent counter={counter} increment={this.increment} />
	  }
	}

//lyrics search
//lyrics api takes /artistname/songname and returns an obj with property lyrics that is a string of lyrics
	//touch react/store.js, constants.js, mkdir react/action-creators, react/reducers, touch react/reducers/root-reducer.js, action-creators/lyrics.js

//Action types are a definition and label for a kind of action. 
//Action creators are functions that can (possibly) take information and return objects that are formatted to be sent into the Redux state. These objects are called actions (thus having been created) and almost always have a type property that describe what type of action they are.


//in index.js, to test: 
	import store from './store';
	import {setLyrics} from './action-creators/lyrics';

	console.log('-------------------------');
	console.log('State before any actions: ', store.getState());

	const inTheAirTonightAction = setLyrics('I can feel it coming in the air tonight ... hold on ...');
	store.dispatch(inTheAirTonightAction);

	console.log('-------------------------');
	console.log('State after first SET_LYRICS action: ', store.getState());

	const rickRollAction = setLyrics('Never gonna give you up, never gonna let you down');
	store.dispatch(rickRollAction);

	console.log('-------------------------');
	console.log('State after second SET_LYRICS action: ', store.getState());

////////==== subscribing
	import store from './store';
	import {setLyrics} from './action-creators/lyrics';

	const unsubscribe = store.subscribe(function () {
	    console.log('----------------');
	    console.log('State changed!!', store.getState());
	});

	store.dispatch(setLyrics('I can feel it coming in the air tonight ... hold on ...'));
	store.dispatch(setLyrics('Never gonna give you up, never gonna let you down'));

	unsubscribe();

	store.dispatch(setLyrics('Hello, darkness, my old friend.'));


//////
import React, {Component} from 'react';
import store from '../store';

export default class extends Component {

  constructor() {

    super();

    this.state = Object.assign({
      artistQuery: '',
      songQuery: ''
    }, store.getState());

    this.handleArtistInput = this.handleArtistInput.bind(this);
    this.handleSongInput = this.handleSongInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleArtistInput(artist) {
    this.setState({ artistQuery: artist });
  }

  handleSongInput(song) {
    this.setState({ songQuery: song });
  }

  handleSubmit() {
    // TBD.
  }

  render() {
    return <Lyrics
      text={this.state.text}
      setArtist={this.handleArtistInput}
      setSong={this.handleSongInput}
      artistQuery={this.artistQuery}
      songQuery={this.songQuery}
      handleSubmit={this.handleSubmit}
    />
  }

}

/////


//handleSubmit should be on form, not on button! 

//First, in our constructor(), let's update our component's initial local state to also include artistQuery and songQuery. This will store values from inputs for later submission.
// --> only for the container- do 
Object.assign({artistQuery: '', songQuery: ''}, store.getState()) 
//OR 
this.state = ...
///////

//We have to import action creators with curly braces - if we did export default setLyrics at the bottom, instead of doing export const setLyrics, we could do it without object destructuring. 

// However, thunk middleware will give us a powerful new ability: instead of dispatching an action object, we can dispatch a new function! --> async action creators! -> AJAX stuff here

export const setLyrics = function (text) {
  return {
    type: SET_LYRICS,
    lyric: text
  };
};

export const fetchLyrics = function (artist, song) {
  return function (dispatch, getState) {
    axios.get(`/api/lyrics/${artist}/${song}`)
      .then(res => {
        dispatch(setLyrics(res.data.lyric));
      });
  };
};

/* BUT WAIT THERE'S MORE! (may be helpful later on!) */

const fetchAlbumsFromServer =() => {
  return dispatch => {
    axios.get('/api/albums')
      .then(res => res.data)
      // use the dispatch method the thunkMiddleware gave us
      .then(albums => dispatch(receiveAlbumsFromServer(albums))); 
  }
}

const playSong = songId => {
  return dispatch => {
    // side effects, like using the audio element belong in async action creators too, even if they aren't "async"
    audio.play() 
    dispatch(selectSong(songId));
  }
}

const doSeveralThings = (stuffId, thingsId) => {
  return dispatch => {
    // we can also use async action creators to compose several actions into one!
    dispatch(doStuff(stuffId));
    dispatch(doThing(thingId));
  }
}

///  
handleSubmit () {
    store.dispatch(fetchLyrics(this.state.artistQuery, this.state.songQuery));
  }

// store.getStore().lyrics

//formerly, currentSong was a property on the root state; now it is a property of a subreducer so we have to refactor as props.player.currentSong 

//in action creators for player- object destructuring with getState() 
export const toggleOne = (selectedSong, selectedSongList) => 
  (dispatch, getState) => {
    const { currentSong } = getState();
    if (selectedSong.id !== currentSong.id)
      dispatch(startSong(selectedSong, selectedSongList));
    else dispatch(toggle());
};

//originally: 
  toggleOne (selectedSong, selectedSongList) {
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }

//replace this.state with getState();

export const next = () => 
  (dispatch, getState) => {
    dispatch(startSong(...skip(1, getState()));
};

//originally: 
  next () {
    this.startSong(...skip(1, this.state));

//pass props down to songs in all posisble parents like so: 
    <Songs
      songs={album.songs}
      toggleOne={this.props.toggleOne}
      {...this.props.player} />

//fetch functions are exported from action-creators. action methods are made inside that module 
//no need for onload fns bc setstate is done through subscribe 

//Use the action types you pasted into constants.js to direct your work.
// Use the current functionality of AppContainer and methods that are not using action creators as your targets.
// Use unmoved properties in initialState to plan out your new sub-reducers.
// Write action creators that will generalize the actions you want to dispatch to your store.
// Write a sub-reducer for each grouping of state information that describes how it will update in response to an action.
// Don't forget to define a default value for each slice of state and to return the current state by default if the action doesn't match
// Also, be very sure to maintain immutability in your reducer. If you're not sure if you're doing this right, check out this section of the Redux docs.
// Add each sub-reducer to the combineReducers call in store.js.
// Keep in mind that, because of our sub-reducing, the shape of our state changes in small but significant ways: We now have .player and .lyrics, after more work we will probably have .artists, .albums, .playlists, .songs. Components receiving props from AppContainer are expecting things to be a little "flatter" and you may have to change these dumb components to adhere to the new state shape.

//passing from appcontainer and keepig all prop names the same: 
    const props = Object.assign({}, this.state, {this.state.player}, {this.state.albums}, {
      toggleOne: this.toggleOne,
      toggle: this.toggle,
      selectAlbum: this.selectAlbum,
      selectArtist: this.selectArtist,
      addPlaylist: this.addPlaylist,
      selectPlaylist: this.selectPlaylist,
      loadSongs: this.loadSongs,
      addSongToPlaylist: this.addSongToPlaylist
    });


//=======REVIEW NOTES

	//axios works on frontend and backend (on backend for this workshop we use request-promise)
	//api reqs: frontend makes req to backend, backend receives req and makes req to api, api responds to backend, backend responds to frontend 

	//for security, frontend cannot make reqs to apis by default (cross-origin request security) - so, instead of making a req through react, usu you make a req to your server running on the same domain, and forward the response back. 

	//redux- all about the store! other files need access to the store, and to action creators. 
	//once we have react-redux, there will be no need to import our store everywhere

	//directory structure is freeform in nodejs (vs ruby) 

	//creating store:
	//redux/store.js 
	import {createStore, applyMiddleware} from 'redux';
	import rootReducer from './reducers/root-reducer';
	import createLogger from 'redux-logger';

	export default createStore(
		rootReducer, 
		applyMiddleware(
			createLogger({ 
				collapsed: true 
			}))
		);

	});
		//store needs a reducer - store holds the state (or is the state itself) and reducer (like the store's utility) is what the store uses to create new states based on actions received.

	//in reducers/root-reducer.js 
	//eventually, this will hold the result of combined reducers
	//in most cases, you should keep your state as flat as possible

		const initialState = {
			lyrics: { //lyrics is a first-level prop, directly inside of the obj itself 
				text: '' //a second-level/nested prop
			}
		};

		export default function (state = initialState, /*default state only applies if the applicable arg is undefined. Falsey values do not trigger that assignment.*/ action) {
			switch (action.type) {

				let newState = Object.assign({}, state); //merges all the props from R onto L object, shallow copy so the props will be merged, but the deeper values won't be. 

				case 'SET_LYRICS': 
					newState.lyrics = Object.assign({}, newState.lyrics}); //or: {text: action.text}
					break;

					//some in redux do a deep clone, which copies all the values of keys recursively down - but it is an expensive process. to make this immutability operation easier, we use subreducers. 

				default: 
					return state; //reducer should return prev state when there is no case for it; redux throws an error if you try to throw an identical new obj
			}
		} //reducer should be functionally pure and only compute from state and action-- anything else will corrupt it!

		//for action-creators etc, there is no need to have a constants.js or to do the organization we did, but it is useful to have those patterns as scaffolding for scale 

		//obj.assign mutates the first obj - instead of creating a new obj, it merges stuff from the R into the first obj

		//action-creator files: a bunch of named exports is convention

		import {SET_LYRICS} from '../constants';

		export const setLyrics = newLyricsText => {
			return {//returns a formatted action to send to store
				type: SET_LYRICS,
				text: newLyricsText
			}; //since this file doesn't depend on redux at all, it is very testable
		}

		//localstate- handling it with this.setState even when we have redux as a global state- handling input values like artistQuery and songQuery- keep in inputs. Once submitted, send it to a redux action- but while it is just being inputted, it can stay on the component so it can just be stored in local state. 

//it is convenient to do async work inside thunk


//common patterns: 

export const fetchLyrics = function(artist, song) {
	return function (dispatch) {
		dispatch(lyricsloading()); //can show loading - it is more useful to centralize all the action creation and dispatch here than to have the component handle everything.

		//this also simplifies and facilitates testing
		get(...)
		.then(res => res.data.lyric) 
		.then(...)
		.then(lyricsText => {
			dispatch(setLyrics(lyricsText));
		})
		.catch(() => {
			dispatch(sendError()); //send error here
		});
	};
}

//refactoring for redux:
	//combineReducers- composes categorized actioncreators/reducers into a single reducer

	//root-reducer is a combo of the reducers
	import lyricsReducer from './lyrics-reducer'; 
	import playerReducer from './player-reducer';

	//combined reducer is the one that is used by the store.
	import {combineReducers} from 'redux';

	export default combineReducers({
		lyrics: lyricsReducer,
		player: playerReducer
	});

	// note: make sure references are copied down the line bc object.assign is not deep copy
	//we can make reducers even smaller and more compartmentalized, as in w an isPlayingReducer

	export default combineReducers ({
		lyrics: lyricsReducer,
		player: playerReducer,
		progress: (state = 0, action) => action.type ===SET_PROGRESS ? action.progress : state 
	});

//building a subcontainer- onEnter with react router 
//when going into indiv artist view- the firs thing it does is do axios reqs getting all info about artist + set state w that retrieved info
//react-router allows us to attach onto routes an onEnter function 

<Route path='/' component ={AppContainer} onEnter={() => console.log('Hello')}}>
	<Route path='/albums' component={Albums} onEnter={fetchAlbums}/> 
</Route>

//the fn provided in onEnter is called when you hit that 
//good place to load stuff 
//assuming we have the actioncreator we want, we can provide onEnter={loadAllInfo} - this is a more appropriate place to have it than on componentDidMount.








