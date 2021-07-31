const Router = require('express').Router()
const productRepository = require('../repositories/productRepository')
const categoryRepository = require('../repositories/categoryRepository')
const adminMiddleware = require('../middlewares/adminMiddlewares')

const uploadImageMiddleware = require('../middlewares/uploadImageMiddleware')
const Resize = require('../utils/resizeImage')
const codeGenerate = require("../utils/randomProductCode");

Router.get('/dashboard', async (req, res) => {
    res.render('pages/admin/dashboard', {title: 'Dashboard', layout: 'layouts/adminLayout.ejs'})
})
Router.get('/productlist', async (req, res) => {
    const {page = 1, count = 10} = req.query
    const offset = (page - 1) * count
    const limit = count

    const product = await productRepository.getListProduct(limit, offset)
    const category = await categoryRepository.getAllCategory()
    const productCount = await productRepository.getProductCount()
    res.render('pages/admin/productList', {
        title: 'Product List',
        layout: 'layouts/adminLayout.ejs',
        category: category.rows,
        products: product.rows,
        productCount: productCount.rows[0].count,
        page: page,
        count: count
    })
})
Router.post('/product/add', adminMiddleware.validateCreateProduct, async (req, res) => {
    try {
        const result = await productRepository.createProduct(req.body, Math.floor(new Date() / 1000))
        const id = result.rows[0].id
        for (let i = 0; i < req.body.productCategory.length; i++) {
            await categoryRepository.insertProductCategory(id, req.body.productCategory[i])
        }

        res.status(200).json({id: id})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message})
    }
})
Router.post('/product/updateImage/:id', uploadImageMiddleware.fields([{
    name: 'productImage',
    maxCount: 1
}, {name: 'productDetailImages',}]), async (req, res) => {
    const id = req.params.id
    const imagePath = 'public/images'
    const fileUpload = new Resize(imagePath);
    try {
        const productImage = req.files.productImage[0]
        const productDetailImages = req.files.productDetailImages
        const productFileName = await fileUpload.save(productImage.buffer)
        await productRepository.updateProductImage(productFileName, id)

        for (let i = 0; i < productDetailImages.length; i++) {
            const filename = await fileUpload.save(productDetailImages[i].buffer)
            await productRepository.addProductDetailImage(filename, id)
        }
        res.status(200).json({id: id})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message})
    }
})

Router.get('/product/ajaxInfo/:id', async (req, res) => {
    const id = req.params.id
    try {
        const data = await productRepository.getProductInfo(id)
        res.status(200).json(data.rows[0])
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})
Router.get('/product/ajaxGetCode', async (req,res) =>{
    try {

        const codeGenerate = require('../utils/randomProductCode')
        let code = codeGenerate(10)
        console.log(code)
        while ((await productRepository.getNumberProductCode(code)).rows[0].count != 0) {
             code = codeGenerate(10)
        }
        res.status(200).json({code:code})
    }catch (e) {
        console.log('wtf')
        console.log(e)
        res.status(500).json({message: e.message})
    }
})

module.exports = Router