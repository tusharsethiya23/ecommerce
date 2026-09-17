import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { addToCartValidator } from '../validators/cart.validator.js'
import { addToCart } from '../controllers/cart.controller.js'

const routes = express.Router()

routes.use(authMiddleware)

routes.post("/add/product/:productId", addToCartValidator, addToCart )

export default routes