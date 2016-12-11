// AUTHENTICATION & PASSPORT 


//==== Reading notes

//==== Lecture notes
	// AAA: part of web security. 
	// 	authentication- logging in and signing out. verify the user is who they say they are.
	// 	authorization- once we know who the user is, allow them certain privileges. 
	// 	accounting- tracks the rsrcs that any given user is using. 

	//eg login/signup implementation: 
		//create a pswd -> sent over HTTP to backend, which stores it in a db and later, user sends pw again; backend compares what user sends w the stored pw value. 

		//this setup can't do: 2FA, change pw, distinguish role of user, STAY LOGGED IN
			//--> staying logged in: how do we store some info about each client/server rltnship ('session')? 
				//USE A COOKIE!

				// other, worse ideas- 1) script variables on the server (but could die w server crash)/frontend script vars (but dont persist after refresh) 2) database docs (but we would have to use db queries a lot more, as login creds would have to be sent w EVERY req) 

	//COOKIES

		// a small text file/bit of data stored on the client's computer, sent w reqs to server. in header of req (not in body)

		// http w/o cookies: client <-> 'the Internet' <-> server (classic req-res cycle)

		//http w/ cookies: client makes req to server.  server sees no cokie attached to it, adds to resp, cookie is communicated to client via resp, and client holds on to cookie and sends it along w every subsequent req. 

		//cookies allow us to persist info about the client's session- no need to auth for every req. browsers have a cookie store- chrome has a sqlite store. servers will also persist info about clients- that is called a session. 

		//clients have cookies; servers have sessions. 

	//SESSIONS

		//client makes req, server sees req and makes a session for that partic client. that is just an obj with a key value set aside for a partic client. eg. sessions[id] = []; server sends back cookie to client. client makes reqs with that cookie, and cookie contains client's unique id, which is used to by the server to look up the user's session and then do stuff to make an appropriate resp. 'server storage' here is referenced in a general way - server loads req-specific sessions stored in RAM (not in db). 
	//single-user example: 
		//a client's browser's cookie store stores cookies for a variety of sites. 

		//server-side: v8 session store (bc we use JS in node), and express (logging middleware, session middleware (helps communicate w session store), routing middleware, etc.) session middleware can specify how long you want session to persist, etc. 

		//user makes get req to homepg. user has no cookies - their req doesn't have cookie info yet. req goes to server and travels down the middleware chain. when it hits the session middleware, the mdw checks the req, notices there are no cookies on it, and makes a session for the user w a unique id in the session store (can store lots of other things, incl language prefs and whatever else app wants to store), and the middleware adds that user's info to the exprs req obj as req.session, and sends back response w a 'set-cookie' in res header - res passes through rest of routes and is sent back w headers to client. the regular res is also served, but when it reaches the client the client's browser also stores the cookie in the v8 store. then the client sends another req- travels to server- when it gets to session mdw, the mdw uses id on cookie to look up client's session, then the other stuff happens again. 

	//multiple sessions example: 
		//server session store has multiple sessions in its session store. first client makes req, since they have a cookie w id, the session mdw on server side can load in info w the res obj. this happens for each client based on their unique id. 

	//cookies are a protocol now- in the early days, browsers had diff specs for cookies, but it has since been unified and that's why cookies are always in the headers. 

