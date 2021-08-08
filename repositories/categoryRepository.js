const db = require('../db')

async function getAllCategory() {
    try {
        const data = await db.query('SELECT * FROM categories')
        return data
    } catch (error) {
        throw error
    }
}
async function insertProductCategory(productId, categoryId) {
    try {
        const result = await db.query('INSERT INTO public.product_category(product_id, category_id) VALUES ($1, $2);',
            [productId, categoryId])
        return result
    } catch (e) {
        throw e
    }
}
async function getProductCategories(productId) {
    try {
        const result = await db.query("SELECT category_id FROM product_category WHERE product_id=$1", [productId])
        return result
    } catch (e) {
        throw e
    }
}

module.exports = {
    getAllCategory,
    insertProductCategory,
    getProductCategories
}