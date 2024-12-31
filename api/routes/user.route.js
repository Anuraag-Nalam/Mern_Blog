import express from 'express'
import { deleteUser, getAllUsers, getuser, signOut, test, updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router()
router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)
router.delete('/delete/:userId', verifyUser, deleteUser)
router.post('/signout', signOut)
router.get('/getUsers', verifyUser, getAllUsers)
router.get('/:userId', getuser)
export default router;
