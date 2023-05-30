function errorCheck(req, res, result) {
    if(res.statusCode !== 200) {
        res.status(res.statusCode).render('errorCheck.hbs', {status: res.statusCode, error: res.statusMessage })
    } else {
        return res.send(result)
    }
}

module.exports = {errorCheck}