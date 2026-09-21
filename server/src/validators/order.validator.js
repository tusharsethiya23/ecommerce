import { body } from 'express-validator'
import { validateRequest } from '../utils/validator.js';

export const createOrderValidator = [
    body("address.state")
        .trim()
        .notEmpty().withMessage("state is required"),

    body("address.city")
        .trim()
        .notEmpty().withMessage("city is required"),

    body("address.street")
        .trim()
        .notEmpty().withMessage("street is required"),

    body("address.house")
        .trim()
        .notEmpty().withMessage("house is required"),

    body("address.zip")
        .trim()
        .notEmpty().withMessage("zip code is required"),

        validateRequest
];