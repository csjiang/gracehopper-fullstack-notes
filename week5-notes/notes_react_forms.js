
//==================
//FORMS
//unlike react router, which is the de facto standard for frontend routing, there is no industry consensus on what library to use for form validation. 

//form: create method 
export default function (props) {
	handleSubmit (event) {

	} //goes on the html for form button as onSubmit={() => this.handleSubmit}
	return (/*jsx*/)	
}
//form component should have jsx rendered out, and another container component. when we have sth w container in the name, it is osmething that holds state. so one container holds state, and it has form inside it and that has inputs and jsx rendered out. form container only has input value. it has local state that we use to grab input value. main state is in main-container app. 
//form: create a container component for form. 

// in form: input - onChange={this.props.handleChange}
//in container: 
import React, { Container } from 'react';
//typically, non-react handler functions have some sort of event passed in
//so this is the same
class FormContainer extends Component {

	constructor(props) {
		super(props);
		//constantly update state. when we submit, take primitive val in state and pass it up to parent
		this.state={
			inputValue: '';
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
			//logging out the event will show proxy- an es6 feature, like a metafeature, cf. es6 slides in library. 
			//react doesnt just allow native event obj; it is wrapped in a proxy and react calls a synthetic event. a syntetic event is sth react created- it is a uniform obj and a wrapper for the event obj, uniform obj across browsers. usu there is one event in memory and it is mutated every time, which is different from the way we just create new events all teh tiem and don't mutate them. react reuses the synthetic event for performance purposes. things logged out are a reference to the event obj. the target has changed though (???) 0 cantget to elmt if we call event.target... target on synthetic event is already null. (keep this in mind when workign w events in react) 
			//event.target.value - wlil show the input. 
			//event.target.formName.value - puppyname.value will show the same as above but is called more specifically w a reference to the name of teh form. 
			this.setState({
				inputValue: event.target.value
			})
	}
	///in formcontainer: 
	<FormContainer changePuppy={changePuppy} /> 
	//then, call this.props.changeFavoritePuppy in handleSubmit function (difft from handleChange; we only want to change the stuff when the form is submitted. )

	handleSubmit(event) {
		console.log(event);
		event.preventDefault(); //we always need this- it prevents the page rfom refreshing. 
		const newFavoritePuppy = this.state.inputValue;
		this.props.changePuppy(newFavoritePuppy);
	}

	render() {
		return (<div>
			<FavPuppyForm handleChange={this.handleChange} />
		</div>)
	}
}

export default FormContainer;

// Forms in React 
//react is declarative rather than imperative
//how to get data- have a little bit of local state to container, and then main app state
//change events in react create events too- with one gotcha- react synthetic event (wraps native event) - and event objs are 'pooled'- just one in memory and it is mutated. can't bbe used asynchronously. 

//react has uncontrolled and ocntrolled components - some that have local state and some that don't. controlled form components havve values directly controlled by state. changes to val on state update what you see in form, changes to what you see in form update val on state. it looks like 2way binding but it just updates state and gets rerendeed on input.
//uncontrolled form components don't do this-- changes to what you see in the form update the value on the state... but not the other way around. 

// controlled comps are much easier to use - separates concerns. are a bit tedious to set up initially bc you need 2 components and pass props and stuff but ultimately it is easier to deal w 

//where does state belong? 
//app state vs local state
	//app state- application state- eg user, which many components may need to access. so this should be managed high up on the state tree.
	//only a form needs to nkow about the data inside it, so that state can be managed lower down. 

	//cf tree diagram visualization of components and state in slides 

//====== JUKE FORMS prereading notes

// Handling events w react elmts - like handling evts on dom elmts except for syntactic diffs: 1) react evts named in camelCase, not lowercase; 2) with JSX you pass a fn as event handler, not a string. 

//HTML: 
<button onclick="activateLasers()">
  Activate Lasers
</button>

//React: 
<button onClick={activateLasers}>
	Activate Lasers
</button>

// + 3) you can't return false to prevent default behavior in React -- you must call preventDefault explicitly. 
//HTML: 
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
//React: 

function ActionLink() {
	function handleClick(e) { //e is a synthetic event 
		e.preventDefault();
		console.log('The link was clicked.');
	}

	return (
		<a href="#" onClick={handleClick}>
		Click me
		</a>
	);
}
//in react- generally, you don't need to call addEventListener on a DOM elmt after it is created. 
//instead, provide a listener when the elmt is initially rendered. 


//defining a component using an ES6 class- a common pattern is for evt handler to be a method on the class. Eg. toggle component - 
class Toggle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		//have to bind to make 'this' work in callback
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState(prevState => ({
			isToggleOn: !prevState.isToggleOn
		}));
	}

	render() {
		return (
			<button onClick={this.handleClick}>
				{this.state.isToggleOn ? 'ON' : 'OFF'}
			</button>
		);
	}
}

