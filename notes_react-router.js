//React Router provides front-end routing
//NON-SPAs!?!? 
	//make a request- browser sends back a new page (each view is represented by its own html page in views) and has to re-render everything. 
	//browser must also fetch any resource that is used by the new page. 
	//other operations- browser makes partial request and sth like nunjucks serves it up 

//SPAs- on page change, the frontend app replaces elements on existing DOM to update biew. 
	// AJAX plays a big part to fill in data that would not be filled by server (cf nunjucks). 
	// browser history API allows for control of URL, back/forward button, even though pages are not visited! MAGICAL 

//REACT ROUTER - keeps UI in sync w URL 
	// - ties into URL and history to allow for easy nav to and from parts of app 
	// - allows easy nesting of views 

// frontend vs backend routing: 
	// frontend: route = url + component 
		//route: display these components in the view
		//when url bar matches the one in the route, react-router causes the specific component's render fn to execute
// npm i -S react-router
//react-router components
import {Router, Route, hashHistory} from 'react-router'
<Router history={hashHistory}>
	<Route path="/path" component=AllPuppies/> 
	<Route path="/puppies/:puppyName" component=SinglePuppy/> 
</Router> 
//params in route ok
//path="/path" will attach a weird path to the end - a unique key created by r-r for each route; has advanced uses - store session info for each route 

//in some browsers, a # in the url keeps the browser from rerendering the page. (cf wikipedia # anchor tags) 

//hashHistory--it manages the routing history with the hash portion of the url. It's got that extra junk to shim some behavior the browser has natively when using real urls. 

//it is difficult to add props to the link tag- so we should make an axios request for info for each individual puppy. 

//since there is a puppyName on route path where singlepuppy is, the puppyName param will be on the props object for singlePuppy. You can log it out in singlePuppy's render fn 

//add middleware to serve up index.html as starting point for any other request made - 
app.use(function(req, res) {
	res.sendFile(__dirname + "index.html");
})

//Nesting routes: 
<Router history={hashHistory}>
	<Route path="/path" component=AllPuppies/> 
	<Route path="/puppies/:puppyName" component=SinglePuppy>
		<Route path="toy" component={Toy} />
	</Route> 
</Router> 

//<Route path="toy" component={} /> -> since no leading slash is added to the path here, React doesn't think it's an absolute path. The path will be tacked onto the parent route path 

const Toy = (props) => <p>{props.toy}</p> //since Toy is a dumb component, we use props.toy and not this.props.toy 

//in render fn for puppy: 
<Link to={`/puppies/${puppy.name}/toy`}>See {puppy.name}'s favorite toy...</Link>

//to properly render child components in their parent component, use prop: { this.props.children } 

<Link to={`/puppies/${puppy.name}/toy`}>See {puppy.name}'s favorite toy...</Link>
{ this.props.children } 
//link is almost identical to <a/> but it is aware of the Router it was rendered in. 

//to properly pass down props to a child element: 
{ this.props.children ? React.cloneElement(this.props.children, {
	toy: puppy.toy
}) : null } //clone element: second arg is the props to pass down. 


//regarding pagination: wait for Redux- AJAX requests to populate pages needs to be done in a different manner. 

// React Router is one such tool, a swell third-party React library that allows us to establish "routes" in our frontend application that render different components while also updating the URL as we traverse our application. Back button functionality and everything!

// Through react-router we have "routes". In its simplest form, a route is a combination of two things, a URL and a component. As far as we are concerned it is a kind of rule about our application: when the URL matches, the component executes its render method.

//routers ignore everythign after #- each route componetn w/in router parent renders its component conditionally based on url 

// The Link component itself is a thin wrapper around the <a> element - we pass it a prop called to that will tell it how to change the url. For example:

<Link to="/albums">Go to Albums</Link>
<Link to={`/albums/${this.props.albumId}`}>Go to an Album</Link>

//CMD + D when highlighting something highlights everythign ont eh same line!!! OMG 

.then((data) => console.log(data))

//destructuring arrays in es6: 
var [resArtist, resAlbums, resSongs] = res; 
console.log(resArtist);
//rs in nodemon restarts process! 
//JS is non-blocking: async call from one module or one block will not halt another non-async thing underneath it. 
//methods on appcontainer have to be bound to this to set state correctly after => call in axios request

//short-circuit to avoid typeerrors:         
{ children && React.cloneElement(children, propsToPassToChildren) }

//static - add in front of a keyword in a class def- means it is available as a method off the class itself, but not as a method of instances of that class. this.staticmethod does not exist bc this always refers to an instance of that class. 

//w/ redux, one store holds our state and that is the source of truth. 













