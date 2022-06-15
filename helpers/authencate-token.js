// MiddleWare
require('dotenv/config')
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).send({error: 'Do Not Have Access'})

    jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send({error: 'Invalid Tocken'})
        req.user = user
        console.log(user)
        next()
    })
}

module.exports = authenticateToken