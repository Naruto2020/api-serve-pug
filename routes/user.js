// import bcrypt to hash password 
var bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config({path : "./config/.env"});
// initialise of the duration of the token
const maxlife = 60000; // en miliseconde equivaut à 1 min
const createToken = (nom)=>{
    return jwt.sign({nom}, process.env.TOKEN_SECRET, {
        expiresIn : maxlife,

    });
}

const userRoutes = (app, fs) => {
    // variables
    const dataPath = './data/users.json';

    // refactored helper methods (factory function )
    const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = 'utf8'
    ) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
            throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = 'utf8'
    ) => {
        fs.writeFile(filePath, fileData, encoding, err => {
            if (err) {
            throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/users', (req, res) => {
        readFile(data => {
            res.send(data);
        }, true);
    });


    // CREATE
    app.post('/create', (req, res) => {
        const {nom, email, password} = req.body;
        bcrypt.hash(req.body.password, saltRounds, function (err,   hash) {
            readFile(data => {
                // this needs to be more robust for production use. 
                // e.g. use a UUID for a unique ID value.
                const newUserId = Date.now().toString();
            
                // transform a data object in to array and sub array  
                var monTableau = Object.keys(data).map(function(cle) {
                    return [Number(cle), data[cle]];
                });
                //console.log("tab : ", monTableau);
                // transform the new array data in to one unique array 
               let newTab = [];
               for(let i=0; i<monTableau.length; i++){
                   for(let j=0; j<monTableau[i].length; j++){
                    let currentE = monTableau[i][j];
                    newTab.push(currentE);
                   }
               }
               // filter data items by type and create a new array of object without id 
               let tabObj = [];
               for(let k=0; k<newTab.length; k++){
                   if(typeof newTab[k] !== "number"){
                       tabObj.push(newTab[k]);
                   }
               }
               // filter array object with email to display user if it's exist
               let myUsers = tabObj.filter(function(e){
                   return e.email === email
               });
               let user = myUsers[0];
               // check if user alredy exist 
               if(user){
                    res.render("singUp", {mess0 : "Utilisateur déjas existant avec cet email"});
               }else if(!nom && !email && !password){
                res.render("singUp", 
                    {
                        mess : "le champ nom n'est pas  remplis... ",
                        mess1 : "le champ email n'est pas  remplis... ",
                        mess2 : "le champ password n'est pas  remplis... "
                    });
               }else if(!nom || !email || !password){
                    res.render("singUp", {mess3 : "* veillez remplir tous les  champs s'il vous plait."});
               }else if(nom && email && password){
                   
                   // add the new user
                   data[newUserId] = {
                       nom: req.body.nom,
                       email:req.body.email,
                       password:hash
                   };
                   res.render("singUp", {
                        mess4 : "Bravo votre compte a été créer avec sucsses ! cliquez sur SingIn pour vous connecter ."
                   });
                   console.log(data[newUserId]);
               
                   writeFile(JSON.stringify(data, null, 2), () => {
                       //res.status(200).send('new user added');
                   });
               }

            }, true);

        });

    });

    // SING IN 
    app.post('/login', (req, res) => {
        const {email, password} = req.body;
        readFile(data => {

            var monTableau = Object.keys(data).map(function(cle) {
                return [Number(cle), data[cle]];
            });
            //console.log("tab : ", monTableau);
           let newTab = [];
           for(let i=0; i<monTableau.length; i++){
               for(let j=0; j<monTableau[i].length; j++){
                let currentE = monTableau[i][j];
                newTab.push(currentE);
               }
           }
           let tabObj = [];
           for(let k=0; k<newTab.length; k++){
               if(typeof newTab[k] !== "number"){
                   tabObj.push(newTab[k]);
               }
           }
           let myUsers = tabObj.filter(function(e){
               return e.email === email
           });
           let user = myUsers[0];
           let authenticated;

           if(!email && !password){
                res.render("singIn", 
                {
                    mess1 : "le champ email n'est pas  remplis... ",
                    mess2 : "le champ password n'est pas  remplis... "
                });
           }else if(!email || !password){
                res.render("singIn", {mess3 : "* veillez remplir tous les  champs s'il vous plait. "});
           }

           // check if user exist with those email and password 
           if(!user){
               console.log("inexistant")
               res.render("singIn", {mess4 : "email inexistant !"});
           }else{
            // check if is correct password    
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result == true){

                    const token = createToken(user.nom);
                    console.log("tok :",token);
                    res.cookie('jwt', token, {httpOnly: true, sameSite:true, maxlife});
                    //res.status(200).json({ user: user.nom});
                    console.log("connecter")
                    if(token)
                    authenticated = true;
                    res.render("home", {authenticated:authenticated, utilisateur : user.nom});
                    
                }else{
                    console.log("mot de passe incorrecte!")
                    res.render("singIn", {mess5 : "mot de passe incorect!"});
                }
            });
           }                

        }, true);
    });


    // UPDATE
    app.put('/users/:id', (req, res) => {
        readFile(data => {
            // add the new user
            const userId = req.params['id'];
            data[userId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${userId} updated`);
            });
        }, true);
    });

    // DELETE
    app.delete('/users/:id', (req, res) => {
        readFile(data => {
            // add the new user
            const userId = req.params['id'];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${userId} removed`);
            });
        }, true);
    });

};

module.exports = userRoutes;