const fs = require("fs")
const bc = require("bcrypt")
const express = require("express")
const cookieParser = require('cookie-parser')
const uuid = require('uuid')

const app = express()

const PORT = 8080
var users = [];
const sessions = {};
const sessionTTL = 300 //sekunder

app.use(cookieParser())
app.use(express.static("./root"))
app.use(express.urlencoded({ extended: true }))

class Session {
    constructor(user, expiresAt){
        this.user = user 
        this.expiresAt = expiresAt
    }

    isExpired(){
        return this.expiresAt < (new Date())
    }
}

function updateUList(){
    if(fs.existsSync("./credentials.json")){
        fs.readFile("./credentials.json", 'utf-8', function(err, data){
            if(err) throw new Error("File could not be read" + err.message)
            if(data.length > 0){
                users = JSON.parse(data.toString())
            }
            else{
                users = []
            }
        })
    }
    else{
        users = [] 
    }
}
updateUList()


function uExists(reference){
    return users.some((user) => user.uName.toLowerCase() === reference.toLowerCase()) || users.some((user) => user.mail.toLowerCase() === reference.toLowerCase())
}

function findU(reference){
    return users.findIndex((user) => user.uName.toLowerCase() === reference.toLowerCase() || user.mail.toLowerCase() === reference.toLowerCase())
}

app.get("/logout", function(req, res) {
    if(!req.cookies){
        res.statusStatus(401).end()
        return
    }

    const token = req.cookies["session-token"]
    if(!token){
        res.sendStatus(401).end()
        return
    }

    delete sessions[token]

    res.clearCookie("session-token")
    res.end()
})

app.get("/welback", function(req, res) {
    //failsafes if site is trying to send data without cookies or with invalid cookies
    console.log("checking if cookie exists");
    console.log(req.cookies);
    console.log(sessions);
    if(!req.cookies){
        res.json({
        status: 401,
        message: "No cookies for me? No login for you!😤"
        }).end()
        return
    }

    const token = req.cookies['session-token']
    if(!token){
        res.json({
            status: 401,
            message: "No token provided"
        }).end()
        return
    }

    const userSession = sessions[token]
    if(userSession == undefined || userSession == null){
        res.clearCookie("session-token")
        res.json({
            status: 401,
            message: "userSession could not be found"
        })
        return  
    }
    else if(userSession.isExpired()){
        console.log("removing token from session and cookies");
        delete sessions[token]
        res.clearCookie("session-token")
        res.json({
            status: 401, 
            message: "token expired"
        })
        return
    }
    else{
        //refresh the token for relogged user
        let newToken = uuid.v4()
        console.log(newToken)
        const now = new Date()
        const expiresAt = new Date(+now + sessionTTL * 1000)
        const session = new Session(userSession.user, expiresAt)

        sessions[newToken] = session
        console.log(sessions);
        delete sessions[token]
        console.log(sessions);

        res.cookie("session-token", newToken, {expires: expiresAt})
        res.json({
            status: 200,
            message: `Welcome back ${userSession.user.ID}`
        })
    }
    res.end()
})



app.post("/login", function(req, res) {
    updateUList();

    const {uRef, password } = req.body;
    console.log("finding user:", uRef);
    const userIndex = findU(uRef.toLowerCase())

    if (userIndex !== -1) {
        console.log("user found");
        const user = users[userIndex];
        console.log("checking password");
        bc.compare(password, user.hash, function(err, result) {
            if (err) {
                throw new Error("Error comparing passwords");
            }
            if (result) {

                const sessionToken = uuid.v4()
                const now = new Date()
                const expiresAt = new Date(+now + sessionTTL * 1000)

                const session = new Session(user, expiresAt)

                sessions[sessionToken] = session

                res.cookie("session-token", sessionToken, {expires: expiresAt})
                console.log("token added user authenticated");
                res.json({
                    status : 200,
                    message : "User authenticated"
                }).end()
                return
            } else {
                console.log("user not authenticated");
                res.json({
                    status : 401, 
                    message : "User unauthorized"
                }).end()
                return
            }
        })
    } else {
        console.log("user not found?");
        res.json({
            status : 400,
            message : "User not found"
        }).end()
        return
    }
});


app.post("/signup", function(req, res){
    updateUList()
    console.log("server was contacted")
    const {uName, name, mail, password} = req.body

    console.log(uName);
    /*Failsafe if webclient fails or if req manipulation*/
    if (!uName?.match(/^\w+$/)){
        res.json({
            status : 400,
            message : "Invalid uName"
        }).end()
        return
    }
    else if (uExists(uName) == true){
        res.json({
            status: 400,
            message: "uName is already taken"
        }).end()
        return
    }

    if(!mail?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
        res.json({
            status : 400,
            message : "Invalid email address"
        }).end()
        return
    }
    else if(uExists(mail)){
        console.log("sending data back: mail is already taken");
        res.json({
            status : 400,
            message : "Mail is already taken"
        }).end()
        return
    }


    if(name?.lenght <= 1){
        res.json({
            status: 400,
            message: "Name is too short"
        }).end()
        return
    }

    if(!password?.match(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)){
        res.json({
            status : 400,
            message : 'Invalid password'
        }).end()
        return
    }
    else if (password?.match(/(--.*)|(((\/\*)+?[\w\W]+?(\*\/)+))/)){
        res.json({
            status : 403,
            message : "Invalid password attempt"
        }).end()
        return
    }


    const user = {
        uName: uName.toLowerCase(),
        name: name,
        mail: mail.toLowerCase(), 
        hash: undefined,
        salt: undefined,
    }
    console.log("user variable has been created " + user);

    bc.genSalt(10, (err, salt) => {
        if(err){
            throw new Error("error no salt exists in the water")
        }
        bc.hash(password, salt, (err, hash) => {
            if(err){
                throw new Error("error creating password hash")
            }
            else{
                user.salt = salt
                user.hash = hash
                console.log("user hash and salt has been created");

                console.log(!uExists(user.uName));
                
                //read and update the users from the database to make sure they exist
                updateUList()
                //create user in file
                if(!uExists(user.uName)){
                    users.push(user)
                    console.log(user)
                    console.log(users)
            
                    if(fs.existsSync("./credentials.json")){
                        fs.writeFile("./credentials.json", JSON.stringify(users), (writeErr) =>  {
                            if(writeErr){
                                throw new Error("error occured while writing credentials to file")
                            }
                            console.log("responding 200");
                            res.sendStatus(200).end()
                        })
                    }
                }
            }
        })
    })
})

app.listen(PORT, () => {
    console.log("listening on port " + PORT)
}) 