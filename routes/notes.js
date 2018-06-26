const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")


// Load Models Here
require("../models/Note")

const Note = mongoose.model("notes")


router.get("/add", (req, res) => {
  res.render('notes/add')
})

router.post("/", (req, res) => {
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