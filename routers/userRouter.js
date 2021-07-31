const Router = require('express').Router()
const userMiddlewares = require('../middlewares/userMiddlewares')
const userRepository = require('../repositories/userRepository')

const uploadImageMiddleware = require('../middlewares/uploadImageMiddleware')
const Resize = require('../utils/resizeImage')

Router.get('/main', async (req, res) => {
    if (req.session.user) {
        const { username } = req.session.user
        const user = await userRepository.findUserByUsername(username)
        if (user.rows.length == 0) {
            return res.redirect('login')
        }
        if (user.rows[0].is_admin) {
            res.redirect('/admin/dashboard')
        } else {

        }
    } else {
        res.redirect('login')
    }

})
Router.get('/login', async (req, res) => {
    if (req.session.user) {
        return res.redirect('main')
    }
    res.render('pages/admin/login', { title: 'Login', layout: 'layouts/authLayout.ejs' })
})
Router.get('/logout', async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect('login')
        }
    })
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
            return res.status(401).send("Username or password incorrect")
        }
        req.session.user = {
            username: user.username
        }
        res.status(200).send('ok')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})


module.exports = Router