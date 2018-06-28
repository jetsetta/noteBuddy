const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {
  ensureAuthenticated,
  ensureGuest
} = require("../helpers/auth")


// Load Models Here
require("../models/Note")
require("../models/Category")
require("../models/Topic")

const Note = mongoose.model("notes")
const Category = mongoose.model("categories")
const Topic = mongoose.model("topics")


router.get("/", (req, res) => {
  Note.find({})
    .populate("user").populate("topic")
    .then(notes => {
      res.render("notes/", {
        Notes: notes
      })

    })
})




router.get("/add", ensureAuthenticated, (req, res) => {
  Category.find({}).then(categories => {
    res.render("notes/add", {
      categories: categories
    })
  })

})

router.post("/add/category/", ensureAuthenticated, (req, res) => {

  Category.findOne({
    title: req.body.category
  }).then(category => {
    Topic.find({
      category: category._id
    }).then(Topics => {

      res.render("notes/add", {
        Topics: Topics
      })
    })
  })

})

router.post("/", ensureAuthenticated, (req, res) => {
  let errors = []
  // Check for errors
  if (!req.body.topic_id) {
    errors.push({
      text: "Please Choose a Topic to post this note under."
    })
  }
  if (!req.body.title) {
    errors.push({
      text: "Cant Post without a title. It is required so please enter it."
    })
  }
  if (!req.body.note_body) {
    errors.push({
      text: "You need to write something in the notes body."
    })
  }
  if (errors.length > 0) {
    res.render("notes/add", {
      errors: errors,
      note_body: req.body.note_body,
      title: req.body.title,
      description: req.body.description
    })
  } else {
    let newNote = {
      title: req.body.title,
      body: req.body.note_body,
      topic: req.body.topic_id,
      user: req.user._id,
      description: req.body.description
    }
    if (req.body.date_taught) {
      newNote["dateTaught"] = req.body.date_taught
    }
    new Note(newNote).save().then(note => {
      Topic.findOneAndUpdate({
        "_id": req.body.topic_id
      }, {
        $push: {
          "notes": note._id
        }
      }).then(topic => {

        res.redirect("/users")
      })
    })
  }
})


router.get("/detail/:note_id", (req, res) => {
  Note.findOne({
      _id: req.params.note_id
    })
    .populate("topic")
    .populate("user")
    .then(note => {
      if (note.user._id == req.user.id) {
        res.render("notes/detail", {
          note: note,
          _isOwner: true
        })
      } else {
        res.render("notes/detail", {
          note: note
        })

      }
    }).catch(err => {
      errors = []
      errors.push(err)

      res.render("notes/detail", {
        note: note,
        errors: errors
      })
    })

})


router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  
  Note.findOne({
      _id: req.params.id
    })
    .populate("user")
    .populate({
      path: "topic",
      populate: {
        path: "category",
        populate: {
          path: "topics",
          model: Topic
        },
        model: Category
      }
    }).then(note => {
      if (note != null) {
        if(req.user.id == note.user._id){
          
                  var topics = note.topic.category.topics
                  var filteredTopics = topics.filter((topic) => {
                    if (topic.title != note.topic.title) {
                      return topic
                    }
                  })
                  res.render("notes/edit", {
                    note: note,
                    topicTitle: note.topic.title,
                    topicsArray: filteredTopics
                  })

        }else{
          req.flash("error_msg","This is not your note. You can only edit your notes")
          res.redirect("/notes/detail/"+note._id)
        }
      }
    })
})

router.put("/:id", ensureAuthenticated, (req, res) => {
  Note.findOne({
      _id: req.params.id
    }).populate("user")
    .then(note => {
      if (req.user.id == note.user.id) {
        note.topic = req.body.topic_id
        note.title = req.body.title
        note.description = req.body.description
        note.dateTaught = req.body.date_taught
        note.body = req.body.note_body
        note.save().then(note => {
          req.flash("success_msg", "Your Note Was Updated!")
          res.redirect("/users")
        }).catch(err => {
          req.flash("error_msg", err)
          res.redirect("/users")


        })
      } else {
        req.flash("error_msg", "You are not Authorized")
        res.redirect("/users")
      }
    })
})

router.get("/delete/:id", ensureAuthenticated, (req, res) => {

  Note.findOne({
      _id: req.params.id
    })
    .populate("users")
    .populate("topic")
    .then(note => {

      if (req.user.id == note.user._id) {


        if (note) {
          Topic.find({
            _id: note.topic.id
          }, (err, result) => {
            result = result[0]

            if (result._id) {

              var topicNotes = result.notes

              for (var i = 0; i < topicNotes.length; i++) {
                var noteInArray = topicNotes[i].toString()
                var noteToRemove = note._id.toString()

                if (noteInArray == noteToRemove) {

                  topicNotes.splice(i, 1)
                }
              }



              var theTopic = result

              theTopic.notes = topicNotes

              theTopic.save((err) => {
                if (err) {
                  req.flash("error_msg", err)
                  res.redirect("/users")
                } else {

                  removeNote(req.params.id)
                }
              })

            }
          })

        }
      }else{
        req.flash("error_msg","You can only delete your notes.")
        res.redirect("/notes/detail/"+note._id)
      }
    })

  function removeNote(id) {
    Note.remove({
      _id: id
    }).then(() => {
      req.flash("success_msg", "Note Removed")
      res.redirect("/users")
    })
  }



})



module.exports = router