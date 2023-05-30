mongoose = require('mongoose')

const orderCollection = 'orders'

const ordersSchema = new mongoose.Schema({
    email: {type: String, required: true},
    orders: {type: Array, required: true}
})

module.exports = mongoose.model(orderCollection, ordersSchema)