import express from 'express'
import { authenticatedUser } from '../middleware/authMiddlerware'
import * as  addressController from '../controllers/addressController'

const router  = express.Router()

router.post('/create-or-update',authenticatedUser,addressController.createOrUpdateAddressByUserId)
router.get('/',authenticatedUser,addressController.getAddressById)

export default router