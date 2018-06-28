const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("passport")

const {
  ensureAuthenticated,
  ensureGuest
} = require("../helpers/auth")

// Load Models
require("../models/User")
require("../models/Note")
require("../models/Category")
const User = mongoose.model("users")
const Note = mongoose.model("notes")
const Category = mongoose.model("categories")

router.get("/", ensureAuthenticated, (req, res) => {
Note.find({
    user: req.user._id
  })
  .populate("user")
  .populate({
    path:"topic",
    populate:{
      path:"category",
      model: Category
    }
  })
  .then(notes => {
    res.render("users/index", {Notes:notes})
  })
})


router.get("/login", ensureGuest, (req, res) => {
  res.render("users/login")
})

router.post("/login", (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: "/users",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next)
})


router.get("/register", ensureGuest, (req, res) => {
  res.render("users/register")
})

router.post("/register", (req, res) => {
  let errors = []
  if (req.body.pass != req.body.pass2) {
    errors.push({
      text: "Password do not match"
    })
  }
  if (req.body.pass.length < 6) {
    errors.push({
      text: "Password must be atleast 6 Characters"
    })
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    })
  } else {
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already Registered")
        res.redirect("/users/register")
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.pass,
        })
        bcrypt.genSalt(10, (err, salt) => {

          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => {
              req.flash("success_msg", "You are now registered and can login")
              res.redirect("/users/login")
            }).catch(err => {
              console.log(err)
              return
            })
          })
        })
      }
    })
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect("/")
})
module.exports = router