//OAUTH : open authorization.	
	//Oauth- std protocol for auth piggybacking. allows a user to log into a website using creds for another website- eg using google id or fb id to log in. 

	//your app- 'consumer' (which uses third-party auth creds)
	//user- 'user'
	//3rd-party authority whose login is used - 'provider'

	//PREP- 
		//consumer app has to have a registered dev acct w the provider
		//provider gives consumer a public client ID + a private client secret. 
		//both services hold onto these creds so the consumer can prove who it is to the provider. 

	//PETITION - 12 steps! (not exhaustive below)
		//- user makes some req to load login 
		//response will be whatever app's login page looks like when rendered. 
		//user makes req to log in w a partic provider
		//res redirects user to provider
		//user logs in to provider - req 
		//res- redirect callback url, back to 'success' url that consumer handles
		//consumer reqs authorization
		//consumer sends access token- 
		//res is served

	//PASSPORT 
		//assuming you set stuff up right, allows a client to log in w a certain provider (eg GET /auth/fb), and now in routes you have req.user to check user info. 
		//ingredients: 
			//passport.session() middleware (on top of express-session() mdw), 

			//define how to minimally store + look up user during session- passport.serializeUser / .deserializeUser (to get info in and out of how you store it and attach the info to req obj) 

			//configure a strategy- diff providers have diff verification strategies - strategy needs a verification callback 

			//passport.authenticate (in 2 diff routes)- takes user to route, and handles callback from provider. 

	//sometimes, you want session store to be in db; sometimes it is just in the server memory. 

	//to write: 
		//express- routes for GET api/auth/fb (req) 
			// --> res: (passport.authenticate) using fb strategy
		//GET api/auth/fb/confirm (req)
			// --> res: passport.authenticate - fb strategy w success/failure redirect URLs
		//any route after passport.session() (cf later)
	//to set up: 

		//passport.session(), configure passport strategy, verification callback(token, profile, done), --> f/c user via profile, give user to done

		// passport.serializeUser(user, done) => convert user to string id, giev id to done, 

		// passport.deserializeUser(id, done) => user id fetched from session store, id used to retrieve user from db, and user info will be attached to any subseq reqs w deserialize user - sets req.user. 

			//any route after passport.session() - can use req. user while session persists. 

//=====WORKSHOP NOTES 

	//description: create an application that supports login/signup through a provided email and password, or through a third party (i.e. "login with Google"). You will also limit the actions available in the browser based on the type of user: there will be guests (unauthenticated visitors), normal users, and super users—admins who can change perhaps anything.

	// local vs foreign authentication: 
		//local authentication: authenticating a logged-inuser w a username or email + pw unique to that app. 
		//vs foreign strategies (provider strategies) taht come from 3rd-party apps like fb and twitter 
			//so a user can decide to set up an acct directly w a username and pw, or indirectly through some other web app they trust. 
//Validators and allowNull

	// If a particular field of a model is set to allow null (with  allowNull: true) and that value has been set to null , its validators do not run. This means you can, for instance, have a string field which validates its length to be at least 5 characters, but which also allowsnull.

	//servers have no inherent understanding of 'users'
	//http normally is 'stateless' -- cookies circumvent this. 

	//all session-related middleware should come before any kind of routing - it attaches a req.session obj to any req so any routes after that can use that. nothign we add to req.session is ever sent back to the client; but some metadata about the cookie is visible in req.session.cookie 

//Global variables are the variables which remain common for the whole application… Their value can be used across the whole application whereas Session variables are variables which remain common for the whole application but for one particular user. They also can be used across the whole application… But they die when a particular user session ends. - session vars are discrete for the IP 

//converting circular data to json problem- means you can't have sth w the same exact key and value- JSON.stringify can't convert structures like: 
var a = {};
a.b = a;


// Now let's use curl to make requests to the server. Since we'll be using cookies, make an empty text file to store the cookies (e.g. $ touch cookiesFile.txt). It doesn't matter where you put this file, it only matters you can find it when you run curl. The cURL command comes with some (extremely primitive) cookie functionality which you can use as follows:

// command	behavior
// curl someURI --cookie aCookieFile	==> uses aCookeFile to set cookies on the request
// curl someURI --cookie-jar aCookieFile	==> replaces the contents of aCookieFile with the cookie info in the response

//in 2 diff terminals - server and client
//in 1- start server in server term.
//A) in client: curl http://localhost:8080/ --cookie cookiesFile.txt -> server term will log out the current session data. session obj will be empty except for info about cookie sent back to client.

