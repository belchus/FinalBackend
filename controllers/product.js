const {productFactory} = require('../repository/productFactory.js')
const {errorCheck} = require('../utils/errorCheck.js')


//controllers para los productos

async function listAll(req, res) {
    const result = await productFactory.listAll();
    console.log(result);
    errorCheck(req, res, result)
};
async function listByMongoId(req, res) {
    let {id} = req.params;
    const resultado = await productosFactory.listByMongoId(id);
    errorChecker(req, res, resultado)
}

async function productById(req, res) {
    let { id } = req.params;
    const result = await productFactory.productById(id);
    errorCheck(req, res, result)
};


async function createProduct(req, res) {
    const result = await productFactory.save(req.body);
    errorCheck(req, res, result)
};

async function modifyProduct(req, res) {
    const result = await productFactory.update(req.body, req.params.id);
    errorCheck(req, res, result)
};

async function deleteProduct(req, res) {
    const result = await productFactory.delete(req.params.id);
    errorCheck(req, res, result)
}

module.exports = { productById,createProduct, modifyProduct, deleteProduct ,listAll,listByMongoId}