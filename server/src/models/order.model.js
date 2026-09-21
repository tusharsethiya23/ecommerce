
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        address: {

            state: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true
            },
            house: {
                type: String,
                required: true
            },
            zip: {
                type: String,
                required: true
            }
        },
        products: [

            {
                product: {
                    title: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                        required: true
                    },
                    price: {
                        amount: {
                            type: Number,
                            required: true
                        },
                        currency: {
                            type: String,
                            required: true
                        }

                    },
                    images: {
                        type: String,
                        required: true
                    },
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        requred: true
                    }
                },

                quantity:{
                    type:Number,
                    required:true
                },
                size:{
                    type:String,
                    required:true,
                }

            }

        ],
        totalPrice:{
            amount:{
                type:Number,
                required:true
            },
            currency:{
                type:String,
                required:true
            }
        },
        status:{
            type:String,
            requird:true,
            enum:["PLACED","CONFIRMED", "SHIPPED","DELIVERED", "CANCELLED" ],
            default:"PLACED"
        }

    },{timestamps:true}
)

const orderModel = mongoose.model("orders", orderSchema)

export default orderModel;