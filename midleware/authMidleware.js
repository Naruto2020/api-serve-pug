const jwt = require("jsonwebtoken");
const app = require('../app');
const path = require('path');
const Users = path.join(__dirname, '/users.json');

module.exports = (req, res, next) => {
    let authenticated = false;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.render('home');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.render('home');
        authenticated = true;
        req.user = user
        next()
    })
};