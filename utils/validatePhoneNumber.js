module.exports = (phone) => {
    const rex = new RegExp("[0-9]{11}")
    return rex.test(phone)
}