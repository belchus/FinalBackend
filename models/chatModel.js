const mongoose = require('mongoose')

const chatCollection ='msg'

const chatSchema = new mongoose.Schema({
    rol: {type: String, required: true},
    firstname: {type: String, required: true},
    email: {type: String, required: true},
    msg: {type: Array, required: true},
})

module.exports = mongoose.model(chatCollection, chatSchema)