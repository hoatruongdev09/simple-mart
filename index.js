const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(session({
    secret: 'appsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new session.MemoryStore()
}))



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('public'))
app.use(expressLayouts)



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


app.use('/user', require('./routers/userRouter'))

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log("App listen on port ", port)
})