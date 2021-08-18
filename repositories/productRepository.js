const db = require('../db')

async function getListProduct(limit = 10, offset = 0, searchValue = '') {
    try {
        const result = await db.query("(SELECT * FROM products WHERE product_code LIKE LOWER($3) UNION SELECT * FROM products WHERE LOWER(name) LIKE LOWER($4) UNION SELECT * FROM products WHERE $3='') ORDER BY date_created DESC LIMIT $1 OFFSET $2", [limit, offset, searchValue, `%${searchValue}%`])
        return result
    } catch (error) {
        throw error
    }
}

async function getProductCount(searchValue = '') {
    try {
        const result = await db.query("SELECT COUNT(id) FROM (SELECT * FROM products WHERE product_code LIKE $1 UNION SELECT * FROM products WHERE name LIKE '%$1%' UNION SELECT * FROM products WHERE $1 LIKE '') as products_search", [searchValue])
        return result
    } catch (error) {
        throw error
    }
}
async function updateProduct(id, { productCode, productName, productPrice, productDiscount, productCount, productDescription, productStatus }) {
    try {
        const result = await db.query("UPDATE products SET name=$1,price=$2,description=$3,count=$4,discount=$5,product_code=$6,status=$7 WHERE id=$8",
            [productName, productPrice, productDescription, productCount, productDiscount, productCode, productStatus, id])
        return result
    } catch (error) {
        throw error
    }
}
async function createProduct({
    productCode,
    productName,
    productPrice,
    productDiscount,
    productCount,
    productDescription,
}, dateCreated, status = 1) {
    try {
        const result = await db.query("INSERT INTO public.products(name, price, description, count, discount, product_code, date_created, status) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;",
            [productName, productPrice, productDescription, productCount, productDiscount, productCode, dateCreated, status])
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
async function getProductImageDetail(imageId) {
    try {
        const result = await db.query("SELECT * FROM product_images WHERE id=$1", [imageId])
        return result
    } catch (error) {
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
async function getAllProductStatus() {
    try {
        const result = await db.query("SELECT * FROM product_status")
        return result
    } catch (error) {
        throw error
    }
}
module.exports = {
    getListProduct,
    getProductCount,
    createProduct,
    updateProduct,
    updateProductImage,
    addProductDetailImage,
    getProductInfo,
    getNumberProductCode,
    getProductDetailImages,
    getProductByCode,
    deleteProductDetailImage,
    getProductImageDetail,
    getAllProductStatus
}