//B) in client: curl http://localhost:8080/login -X POST -d '{"email": "zeke@zeke.zeke", "password": "123"}' --cookie-jar cookiesFile.txt -> server will log stuff out again. and we should get a successful response in clientTerm bc we've submitted correct creds. 

//C) in client: curl http://localhost:8080/ --cookie cookiesFile.txt -> user's info - userid will be on the cookie- will appear in serverterminal logs - if you delete cookie file, no user info will be logged anymore. 

//D) curl http://localhost:8080/login -X POST -d '{"email": "doesnotexist@email.com", "password": "abcdefg"}' --cookie-jar cookiesFile.txt -> fails to persist data to session, fail status on server.

//E) curl http://localhost:8080/ --cookie cookiesFile.txt -> now, serverterm won't log any info bc there is no user associated w that cookie file. 

//expire time for cookies 

var hour = 3600000
req.session.cookie.expires = new Date(Date.now() + hour)
req.session.cookie.maxAge = hour

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Specifies the Date object to be the value for the Expires Set-Cookie attribute. By default, no expiration is set, and mostoooiiji clients will consider this a "non-persistent cookie" and will delete it on a condition like exiting a web browser application. Note: The expires option should not be set directly; instead only use the maxAge option.

//return obj literals in ES6 with parentheses to avoid parsing errors 

//initial state in reducer can just be one thing- don't need to make a variable for it before 

//joe: never mutate state- don't overwrite states bc you may want to go back to other states 
//in reducer: 
newState = Object.assign({}, newState, {currentUser: action.currentUser})

//mount login, logout, signup on '/auth' router 
//logging in: attach user id to req.session. associated w user - express-session sets the cookie and persists the session for the user. 
//LOGGING OUT: 1) dissociate user id from req.session- 
	/*A)*/ req.session.userId = null;
	/*B)*/ req.session.destroy(), //destroys the entire session
	/*C)*/ delete req.session.userId; //that userId is no longer associated w session --> won't be associated w that client anymore. 

// from Emily: 
// * Your auth routes (login, signup, etc.) are not supposed to use the `api/users/` router at all.
// * The post route there is for a hypothetical admin user who can make new users through an admin panel or similar.
// * There's no security preventing unauthorized users from hitting those routes currently, because this app is made deliberately in a very not-secure fashion (for use in our now-deprecated security workshop).
// * You should be making a _new route_ for login / signup and similar authentication actions.
// * This is also why our app doesn’t use `body-parser`, and instead has its own (insecure) body parser - for us to exploit in a later, now defunct web security workshop.

	//on frontend: send currentUser to null.

	//logout- optimistic- removes user form state before the request to logout response is actually returned. this provides a better and faster experience for the user. 

//single auth component rendered w either login or signup (both are creted w connect at the bottom of auth component) - and logout dispatches logout method 

//dispatch takes action created by action creator and passes it to reducer (normally)
//thunk middleware: no need to have every dispatch have a case in the action creator, but the action it eventually dispatches should.

//why is it bad to make a post req to /api/users for signup? --> you may want to protect that route and only allow certain authorized users/routes to access that. you may want to use middleware to restrict access in this way. not good to have unprotected routes 