ReactDOM.render(
	<Toggle />,
	document.getElementById('root')
);

//re: this in callbacks: in JSX, JS class methods aren't bound by default so if you don't bidn this and pass it, this will be undefined when fn is actually called. 
//to avoid using 'bind', either use experimental property initializer syntax (see docs) or arrow fn in callback: 
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}> 
        Click me
      </button>
    );
  }
}
//however, this syntax makes a difft callback each time the loggingbutton renders - this might cause a lot of rerendering if passed to many lower components. 

//FORMS
//Form elmts: naturally keep some internal state. Default HTML form behavior is to browse to a new page. We use controlled components - have a JS fn that handles form submission and has access to user input. 

//HTML- form elmts like input, textarea, and select maintain their own state and update it based on user input. 
//React- mutable state is typically kept in state prop of components and updated only through setState()
	//combining the two--> make React state the 'single source of truth'- a react component that renders a form also controls what happens in that form on subsequent user input. --> this comp is a "controlled component"

//ex. 
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}; //this is always the displayed value, so React is the single source of truth 

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value}); //runs on every keystroke: displayed val updates as user types
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

//w a controlled comp- every state mutation has an associated handler fn! this facilitates modifying/validation of user input. 
//eg all caps validation: 
handleChange(event) {
	this.setState({value: event.target.value.toUpperCase()});
}

//textarea tag
	//in HTML it defines its text by its children:
	<textarea>
	  Hello there, this is some text in a text area
	</textarea>

	//in react, <textarea> uses a value attribute: 
	class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.' //basically similar to single-line input forms
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

//select tag
	//in html, it creates a dropdown list: 
	<select>
	  <option value="grapefruit">Grapefruit</option>
	  <option value="lime">Lime</option>
	  <option selected value="coconut">Coconut</option> <!-- selected attrib makes it initially selected -->
	  <option value="mango">Mango</option>
	</select>

	//React- instead of using a selected attrib, it uses a value attrib on the root select tag. - so you only need to update it in one place. 

	class FlavorForm extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {value: 'coconut'}; //here is where react keeps the selected val

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	  }

	  handleChange(event) {
	    this.setState({value: event.target.value});
	  }

	  handleSubmit(event) {
	    alert('Your favorite flavor is: ' + this.state.value);
	    event.preventDefault();
	  }

	  render() {
	    return (
	      <form onSubmit={this.handleSubmit}>
	        <label>
	          Pick your favorite La Croix flavor:
	          <select value={this.state.value} onChange={this.handleChange}>
	            <option value="grapefruit">Grapefruit</option>
	            <option value="lime">Lime</option>
	            <option value="coconut">Coconut</option>
	            <option value="mango">Mango</option>
	          </select>
	        </label>
	        <input type="submit" value="Submit" />
	      </form>
	    );
	  }
	}
//takeaway: in react, <input type="text">, textarea, and select all have a value attrib that you use to implement a controlled component. 

