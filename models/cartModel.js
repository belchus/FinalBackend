const mongoose = require('mongoose') ;

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    id: {type: Number, required: true, dropDups: true},
    email:{type: String, required: true},
    address: {type: String, required: true},
    timestamp: {type: Date, default: Date.now(), required: true},
    products: {type: Array, required: true},
})

module.exports = mongoose.model(cartCollection, cartSchema)