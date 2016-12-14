const Sequelize = require('sequelize');

const dbConnection = new Sequelize(
	'postgres://localhost:5432/gifts'
);
	//Sequelize constructor can be an obj that specifies protocol and db location, or it can be a string that has that info

	//a db is like a server- it runs on a port, and we interact with it in a way that is kind of analogous to web sockets - we use a TCP connection. in the case of a deployed app, the db + server process(es) are usu not in the same location, but they can communicate through TCP. 

module.exports = dbConnection;