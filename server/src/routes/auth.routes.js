import epxress from 'express'
import { loginValidator, registerValidator } from '../validators/auth.validator.js'
import { loginUser, registerUser } from '../controllers/auth.controller.js'

const routes = epxress.Router()


routes.post("/register",registerValidator, registerUser )
routes.post("/login", loginValidator, loginUser)

export default routes

