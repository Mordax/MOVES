/**
 * valid ROLES and CLAIMS
 */
const ROLES = {
    VOLUNTEER: 'volunteer',
    LEADER: 'leader',
    COORDINATOR: 'coordinator',
    ONSITE_MANAGER: 'onsite-manager',
    ADMIN: 'admin',
    DEVLEAD: 'DevLead',
}

const CLAIMS = {
    TYPES: {
        OU: 'OU',
        TASKS: 'Tasks',
    },
    OU: {
        Volunteer: 'Volunteer',
        Marketing: 'Marketing',
        DevLead: 'DevLead',
    },
    TASKS: {
        UserAccountReadAll: 'UserAccountReadAll',
        UserAccountWrite: 'UserAccountWrite',

        ContentWrite: 'ContentWrite',

        UserProfileReadAll: 'UserProfileReadAll',
        UserProfileWrite: 'UserProfileWrite',

        AnnouncementWrite: 'AnnouncementWrite',

        LocaleInfoView: 'LocaleInfoView',
        MessageSend: 'MessageSend',
    }
}

/**
 * Use only claims as access control
 * Roles are not intended for access control
 * 
 * List only the routes that need to be guarded by claims
 */
const FULL_PATHS = {
    // MATCH with req.baseUrl + req.route.path
    '/api/useraccounts/allusers': {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.UserAccountReadAll }
        ]
    },
    
    '/api/useraccounts/addclaims': {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.UserAccountWrite }
        ],
    },

    '/api/useraccounts/resetclaims': {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.UserAccountWrite }
        ]
    },

    '/api/content/add' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.ContentWrite }
        ]
    },

    '/api/content/edit/:id' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.ContentWrite }
        ]
    },

    '/api/content/delete/:id' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.ContentWrite }
        ]
    },

    '/api/personnel/add' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.UserProfileWrite }
        ]
    },

    '/api/personnel/edit/:id' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.UserProfileWrite }
        ]
    },

    '/api/personnel/delete/:id' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.UserProfileWrite }
        ]
    },

    '/api/announcement/add' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.AnnouncementWrite }
        ]
    },

    '/api/announcement/edit/:id' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.AnnouncementWrite }
        ]
    },

    '/api/announcement/delete/:id' : {
        CLAIMS: [
            { type: CLAIMS.TYPES.TASKS, value: CLAIMS.TASKS.AnnouncementWrite }
        ]
    },
}

/**
 * Database connection constants
 */
const CONNECTION_STRING = "mongodb+srv://userOne:sbbbi7xM5lO9QpOt@cluster0-8qsal.azure.mongodb.net/MOVES?retryWrites=true&w=majority";
const CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // autoIndex: false,                    // Don't build indexes
    // reconnectTries: Number.MAX_VALUE,    // Never stop trying to reconnect
    // reconnectInterval: 500,              // Reconnect every 500ms
    // poolSize: 10,                        // Maintain up to 10 socket connections
    //                                      // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    // connectTimeoutMS: 10000,             // Give up initial connection after 10 seconds
    // socketTimeoutMS: 45000,              // Close sockets after 45 seconds of inactivity
    // family: 4                            // Use IPv4, skip trying IPv6
};

// "DPS945, the MO:VES project secret"
const JWTSECRET = "RFBTOTQ1LCB0aGUgTU86VkVTIHByb2plY3Qgc2VjcmV0";
const JWTISSUER = "groupA.dps945.com";
const JWTEXPIRY = 60 * 15;  // in seconds

/**
 * ROUTES for easy access and consistency
 * get by filter routes are currently using a base64 encoding of a stringified JSON objects
 * subject to change
 * 
 * The reason for redundant naming for add/edit routes is to guarantee the full route names
 * are unique, so the full route name can be used as a key for easier retrival
 * when putting into a dictionary prepared for claim check
 * 
 * Also the route names are more readable, instead of the same route has different uses
 * when combined with different http request methods.
 * E.g. /api/content/:id  will be used for "get one", "edit", "remove" when combined with
 * get, put, delete
 */
