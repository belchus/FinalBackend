const mongoose = require('mongoose') ;

const productsCollection = 'products'

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true, max: 50},
    price: {type: Number, required: [true, "un valor debe ser incluido"]},
    code: {type: String, required: true, max: 10},
    thumbnail: {type: String, required: true},
    stock:{type: Number, required: true},
    description: {type: String, required: true},
    id: {type: Number, requird: true, dropDups: true},
    timestamp: {type: Date, default: Date.now(), required: true},
})

module.exports = mongoose.model(productsCollection, ProductSchema)