//when we do seed.js, it triggers the db/index.js file, which sets up the db connection and makes the models 
const db = require('./db');

//so then we can require the models bc they have been set up by requiring db/index
const Recipient = db.model('recipient');

db.sync({ force: true })
	.then(() => {
		const recipientNames = [
		{ name: 'Mariana', location: 'Philly!'}, 
		{name: 'Gladys', location: 'NYC'},
		{name: 'Chloe', location: 'Sacramento'}
		];
		const creatingRecipients = recipientNames.map(n => {
			return Recipient.create({ name: n }); //returns a promise
		}); //returns an array of promises
		return Promise.all(creatingRecipients);
	})
	// .spread((arr) => {
	// 	const mariana = arr[0];
	// 	const chloe = arr[2];
	// }) //native promises in es6 don't have .spread or .map or .filter like Bluebird promises do
	.then(() => {
		console.log('Seeding complete!');
	})
	.catch(console.error);

//example of array destructuring in es6
//like in .then(([mariana, gladys, chloe])) for the resolved promises

// const add = ([x, y, z]) => { 
// 	return x + y + z;
// };
// add([6, 4, 1]);

//sync checks to see that all the tables exist properly. this is an async process bc it works w the db, so it returns a promise. 

//force true drops all the tables and recreates them based on the model. this is appropriate for the seed file as it reinstantiates the db. 