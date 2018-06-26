const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

// Loading models
require("../models/Topic")
require("../models/Category")

const Topic = mongoose.model("topics")
const Category = mongoose.model("categories")

router.get("/add", (req,res)=>{
  Category.find({}).then(categories =>{
    res.render("topics/add", {categories:categories})
  })
})



router.get("/",(req,res)=>{
  Topic.find({}).populate("category").then(topics =>{
    res.render("topics/index", {topics:topics})
  })

})

router.post("/", (req,res)=>{

  Category.findOne({title: req.body.category}).then(queried_category =>{
    var newTopic = {
      title : req.body.title,
      category : queried_category._id
    }
    new Topic(newTopic).save().then(topic=>{
  
      req.flash("success_msg","Topic is added")
      res.redirect("/topics")
    })
  })
})


module.exports = router