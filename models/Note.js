const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NoteSchema = new Schema({
  title: {
    type:String,
    required: true
  },
  body: {
    type:String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateTaught: {
    type: Date,
  },
  topic:{
    type: Schema.Types.ObjectId,
    ref: "topics"
  },
  user:{
    type: Schema.Types.ObjectId,
    ref:"users"
  }

})


mongoose.model("notes", NoteSchema)