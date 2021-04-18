const jwt = require("jsonwebtoken");
require("dotenv").config({path : "./config/.env"});

// initialise of the duration of the token
const maxlife = 60000; // en miliseconde equivaut à 1 min
const createToken = (nom)=>{
    return jwt.sign({nom}, process.env.TOKEN_SECRET, {
        expiresIn : maxlife,

    });
}


const pageRoutes = (app, fs) => {
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

    // display sing up page 
    app.get('/create', (req, res)=>{
        res.render('singUp');
    });

    // display singIn page
    app.get('/connect', (req, res)=>{
        res.render("singIn");
    });

    // display home page 
    app.get("/restricted", (req, res)=>{
        const {email, password} = req.body;
        readFile(data => {
            let authenticated;

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
               return e = {email, password};
           });
           let user = myUsers[0];

            // page restriction
            if(user && user.email === email && user.password === password){
                const token = createToken(user.nom);
                res.cookie('jwt', token, {httpOnly: true, sameSite:true, maxlife});
                if(token)
                  authenticated = true;
            }
            res.render("home");

        }, true);
    });

};

module.exports = pageRoutes;