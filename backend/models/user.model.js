const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    graduationYear: {
        type: String,
    },
    creditBalance : {
        type: Number,
        default: 5,
    },
    problemsSolved: {
        type: [{
            problem:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Problem'
            },
            status: { 
                type:Boolean,
                default: false
            },
            solvedAt: {
                type: Date,
                default: Date.now()
            },
            points: {
                type: Number,
                default: 0,
            }
        }],
        default: []
    }
})

const User = new mongoose.model('User', userSchema)
module.exports = User;