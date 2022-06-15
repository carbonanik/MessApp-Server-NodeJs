const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model
const ObjectId = Schema.Types.ObjectId

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    email: String,
    address: String,
    conversationWith: [ObjectId],
    connectionWith: [ObjectId]
})

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

userSchema.virtual('id').get(function() {
    return this._id
})

module.exports = model('User', userSchema)