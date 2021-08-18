const Router = require('express').Router()
const productRepository = require('../repositories/productRepository')
const categoryRepository = require('../repositories/categoryRepository')
const adminMiddleware = require('../middlewares/adminMiddlewares')

const uploadImageMiddleware = require('../middlewares/uploadImageMiddleware')
const Resize = require('../utils/resizeImage')
const deleteFile = require('../utils/deleteFile')

Router.get('/', (req, res) => {
    res.redirect('/admin/dashboard')
})
Router.get('/dashboard', async (req, res) => {
    res.render('pages/admin/dashboard', { title: 'Dashboard', layout: 'layouts/adminLayout.ejs' })
})
Router.get('/product/detail/:code', async (req, res) => {
    try {
        const code = req.params.code
        const productInfo = await productRepository.getProductByCode(code)
        if (productInfo.rows.length == 0) {
            return res.status(404).send('product not found')
        }
        const productID = productInfo.rows[0].id
        const productImages = await productRepository.getProductDetailImages(productID)
        const productCategories = await categoryRepository.getProductCategories(productID)
        const category = await categoryRepository.getAllCategory()
        const status = await productRepository.getAllProductStatus()
        res.render('pages/admin/productDetail', {
            title: 'Product Detail',
            layout: 'layouts/adminLayout.ejs',
            category: category.rows,
            productInfo: productInfo.rows[0],
            productImages: productImages.rows,
            allStatus: status.rows,
            productCategories: productCategories.rows.map(cat => cat.category_id)
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('internal error')
    }
})
Router.get('/product/list', async (req, res) => {
    const { page = 1, count = 2, searchValue = '' } = req.query
    const offset = (page - 1) * count
    const limit = count
    try {
        const product = await productRepository.getListProduct(limit, offset, searchValue)
        const category = await categoryRepository.getAllCategory()
        const productCount = await productRepository.getProductCount()
        const status = await productRepository.getAllProductStatus()
        res.render('pages/admin/productList', {
            title: 'Product List',
            layout: 'layouts/adminLayout.ejs',
            category: category.rows,
            products: product.rows,
            productCount: productCount.rows[0].count,
            status: status.rows,
            page: page,
            count: count,
            searchValue: searchValue
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

Router.post('/product/add', adminMiddleware.validateCreateProduct, async (req, res) => {
    try {
        const result = await productRepository.createProduct(req.body, Math.floor(new Date() / 1000))
        const id = result.rows[0].id
        for (let i = 0; i < req.body.productCategory.length; i++) {
            await categoryRepository.insertProductCategory(id, req.body.productCategory[i])
        }


        res.status(200).json({ id: id })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
})
Router.post('/product/ajaxUpdateInfo/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updateResult = await productRepository.updateProduct(id, req.body)
        await categoryRepository.deleteAllProductCategory(id)
        for (let i = 0; i < req.body.productCategory.length; i++) {
            await categoryRepository.insertProductCategory(id, req.body.productCategory[i])
        }
        const productInfo = await productRepository.getProductInfo(id)
        const productCategory = await categoryRepository.getProductCategories(id)
        res.status(200).json({ productData: productInfo.rows[0], productCategories: productCategory.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
Router.post('/product/ajaxUpdateNewImage/:id', uploadImageMiddleware.single('image'), async (req, res) => {
    const id = req.params.id
    const imagePath = 'public/images'
    const fileUpload = new Resize(imagePath)
    try {
        const productInfo = await productRepository.getProductInfo(id)
        if (productInfo.rows.length == 0) {
            return res.status(404).json({ message: 'Product not found' })
        }
        deleteFile(`${imagePath}/${productInfo.rows[0].image}`)

        const image = req.file
        const filename = await fileUpload.save(image.buffer)
        const result = await productRepository.updateProductImage(filename, id)
        res.status(200).json({ image: filename })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
Router.post('/product/ajaxUploadNewImage/:id', uploadImageMiddleware.single('image'), async (req, res) => {
    const id = req.params.id
    const imagePath = 'public/images'
    const fileUpload = new Resize(imagePath);
    try {
        const image = req.file
        const filename = await fileUpload.save(image.buffer)
        const imageInfo = await productRepository.addProductDetailImage(filename, id)
        res.status(200).json(imageInfo.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
Router.post('/product/ajaxDeleteDetailImage/', async (req, res) => {
    try {
        const id = req.body.id
        const imageInfo = await productRepository.getProductImageDetail(id)
        if (imageInfo.rows.length == 0) {
            return res.status(200).json({ message: 'Image is not found' })
        }
        deleteFile(`public/images/${imageInfo.rows[0].image}`)
        const result = await productRepository.deleteProductDetailImage(id)
        res.status(200).json({ message: 'ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

Router.post('/product/updateImage/:id', uploadImageMiddleware.fields([{
    name: 'productImage',
    maxCount: 1
}, { name: 'productDetailImages', }]), async (req, res) => {
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
        res.status(200).json({ id: id })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
})

Router.get('/product/ajaxInfo/:id', async (req, res) => {
    const id = req.params.id
    try {
        const data = await productRepository.getProductInfo(id)
        res.status(200).json(data.rows[0])
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})
Router.get('/product/ajaxGetCode', async (req, res) => {
    try {

        const codeGenerate = require('../utils/randomProductCode')
        let code = codeGenerate(10)
        console.log(code)
        while ((await productRepository.getNumberProductCode(code)).rows[0].count != 0) {
            code = codeGenerate(10)
        }
        res.status(200).json({ code: code })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
})

module.exports = Router