import { body } from "express-validator";
import { validateRequest } from "../utils/validator";

export const productValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("title is requried")
        .isLength({ min: 10 }).withMessage("title must be minimum 10 characters long")
        .isLength({ max: 50 }).withMessage("title should not be more than 50 characters"),

    body("description")
        .trim()
        .notEmpty().withMessage("description is required")
        .isLength({ min: 50 }).withMessage("description should be minimum 50 characters")
        .isLength({ max: 1000 }).withMessage("descritpion should not be nore than 1000 characters"),

    body("categories")
        .isArray().withMessage("categories must be an array"),

    body("categories.*")
        .trim()
        .notEmpty().withMessage("categories is required")
        .isString().withMessage("categories must be a string"),

    body("price.amount")
        .notEmpty().withMessage("amount is required")
        .isFloat({ min: 0 }).withMessage("price should not be empty"),

    body("price.currency")
        .notEmpty().withMessage("currency is required")
        .isIn(["INR", "USD", "EUR", "CAD"]).withMessage("currency must be one of USD, INR, EUR, CAD"),

    body("sizes")
        .isArray().withMessage("sizes must be an array"),

    body("size.*.size")
        .notEmpty().withMessage("Size is required")
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Size must be one of XS, S, M, L, XL, XXL"),

    body("size.*.stock")
        .notEmpty().withMessage("quantity is required")
        .isInt({ min: 0 }).withMessage("quantity cannot be negative"),


    validateRequest

]
export const updateProductValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty().withMessage("title is requried")
        .isLength({ min: 10 }).withMessage("title must be minimum 10 characters long")
        .isLength({ max: 50 }).withMessage("title should not be more than 50 characters"),

    body("description")
        .optional()
        .trim()
        .notEmpty().withMessage("description is required")
        .isLength({ min: 50 }).withMessage("description should be minimum 50 characters")
        .isLength({ max: 1000 }).withMessage("descritpion should not be nore than 1000 characters"),

    body("categories")
        .optional()
        .isArray().withMessage("categories must be an array"),

    body("categories.*")
        .optional()
        .trim()
        .notEmpty().withMessage("categories is required")
        .isString().withMessage("categories must be a string"),

    body("price.amount")
        .optional()
        .notEmpty().withMessage("amount is required")
        .isFloat({ min: 0 }).withMessage("price should not be empty"),

    body("price.currency")
        .optional()
        .notEmpty().withMessage("currency is required")
        .isIn(["INR", "USD", "EUR", "CAD"]).withMessage("currency must be one of USD, INR, EUR, CAD"),

    body("sizes")
        .optional()
        .isArray().withMessage("sizes must be an array"),

    body("size.*.size")
        .optional()
        .notEmpty().withMessage("Size is required")
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Size must be one of XS, S, M, L, XL, XXL"),

    body("size.*.stock")
        .optional()
        .notEmpty().withMessage("quantity is required")
        .isInt({ min: 0 }).withMessage("quantity cannot be negative"),


    validateRequest

]
