//REACT-REDUX NOTES

	//react-redux (v small) provides a way to create 'smart' components using a special fn called 'connect' - binds components to redux in a patterned way 

	//automatically implements performance-saving optimizations, but your state must be immutable.

//omgifts example: 
addNewRecipient(recipientName) {
	store.dispatch(addRecipient(recipientName));
}

manageRecipients = (props) => //component that shows a recipient entry per recipient 
//react-redux- instead of us importing the store and doing subscribe on mount, we have a generalized and patterned way to do it- 

//how-to: 
	//0) npm i -S react-redux
	//1) wrap the entire root component (<Router>, in the render fn) in another component: Provider.
		import {Provider} from 'react-redux';
		import store from './store'; //index.js in store folder
			//by using provider elmt and wrapping root around, we say that the store will be passed down the entire tree by default - uses context, which is a react thing mostly used by libraries and not actual react apps. 
		<Provider store={store}> 
			<Router>
			//...
			</Router> 
		</Provider>

	//2) in AppContainer, use connect: 
		import {connect} from 'react-redux';

		//connect- pass 2 args to it, and it gives us a new component that will make it connect to store
		//1st arg: mapStateToProps fn
		const mapStateToProps = state => {
			//this fn receives full state from redux store, we return a new obj that is all the props that we want comp to rcv based on this state 
			//returns an obj w props that we want to map to state and how to map them
			//copied from the managerecipientscontainer thing - 
			return {
				recipients: state.recipientGifts.map(entry => entry.recipient)
			};
		};

		//2nd arg: mapDispatchToProps
		const mapDispatchToProps = dispatch => {
			//matches store dispatch to props. return an obj- fns that use dispatch
			return {
				addNewRecipient(recipientName) {
					dispatch(addRecipient(recipientName)); //not store.dispatch 
				},
				removeRecipient(recipientName) {
					dispatch(removeRecipient(recipientName));
				}
			}
		}

		export default connect(mapStateToProps, mapDispatchToProps)(ManageRecipients) //this connect returns a new fn that invokes right away; pass in ManageRecipients component - so recipients will get a prop equal to what we returned from mapStateToProps. Since we mapped dispatch, we get two additional fns as props on that component.
		//no subscribe, no importing of store 


	//example 2: with gifts container 
	import { connect } from 'react-redux';

	const mapStateToProps = state => {
		return {
			gifts: state.recipientGifts 
		};
	};

	const mapDispatchToProps = dispatch => {
		return {
			updateGift(recipientName, newGiftName) {
				dispatch(updateGift(recipientName, newGiftName));
			},
			//another fn,
			//another fn
		}
	}

	const connectToStore = connect(mapStateToProps, mapDispatchToProps);
	export connectToStore(Gifts); //gifts stays as a presentational component but it gets the necessary props
	

	//Right now, our "container" components have the following 4 jobs:

	// Job 1. Subscribe to the redux store when the component mounts.

	// Job 2. Get the state from the store, and send the parts we care about down as props to our stateless components.

	// Job 3. Define methods that dispatch changes to the store.

	// Job 4. Unsubscribe from the redux store when the component unmounts.

	// The react-redux library gives us a method called connect which simplifies the way that we perform those 4 jobs. To learn how to use it, let's do one of my favorite things - write it ourselves!

//eg starting point container: 
	import React from 'react';
	import store from '../store';
	import { incrementCounter } from '../action-creators';
	import StatelessComponent from './StatelessComponent';

	class ContainerComponent extends React.Component {
	  constructor (props) {
	    super(props);
	    this.state = store.getState();
	  }

	  // Job 1: subscribe to the store
	  componentDidMount () {
	    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
	  }

	  // Job 4: unsubscribe when unmounting
	  componentWillUnmount () {
	    this.unsubscribe();
	  }

	  // Job 3: define methods that dispatch to the store
	  increment () {
	    store.dispatch(incrementCounter());
	  }

	  render () {
	    // Job 2: "map" data from the state into props
	    const {counter} = this.state;
	    return <StatelessComponent counter={counter} increment={this.increment} />
	  }
	}

