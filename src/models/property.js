const mongoose = require('mongoose')
const User = require('../models/user')
const detailSchema = new mongoose.Schema({
    rooms: {
        quantity: {
            type: Number,
            minlength: 1
        },
        size: String
    },
    bathrooms: {
        quantity: {
            type:Number,
            minlength:1
        },
        size:String
    }
})
const propertySchema = new mongoose.Schema({
    pics: [
        {
            pic: Buffer
        }
    ],
    address: {
        type: String,
        required: true,
        minlength: [6, "invalid address"]
    },
    area:{
        type:String
    },
    city:{
        type:String
    },
    category: {
        type: String,
        required: true,
        default: "for sale"
    },
    priceRate: {
        type: Number,
        required: true,
        validate(param) {
            if (param < 0) {
                throw new Error("invalid price rate")
            }
        }
    },
    Type: {
        type: String,
        required: true,
        default: "house"
    },
    size: {
        type: String,
        required: true,
        default:"Z x Y"
    },
    detail: detailSchema,
    owner: {
        type: String,
        required: true,
        ref: 'client'
    }
})

propertySchema.pre('remove',async function(next){
try{
    console.log('hello from pre')
    let asset = this
    const users = await User.find({})
    console.log(users)
    // const assets = await User.updateMany({},
    //     {$pull:{favourite:asset._id}})
    // console.log(assets)
    next()
}
catch(err){
    console.log(err)
}}
)
const property = mongoose.model("property", propertySchema)
module.exports = property