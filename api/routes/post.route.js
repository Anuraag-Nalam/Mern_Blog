import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { create, getPosts, deletePosts, updatePost } from '../controllers/post.controller.js'

const router = express.Router()
router.post('/create', verifyUser, create)
router.get('/getPosts', getPosts)
router.delete('/deletePost/:postId/:userId', verifyUser, deletePosts)
router.put('/updatepost/:postId/:userId', verifyUser, updatePost)

export default router