//COMPOSITION v INHERITANCE
	//use composition over inheritance to reuse code between components 

	//Containment: for components that dont know their children ahead of time (eg sidebar, dialog, generic 'box' components) --> use the children prop to pass children elmts directly into output 

	function FancyBorder(props) {
	  return (
	    <div className={'FancyBorder FancyBorder-' + props.color}>
	      {props.children}
	    </div>
	  );
	}

	//so then other comps can pass arbitrary children to them by nesting JSX
	function WelcomeDialog() { //with this, anything inside <FancyBorder> JSX tag is passed into the FancyBorder comp as a children prop - passed elmts will appear in final output bc FB renders {props.children} inside a div. 
	  return (
	    <FancyBorder color="blue">
	      <h1 className="Dialog-title">
	        Welcome
	      </h1>
	      <p className="Dialog-message">
	        Thank you for visiting our spacecraft!
	      </p>
	    </FancyBorder>
	  );
	}

	//to use multiple 'holes' instead of using children: 
	function SplitPane(props) {
	  return (
	    <div className="SplitPane">
	      <div className="SplitPane-left">
	        {props.left}
	      </div>
	      <div className="SplitPane-right">
	        {props.right}
	      </div>
	    </div>
	  );
	}

	function App() {
	  return (
	    <SplitPane
	      left={
	        <Contacts />
	      }
	      right={
	        <Chat /> //you can pass react elmts as props like any other data bc they are just objs. 
	      } />
	  );
	}

	//SPECIALIZATION

	//components as 'special cases' of other components - 
	//composition- a more specific component renders a more generic one and configures it with props.

	function Dialog(props) { //less specific
	  return (
	    <FancyBorder color="blue">
	      <h1 className="Dialog-title">
	        {props.title}
	      </h1>
	      <p className="Dialog-message">
	        {props.message}
	      </p>
	    </FancyBorder>
	  );
	}

	function WelcomeDialog() { //more specific
	  return (
	    <Dialog
	      title="Welcome"
	      message="Thank you for visiting our spacecraft!" />
	  );
	}

	//composition also works for components defined as classes. 

	function Dialog(props) {
	  return (
	    <FancyBorder color="blue">
	      <h1 className="Dialog-title">
	        {props.title}
	      </h1>
	      <p className="Dialog-message">
	        {props.message}
	      </p>
	      {props.children}
	    </FancyBorder>
	  );
	}

	class SignUpDialog extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSignUp = this.handleSignUp.bind(this);
	    this.state = {login: ''};
	  }

	  render() {
	    return (
	      <Dialog title="Mars Exploration Program"
	              message="How should we refer to you?">
	        <input value={this.state.login}
	               onChange={this.handleChange} />
	        <button onClick={this.handleSignUp}>
	          Sign Me Up!
	        </button>
	      </Dialog>
	    );
	  }

	  handleChange(e) {
	    this.setState({login: e.target.value});
	  }

	  handleSignUp() {
	    alert(`Welcome aboard, ${this.state.login}!`);
	  }
	}

	//FB doesn't use inheritance hierarchies, so you shouldn't either. 
	//use props and composition to customize components' look and behavior. components can accept arbitrary props incl. primitive values, react elmts, or functions. 

	//to reuse non-UI functionality btw components, extract into a separate JS module for components to import, without extending them. 


//Synthetic events
	//event handlers are passed instances of synthetic event, a cross-browser wrapper around browser's native event. has same interface as native evt, incl stopPropagation() and preventDefault() 
	//use the nativeEvent attribute to get the browser native event. 

	//attribs on SE: 
	boolean bubbles
	boolean cancelable
	DOMEventTarget currentTarget
	boolean defaultPrevented
	number eventPhase
	boolean isTrusted
	DOMEvent nativeEvent
	void preventDefault()
	boolean isDefaultPrevented()
	void stopPropagation()
	boolean isPropagationStopped()
	DOMEventTarget target
	number timeStamp
	string type

	//SE is pooled: SE obj reused and all props nullified after the evt callback has been invoked. 

	function onClick(event) {
	  console.log(event); // => nullified object.
	  console.log(event.type); // => "click"
	  const eventType = event.type; // => "click"

	  setTimeout(function() {
	    console.log(event.type); // => null
	    console.log(eventType); // => "click"
	  }, 0);

	  // Won't work. this.state.clickEvent will only contain null values.
	  this.setState({clickEvent: event});

	  // You can still export event properties.
	  this.setState({eventType: event.type});
	}

	//there is also event.persist() to get event to stick around for async operations
	//list of events https://facebook.github.io/react/docs/events.html

