const express = require('express')
const app = express()
const path=require('path')
require('./src/db/mongoose')
const user = require('./src/models/user')
require('./src/middleware/auth')
const userRoute = require('./src/routes/user')
const assetRoute = require('./src/routes/property')
//const testRoute = require('./src/routes/testRoute')
const passportSetup = require('./config/passport')
const passport = require('passport')
app.use(express.json())
app.use(passport.initialize())
app.use(express.static(path.join(__dirname,'clientside/build')))
app.use('/user',userRoute)
app.use(assetRoute)
//app.use(testRoute)

const port = process.env.PORT || 3000


app.listen(port, () => {
    console.log('running',port)
})

// const u = new user({
//     _id: "kkk12",
//     contact: 0900,
//     email:"k12@gmail.com",
//     password:"k12123"
// })
// u.save().then(()=>{
//     console.log("doc saved")
// })
//console.log(express.json())