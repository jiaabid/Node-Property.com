const express = require('express')
const router = express.Router()
const asset = require('../models/property')
const auth = require('../middleware/auth')
const controller = require('../controller/assetController')
const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
            return cb(new Error('doesnt support'))
        }
        cb(undefined, true)
    }
})
router.post('/upload', upload.array('upload', 15), async (req, res) => {
    try {
        const post = await asset.findById(req.query)
        //console.log(req.files)
        req.files.every(file => post.pics.push({
            pic: file.buffer
        }))
        //console.log(post.pics)
        await post.save()
        res.send(post)
    } catch (err) {
        res.send(err)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
//getting a single pic
router.get('/get', auth, async (req, res) => {
    const {post_id,pic_id} = req.query
    const post = await asset.findById({_id:post_id})
    const pics = await post.findById({_id:pic_id})
    res.send(pics)
})
//posting your add
router.post('/addpost', auth,controller.postAdd )
//my posted properties
router.get('/myposts', auth, controller.myPosts)
//getting all posts
router.get('/allpost', auth, controller.allPost)
//edit the post
router.patch('/editpost', auth, controller.updatePost)
//delete the post
router.delete('/dltpost', auth,controller.dltPost )
module.exports = router