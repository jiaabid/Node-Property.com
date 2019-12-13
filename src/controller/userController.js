const User = require('../models/user')
const asset = require("../models/property")
var arr = [];
//signup
const SignUp = async (req, res) => {
    try {
        //console.log(req.body)
        const { jwt } = req.body
        const oldUser = await User.findOne({ "jwt.email": jwt.email })
        if (oldUser) {
            return new Error("user already exist")
        }
        const newUser = new User(req.body)
        console.log(newUser)
        await newUser.save()
        const token = await newUser.tokenGenerator()
        console.log(token)
        res.status(201).send({ newUser, token })
        // res.send(req.body)
    } catch (err) {
        res.status(400).send(err)
    }
}
//login
const logIn = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        console.log(email, password)
        const user = await User.findByCredential(email, password)
        const token = await user.tokenGenerator()
        console.log(user,token)
        checkFavs(user)
        console.log(user,token)
        res.status(200).send({ user, token })
    } catch (err) {
        res.status(404).send(err)
    }
}
//logout
const logOut = async (req, res) => {
    try {
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter(obj => obj.token !== req.token)
        // const user = logout(req.user,req.token)
        await req.user.save()
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
}
//myprofile
const myAccount = async (req, res) => {
    try {
        console.log(req.user)
        res.send(req.user)
    } catch (err) {
        res.status(404).send(err)
    }
}
//updateaccount
const updateAccount = async (req, res) => {
    try {

        const updates = Object.keys(req.body)
        const validUpdates = ['_id', 'contact', 'email', 'password', 'name']
        const isMatch = updates.every(update => validUpdates.includes(update))
        if (!isMatch) {
            res.status(400).send()
        }
        updates.every(update => req.user[update] = req.body[update])
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({
            user: req.user,
            message: "login again"
        })
        console.log('login again')
    } catch (err) {
        res.status(404).send(err)
    }
}
//upload dp
const uploadDP = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { dp: req.file.buffer })
        //user.dp = req.filter
        await user.save()
        res.send(user)
    } catch (err) {
        res.send(err)
    }
}
//setting dp
const myDP = async (req, res) => {
    try {
        res.set("Content-Type", 'image/jpeg')
        res.send(req.user.dp)
    } catch (err) {
        res.send(err)
    }
}
//add property to favourtie
const addFav = async (req, res) => {
    try {
        if (req.user.favourite.length > 5) {
            return res.status(400).send("cannot add more")
        }
        if (req.user.favourite.includes(req.query.assetID)) {
            return res.status(400).send("already favourite")

        }
        req.user.favourite.push(req.query.assetID)
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(404).send(err.message)
    }
}
//all my favourites
const myFav = async (req, res) => {
    try {
        checkFavs(req.user)
        if (req.user.favourite.length < 1) {
            return new Error("no favs yet")
        }
        var favs;
        for (i = 0; i < req.user.favourite.length; i++) {
            favs = await prop(req.user.favourite[i]._id)
            //console.log("hello",arr)  
        }
        res.send(favs)

    } catch (err) {
        console.log(err)

        res.status(400).send(err.message)
    }

}

const prop = async (id) => {
    try {
        arr.push(await asset.findById(id))
        //console.log("one",arr)
        return arr
    } catch (err) {
        console.log(err)
    }
}
//filtering the favourites (do they exist or not)
const checkFavs = async (user) => {
    try {
        console.log("hello from fav")
        for (i of user.favourite) {
            console.log(i)
            const assetExist = await asset.findById(i)
            console.log(assetExist)
            if (!assetExist) {
                user.favourite.splice(user.favourite.indexOf(i), 1)
            } else {
                continue;
            }
        }
        //console.log("hello",user.favourite)
        await user.save()
    } catch (err) {
        res.send(err)
    }
}

//deactivate account
const deactivate = async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (err) {
        res.status(404).send(err)
    }
}

//signin with google
const googleOauth = async (req, res) => {
    //console.log("requested user", req.user)
    const token = await req.user.tokenGenerator()
    res.status(200).send({ token })
}

module.exports = {
    SignUp,
    logIn,
    logOut,
    deactivate,
    updateAccount,
    myAccount,
    myDP,
    uploadDP,
    googleOauth,
    addFav,
    myFav
}