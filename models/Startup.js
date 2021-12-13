const {Schema, model } = require('mongoose')

const schema = new Schema({
  name: {
     type: String,
     required: true,
     unique: true 
    },
  listingTimeAlert: {
    type: Boolean,
    default: false
  }  
})

module.exports = model('Startup', schema)
