const {errorCheck} = require ('../utils/errorCheck.js')
const orderRepo = require ('../repository/orderRepository.js')
const order = new orderRepo()


async function allOrders(req, res) {
    const result = await order.getOrders()
    errorCheck(req, res, result)
}

async function listByMail(req, res) {
    const {email} = req.params
    const result = await order.getOrderByMail(email)
    errorCheck(req, res, result)
}

async function saveOrder(req, res) {
    const result = await order.addThisOrder(req.body)
    errorCheck(req, res, result)
}


module.exports = {allOrders, listByMail, saveOrder}