const ROLES = {
    VOLUNTEER: 'volunteer',
    LEADER: 'leader',
    COORDINATOR: 'coordinator',
    ONSITE_MANAGER: 'onsite-manager',
}

const FULL_PATHS = {
    // MATCH with req.baseUrl + req.route.path
    // User account routes
    '/api/useraccounts/passwordchange': {
        ROLES: [],
        CLAIMS: [],
    },
    
    '/api/useraccounts/addclaims': {
        ROLES: [],
        CLAIMS: [
            { type: 'Tasks', value: 'UserProfileEdit' }
        ],
    },

    // Content routes
    '/api/content': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/content/filter/:serializedQuery': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/content/:id': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/content/add': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/content/edit': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/content/deactivate': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/content/delete': {
        ROLES: [],
        CLAIMS: [],
    },
    
    // Personnel routes
    '/api/personnel': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/personnel/filter/:serializedQuery': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/personnel/:id': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/personnel/add': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/personnel/edit': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/personnel/deactivate': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/personnel/delete': {
        ROLES: [],
        CLAIMS: [],
    },

    // Announcement routes
    '/api/announcement': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/announcement/filter/:serializedQuery': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/announcement/:id': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/announcement/add': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/announcement/edit': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/announcement/deactivate': {
        ROLES: [],
        CLAIMS: [],
    },
    '/api/announcement/delete': {
        ROLES: [],
        CLAIMS: [],
    },
}

const CLAIM = {
    OU: {
        
    },
    TASKS: {
        UserProfileEdit: 'UserProfileEdit',
        LocaleInfoView: 'LocaleInfoView',
        MessageSend: 'MessageSend',
    }
}

const CONNECTION_STRING = "mongodb+srv://userOne:sbbbi7xM5lO9QpOt@cluster0-8qsal.azure.mongodb.net/MOVES?retryWrites=true&w=majority";
const CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // autoIndex: false, // Don't build indexes
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    // poolSize: 10, // Maintain up to 10 socket connections
    // // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    // family: 4 // Use IPv4, skip trying IPv6
};

// "DPS945, the MO:VES project secret"
const JWTSECRET = "RFBTOTQ1LCB0aGUgTU86VkVTIHByb2plY3Qgc2VjcmV0";

const ROUTES = {
    USER_ACCOUNT: {
        NAME: 'useraccounts',
        BASE_ROUTE: '/api/useraccounts',
        PATH: {
            LOGIN: '/login',
            CREATE: '/create',
            PASSWORD_CHANGE: '/passwordchange',
            ADD_CLAIMS: '/addclaims',
            RESET_CLAIMS: '/accountreset',
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
            EDIT: '/edit',
            DEACTIVATE: '/deactivate',  
            DELETE: '/delete', 
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
            EDIT: '/edit',
            DEACTIVATE: '/deactivate',
            DELETE: '/delete',  
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
            EDIT: '/edit',
            DEACTIVATE: '/deactivate',
            DELETE: '/delete', 
        }
    },
}

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
    CLAIM,
    CONNECTION_STRING,
    CONNECTION_OPTIONS,
    JWTSECRET,
    ROUTES,
    FULL_PATHS,
    package,
}