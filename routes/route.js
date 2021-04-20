// load up our new route for users and pages
const userRoutes = require('./user');
const pageRoutes = require('./page');
const requireAuth = require('../midleware/authMidleware').requireAuth;
const checkAuth = require('../midleware/authMidleware').checkAuth; 

const router = (app, fs) => {
  // default route here that handles empty routes
  // at the base API url
  app.get('/', (req, res) => {
    res.send('welcome to api-server');
  });
 
  app.get("/jwtid", requireAuth, (req, res) =>{ // on récuppère les infos de l'ut connecté 
    //res.status(200).json('coockie');
    console.log("yes");
  });

  // run our user and page routes modules
  userRoutes(app, fs);
  pageRoutes(app,fs);
};

module.exports = router;