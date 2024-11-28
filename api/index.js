import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import { stat } from 'fs'

dotenv.config()
const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Mongo Connected')
}).catch((err) => {
    console.log("some error")
})

app.listen(3000, () => {
    console.log("server is running on 3000!")
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})