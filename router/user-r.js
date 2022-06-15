// Router
const express = require('express')
const router = express.Router()

const User = require('../model/user-m')

router.get('/list', async (req, res) => {
    const userList = await User.find().select('-passwordHash')
    if (!userList) return res.status(400).json('user list not be found!')
    res.send(userList)
})

router.get('/selected', async (req, res) => {
    const records = await User.find().where('_id').in(req.body.ids).exec()
    if (!records) return res.status(400).json('user list not be found!')
    res.send(records)
})

router.get('/selected_by_phone_no', async (req, res) => {
    const records = await User.find().where('phone').in(req.body.phone).exec()
    if (!records) return res.status(400).json('user list not be found!')
    res.send(records)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) return res.status(400).json('user not be found!')
    res.send(user)
})


module.exports = router