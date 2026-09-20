import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                    required: true
                },
                quantity: {
                    type: Number,
                    min: 1,
                    required: true
                },
                size: {
                    type: String,
                    required: true,
                    enum: ["XS", "S", "M", "L", "XL", "XXL"]
                }
            }
        ]
    }
)

const cartModel = mongoose.model("carts", cartSchema)

export default cartModel