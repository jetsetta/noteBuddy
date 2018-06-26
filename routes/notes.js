const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {
  ensureAuthenticated, ensureGuest
} = require("../helpers/auth")


// Load Models Here
require("../models/Note")
require("../models/Category")
require("../models/Topic")

const Note = mongoose.model("notes")
const Category = mongoose.model("categories")
const Topic = mongoose.model("topics")

router.get("/add",ensureAuthenticated, (req, res) => {
  Category.find({}).then(categories =>{
    res.render("notes/add", {categories:categories})
  })
  
})

router.post("/add/category/",ensureAuthenticated, (req, res) => {
  console.log("We will need to bring out the node inspect" + req.params.category) 
  Category.findOne({title:req.body.category}).then(category =>{
    Topic.find({category:category._id}).then(Topics =>{
      
      res.render("notes/add", {Topics:Topics})
    })
  })
  
})

router.post("/",ensureAuthenticated, (req, res) => {
  let errors = []
  if (!req.body.title) {
    errors.push({
      text: "Please add a title"
    })
  }
  if (!req.body.body) {
    errors.push({
      text: "Please add a Note"
    })
  }
  if (!req.body.dateTaught) {
    errors.push({
      text: "Please add the date this was taught"
    })
  }
  if (errors.length > 0) {
    res.render("notes/add", {
      errors: errors,
      title: req.body.title,
      body: req.body.body,
      dateTaught: req.body.dateTaught
    })
  } else {
    const newNote = {
      title: req.body.title,
      body: req.body.body,
      dateTaught: req.body.dateTaught
    }
    new Note(newNote)
      .save()
      .then(note =>{
        res.redirect("/notes")
      })
  }
})

router.get("/", (req,res)=>{
  res.send("this is where the notes will be viewed")
})


module.exports = router