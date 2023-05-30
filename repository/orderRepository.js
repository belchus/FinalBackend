const orderMongo = require('../DAO/orderMongo.js')
const orderModel = require('../models/orderModel.js')


module.exports = class OrderRepository extends orderMongo{
    constructor(){
        super(orderModel)
    }
    async getOrders() {
        const data = await this.getAllOrders()
        return data
    }
    async getOrderByMail(email) {
        const data = await this.getByMail(email)
        return data
    }
    async addThisOrder(payload) {
        const data = await this.addOrder(payload)
        return data
    }
}