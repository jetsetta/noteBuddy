const mongoose  = require("mongoose")
const Schema = mongoose.Schema

const TopicSchema = new Schema({
  title:{
    type:String,
    required: true
  },
  notes:[{
    type: Schema.Types.ObjectId,
    ref:"notes"
  }],
  category:{
    type: Schema.Types.ObjectId,
    ref:"categories"
  }
})

mongoose.model("topics", TopicSchema)