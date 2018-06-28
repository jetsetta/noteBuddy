const mongoose  = require("mongoose")
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  title:{
    type:String,
    required: true
  },
  topics:[{
    type: Schema.Types.ObjectId,
    ref:"topics"
  }]
})

mongoose.model("categories", CategorySchema, "categories")