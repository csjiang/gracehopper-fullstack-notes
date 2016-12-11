// notes on sequelize/express checkpoint 

// MODELS! 

// 1) validation with notNull is deprecated in favor of allowNull: false. BUT you can validate that something is not an empty string by doing 

validate: {
	is: /.+/
}

// 2) always use 
this.getDataValue 
// and 
this.setDataValue 
//in virtuals and in get methods for fields to avoid interference from changes in the underlying structure.

// 3) as a replacement for 

where: {
	title: title
}

// just do 

where: {title} //you can't do where: title

// 4) hook structure is like this: depending on the hook, the first argument to the hook function is either the instance or model. for creating and updating hooks, it's the instance.

hooks: {
	afterUpdate: function (article, options) {
		++article.version; 
	}
}

// 5) fat arrows syntax will break this references in model definition!!! this is because fat arrows always bind 'this' to the immediate/enclosing lexical scope. 

// 6) you can do 

Model.belongsTo(Model, {as: 'author'}); 

// to set a custom name on the id. 

// 7) Ask why we do 
module.exports = new Sequelize(config.database, config.username, config.password, config);

// when there is no config.username or config.password given in the config. 

// 8) you need db in model definition files so you can do db.define. you also need Sequelize so you can access Sequelize datatypes. 

// ROUTES!

// 9) You can't throw an error in the ternary operator syntax bc the ternary operator expects condition ? expression : expression, whereas throwing an error is a statement. Ternary operators aren't meant to produce side effects; for clarity, it is best to use a simple if-else statement. 

// 10) You can transform a Sequelize instance to a plain object using the option plain: true when doing Model.get. (check this) -- to return an object and pass the tests like we did you can do 

	res.send({
		message: 'Updated successfully',
		article: updatedArticle,
	});

//or JSON.stringify(article)


// 11) if you are passing in req params with names that match field names on the model, you can save all the pertinent fields by doing 
Article.create(req.body) 
// or 
Article.update(req.body) 
// instead of having to write out the fields. 

// 12) There is something called app.param, which lets you set a route that will look for any matching param (anywhere in the route) and lets you modify it and pass it along as something attached to the request. This takes a fourth argument, the value of the param name you are looking for. Example: 

app.param('id', (req, res, next, id) => {
	Article.findById(id)
	.then((foundArticle) => {
		foundArticle 
		? req.article = foundArticle //attaches the found instance to the req object and passes it along
		: res.sendStatus(404);
		next();
	})
});

//this will apply to the following routes: 
app.get('/articles/asdioasjodij/:id', (req, res, next) => {
	res.send(req.article) //the instance has been located already and attached to the request object, so you can just do stuff with it here instead of running another query
});

app.get('/whosits/whatsits/:id', (req, res, next) => {});

//One caveat when working with app.param is that the modified stuff is local to the router where app.param is defined. Therefore, if I define app.param to do something with the 'id' param in my app.js, and then do app.use('/', anotherRouter), the req.foundArticle that I attached in app.js is NOT passed along to any routes in anotherRouter.js. So you need to do anotherRouter.param in this case!!!! Very important!

//All param callbacks will be called before any handler of any route in which the param occurs, and they will each be called only once in a request-response cycle, even if the parameter is matched in multiple routes.

app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value);
  next();
});
//when you work with multiple params for app.param, the callback to app.param is called ONCE with each param. 

// On GET /user/42/3, the following is printed:

// CALLED ONLY ONCE with 42
// CALLED ONLY ONCE with 3

// OTHER RANDOM SEQUELIZE AND EXPRESS STUFF!

// - db instances are created w 
	var db = new Sequelize(/*connection string*/)
// - model creation: 
	db.define('Modename', {schemafields : {attribtype, validations /*allowNull etc*/, defaultValues}}, {getterMethods: {virtual1: function() {}}, setterMethods: {}, hooks: {beforeUpdate: function (instance, options) {}}, classmethods: {transmogrifyContent: function(newContent) {return this.getDataValue('content') = newContent;}}, instanceMethods: {}, })
// - this value in options: 
// 	- the instance -> getters, instance methods 
// 	- the model -> model hooks (instances are first arg of func), instance hooks (instance is first arg of hook func) 
// 	- class -> class methods 

//associating models: 
//foreign key is set on the: 
A.hasOne(B)
A.belongsTo(B)
// methods on the: 

// - app.use: applies to routes that are /specifiedroute/.+
// - app.all is limited to routes that match exactly
// - app.get
// - app.post
// - app.put
// - app.delete 
// - req.param (URI match), req.query (?value=), req.body (body-parser does this) 
// - models in an express app: import models in routes where they are needed: model.create, instance.destroy, etc. 
// - more complex queries: $in, $ne, other operators (cf Sequelize notes) 
// -  eager loading (include syntax) to do joins -> 
