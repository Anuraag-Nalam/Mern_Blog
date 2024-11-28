import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Mongo Connected')
}).catch((err) => {
    console.log("some error")
})
app.listen(3000, () => {
    console.log("server is running on 3000!")
})