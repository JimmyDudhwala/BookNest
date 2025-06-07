import express from 'express'
import { authenticatedUser } from '../middleware/authMiddlerware'
import * as  cartController from '../controllers/cartController'

const router  = express.Router()

router.post('/add',authenticatedUser,cartController.addToCart)
router.delete('/remove/:cartItemId',authenticatedUser,cartController.removeFromCart)
router.get('/:userId',authenticatedUser,cartController.getCartByUser)

export default router