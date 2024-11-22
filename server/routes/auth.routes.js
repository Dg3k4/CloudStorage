const Router = require("express")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const {check, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const config = require("config")
const router = new Router()
const authMiddleWare = require("../middleware/auth.middleware")
const fileService = require("../service/fileService")
const File = require("../models/File")

router.post("/registration",
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Password must be longer than 3 and shorter than 12").isLength({min: 3, max:12})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Incorrect request", errors})
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: `User with email: ${email} already exist`})
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = new User({email, password: hashPassword})
        await user.save()
        await fileService.createDir(req, new File({user: user.id, name:  ""}))
        return res.json({message: "User has been created"})

    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})

router.post("/login",
    async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message:"User with this email not exist"})
        }
        const isPassValid = bcrypt.compareSync(password, user.password)

        if (!isPassValid) {
            return res.status(400).json({message: "Invalid password"})
        }
        const token = await jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "24h"});

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                avatar: user.avatar
            }
        })
    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})

router.get("/auth", authMiddleWare,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})
            const token = await jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "24h"});

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

module.exports = router