const asset = require('../models/property')
//add post
const postAdd = async (req, res) => {
    try {
        console.log(req.body)
        const post = new asset({
            ...req.body,
            owner: req.user._id
        })
        console.log(post)
        await post.save()
        res.status(201).send(post)
    } catch (err) {
        res.status(400).send(err)
    }
}
//retrieving uploaded posts
const myPosts = async (req, res) => {
    await req.user.populate('myproperty').execPopulate()
    res.send(req.user.myproperty)
}
//retrieving all posts
const allPost = async (req, res) => {
    try {
        const posts = await asset.find({})
        if (!posts) {
            res.status(400).send('no posts')
        }
        res.status(200).send(posts)
    } catch (err) {
        res.status(404).send(err)
    }
}
//update post
const updatePost = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const post = await asset.findById(req.query)
        if (!post) {
            res.status(400).send()
        }
        updates.every(field => post[field] = req.body[field])
        await post.save()
        res.status(200).send(post)
    } catch (err) {
        res.status(404).send(err)
    }
}
//delete post
const dltPost = async (req, res) => {
    try {
        console.log("hello from dlt")
        console.log(req.query)
        const post = await asset.findById(req.query)
        if (!post) {
            res.status(400).send()
        }

        await post.remove()
        res.status(200).send(post)
    } catch (err) {
        res.status(404).send(err)
    }
}
//filtering the post
const filterBy = async (req, res) => {
    try {
        const assets = await asset.find(req.query)
        res.send(assets)
    } catch (err) {
        res.status(400).send(err)
    }
}
module.exports = {
    postAdd,
    allPost,
    myPosts,
    updatePost,
    dltPost
}