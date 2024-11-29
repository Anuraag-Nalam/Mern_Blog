import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body
    console.log(username, password, email)
    if (!username || !password || !email || username == '' || email == '' || password == '') {
        return next(errorHandler(400, 'All Fields are required'))
    }
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username, email, password: hashedPassword
    })
    try {
        await newUser.save()
        res.json('SignUp successful')
    }
    catch (e) {
        next(e)
    }
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email == '' || password == '') {
        next(errorHandler(400, 'All Fields are required'))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'Invalid Credentials!'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid Credentials'))
        }
        const token = jwt.sign(
            {
                id: validUser._id,
            },
            process.env.JWT_SECRET
        )
        const { password: pass, ...rest } = validUser._doc
        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest)
    }
    catch (error) {
        next(error);
    }
}