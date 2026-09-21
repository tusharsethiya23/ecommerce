import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createOrderValidator } from '../validators/order.validator.js'
import { cancelOrder, createOrder, getOrders } from '../controllers/order.controller.js'

const router = express.Router()
router.use(authMiddleware)

router.post("/", createOrderValidator, createOrder)
router.get("/", getOrders)
router.post("/cancel/:orderId", cancelOrder)

export default router