//Refs and the DOM

	//in a typical React dataflow, parent comps only interact w their children through rerendering them w new props. BUT if you want to imperatively modify a child outside of the typical dataflow: 
		//child to be modified can be an instance of a React comp or a DOM elmt

		//ref callback attribute- you can attach this to any comp. 
		//callback executed immediately after comp is MOUNTED or UNMOUNTED. 

		//REF ON HTML: when ref attr used on HTML elmt- ref callback receives underlying DOM elmt as its arg. 
			//eg ref callback to store reference to DOM node: 
			class CustomTextInput extends React.Component {
			  constructor(props) {
			    super(props);
			    this.focus = this.focus.bind(this);
			  }

			  focus() {
			    // Explicitly focus the text input using the raw DOM API
			    this.textInput.focus();
			  }

			  render() {
			    // Use the `ref` callback to store a reference to the text input DOM
			    // element in this.textInput.
			    return (
			      <div>
			        <input
			          type="text"
			          ref={(input) => { this.textInput = input; }} />
			        <input
			          type="button"
			          value="Focus the text input"
			          onClick={this.focus}
			        />
			      </div>
			    );
			  }
			}

		//react calls ref callback w DOM elmt when comp mounts - call with null when it unmounts. 
		//it is common to use the ref callback just to set a property on a class. 
			//use this instead of this.refs.myRefName to access refs.

		//REF on REACT custom component: 
			//ref callback takes the mounted instance of the comp as its arg. 
			//eg wrap a comp to simulate it being clicked immediately post-mounting: 

			class AutoFocusTextInput extends React.Component {
			  componentDidMount() {
			    this.textInput.focus();
			  }

			  render() {
			    return (
			      <CustomTextInput
			        ref={(input) => { this.textInput = input; }} />
			    );
			  }
			}

			//NO USE of REF on DUMB COMPONENTS because they don't have instances!
			//but you can use ref attrib inside render fn of a dumb component: 

			function CustomTextInput(props) {
			  // textInput must be declared here so the ref callback can refer to it
			  let textInput = null;

			  function handleClick() {
			    textInput.focus();
			  }

			  return (
			    <div>
			      <input
			        type="text"
			        ref={(input) => { textInput = input; }} />
			      <input
			        type="button"
			        value="Focus the text input"
			        onClick={handleClick}
			      />
			    </div>
			  );  
			}
		//but don't overuse refs over state - make sure you know where state belongs in a component hierarchy.


//=====WORKSHOP NOTES
	//Data synchronization is a problem w forms! --> implement playlists 
	//ui/local state (forms, timers, small animations etc) v app state- dont clutter up main container. 

	//artists filter- use fnal comp to write a new stateful component that will manage value of filter's input, filter artist's array, and pass filtered array of artists down to artists componetn 

	//presentational comp- FilterInput 

	//synthetic events- Whenever you pass a callback function to an event listener like onClick, React will implicitly pass an event object to it as the first argument.

	//for cross-browser compatibility react wraps teh native browser event w a class of its own called SyntheticEvent. 
	//react pools all events intot eh same SE obj- a single obj allocation mutated at runtime. Good for performance but you can't use it asynchronously (incl setstate) - always grab values off the event obj when you need to do async stuff w it 
	//eg collecting input value: 
	// safely get the string value from event.target
	this.setState({ inputValue: event.target.value }
		//NOT this.setState({ input: event })

	//handleChange goes on input as onChange; handleSubmit goes on form as onSubmit

	//shift-cmd-r : hard refresh 
	//console log props to make sure you have everything
	//index.js has to have the CONTAINER rendered instead of the presentation form itself!!!

	//make input reset to '' on submit- clear value by setting state in handlesubmit; pass value to input form as part of props

	//validations: Don't forget that button elements can take a prop called disabled, which will accept a boolean. Sounds like you could manage some state in the container component, or use the value prop that controls the input value. - set state on playlist container, pass disabled prop to presentation form and put it on the button as disabled={this.props.disabled}
    //STYLE!!!
     <div className="alert alert-warning" style={!props.tooLong ? {display: "none"} : null}>That is way too long for a playlist name. Please be more realistic.</div>

//when you have sth too long but erase it all at once, why do you get both warnings? backspace is not an input?

//you only need to initialize class with props and super when you need a state! Wow 
//otherwise you can still have a class component but just w lifecycle hooks and no constructor 


//component willreceiveprops: lifecycle hook for comps that are mounted but need to be updated anyway. 
//invoked before a mounted comp receives new props- update in response to prop changes - compare this.props and nextProps
	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.props.selectPlaylist(nextProps.playlistId)
		}
	}

//frontend redirect:

// modules/Repos.js
import { browserHistory } from 'react-router'

// ...
  handleSubmit(event) {
    // ...
    const path = `/repos/${userName}/${repo}`
    browserHistory.push(path)
  },
// ... event.target.elmts has id of thing on it 

  handleSubmit(event) {
    event.preventDefault()
    const userName = event.target.elements[0].value
    const repo = event.target.elements[1].value
    const path = `/repos/${userName}/${repo}`
    console.log(path)
  },

//hashHistory.push(path);
//1) either return promise from createplaylist method and resolve it in handlesubmit event;
//2) or const the path and push onto hashhistory from inside that method 



