const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {

        // const token = req.header('Authorization').replace("Bearer ", "")
        const token = req.query.token
        const decoded = jwt.verify(token, process.env.JWTKEY)
        console.log(decoded, token)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        console.log(user)
        console.log('heelo')
        if (!user) {
            return new Error('please authenticate');

        }
        //       console.log(user)
        req.token = token
        req.user = user
        console.log("hello passport")
        next()
    } catch (err) {
        res.status(404).send(err.message)
    }
}

module.exports = auth