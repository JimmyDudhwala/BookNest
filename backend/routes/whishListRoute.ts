import express from 'express'
import { authenticatedUser } from '../middleware/authMiddlerware'
import * as  wishListController from '../controllers/wishListController'

const router  = express.Router()

router.post('/add',authenticatedUser,wishListController.addToWhisList)
router.delete('/remove/:productId',authenticatedUser,wishListController.removeFromWishList)
router.get('/:userId',authenticatedUser,wishListController.getWishListByUser)

export default router