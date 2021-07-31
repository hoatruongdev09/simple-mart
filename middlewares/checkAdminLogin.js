const userRepository = require('../repositories/userRepository')
async function checkLogin(req, res, next) {
    if (req.session.user == null) {
        return res.redirect('/user/login')
    }
    const { username } = req.session.user
    const user = await userRepository.findUserByUsername(username)
    if (user.rows.length == 0) {
        return res.redirect('/user/login')
    }
    if (!user.rows[0].is_admin) {
        return res.redirect('/user/login')
    }
    req.user = user.rows[0]
    next()
}

module.exports = checkLogin