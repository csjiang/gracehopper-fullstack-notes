const db = require('./_db'); //_ in front of names usu indicates a file not to be interacted w directly. but stuff that is private also (like models) can and should interact w it directly. 

const Recipient = require('./models/recipients');
// require('./models/recipients');
//const Recipient = db.model('recipient');

//you can require this even if you don't module.export the recipients from that file. you require it so the file can run -- the file doesn't run unless it is required! and the file will add info to db. 
// console.log(db.model('recipient').findAll); //[Function] 

//if you require the same file twice, it doesn't run the file again. this is the singleton pattern- the first time, it runs. the second and successive times it is required/imported, it spits back what it evaluated to the first time. 

module.exports = db;

