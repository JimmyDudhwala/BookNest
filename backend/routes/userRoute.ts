import express from 'express'
import { authenticatedUser } from '../middleware/authMiddlerware'
import * as  userController from '../controllers/userController'

const router  = express.Router()

router.post('/profile/update/:userId',authenticatedUser,userController.updateUserProfile)

export default router