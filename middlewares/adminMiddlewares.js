async function validateCreateProduct(req, res, next) {
    const {
        productCode,
        productName,
        productPrice,
        productDiscount,
        productCount,
        productCategory,
        productDescription,
    } = req.body
        console.log(productCode)
        console.log(productName)
        console.log(productPrice)
        console.log(productDiscount)
        console.log(productCount)
        console.log(productCategory)
        console.log(productDescription)
    next()
}

module.exports = {
    validateCreateProduct
}