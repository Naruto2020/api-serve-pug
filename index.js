const app = require('./app');

// finally, launch our server on port 3000.
app.listen(process.env.PORT, () => {
  console.log(`listening on port : ${process.env.PORT}`);
});