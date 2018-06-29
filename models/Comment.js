const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  comment:{
    type:String,
    required: true
  },
  note:{
    type:Schema.Types.ObjectId,
    ref:"notes",
    required:true
  },
  dateCreated:{
    type:Date,
    default: Date.now
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:"users",
    required:true,
  }
})

mongoose.model("comments",CommentSchema)