// load up our new route for users and pages
const userRoutes = require('./user');
const pageRoutes = require('./page');

const router = (app, fs) => {
  // default route here that handles empty routes
  // at the base API url
  app.get('/', (req, res) => {
    res.send('welcome to api-server');
  });
 

  // run our user and page routes modules
  userRoutes(app, fs);
  pageRoutes(app,fs);
};

module.exports = router;