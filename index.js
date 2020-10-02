const express = require("express");
var validator = require('validator');
const fs = require('fs')
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
let usersCounter = 0
let usersData = {}
app.set("view engine", "ejs")
app.use("/public", express.static("public"))
app.listen(8080)
let log = false;
// fs.truncate('./auth/auth.json', 0, function () { console.log('data is cleaned') })

app.get("/", (req, res) => {
    res.render("login")
})

app.get("/authFailed", (req, res) => {
    res.render("errorPages/authFailed")
})
app.get("/registration", (req, res) => {
    res.render("register")
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', urlencodedParser, (req, res) => {
    const user = { ...req.body }
    if(validator.isEmail(user.email)){
    usersData[`user_${++usersCounter}`] = user
    let idGenereator = Date.now() + ''
    let gen = req.body.lastname
    user.id = "";
    for (let i = 0; i < idGenereator.length; i++) {
        gen[i] === undefined ? user.id += idGenereator[i] : user.id += idGenereator[i] + gen[i]
    }
    fs.writeFile('./auth/auth.json', JSON.stringify(usersData), 'utf8', () => {
        console.log(user);
    });
    res.render('login')
}else{
    res.render("errorPages/authFailed",{err : "Registration failed"})
}
})
app.post("/", urlencodedParser, (req, res) => {
    const auth = fs.readFileSync('./auth/auth.json', { "Context-Type": "application/json; charset=utf-8" }, (err) => {
        console.error(err)
    })
    const jsonAuth = JSON.parse(auth)
    const sendedInfo = req.body

    for (let i in jsonAuth) {
        const user = jsonAuth[i]
        if (user.email.toLowerCase() === sendedInfo.email.toLowerCase() && user.password === sendedInfo.password) {
            log = true;
            if (log) res.render('index', { data: user, logged: log })
            return;
        }
    }
    res.render("errorPages/authFailed", {err : "Auth failed"})
})