//a dumb component.
import React from 'react';
	//necessary to use JSX
import Location from './location';

export default (props) => {

	return (//what it renders 
		<div className="recipient">
			<input type="text" 
			//onchange event typically sets some sort of local state
			onChange={(e) => {}} />
			<h1>{props.recipient.name}</h1>
			<Location place={props.recipient.location}>
		</div>
	);
};