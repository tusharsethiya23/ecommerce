import express from 'express'
import authRouter from '../routes/auth.routes.js'
import productRouter from '../routes/product.routes.js'

const app = express()
app.use(express.json())

export default app

app.use("/api/auth", authRouter )
app.use("/api/product", productRouter )