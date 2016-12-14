//redux is all about interacting with the store, which serves as the central source of informaiton.

import { createStore } from 'redux';

const initialState = {
	recipients: []
};

//this keeps it simple, because we don't want this app to scale a whole lot. 
export default createStore((state = initialState, action) => {

	switch (action.type) {

		case 'SET_RECIPIENTS':
			const newState = Object.assign({}, state);
			newState.recipients = action.recipients;
			return newState;

		default: 
			return state; //return the prev state- we won't change anything. 
	}
};

//createStore() has one req arg- a reducer. It can be imported in from another file, or it can be the result of combineReducers, or it can be a single function, as above. 

//reducer always takes a state and an action, and creates a new state. 