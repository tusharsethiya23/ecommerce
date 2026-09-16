
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export const authMiddleware = async(req,res,next)=>{

    const token = req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(400).json({message:"token expired or not found"})
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET_KEY)
        req.user = decoded
        next()
    }catch(error){
        console.log(error)
    }
}