//Passport! 
	//npm i -S passport passport-google-auth
	//for each provider, you have to configure a strategy w passport

	//doing passport config: 
	//touch index.js, google.oauth.js in /server/auth folder - router. 
	//google.oauth.js: 
	var router = require('express').Router();
	var passport = require('passport');
	var GoogleStrategy = require('passport-google-auth'), OAuth2Strategy; //strategy constructor
	//oauth 2 vs oauth strategies are diff't - cf Passport docs 
	var User = require('../api/users/user.model');

	//add passport middleware and construct new strategy: takes in 2 args- an obj w important info, and a callback fn 
	passport.use(new GoogleStrategy({
		clientID: '', //API client ID
		clientSecret: '',
		callbackURL: '/auth/google/callback/' //when a user signs in successfully, this url redirects them to our app. you have to authorize this w the google OAuth client through google. 
	}, function(token, refreshToken, profile, done) { //runs upon success from google 
		var info { //collect info from google profile of user upon successful auth
			name: profile.displayName,
			email: profile.emails[0].value //email prop is an array w multiple vals - log this out upon initial testing to see what vals to access
			photo: profile.photos ? profile.photos[0].value : undefined 
		};

		User.findOrCreate({
			where: {
				googleId: profile.id //add this column to User model - you may want to resync db after that + possibly force: true 
			},
			defaults: info 
			} 
		})
		.spread(function(user){ //brings back an array of vals
			done(null, user); //not the 'done' from mocha! here, done serializes our user + adds their info to a session store - we have to define how to serialize user, so we can get info out later. it is also an error-first callback fn, so first arg should be null. 
		})
		.catch(done); 
	}));

	//frontend has a button wired up to make a req to /auth/google: 

	router.get('/auth/google', passport.authenticate('google', {scope: 'email'})); //takes name of provider as a string + second options obj specifies how much info about user you can see after they've logged in w google. 

	//user gets here when they click the button to go to google for auth. eventually, they are redirected. 

	//mount onto /google in auth routes, whole route is '/auth/google' --> two routes nested 

	//in /auth/index.js:

	router.use('/google', require('./google.oauth')); //passport setup code is meaty + can be a pain to test 

	//when user is redirected: 

	router.get('/callback', passport.authenticate('google', {
		successRedirect: '/stories',
		failureRedirect: '/' //if login is unsuccessful 
	}));


	module.exports = router;

//in index.js for the whole app: 
	var passport = require('passport');

	//after express-session's app.use(session): 
	app.use(passport.initialize()); //this provides us w handy login methods- so we can do req.login or req.logout and pass in params - can work both locally and with oauth, so we don't have to write our own login and logout routes!


	app.use(passport.session()); //piggybacks off of express-session 
	//dfine how to serialize user, and has its own done fn

	passport.serializeUser(function(user, done) { //runs once when user logs in- we find user info in db, pass user row to done fn, done passes user here, where we want to store the user id and associate it w that user's session. 

		done(null, user.id); 
	});

	//after the initial serialization, when the user makes subsequent reqs, we have to deserialize the user- take info associated w them on the session, and get user's info based on that id. 
	passport.deserializeUser(function(id, done) {
		//whatever we pass to done, it will be passed to our req obj as req.user and all our routes after that can access that. 
		User.findById(id)
		.then(function(user) {
			done(null, user); //now req.user on all subseq routes will have the entire user row 
		})
		.catch(done);
	});
	//deserializeUser runs every time a user makes a subsequent request. This over-querying of the db is not ideal, but we will come back to this later. 

//refactoring login and logout routes: in auth/index.js: 

router.post('/login', function(req, res, next) {

	User.findOne({
		where: req.body
	})
	.then(function(user) {
		if (!user) {
			res.sendStatus(401);
		} else {
			req.login(user, function(err) { //req.login takes a user and an error-first cb
				if(err) next(err);
				else res.json(user);
			});
		}
	})
});

router.post('/signup', function(req, res, next) {
	User.findOrCreate({
		where: {
			email: req.body.email
		},
		defaults: {
			password: req.body.password
		})
	.spread(function(user) {
		req.login(user, function(err) {
			if(err) next(err);
			else res.json(user);
			});
		})
	})
});

router.get('/logout', function(req, res, next) {
	req.logout(); //we use passport's login and logout methods to merge our local authentication system 
});

router.get('/me', function(req, res, next) {
	if (req.user) res.json(req.user)
		else res.sendStatus(401); //after logging in w oauth, have app restart + it will reinitialize users + stories and then makes req to /me for info about user. --> update local routes to use passport - previously, we used req.session for the user id. now we have it through passport. 
})

//(GENERALLY) DON'T ROLL YOUR OWN AUTHENTICATION! DON'T DO YOUR OWN BODY-PARSING MIDDLEWARE! OMG  









