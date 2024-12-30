import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { create, getPosts, deletePosts } from '../controllers/post.controller.js'

const router = express.Router()
router.post('/create', verifyUser, create)
router.get('/getPosts', getPosts)
router.delete('/deletePost/:postId/:userId', verifyUser, deletePosts)

export default router