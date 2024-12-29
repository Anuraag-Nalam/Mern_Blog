import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({ message: 'API working' })
}

export const updateUser = async (req, res, next) => {
    console.log(req.user)
    console.log(req.body.username)
    if (req.user.id != req.params.userId) {
        return next(errorHandler(401, 'You are not allowed to update user'))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password length must be greater than 6'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            console.log('issue spotted')
            return next(errorHandler(400, 'Username length should be between 6 and 20 characters'))
        }
        if (req.body.username.includes(' ')) {
            return (next(errorHandler(400, 'Username should not have spaces')))
        }
        if (req.body.username != req.body.username.toLowerCase()) {
            return (next(errorHandler(400, 'Username should only have lower case characters')))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username should only have lower case characters'))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, {
            new: true
        }
        )
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    }
    catch (err) {
        next(err)
    }
}