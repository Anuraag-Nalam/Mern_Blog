import express from 'express'
import { deleteUser, getAllUsers, signOut, test, updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router()
router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)
router.delete('/delete/:userId', verifyUser, deleteUser)
router.post('/signout', signOut)
router.get('/getUsers', verifyUser, getAllUsers)
export default router;
