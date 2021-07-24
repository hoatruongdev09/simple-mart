const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.STMP_USER,
        pass: process.env.STMP_PASSWORD
    }
})

const sendMail = async ({ to, subject, text, from = process.env.STMP_USER }) => {
    return await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text
    })
}

module.exports = sendMail