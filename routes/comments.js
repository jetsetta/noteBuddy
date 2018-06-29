const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {
  ensureAuthenticated,
  ensureGuest
} = require("../helpers/auth")

// Load models
require("../models/Note")
require("../models/Comment")

const Note = mongoose.model("notes")
const Comment = mongoose.model("comments")

router.post("/add",ensureAuthenticated, (req,res)=>{
  let newComment ={
    comment: req.body.comment_body,
    user: req.user.id,
    note: req.body.note_id
  }
  new Comment(newComment).save()
  .then(comment =>{
    res.redirect("/notes/detail/"+req.body.note_id)
  })
  
})


router.get("/edit/:id", ensureAuthenticated, (req,res)=>{
  Comment.findOne({
    _id: req.params.id
  })
  .populate("user")
  .populate("note")
  .then(comment =>{

    if(comment.user.id == req.user.id){

      res.render("comments/edit",{comment:comment})
    }else{
      req.flash("error_msg","you are not authorized to edit the comment as you are not the user that posted it.")
      res.redirect("/notes/detail/" + comment.note._id)
    }
  })

})

router.post("/update/", ensureAuthenticated, (req,res)=>{

  let id = req.body.comment_id
  Comment.findByIdAndUpdate(id, {$set:{comment:req.body.comment_body}},()=>{
    res.redirect("/notes/detail/" + req.body.note_id)
  })
})

router.get("/delete/:id&:commentid&:noteid",ensureAuthenticated, (req,res)=>{
  let comment_id = req.params.commentid
  let user_id = req.params.id
  if (user_id==req.user.id){
    Comment.findOneAndRemove({_id:comment_id}, function(err,comment){
      res.redirect("/notes/detail/"+req.params.noteid)
    })
  }
})

module.exports = router