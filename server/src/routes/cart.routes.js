import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { addToCartValidator, removeFromCartValidator } from '../validators/cart.validator.js'
import { addToCart, getCartProducts, removeFromCart } from '../controllers/cart.controller.js'

const routes = express.Router()

routes.use(authMiddleware)

/*
METHOD:post
add to cart 
PATH: api/cart
 */
routes.post("/add/product/:productId", addToCartValidator, addToCart )

/*
METHOD:delete
remove from cart 
PATH: api/cart
 */

routes.delete("/remove/product/:productId", removeFromCartValidator ,removeFromCart)

routes.get("/", getCartProducts)

export default routes
