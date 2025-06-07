import express from 'express'
import { authenticatedUser } from '../middleware/authMiddlerware'
import * as  orderController from '../controllers/orderController'

const router  = express.Router()
// Add both POST and PATCH routes for the same controller
router.post('/', authenticatedUser, orderController.createOrUpdateOrder);
router.patch('/', authenticatedUser, orderController.createOrUpdateOrder);
router.get('/',authenticatedUser,  orderController.getOrderbyUser)
router.get('/:id',authenticatedUser, orderController.getOrderById)
router.post('/payment-razorpay',authenticatedUser, orderController.createPaymentWithRazorpay)
router.post('/razorpay-webhook',authenticatedUser, orderController.handleRazorPayWebhook)

export default router