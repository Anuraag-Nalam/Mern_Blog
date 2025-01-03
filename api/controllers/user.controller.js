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

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id != req.params.userId) {
        return (next(errorHandler(403, 'You are not allowed to delete this account')))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted')
    }
    catch (error) {
        console.log(error)
    }
}

export const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been Signed out')
    }
    catch (err) {
        next(err)
    }
}

export const getAllUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, 'You are not allowed to view users!'))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1
        const users = await User.find().sort({
            createdAt: sortDirection
        }).skip(startIndex).limit(limit)
        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest;
        })
        const totalUsers = await User.countDocuments();
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt: {
                $gte: oneMonthAgo
            }
        })
        res.status(200).json({
            users: usersWithoutPassword,
            lastMonthUsers,
            totalUsers
        })
    }
    catch (error) {
        next(error)
    }
}

export const getuser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        const { password, ...rest } = user._doc
        if (!user) {
            next(new errorHandler(404, 'User not found'))
        }
        res.status(200).json(rest)
    }
    catch (e) {
        next(e)
    }
}