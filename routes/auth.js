const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')

//REGISTER
router.post("/register", async(req, res) =>{
    const newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    })

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(err);
    }
})

//Login

router.post("/login", async(req, res) => {
    try {
        
        const user = await User.findOne({username: req.body.username});

        if(!user) {
            return res.status(401).json("Invalid Credentials!")
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const password = hashedPassword.toString(CryptoJS.enc.Utf8)

        if(password !== req.body.password) {
            return res.status(401).json("Invalid Credentials!")
        }else{
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.JWT_SEC, {expiresIn:"30d"})

            const {password, ...others} = user._doc;
            return res.status(200).json({...others, accessToken})
        }

    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = router