const mongoose = require('mongoose')
// require('mongoose-long')(mongoose)

// const {Type: {Long}} = mongoose

const messageSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    }, 
    receiver: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    localId: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    with: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

messageSchema.set('toObject', { virtuals: true })
messageSchema.set('toJSON', {virtuals: true})

messageSchema.virtual('id').get(function() {
    return this._id
})

module.exports = mongoose.model('Message', messageSchema)
