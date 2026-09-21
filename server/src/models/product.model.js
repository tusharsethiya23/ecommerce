
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(

    {

        title: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 1000
        },
        categories: [
            {
                type: String,
                required: true
            }
        ],
        price: {
            currency: {
                type: String,
                required: true,
                enum: ["USD", "INR", "EUR"],
                default: "INR"
            },
            amount: {
                type: Number,
                required: true,
                min: 0,
            }
        },

        images: [
           {
            imagekitId:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true
            },
            order:{
                type:Number,
                required:true
            }
           }
        ],
        sizes:[
            {
                size:{
                    type:String,
                    required:true,
                    enum:["XS","S","M","L","XL","XXL"]
                },
                stock:{
                    type:Number,
                    required:true,
                    min:0
                }
            }
        ],
        seller:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        isPublished:{
            type:Boolean,
            required:true,
            default:false

        }
        
    },
    {
        timestamps:true
    }
)


const productModel = mongoose.model("product", productSchema)

export default productModel