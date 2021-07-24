const Router = require('express').Router()
const userMiddlewares = require('../middlewares/userMiddlewares')
const userRepository = require('../repositories/userRepository')


Router.get('/login', async (req, res) => {
    console.log(req.session.user)
    if (req.session.user) {
        console.log("hey hey you here")
    }
    res.render('pages/admin/login', { title: 'Login', layout: 'layouts/authLayout.ejs' })
})
Router.get('/register', async (req, res) => {
    res.render('pages/admin/register', { title: 'Register', layout: 'layouts/authLayout.ejs' })
})
Router.get('/checkValidUserName/:username', async (req, res) => {
    try {
        const { username } = req.params
        const result = await userRepository.checkValidUserName(username)
        res.status(200).json(result.rows[0].count == 0)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
Router.get('/checkValidPhone/:phone', async (req, res) => {
    try {
        const { phone } = req.params
        if (phone.length == 0 || phone.length > 11) {
            return res.status(200).json(false)
        }
        if (isNaN(phone)) {
            return res.status(200).json(false)
        }
        const result = await userRepository.checkValidPhone(phone)
        res.status(200).json(result.rows[0].count == 0)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
Router.post('/register', userMiddlewares.validateRegisterData, async (req, res) => {
    try {
        const { password, phone, firstname, lastname, username } = req.body
        const is_admin = false
        const result = await userRepository.createUser({ password, phone, firstname, lastname, is_admin, username })
        res.status(200).json({ message: 'ok' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
Router.post('/login', userMiddlewares.validateLoginData, async (req, res) => {
    try {
        const { password } = req.body
        const user = req.user
        if (password != user.password) {
            res.status(401).send("Username or password incorrect")
        }
        req.session.user = user
        res.status(200).send('ok')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})


module.exports = Router