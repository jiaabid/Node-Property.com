const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asset = require('./property')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    methods: {
        type: [String],
        required: true,
        default:[ "jwt"]
    },
    contact: {
        type: Number,
        maxlength: [13, "number is not valid"],
        minlength: [11, "number is not valid"]
    },
    name:{
type:String
    },
    jwt: {
        email:
        {
            type: String,
            unique: true,
            validate(param) {
                if (!validator.isEmail(param)) {
                    throw new Error('email is not valid re-enter')
                }
            }
        },
        password:
        {
            type: String,
            minlength: [8, "should contain atleast 8 character"]
            //maxlength:[12,"password limit exceeded(max:12)"]
        }
    }
    ,
    dp: {
        type: Buffer
    },
    favourite:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'property'
    }],
    tokens: [{
        token: {
            type: String,
            validate(param) {
                if (!validator.isJWT(param)) {
                    throw new Error('something fishy with token')
                }
            }
        }
    }],
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }

})
//virtually referrencing to the property
userSchema.virtual('myproperty', {
    ref: "property",
    localField: "_id",
    foreignField: "owner"
})
//hashing password
userSchema.pre('save', async function (next) {
    const user = this
    //console.log(user.methods)
    if(!user.methods.includes("jwt")){
        next()
    }
    //console.log(user.jwt.password)
        try {
            if(user.isModified('jwt.password'))
            {
                user.jwt.password = await bcrypt.hash(user.jwt.password, 10)
                //console.log(user.jwt.password)
                next()
            }
            
        } catch (err) {
            console.log(err)
        }
        
    }
)
//login
userSchema.statics.findByCredential = async (email, password) => {
    try {
        //console.log(email)
        const user = await User.findOne({ "jwt.email":email })
      //  console.log(user)
        if (!user) {
            return new Error('Invalid email,recheck it')
        }
        //console.log(password,"jjj",user.jwt.password)
        const match = await bcrypt.compare(password, user.jwt.password)
        console.log(match)
        if (!match) {
            return new Error('Invald password,try again')
        }
       // console.log("hello")
        return user
    } catch (err) {
        return err
    }
}
//setting the token generator
userSchema.methods.tokenGenerator = async function () {
    const user = this
    try {
        const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWTKEY)
        user.tokens = user.tokens.concat({ token })
        await user.save()
        //console.log(token)
        return token
    } catch (err) {
        return err
    }

}

//limiting data
userSchema.methods.toJSON = function () {
    const user = this
    const profile = user.toObject()
    delete profile.password
    delete profile.tokens
    return profile

}
//deleting the related posts with user
userSchema.pre('remove', async function (next) {
    const user = this
    console.log(user)
    await asset.deleteMany({ owner: user._id })
    next()
})
const User = mongoose.model('client', userSchema)

module.exports = User