//We want to bake the ability to perform Jobs 2 and 3 into the component that createSubscribedComponent returns. We can do this by wrapping createSubscribedComponent in another function - the connect fn.

	// connect is a function that returns a function (a.k.a a "higher-order function"). It returns our createSubscribedComponent function from before (with a few changes). connect takes two arguments, "functionThatDoesJob2", and "functionThatDoesJob3". We will write these functions ourselves every time we have a new component to create. 

	// functionThatDoesJob2 takes the redux store's state as an argument, and returns an object with just the props we want to pass as its key-value pairs.
	// functionThatDoesJob3 takes the redux store's dispatch method as an argument, and returns an object with all of the specific methods we want as key-value pairs.

import React from 'react';
import store from '../store';

function connect (functionThatDoesJob2, functionThatDoesJob3) {
  // createSubscribedComponent will have closure over functionThatDoesJob2 and functionThatDoesJob3
  return function createSubscribedComponent (OtherReactComponent) {
    return class extends React.Component {
      constructor (props) {
        super(props);
        this.state = store.getState();
      }

      // Job 1: subscribe to the store
      componentDidMount () {
        this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
      }

      // Job 4: unsubscribe when unmounting
      componentWillUnmount () {
        this.unsubscribe();
      }

      render () {
        // Job 2: ourProps is an object that looks like this: 
        // { counter: state.counter }
        const ourProps = functionThatDoesJob2(store.getState());

        // Job 3: ourMethods is an object that looks like this: 
        // { increment: function () { dispatch(incrementCounter()) } }
        const ourMethods = functionThatDoesJob3(store.dispatch)

        // all of our props and methods get passed down to the OtherReactComponent!
        return <OtherReactComponent {...ourProps} {...ourMethods} />
      }
    }
  }
}

//functions that compose: 
	import React from 'react';
	import { incrementCounter } from '../action-creators';

	// expects to receive the current state as an argument
	// returns an object literal with just the fields from state we care about
	function mapStateToProps (state) {
	  return {
	    counter: state.counter
	  };
	}

	// expects to receive the dispatch method as an argument
	// returns an object literal with the methods we want to use
	function mapDispatchToProps (dispatch) {
	  return {
	    increment: function () {
	      dispatch(incrementCounter());
	    }
	  };
	}

// We pass in the two functions we wrote above to "connect" and invoke it,
// which gives us our "createSubscribedComponent" function, which now has closure over the
// two functions, and we invoke that with our target component!
const CompletedCounterComponent = connect(
  mapStateToProps, mapDispatchToProps)(StatelessComponent);
// We can pass our StatelessComponent right in to receive the props it needs! 
// No need to write a new class!

//Now, any time we want a component that's hooked up to the redux store, we don't need to write a class - we just need to write a couple of functions! Compare that with all of the cruft from fig 1. How cool is that?

//connect w stations- 

	//implementing a brand new feature - stations! These will simply organize your songs by genre. The list of all stations will allow you to select a genre, and choosing one will present you with a song list consisting only of songs belonging to that genre. This should be good practice/review of our fundamental redux and react-router skills as well!

//context is like a global var for react app - store will be availb in al child comps as this.context.store 
//NEVER USE CONTEXT FROM STORE YOURSELF - if you need sth from state then write a thunk action creator

const onPlaylistEnter = function (nextRouterState) {
  const playlistId = nextRouterState.params.playlistId;
  store.dispatch(getPlaylistById(playlistId));
};
<Route path="/playlists/:playlistId" component={PlaylistContainer} onEnter={onPlaylistEnter}/>
//in index.js

//Remember that connect is automatically subscribing to the store so that it will execute mapStateToProps and re-render the Station component when the state inside the store changes (which is what happens when we receive the songs).

export default (props) => {
  const stations = props.stations;
  return (
    <div>
      <h3>Stations</h3>
      <div className="list-group">
      {
        Object.keys(stations).map(genre => {
          return (
            <div className="list-group-item" key={genre}>
              <Link to={'fill/me/in/later'}>{genre}</Link>
            </div>
          );
        })
      }
      </div>
    </div>
  );
}

