const express = require('express');
const router = express.Router();
module.exports = router;

//paths should be '/' bc the app routes them through '/recipients'
router.get('/', (req, res, next) => {

});

//next is sth that lets us pass errors down/pass stuff through middleware handlers
app.get('/recipients', (req, res, next) => {
	//localhost:1337/recipients?location=Sacramento&somethingelse=2
	if (req.query.location) {
		databaseCall = Recipient.findByLocation(req.query.location);
	} else {
		databaseCall = Recipient.findAll();
	} //w/o promises, our code wouldn't be as DRY as we'd need to have callbacks for both the above calls

	databaseCall
	.then(recipients => res.send(recipients))
	.catch(next);
});

app.get('/recipients/:recipientId', (req, res, next) => { //ids are often strings - think of drivers' licenses or SSNs
	Recipient.findById(req.params.recipientId)
	.then(foundRecipient => res.send(foundRecipient))
	.catch(next);

	//if you use findAll method, it always gives back an array even if there is only 1 returned. findOne returns that single instance - resolves to an object. 
});

app.post('/recipients', (req, res, next) => {
	//you need body-parser to parse the body of this post request
	Recipient.create(req.body.name)
		.then(createdRecipient => {
			res.status(201).send(createdRecipient);
		})
		.catch(next);
})

const db = require('../db');
const Recipient = db.model('recipient');
