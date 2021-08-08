const db = require('../db')

async function getListProduct(limit = 10, offset = 0) {
    try {
        const result = await db.query("SELECT * FROM products ORDER BY date_created DESC LIMIT $1 OFFSET $2", [limit, offset])
        return result
    } catch (error) {
        throw error
    }
}

async function getProductCount() {
    try {
        const result = await db.query("SELECT COUNT(id) FROM products")
        return result
    } catch (error) {
        throw console.error();
    }
}

async function createProduct({
    productCode,
    productName,
    productPrice,
    productDiscount,
    productCount,
    productDescription,
}, dateCreated) {
    try {
        const result = await db.query("INSERT INTO public.products(name, price, description, count, discount, product_code, date_created) VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id;",
            [productName, productPrice, productDescription, productCount, productDiscount, productCode, dateCreated])
        return result
    } catch (e) {
        throw e;
    }
}

async function updateProductImage(imageName, productId) {
    try {
        const result = await db.query("UPDATE public.products SET image=$1 WHERE id=$2", [imageName, productId])
        return result
    } catch (e) {
        throw e
    }
}

async function addProductDetailImage(imageName, productId) {
    try {
        const result = await db.query("INSERT INTO public.product_images(product_id, image) VALUES ($1, $2) RETURNING *;", [productId, imageName])
        return result
    } catch (e) {
        throw e
    }
}
async function getProductDetailImages(productId) {
    try {
        const result = await db.query("SELECT * FROM product_images WHERE product_id=$1", [productId])
        return result
    } catch (e) {
        throw e
    }
}
async function deleteProductDetailImage(imageId) {
    try {
        const result = await db.query("DELETE FROM product_images WHERE id=$1", [imageId])
        return result
    } catch (error) {
        throw e
    }
}
async function getProductInfo(productId) {
    try {
        const result = await db.query("SELECT * FROM products WHERE id=$1", [productId])
        return result
    } catch (e) {
        throw e
    }
}

async function getNumberProductCode(code) {
    try {
        console.log(code)
        const result = await db.query("SELECT COUNT(product_code) FROM products WHERE product_code=$1", [code])
        return result
    } catch (e) {
        throw e
    }
}
async function getProductByCode(code) {
    try {
        const result = await db.query("SELECT * FROM products WHERE product_code=$1", [code])
        return result
    } catch (e) {
        throw e
    }
}
module.exports = {
    getListProduct,
    getProductCount,
    createProduct,
    updateProductImage,
    addProductDetailImage,
    getProductInfo,
    getNumberProductCode,
    getProductDetailImages,
    getProductByCode,
    deleteProductDetailImage
}