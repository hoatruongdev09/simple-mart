const validatePassword = require('../utils/validatePassword')
const validatePhoneNumber = require('../utils/validatePhoneNumber')
const userRepository = require('../repositories/userRepository')


async function validateRegisterData(req, res, next) {
    const { password, confirmPassword, phone, firstname, lastname, username } = req.body
    if (!validatePhoneNumber(phone)) {
        return res.status(400).send('Phone number is not valid')
    }
    const checkPhoneResult = await userRepository.checkValidPhone(phone)
    if (checkPhoneResult.rows[0].count != 0) {
        return res.status(400).send('Phone number is not available')
    }
    const checkUsernameResult = await userRepository.checkValidUserName(username)
    if (checkUsernameResult.rows[0].count != 0) {
        return res.status(400).send('Username is not available')
    }
    if (!validatePassword(password)) {
        return res.status(400).send('Password must be 8 or more character and include at least 1 UPPERCASE, 1 number character.')
    }
    if (password != confirmPassword) {
        return res.status(400).send('Password and confirm password are not the same')
    }
    next()
}

async function validateLoginData(req, res, next) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).send('Username or password not valid')
        }
        const findUserResult = await userRepository.findUserByUsername(username)
        if (findUserResult.rows.length == 0) {
            return res.status(401).send("Username or password incorrect")
        }

        req.user = findUserResult.rows[0]
        next()
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
}



module.exports = {
    validateRegisterData,
    validateLoginData
}