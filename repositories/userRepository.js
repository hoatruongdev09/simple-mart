const db = require('../db')

async function createUser({ password, phone, firstname, lastname, is_admin, username }) {
    try {
        const user = await db.query("INSERT INTO public.users(password, firstname, lastname, phone, is_admin, username) VALUES  ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [password, firstname, lastname, phone, is_admin, username])
        return user
    } catch (error) {
        throw error
    }
}
async function findUserByEmail({ email }) {
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email])
        return user
    } catch (error) {
        throw error
    }
}
async function findUserByUsername(username) {
    try {
        const user = await db.query("SELECT * FROM users WHERE username=$1", [username])
        return user
    } catch (error) {
        throw error
    }
}
async function checkValidUserName(username) {
    try {
        const result = await db.query("SELECT COUNT(id) FROM users WHERE username=$1", [username])
        return result
    } catch (error) {
        throw error
    }
}
async function checkValidPhone(phone) {
    try {
        const result = await db.query("SELECT COUNT(id) FROM users WHERE phone=$1", [phone])
        return result
    } catch (error) {
        throw error
    }
}
async function checkIfUserIsAdmin(id) {
    try {
        const result = await db.query("SELECT is_admin FROM users WHERE username = $1", [username])
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
    findUserByEmail,
    checkValidUserName,
    checkValidPhone,
    findUserByUsername,
    checkIfUserIsAdmin
}