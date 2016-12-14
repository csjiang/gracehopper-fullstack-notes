//you need the db to create a model - every model gets tied to a specific connection. models are the only ones that access db directly; everything else (incl seed files) do it through index.js. 
const db = require('../_db'); 
const Sequelize = require('sequelize');

//db.define takes max of 3 args: 
	//1) name of model - should be singular and lowercase
	//2) obj w columns
	//3) obj w utilities

module.exports = db.define('recipient', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	location: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	instanceMethods: {},
	classMethods: {
		//don't use fat arrows here bc context matters
		findByLocation: function(locationStr) {
			return this.findAll({
				where: {
					location: locationStr
				}
			});
		}
	}
});

//can also define separately: 
// const columns = {};
// columns.name = {
// 	type: Sequelize.STRING,
// 	allowNull: false
// };

// const utilities = {};
// utilities.instanceMethods = {};
// utilities.classMethods = {};
// const Recipient = db.define('recipient', columns, utilities);

