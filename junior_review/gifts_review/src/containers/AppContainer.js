import React, { Component } from 'react';
import Recipient from '../components/Recipient';
import { get } from 'axios';

//bring in the redux store: 
import store from '../state/';

export default class extends Component {
	constructor () {
		super(); //you can't use 'this' until you call super
		this.state = store.getState(); //w/ redux ^ 

		//vanilla react
		// {
			// recipients: [
			// 	{ name: 'Mariana', location: 'Philly'},
			// 	{ name: 'Gladys', location: 'New York'},
			// 	{ name: 'Chloe', location: 'Sacramento'},
			// ] //bc you know what you eventually expect data to look like, you can populate it with dummy info when testing
		// }

		this.setNewRecipient = this.setNewRecipient.bind(this);
	}

	//lifecycle hook called when component gets on screen:
	componentDidMount() {
		//we have to subscribe to the store in order to listen to it and rerender when store state changes

		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		});

		get('/recipients')
			.then(res => res.data) 
			.then(recipients => {
				//vanilla react:
				// this.setState({
				// 	recipients: recipients
				// });

				//w/ redux:
				store.dispatch({
					type: 'SET_RECIPIENTS',
					recipients: recipients
				})

			});
	}

	componentWillUnmount() {
		//it is impt to unsubscribe in conditions when our comp unmounts (which it doesn't in this case). unsubscribe + subscribe are replaced when we have react-redux. 
		this.unsubscribe();
	}

	setNewRecipient() {
		this.setState({ newRecipient: e.target.value });
		//we have to bind it (in the constructor) to use it 
	}

	render() {
		return (
			<div>
				<p>New recipient is: {this.state.newRecipient }</p>
				<input type="text" onChange={this.setNewRecipient} />
			{this.state.recipients.map((r, i) => {
				return <Recipient recipient={r} key={i}  />
				//could even pass down props like: <Recipient props = {...r} />
			})}
			</div>
		);
	}
}