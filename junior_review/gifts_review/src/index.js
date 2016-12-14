import React from 'react';
import { render } from 'react-dom';
import AppContainer from './containers/AppContainer';
//bring in the store from redux
import store from './state/';

render(
	<AppContainer/>,
	document.getElementById('start')
);

//this is the only place that react and the dom actually intertwine. we tell react to render stuff onto the specified dom elmt, and react just takes it from there!

//in devtools, you can right-click on an obj and store it as a global var -> then you can call methods and stuff on it for testing and debugging! try this with the store - you can call getState() and dispatch on it! 