import userModel from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from "../config/config.js"


export const registerUser = async (req, res) => {

    const { name, email, password, role } = req.body

    const isUserExists = await userModel.findOne({ email: email })

    if(isUserExists) {
        return res.status(400).json({
            message: "user already exists",
            errors: {
                message: "user already exists",
                field: 'email'
            }
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create(
        {
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        }
    )

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        }, config.JWT_SECRET_KEY
    )

    res.status(201).json({
        message: "user created successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, token
    })

}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email: email }).select("+password")

    if (!user) {
        return res.status(400).json({ message: "invalid email or password" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        return res.status(400).json({ message: "invalid email or password" })
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        }, config.JWT_SECRET_KEY
    )


    return res.status(200).json({
        message: "user logged in successfully", data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, token
    })


}