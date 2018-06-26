const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const path = require("path")
const passport = require("passport")
const methodOverride = require("method-override")

const app = express()


// Passport Config
require("./config/passport")(passport)

// Load Routes
const notes = require("./routes/notes")
const users = require("./routes/users")

// Connect to mongo DB
mongoose.connect('mongodb://notebuddy:Asdzxc123@ds117711.mlab.com:17711/notebuddy').then(() => {
  console.log("connected to mongo")
})
// Static folder
app.use(express.static(path.join(__dirname, "public")))

// Connect Flash Middleware
app.use(flash())

// Handlebars Middleware
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}))
app.set("view engine", "handlebars")

// body Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// Sessions Middleware
app.use(session({
  secret:"KehKeLunga",
  resave: true,
  saveUninitialized: true
}))
// Passport session middleware always after express session middleware
app.use(passport.initialize())
app.use(passport.session())

//  method override middleware
app.use(methodOverride("_method"))



// Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null
  next()
})





app.get('/', (req, res) => {
  res.render("index")
})

app.get('/about', (req, res) => {
  res.render("about")
})


app.use("/notes", notes)
app.use("/users", users)


const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})