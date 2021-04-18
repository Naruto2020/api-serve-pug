// load up the express framework, body-parser, and pug
const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');
require("dotenv").config({path : "./config/.env"});

// create an instance of express 
const app = express();

// load up file system helper library here use to serve our JSON files 
const fs = require('fs');

// declare pug files 
app.set("view engine", "pug");

// declare statics files 
app.use(express.static(__dirname + "/publique"));

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handle our various routes from
const routes = require('./routes/route')(app, fs);

module.exports = app;