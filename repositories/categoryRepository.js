const db = require('../db')


async function getAllCategory(limit = 100, offset = 0, searchValue = '') {
    try {
        const data = await db.query("SELECT * FROM categories WHERE LOWER(name) LIKE LOWER($1) OR $1 LIKE '' LIMIT $2 OFFSET $3", [`%${searchValue}%`, limit, offset])
        return data
    } catch (error) {
        throw error
    }
}
async function getCategoryCount(searchValue = '') {
    try {
        const data = await db.query("SELECT COUNT(id) FROM categories WHERE LOWER(name) LIKE LOWER($1) OR $1 LIKE ''", [`%${searchValue}%`])
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
async function deleteAllProductCategory(productId) {
    try {
        const result = await db.query("DELETE FROM product_category WHERE product_id=$1", [productId])
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAllCategory,
    insertProductCategory,
    getProductCategories,
    deleteAllProductCategory,
    getCategoryCount
}