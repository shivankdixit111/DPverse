const mongoose = require('mongoose')
const problemSchema = new mongoose.Schema({
    form: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }, 
    practiceLink: {
        type: String,
        required: true,
    },
    platform: {
      type: String,
    },
    resourceLink: {
        type: String, 
    },
    videoLink: {
        type: String, 
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    }
}) 

const Problem = new mongoose.model('Problem', problemSchema)
module.exports = Problem;