import express from 'express'
import multer from 'multer'
import { productValidator, updateProductValidator } from '../validators/product.validator.js'
import { createProduct, deleteImages, getProducts, getProductsBySeller, togglePublishProduct, updateProduct } from '../controllers/product.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const upload = multer({storage:multer.memoryStorage()})

const routes = express.Router()


routes.post("/",upload.array("images", 5),authMiddleware,productValidator, createProduct)
routes.post("/updateProduct/:productId", upload.array("images",5), authMiddleware,updateProductValidator, updateProduct)
routes.delete("/deleteImages/:productId/:imageId",authMiddleware, deleteImages)
routes.post("/publishProduct/:productId",authMiddleware,togglePublishProduct)

routes.get("/bySeller",authMiddleware, getProductsBySeller )
routes.get("/", getProducts)

export default routes