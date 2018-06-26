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
    required: true
  },

})


mongoose.model("notes", NoteSchema)