const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")


//REGISTRO
router.post("/register", (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
    })
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err)
    }

    //LOGIN
    router.post("/login", async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            !user && res.status(401).json("Dados incorretos")

            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)

            const originalPw = hashedPassword.toString(CryptoJS.enc.Utf8)
            OriginalPw !== req.body.password && res.status(401).json("Dados incorretos")

            const acessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            },
                process.env.JWT_SEC,
                { expiresIn: "3d" }
            )

            const { password, ...outros } = user._doc

            res.status(200).json(...outros, acessToken)
        } catch (err) {
            res.status(500).json(err)
        }
    })
})

module.exports = router;