const ROUTES = {
    USER_ACCOUNT: {
        NAME: 'useraccounts',
        BASE_ROUTE: '/api/useraccounts',
        PATH: {
            ALL_USERS: '/allusers',
            LOGIN: '/login',
            CREATE: '/create',
            ACTIVATE: '/activate',
            PASSWORD_CHANGE: '/passwordchange',
            ADD_CLAIMS: '/addclaims',
            RESET_CLAIMS: '/resetclaims',
        }
    },
    
    CONTENT: {
        NAME: 'content',
        BASE_ROUTE: '/api/content',
        PATH: {
            GET_ALL: '/',
            GET_BY_FILTER: '/filter/:serializedQuery',
            GET_ONE: '/:id',
            ADD: '/add',
            EDIT: '/edit/:id', 
            DELETE: '/delete/:id', 
        }
    },

    PERSONNEL: {
        NAME: 'personnel',
        BASE_ROUTE: '/api/personnel',
        PATH: {
            GET_ALL: '/',
            GET_BY_FILTER: '/filter/:serializedQuery',
            GET_ONE: '/:id',
            ADD: '/add',
            EDIT: '/edit/:id',
            DEACTIVATE: '/deactivate/:id',
        }
    },

    ANNOUNCEMENT: {
        NAME: 'announcement',
        BASE_ROUTE: '/api/announcement',
        PATH: {
            GET_ACTIVE: '/active',
            GET_BY_FILTER: '/filter/:serializedQuery',
            GET_ONE: '/:id',
            ADD: '/add',
            EDIT: '/edit/:id',
            DELETE: '/delete/:id', 
        }
    },
}

/**
 * 
 * @param {array of objects} incomingData
 * @param {string} path 
 * 
 * Provided by Peter to generate hypermedia representation
 * Package result of all get requests
 */
function package(incomingData, path) {

    // IMPORTANT - This is used for data stored in MongoDB
    // Its identifier property is "_id" (which is different from "id" or "ID" etc.)
  
    // Package is an object with these key-value pairs:
    // timestamp  string                 Current date-and-time, as an ISO 8601 string
    // version    string                 Version number identifier (for future use)
    // links      array of link objects  Package-level controls
    // count      number                 Item count being returned
    // data       array of item(s)       Data items, each one includes a "links" collection
  
    // Common tasks:
    // Add package metadata
  
    let now = new Date();
    let pkg = {
      timestamp: now.toISOString(),
      version: '1.0.0',
    };
  
    // Determine if the incoming data is an object or an array
    const isItem = (incomingData.length == undefined);
  
    // Make a local copy of the incoming data
    // Must do this to break the Mongoose schema prototype dependency
    let data = JSON.parse(JSON.stringify(incomingData));
  
    if (isItem) {
  
      // Item tasks:
      // Package links will have self and collection
      // Item links will have self and collection
      // Incoming data is put into an array and added to the package
  
      pkg.links = [{ href: `${path}/${data._id}`, rel: 'self' }, { href: path, rel: 'collection' }];
      pkg.count = 1;
      data.links = [{ href: `${path}/${data._id}`, rel: 'self' }, { href: path, rel: 'collection' }];
      pkg.data = [data];
  
    } else {
  
      // Collection tasks:
      // Package links will have self only
      // Item links will have self for each item, generated 
  
      pkg.links = [{ href: path, rel: 'self' }];
      pkg.count = data.length;
  
      // For each syntax
      /*
      data.forEach(e => {
        e.links = [{ href: `${path}/${e.id}`, rel: 'self' }, { href: path, rel: 'collection' }];
      });
      pkg.data = data;
      */
  
      // Map and spread syntax
      pkg.data = data.map(e => ({ ...e, links: [{ href: `${path}/${e._id}`, rel: 'self' }, { href: path, rel: 'collection' }] }));
    }
  
    return pkg;
  }

module.exports = {
    ROLES,
    CLAIMS,
    FULL_PATHS,

    CONNECTION_STRING,
    CONNECTION_OPTIONS,
    
    JWTSECRET,
    JWTISSUER,
    JWTEXPIRY,
    
    ROUTES,
    
    package,
}