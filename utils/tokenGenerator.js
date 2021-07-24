require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

function tokenGenerate(payload) {
    return jwt.sign(payload, jwtSecret)
}
function decodeToken(token) {
    return jwt.verify(token, jwtSecret)
}

module.exports = {
    tokenGenerate,
    decodeToken
}
