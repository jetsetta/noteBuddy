const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

// Loading models
require("../models/Category")

const Category = mongoose.model("categories")

const Topic = mongoose.model("topics")

router.get("/add", (req,res)=>{

  res.render("categories/add")
})


router.get("/",(req,res)=>{
  Category.find({}).then(categories =>{
    res.render("categories/index", {categories:categories})
  })

})

router.post("/", (req,res)=>{
  const newCategory = {
    title : req.body.title
  }
  new Category(newCategory).save().then(topic=>{
    req.flash("success_msg","Category is added")
    res.redirect("/categories")
  })
})


module.exports = router