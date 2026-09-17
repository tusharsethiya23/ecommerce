import { resolvePath } from "react-router";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";


export const addToCart = async(req,res)=>{

    const {productId} = req.params

    const {size:productSize, quantity} = req.body

    const product = await productModel.findById(productId)

    if(!product){
        return res.status(404).json({message:"Product not found"})
    }

    const size = product.sizes.find(s=>s.size === productSize)

    if(!size){
        return res.status(400).json({message:"Invalid size"})
    }

    if( quantity>size.stock){
        return res.status(400).json({message:`insufficient stock. Available ${size.stock} `})
    }

    const cart = (await cartModel.findOne({user:req.user.id}))?? await cartModel.create({user:req.user.id})

    const productInCart = cart.products.find(p=>p.product.toString()===productId && p.size === productSize)

    if(productInCart){
        const totalQuantity = productInCart.quantity  + quantity
        if(totalQuantity > size.stock){
            return res.status(400).json({message:`insufficient stock. Available: ${size.stock}`})
        }
        await cartModel.findOneAndUpdate(
            {
               user: req.user.id
            },
            {
                $set:{"products.$[elem].quantity":totalQuantity}
            },{
                arrayFilters:[{"elem.product":productId, "elem.size":productSize}]
            }
        )
    }else{
        await cartModel.findOneAndUpdate(
            {
                user:req.user.id
            },{
                $push:{
                    products:{
                        product:productId,
                        size:productSize,
                        quantity:quantity
                    }
                }
            }
        )
    }

    return res.status(201).json({message:"product added to the cart successfully"})

}

export const removeFromCart = async(req,res)=>{

    const user = req.user

    const {productId} = req.params

    const {size:productSize, quantity} = req.body

    const product = await productModel.findOne({_id:productId})

    if(!product){
        return res.status(404).json({message:"product not found"})
    }

    const cart = await cartModel.findOne({user:req.user.id})

    if(!cart){
        return res.status(400).json({message:"cart not found"})
    }

    const isInCart = cart.products.find(p=>p.product.toString() === productId && p.size === productSize)

    if(!isInCart){
        return res.status(404).json({message:"product not found in cart"})
    }

   if(quantity>=isInCart.quantity){
        await cartModel.findOneAndUpdate(
            {
                user:req.user.id
            },
            {
                $pull:{
                    products:{
                        product:productId,
                        size:productSize
                    }
                }
            }
        )
   }else{

    const newQuantity = isInCart.quantity - quantity

    await cartModel.findOneAndUpdate(
        {
            user:req.user.id
        },
        {
           $set:{
            "products.$[elem].quantity":newQuantity
           } 
        },
        {
            arrayFilters:[{"elem.product":productId, "elem.size":productSize}]
        }
    )

   }

   return res.status(200).json({message:"product removed from cart"})

}