
import {body} from 'express-validator'
import { validateRequest } from '../utils/validator.js'

export const registerValidator = [
    body("email")
    .trim()
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("email is not valid"),

    body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({min:3}, {max:20}).withMessage("name must be atleast 3 characters long and less than 20 characters"),
    

    body("password")
    .trim()
    .notEmpty().withMessage("password is required")
    .isLength({min:6}).withMessage("password must be atleast 6 characters long "),

    body("role")
    .optional(),

    validateRequest
]

export const loginValidator = [
    body("email")
    .trim()
    .notEmpty().withMessage("email is requierd")
    .isEmail().withMessage("email is not valid"),

    body("password")
    .trim()
    .notEmpty().withMessage("password is required"),

    validateRequest
]