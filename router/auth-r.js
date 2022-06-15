const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../model/user-m')
const authenticateToken = require('../helpers/authencate-token')


// sign up request---------------------------------------------------------------
router.post('/signup', async (req, res) => {

    // check all request body data
    if (!req.body.name || !req.body.phone || !req.body.password) return res.status(400).send({error: "Information Not Fully given to create new User"})

    // create a new user object using data from request body
    const user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })

    // save user object to database
    const userafterSignUp = await user.save()

    // check if object successfully saved to database
    if (!userafterSignUp) return res.status(400).send({error: "Error rrr"})

    // make a sign up token for the user 
    const token = jwt.sign(
        {userId: user._id,},
        process.env.ACCESS_TOCKEN_SECRET//,
        // {expiresIn: '1d'}
    )
    // delete  password befotre sending to user
    delete user.passwordHash
    
    // send user object and token to the user
    res.status(200).send({
        authToken: token,
        user: user
    })
})


// login request --------------------------------------------------------------------
router.post('/login', async (req, res) => {

    // check all request body data
    if (!req.body.phone || !req.body.password) return res.status(400).send({error : 'Use Email And Password To LogIn'})

    // find user by phone from request body data
    const user = await User.findOne({ phone: req.body.phone })

    // check if user is valid 
    if (!user) return res.status(400).send({error: 'The User not found'})

    // check if the the password match 
    if (!bcrypt.compareSync(req.body.password, user.passwordHash)) return res.status(400).send({error: 'Password Worng'})

    // create a token
    const token = jwt.sign(
        {userId: user._id,},
        process.env.ACCESS_TOCKEN_SECRET//,
        // {expiresIn: '1d'}
    )

    // delete  password befotre sending to user
    delete user.passwordHash

    //  send to the user 
    res.status(200).send(
    {
        authToken: token,
        user: user
    })
})

//---------------------------------------------------------------------------
// current user request -- logged in user can request for his/ her user information 
router.get('/current-user', authenticateToken, async (req, res) => {
    // find user by id
    let user = await User.findById(req.user.userId).select('-passwordHash')

    // check if user valid 
    if (!user) res.status(400).send({error: 'No User'})

    // send user object to the user 
    res.status(200).send(user)
})


// export this router 
module.exports = router