//don't put the mapping fn in the dumb component bc we want dumb components to be dumb to be modular


//staic view -> dynamic view 


// In addition to state as its first parameter, mapStateToProps functions can also expect to receive an object called ownProps in the second parameter.

function mapStateToProps = function (state, ownProps) {
  return {
    // etc...
  };
}
// Likewise, mapDispatchToProps receives the same thing.

function mapDispatchToProps = function (dispatch, ownProps) {
  return {
    // etc...
  };
}
// This is so that container components can accept props of their own (for example, from other components we write, or from react-router if a container is mounted under a Route).

// Consider this example:

import FoodListContainer from '../containers/FoodListContainer';

export default function MyFavoriteFoods (props) {

  // ["bagels", "chocolate", "key lime pie"]
  // ...in case anyone was wondering
  const myFavoriteFoods = props.myFavoriteFoods;

  return (
    <div>
      <h3>Blah Blah Blah</h3>
      <FoodListContainer favorites={myFavoriteFoods} /> 
    </div>
  );
}
//w/ foodlistcontainer example- it was created with react-redux. so where it is used, it is being given extra props. 

//when you call connect and invoke the fn you get back, you get a component back- a component you can call - a container, for instance. when you use those comps in the route or when you put them there with < Container /> you can use props. in react-redux you don't have a constructor - nothing to pass props. 

//we can't access props in a typical way- that's why we have ownprops- we pass through props to the props of the dumb component. if you need to pass info down (eg ownProps.params.genreName for the station container - doesn't coem from state, and comes from dynamic portion of url from a prop which we can't access if it's a connect comp)


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Station from '../components/Station';
import { toggleSong } from '../action-creators/player'

const mapStateToProps = (state, ownProps) => {
	console.log(ownProps);

  return {
  	genre: ownProps.params.genreName,
  	songs: state.songs,
  	currentSong: state.player.currentSong,
  	isPlaying: state.player.isPlaying
  };
};

const mapDispatchToProps = dispatch => { //map methods. if we imported store, we would do that and use store.dispatch. react-redux allows us to get around importing store over and over again and receive it bc of the connection. useful if you have a lot of dependencies and need to test - store bubbles down to child components. you should only need to import store once. 
  return {
  	toggleOne: (song, list) => dispatch(toggleSong(song, list)) //define a fn that will do this later - w/o fat arrow, it would be invoked immediately. togglesong returns a fn - dispatch action. 

  	//v impt to specify args here! 
  	//YOU HAVE TO PASS DOWN ARGUMENTS IN MAPDISPATCH TO PROPS BECAUSE JAVASCRIPT SUCKS 

  };
};

const connectToStore = connect(
	  mapStateToProps,
	  mapDispatchToProps
  );

export default connectToStore(Station);

const onStationsEnter = function (nextRouterState) {
  store.getState().songs.length === 0 && store.dispatch(loadAllSongs());
};
//hook on both entering stations and station/stationname

//ajax req could still be out while the station page is loading and rendering- that is why there is a moment of nothingness before it renders fully. 

//ownprops- dynamic url name- react router activates this and gives the component these props when there is a dynamic url with : param. 

//dumb components are completely agnostic of redux and react-redux and react-router! they don't know they are getting info through connection- they get that info like a fn would get args. --> separate knowledge and smartness from dumbness. 

//shouldcomponentupdate- compares props and nextprops and returns true or false. 
	//yields performance wins if you don't need to repaint all the child components 
	//the connect method of react-redux implements this for us!
	//just make sure the state is immutable. 
		//updates to arrays should always perform immutable operations like concat, map, and filter-- but NEVER push or pop 
		//updates to objs should always use Obj.assign({} /*and other args*/)

		// objects and arrays in JavaScript represent a location in memory, and when you evaluate equality for an object or an array, the === operator is actually checking to see if the object or array is referring to the same location in memory, not whether their contents are the same.

	// const array = [];
	// const sameArray = array;
	// sameArray.push(1);

	// array === sameArray; // true! The same array is referenced by both variables!

	// const differentArray = array.slice();
	// array === differentArray // false! Array.prototype.slice always returns a new array!

	//This means that if you mutate an object or array on your state, your connect components will think that nothing has changed (because the address of your current object will be equal to the address of the next object), and they'll prevent your components from re-rendering even though they should!


	//refactor ALL the container components

