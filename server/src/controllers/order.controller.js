import cartModel from "../models/cart.model.js"
import orderModel from "../models/order.model.js"
import productModel from "../models/product.model.js"


export const createOrder = async (req, res) => {

    const user = req.user

    const cart = await cartModel.findOne({ user: user.id }).populate("products.product")

    if (!cart) {
        return res.status(404).json({ message: "cart not found." })
    }

    if (cart.length === 0) {
        return res.status(200).json({ message: "cart is empty" })
    }

    const publishedProduct = cart.products.filter(p => p.product.isPublished)

    if (publishedProduct.length !== cart.products.length) {
        return res.status(400).json({ message: "some products are not published in the cart" })
    }

    const sizeErrors = []

    cart.products.forEach(p => {

        const productSize = p.size

        const size = p.product.sizes.find(product => {
            return product.size === productSize
        })

        if (!size) {
            sizeErrors.push(
                {
                    product: p.product._id,
                    message: "size not available for this product"
                }
            )
            return
        }

        const isStockAvailable = size.quantity >= p.quantity

        if (!isStockAvailable) {
            sizeErrors.push(
                {
                    product: p.product._id,
                    message: `only ${size.stock} items available for ${productSize}`
                }
            )
            return
        }

        if (sizeErrors.length > 0) {
            return res.status(400).json(
                {
                    message: "some products have size issue or stock issue",
                    errors: sizeErrors
                }
            )
        }

    })
    await productModel.bulkWrite(
        cart.products.map(product => {
            return {
                updateOne: {
                    filter: {
                        _id: product.product._id,
                        "sizes.size": product.size
                    },
                    update: {
                        $inc: {
                            "sizes.$.stock": -product.quantity
                        }
                    }
                }
            }
        })
    )


    const order = await orderModel.create(
        {
            user: user.id,
            address: req.body.address,
            products: cart.products.map(product => {
                return {
                    product: {
                        title: product.product.title,
                        description: product.product.description,
                        price: product.product.price,
                        images: product.product.images[0]?.url ?? "",
                        productId: product.product._id

                    },
                    quantity: product.quantity,
                    size: product.size
                }
            }),
            totalPrice: {
                amount: cart.products.reduce((total, product) => {
                    return total + product.product.price.amount * product.quantity
                }, 0),
                currency: "INR"
            }
        }
    )

    return res.status(200).json({
        message: "ordered retrieved successfully",
        data: {
            order
        }
    })


}