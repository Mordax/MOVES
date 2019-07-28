#MO:VES backend

This project serves as the backend for the MO:VES project for the DPS945 Spring 2019 for ICVA client.

This backend is currently deployed on [Heroku](https://moves-backend-a.herokuapp.com)

The main schemas we will be working with are 

* `user-account`
* `content`
* `personnel` (the employee directory)
* `announcement` (alerts)

File structure (important files):

<pre>
├── routes
│   ├── announcement.js  // handles all <b>announcement</b> related routes
│   ├── content.js  	 // handles all <b>content</b> related routes
│   ├── personnel.js 	 // handles all <b>personnel</b> related routes
│   └── user-account.js  // handles all <b>user-account</b> related routes
├── schemas
│   ├── emergency-contact.js // TBD
│   ├── mdl-announcement.js	 // contains the <b>announcement</b> schema
│   ├── mdl-personnel.js   	 // contains the <b>personnel</b> schema
│   ├── mdl-user-account.js	 // contains the <b>user-account</b> schema
│   ├── media-content.js
│   ├── profile.js
│   └── text-content.js		 // contains the <b>content</b> schema
├── server.js		// handles server startup
├── services
│   ├── db-manager.js			// Starts and prepare the MongoDB connection
│   ├── msc-announcement.js  	// database manager for <b>announcement</b> routes
│   ├── msc-content.js			// database manager for <b>content</b> routes
│   ├── msc-personnel.js		// database manager for <b>personnel</b> routes
│   ├── msc-user-account.js		// database manager for <b>user-account</b> routes
│   └── <b>passport-service.js</b>		// provide various <b>guard</b> middlewares for authentaication, claim check
├── <b>util.js</b>		// stores all pre-defined constants such as route names & information, secrets, claims, various helper functions
└── views
    └── usage.html		// usage information for client side

</pre>

It is suggested all constant values are saved in `util.js`, and all validation logic stored in `passport-service.js` as middlewares. But the claim validation logic may need to be hardcoded into each routes depends on the business logic

`passport-service.js`

* `auth_guard` - middleware used for authorization check
* `protective_guard` - middleware used for routes that maybe accessible by both registered users and non-registered users
* `claim_guard` - middleware to do claim check, the claims(or roles) are to be defined in `utils.js - FULL_PATHS` for each route