//call stack goes CRAZY when children aren't passed down for Artist container!
	//react 3.0: the way it passes down children- the container itself- the route. 
	//ownProps.children.props.children
	//react-router is in play for this 

	//what used to be the case: it would pass down children as the children. but now the children is itself- the component for the route is now rendered out as the child of the route itself. the container thinks it is its own parent/child. 

	// what is now: chidren passed to artistcontainer = same children for route, which is artistcontainer itself. so it recursively renders artistcontainer. so instead of passing down props.children (itself), we pass down props.children.children.props 

//issues to tackle: 
	//forms- should we keep them stateful, or use redux-forms? 
		//app state vs local state- can try to use as much redux as possible, or keep some comps w local state. 

	//how should we handle things like playercontainer, which has event listeners on it + a dispatch that uses args from state (but which must be in the maptodispatch fn)?	
		//change how the action creator works- toggleSong the action creator - right now it returns a fn dispatch w thunk. the fn has access to state, but we require that the args are passed in anyway. so we can just make these args optional and assume that if not, then we are trying to toggle the current song: 
		song = song || currentState.currentSong; 

// performance-wise, storing sth like UI state in the store rather than in local state is not that much of a difference. it just calls a few more functions. JS is very optimized for function identification and function calling. if it was triggering computation or some sort of requests, that would be worse. 

//Joe - I tend to like storing stuff like input values locally and then sharing them globally on submit. 

//to do connect w forms that still have local storage- take some of it out and instead of connecting to the dumb components, conncet to smart components that maintain some local state. so take out some of the stuff and put it in redux connect comp, then use the container only for maintaining local state and rendering the final local state. 

//Joe - redux-form is pretty complicated. Angular is better for forms - much better for sth like an admin panel or something. cf, though, react two-way binding. 

//playercontainer.js, refactored: 
	import React, {Component} from 'react';
	import { connect } from 'react-redux';
	import {previous, next, setProgress, toggleSong} from '../action-creators/player';
	import Player from '../components/Player';

	const mapStateToProps = (state, ownProps) => {
	  const myPlainObject = Object.assign({}, state.player);
	  return myPlainObject;
	};

	const mapDispatchToProps = dispatch => {
	  return {
	    toggle: () => dispatch(toggleSong()),
	    next: () => dispatch(next()),
	    prev: () => dispatch(previous()),
	  };
	};

	const connectToStore = connect(
	  mapStateToProps,
	  mapDispatchToProps
	);

	export default connectToStore(Player);

//updated actioncreators in player: 

export const addAudioEventListeners = () => {
  return dispatch => {
    AUDIO.addEventListener('ended', () => dispatch(next()));
    AUDIO.addEventListener('timeupdate', () => {
      dispatch(setProgress(AUDIO.currentTime / AUDIO.duration));
    });
  }
}

//updated onAppEnter in index.js: 
	store.dispatch(addAudioEventListeners());


