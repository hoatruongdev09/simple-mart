function validPassword(password) {
    const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
    return strongPasswordRegex.test(password)
}

module.exports = validPassword