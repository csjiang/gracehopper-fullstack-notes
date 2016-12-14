import React from 'react';
//tiny components can still be good and useful in React!

export default (props) => {
	return (
		<h3><i>They are from:</i>{props.place}</h3>
	)
};
//react renders downward, passing info toward the most deeply nested child. 