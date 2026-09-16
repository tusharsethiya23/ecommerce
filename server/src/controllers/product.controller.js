import productModel from "../models/product.model.js"
import { deleteFile, uploadFiles } from "../services/storage.service.js"


export const createProduct = async (req, res) => {

    const user = req.user

    if (user.role !== 'seller') {
        return res.status(404).json({ message: "only seller can create product" })
    }

    const { title, description, price: { currency, amount }, categories, sizes } = req.body

    const errors = []

    const files = req.files

    if (!req.files || req.files.length === 0) {
        errors.push({
            field: "images",
            message: "atleast one image is required"
        })
    }

    if (errors.lenght > 0) {
        return res.status(400).json(errors)
    }

    const urls = await Promise.all(req.files.map(async (file, index) => {

        const fileName = `${Date.now()}-${file.originalname}`
        const response = await uploadFiles(file.buffer.toString("base64"), fileName)


        return {
            url: response.url,
            imagekitId: response.fileId,
            order: index + 1
        }

    }))

    const product = await productModel.create(
        {
            title,
            description,
            price: {
                amount,
                currency
            },
            categories,
            images: urls,
            seller: user.id,
            sizes
        }
    )

    res.status(201).json({
        message:
            "product created successfully",
        data: {
            product: {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                categories: product.categories,
                images: product.images,
                seller: product.seller,
                sizes: product.sizes,
                isPublished: product.isPublished
            }
        }
    })

}

export const updateProduct = async (req, res) => {

    const { title, description, price, categories, sizes } = req.body

    const user = req.user;
    const { productId } = req.params

    if (user.role !== 'seller') {
        return res.status(403).json({ message: "only seller can update products" })
    }

    const product = await productModel.findOne({ _id: productId })

    if (!product) {
        return res.status(404).json({ message: "product not found" })
    }

    if (product.seller.toString() !== user.id) {
        return res.status(403).json({ message: "You are not authorized to access this product" })
    }

    const totalImages = product.images.length + (req.files ? req.files.length : 0)

    if (totalImages > 5) {
        return res.status(400).json({ message: "you can upload a maximum of 5 images" })
    }

    if (req.files && req.files.length > 0) {

        const urls = await Promise.all(req.files.map(async (file, index) => {

            const fileName = `${Date.now()}-${file.originalname}`
            const response = await uploadFiles(file.buffer.toString("base64"), fileName)

            return {
                url: response.url,
                imagekitId: response.fileId,
                order: product.images.length + index + 1
            }
            
        }))
        product.images.push(...urls)
    }


    if (title) product.title = title
    if (description) product.description = description
    if (price) product.price = price
    if (categories) product.categories = categories
    if (sizes) product.sizes = sizes

    await product.save()

    return res.status(200).json({
        message: "Product updated successfully",
        data: {
            product: {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                categories: product.categories,
                images: product.images,
                seller: product.seller,
                sizes: product.sizes,
                isPublished: product.isPublished
            }
        }
    })

}

export const deleteImages = async (req, res) => {

    const user = req.user

    if (user.role !== "seller") {
        return res.status(400).json({ message: "you are not authorized to delete images" })
    }

    const { productId, imageId } = req.params

    const product = await productModel.findOne({ _id: productId })

    if (!product) {
        return res.status(404).json({ message: "product not found" })
    }

    if (user.id !== product.seller.toString()) {
        return res.status(403).json({ message: "You are not authorized to do changes in this product" })
    }

    const fileId = product.images.id(imageId)

    await deleteFile(fileId.imagekitId)
    await productModel.findOneAndUpdate(
        {
            _id: productId
        },
        {
            $pull: {
                images: {
                    _id: imageId
                }
            }
        }
    )

    return res.status(200).json({ message: "Image deleted successfully" })


}

export const togglePublishProduct = async (req, res) => {

    const user = req.user;
    const { productId } = req.params

    if (user.role !== 'seller') {
        return res.status(403).json({ message: "only seller can publish or unpublish products" })
    }

    const product = await productModel.findOne({ _id: productId })

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }


    if (user.id !== product.seller.toString()) {
        return res.status(403).json({ message: "You are not authorized to publish or unpublish this product" })
    }

    await productModel.findOneAndUpdate(
        {
            _id: productId
        },
        {
            isPublished: !product.isPublished
        }
    )

    return res.status(200).json({
        message: product.isPublished ?
            "product unpublished successfully" :
            "product published successfully",
        data: {
            product: {
                id: product._id,
                isPublished: !product.isPublished
            }
        }
    })
}

export const getProductsBySeller = async (req, res) => {

    const user = req.user

    if (user.role !== 'seller') {
        return res.status(403).json({ messsge: "only seller are authorized to see their products" })
    }


    const totalProducts = await productModel.countDocuments({ seller: user.id })


    const totalPages = Math.ceil(totalProducts / 5)

    const page = req.query.page ? Math.min(parseInt(req.query.page), totalPages) : 1

    const skip = 5 * (page - 1)

    const products = await productModel.find({ seller: user.id })
        .skip(skip)
        .limit(5)


    return res.status(200).json({
        message: "products retrieved successfully",
        data: {
            products: {
                products: products,
                totalPages: totalPages,
                currentPage: page

            }
        }
    },)

}

export const getProducts = async (req, res) => {

    const totalProducts = await productModel.countDocuments()

    const totalPages = Math.ceil(totalProducts / 20)

    const page = req.query.page ? Math.min(parseInt(req.query.page), totalPages) : 1

    const skip = 20 * (page - 1)

    const products = await productModel.find({ isPublished: true })
        .skip(skip)
        .limit(20)

    return res.status(200).json({
        message: "products retrieved successfully",
        data: {
            produts: {
                products: products,
                totalPages: totalPages,
                currentPage: page
            }
        }
    })

}