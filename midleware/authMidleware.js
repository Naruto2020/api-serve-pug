const jwt = require("jsonwebtoken");
const app = require('../app');
const path = require('path');
const Users = path.join(__dirname, '/users.json');

module.exports.checkAuth = (req, res, next) => {
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

// information sur l'utilisateur connecté 
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    let authenticated=false;
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) =>{
            if(err){
                console.log(err);
            }else{
                authenticated = true;
                res.status(200).json(decodedToken);
                console.log("current username : ",decodedToken.nom);
                next();
            }
        });
    }else{
        console.log("token absent ...");
    }
}