//example: 
	// 1. A connect component written with react-redux, which exposes a way to dispatch changes to the redux store
	// 2. A stateful React class that manages local form data
	// 3. A stateless functional React component that displays the UI and connects event listeners

	// 1. Container.js

		import { connect } from 'react-redux';
		import { submitLoginActionCreator } from '../action-creators';
		import StatefulFormClass from './StatefulFormClass';

		const mapStateToProps = state => {
		  return {
		    // our main state.user
		    user: state.user
		  };
		};

		const mapDispatchToProps = dispatch => {
		  return {
		    // dispatches a change to our central `state.user` in the redux store
		    submitLogin (userName) {
		      dispatch(submitLoginActionCreator(userName));
		    }
		  };
		};

		export default connect(
		  mapStateToProps,
		  mapDispatchToProps
		)(StatefulFormClass);

	// 2. StatefulFormClass.js

		import React, { Component } from 'react';
		import StatelessForm from './StatelessForm';

		export default class StatefulFormClass extends Component {

		  constructor (props) {
		    super(props);
		    this.state = {
		      inputValue: '' // the entered user name
		    };
		    this.handleChange = this.handleChange.bind(this);
		    this.handleSubmit = this.handleSubmit.bind(this);
		  }

		  // updates our local state when the input form is changed
		  handleChange (evt) {
		    evt.preventDefault();
		    this.setState({
		      inputValue: evt.target.value
		    });
		  }

		  // takes our local inputValue and passes it to the method from our connect component, 
		  // which has access to `dispatch`
		  handleSubmit (evt) {
		    evt.preventDefault();
		    this.props.submitLogin(this.state.inputValue);
		  }

		  render () {
		    // passes down the local methods and inputValue, as well as the `user` from the store
		    return (
		      <StatelessForm 
		        user={this.props.user}
		        inputValue={this.state.inputValue}
		        handleSubmit={this.handleSubmit}
		        handleChange={this.handleChange}
		      />  
		    );
		  }
		}

	// 3. StatelessForm.js

		import React, { Component } from 'react';
		import StatelessForm from './StatelessForm';

		export default function (props) {

		  // a prop from our redux store
		  const user = props.user; 

		  // props from our local stateful component
		  const inputValue = props.inputValue; 
		  const handleChange = props.handleChange;
		  const handleSubmit = props.handleSubmit;

		  return (
		    <div>

		      { user ? <h3>You are already logged in: { user }</h3> : null }

		      <form onSubmit={handleSubmit}>
		        <label htmlFor="username">Enter your name</label>
		        <input value={inputValue} onChange={handleChange} />
		        <button type="submit">Submit</button>
		      </form>

		    </div>
		  );
		}


//incorporating react-redux: 
import {Provider} from 'react-redux';
//wrap Router in that component 

Object.keys(stations).map(genre => { //returns obj keys 
	return (
		...)
});

//StationsContainer: 

	const changeAllSongsIntoAllGenres = songs => {
		//a use case for reduce! when you want to turn an array of elmts into another value. 
		return songs.reduce((stationsObj, song) => {
			const g = song.genre;
			if (!stations[g]) stations[g] = [];
			stations[g].push(song);
			return stations;
		}, {});
	}; //this builds a grouped obj out of an array of elmts.

	const mapStateToProps = state => { //mapStateToProps can be called anything, even 'puppies', so long as it takes the state as an arg
		return {
			stations: changeAllSongsIntoAllGenres(state.songs)
		};
	};

	const mapDispatchToProps = dispatch => {
		return {};
	}; 

	const letsConnectAComponent = connect(mapStateToProps, mapDispatchToProps); 

	const StationsContainer = letsConnectAComponent(Stations);

	export default StationsContainer;

//the magic of debugger: 
	//if you put debugger in a line of code, it will pause execution of the program at that point + you can check out stuff that has happened. also, in your console, you can run expressions as if you were at that line in your program. so you can actually use 'state' in your console and use state at that point in time! 

//adding TODO comments: //TODO: add load all songs here (there are pkgs for this in subl too) 
//this is useful if you can search for them and see all the todo stuff throughout all your files

//react renders child comps based on the props received - dumb child comps are like pure fns 

//consider the typical flow of program + use cases when deciding whether to add onEnter or onLeave hooks to routes - eg the user might bookmark the page for single stations, so you don't want to lose the songs if it's entered directly -- add the hook. But you want to make sure it doens't load all the songs if it doesn't need to (eg if songs are already loaded from the previous stations page) -- so add a line to onStationsEnter- 
	if (store.getState().songs.length === 0 /*if you only have your inital state */) //do axios req

//you can provide null instead of mapStateToProps if you don't need it

//onleave is the inverse of onenter for routes!!!

