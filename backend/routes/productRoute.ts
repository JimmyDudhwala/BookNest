import express from 'express'
import { authenticatedUser } from '../middleware/authMiddlerware'
import { multerMiddleware } from '../config/cloudnaryConfig'
import * as  productController from '../controllers/productController'

const router  = express.Router()

router.post('/',authenticatedUser, multerMiddleware, productController.createProduct)
router.get('/', productController.getAllProducts)
router.get('/:id',authenticatedUser, multerMiddleware, productController.getProductById)
router.delete('/seller/:productId',authenticatedUser, multerMiddleware, productController.deleteProduct)
router.get('/seller/:sellerId',authenticatedUser, multerMiddleware, productController.getProductBySellerId)

export default router