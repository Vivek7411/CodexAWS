const express = require('express')
const loginRouter = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/login', async(req, res) => {
    const { email, password } = req.body
    try{
        const user = await User.findOne({ email })
        if(!user) {
        return res.status(400).json({message: 'User does not exits'});
        }

        //Compare input password with hashed password
        const isPassValid = await bcrypt.compare(password, user.password)
        if(!isPassValid) {
            return res.status(400).json({message: 'Invalid credentials (username/email/password)'})
        }

        //Generate JWT Token
        const token = jwt.sign({_id : user._id}, process.env.SECRET_KEY , {expiresIn: '365d'})
        // localStorage.setItem('userId', user.id);  // ✅ This is important
        // res.status(200).json({token, email: user.email});
        res.status(200).json({token, 
            user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }});
    } catch(error) {
        res.status(500).json({message: 'Error in Logging in'})
    }
})

module.exports = loginRouter