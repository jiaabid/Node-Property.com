const express = require('express')
const app = express()
const router = new express.Router()
const User = require('../models/user')
const passport = require('passport')
require('../../config/passport')
const JWT = require('jsonwebtoken')
const auth = require('../middleware/auth')
const { SignUp,
    logIn,
    logOut,
    deactivate,
    updateAccount,
    myAccount,
    myDP,
    uploadDP,
    googleOauth,
    addFav,
    myFav } = require('../controller/userController')
const multer = require('multer')
//validating the size and type of files for profile
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
            return cb(new Error("file format not support"))
        }
        cb(undefined, true)
    }
})
app.use(express.json())
// signToken = user=>{
//     return JWT.sign({
//         sub:user.id,
//     },"ghr")
// }
// router.get('/', (req, res) => {
//     res.send("hello")
// })



//user signup
router.post('/', SignUp)

//upload profile
router.post('/profileUpload', auth, upload.single('upload'), uploadDP)

//getting profile pic
router.get('/dp', auth, myDP)

//user login
router.post('/login', logIn)

//my profile 
router.get('/me', auth, myAccount)

//update profile
router.patch('/update', auth, updateAccount)

//deactivate the account
router.delete('/deactivate', auth, deactivate)

//logout
router.post('/logout', auth, logOut)
//add fav post
router.post('/addFavs', auth, addFav)
//retriving the fav posts 
router.get("/myFav", auth, myFav)

router.post('/oauth/google', passport.authenticate('google', { session: false }), googleOauth)
module.exports = router



// const logout = (user,token)=>{
//    user.tokens = user.tokens.filter(obj => obj.token !==token )
//      return user
// }