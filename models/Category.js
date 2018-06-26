const mongoose  = require("mongoose")
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  title:{
    type:String,
    required: true
  },
})

mongoose.model("categories", CategorySchema, "categories")