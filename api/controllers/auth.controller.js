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
    console.log(email, password, 'check creds here')
    if (!email || !password || email == '' || password == '') {
        next(errorHandler(500, 'All Fields are required here'))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'User Not Found!'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid Credentials'))
        }
        const token = jwt.sign(
            {
                id: validUser._id,
                isAdmin: validUser.isAdmin
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

export const google = async (req, res, next) => {
    //return User if success else data.message
    const { email, name, profilePicture } = req.body
    console.log(profilePicture, 'dp inside controller')
    // console.log(photoURL, 'find the url ohoto here')
    try {
        //find the user
        const user = await User.findOne({ email })
        console.log('user found ', user)
        if (user) {
            // console.log('user came1', newUser)
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
            const { password, ...rest } = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random.toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            console.log(profilePicture, 'dp inside controller else case')
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: profilePicture,
            })
            await newUser.save()
            console.log('user came', newUser)
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET)
            const { password, ...rest } = newUser._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
    }
    catch (e) {
        console.log('some error', e)
    }
}