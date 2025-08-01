const { generateUniqueName } = require("../helper");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const ColorModel = require("../models/colorModel");
const fs = require("fs");


const productController = {
    async create(req, res) {
        try {
            if (!req.body.name || !req.body.slug) {
                return res.send({ msg: "Please fill all the fields", flag: 0 })
            }


            const thumbnail = req.files.thumbnail;
            const image = generateUniqueName(thumbnail.name);
            const destinationPath = `./public/images/product/${image}`;
            thumbnail.mv(
                destinationPath,
                async (err) => {
                    if (err) {
                        return res.send({ msg: "Unable to upload image", flag: 0 });
                    }
                    const findProduct = await ProductModel.findOne({ name: req.body.name });
                    if (findProduct) {
                        return res.send({ msg: "Product Already Exists", flag: 0 })
                    }


                    const product = new ProductModel({
                        ...req.body,
                        thumbnail: image,
                        colors: JSON.parse(req.body.colors)
                    })
                    product.save()
                        .then(
                            () => {
                                res.send({ msg: "Product Created Successfully", flag: 1 });

                            }).catch(
                                (err) => {
                                    res.send({ msg: "Unable to Create Product", flag: 0, errmsg: err.message });
                                }
                            )


                }
            )

        }
        catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async read(req, res) {
        try {
            const id = req.params.id;
            let products = null;

            if (id) {
                products = await ProductModel.findById(id)
                    .populate("categoryId", "name")
                    .populate("colors");
            } else {
                const filterQuery = {};

                // Category filtering
                if (req.query.category) {
                    const category = await CategoryModel.findOne({ slug: req.query.category });
                    if (category) {
                        filterQuery.categoryId = category._id;
                    } else {
                        return res.send({ msg: "Category not found", products: [], total: 0, flag: 1 });
                    }
                }

                // Color filtering
                if (req.query.color) {
                    const color = await ColorModel.findOne({ slug: req.query.color });
                    if (color) {
                        filterQuery.colors = { $in: [color._id] };
                    } else {
                        return res.send({ msg: "Color not found", products: [], total: 0, flag: 1 });
                    }
                }

                if (req.query.minPrice || req.query.maxPrice) {
                    const priceFilter = {};
                    if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
                    if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);

                    // Make sure you’re filtering on correct field name (price or finalPrice)
                    filterQuery.finalPrice = priceFilter;
                }
                const limit = req.query.limit ? parseInt(req.query.limit) : 0;
                products = await ProductModel.find(filterQuery).limit(limit)
                    .sort({ createdAt: -1 })
                    .populate("categoryId", "name")
                    .populate("colors");
            }

            res.send({
                msg: "Products found successfully",
                flag: 1,
                products: products,
                total: Array.isArray(products) ? products.length : 1
            });

        } catch (error) {
            console.error(error);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;
            const product = await ProductModel.findById(id);

            if (!product) {
                return res.send({ msg: "Product not found", flag: 0 });
            }

            const imagePath = `./public/images/product/${product.thumbnail}`;

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log("Image deleted successfully:", imagePath);
            } else {
                console.log("Image file does not exist:", imagePath);
            }

            await ProductModel.findByIdAndDelete(id);

            res.send({ msg: "Product Deleted Successfully", flag: 1 });
        } catch (error) {
            console.error("Error while deleting product:", error.message);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async status(req, res) {
        try {
            const id = req.params.id;
            const flag = req.body.flag;
            const product = await ProductModel.findById(id);
            let message;

            if (product) {
                const productStatus = {};
                if (flag == 1) {
                    productStatus.topSelling = !product.topSelling;
                    message = "Top Selling updated"
                } else if (flag == 2) {
                    productStatus.stock = !product.stock;
                    message = "Stock updated"
                } else if (flag == 3) {
                    productStatus.status = !product.status;
                    message = "Status updated"
                }
                console.log(productStatus)
                await ProductModel.updateOne({ _id: id }, { $set: productStatus }).then(
                    () => {
                        res.send({ msg: message, flag: 1 })
                    }
                ).catch(
                    (err) => {
                        res.send({ msg: "Unable to update Product", flag: 0, errmsg: err.message });
                    }
                )
            } else {
                return res.send({ msg: "Product  not found", flag: 0 })
            }


        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async multipleImages(req, res) {


        try {
            const id = req.params.id;
            const images = req.files.image;

            const product = await ProductModel.findById(id);

            if (!product) {
                return res.send({ msg: "Product not found", flag: 0 });
            }

            let allimages = product.images ?? [];
            let uploadPromise = [];

            for (let image of images) {
                const img = generateUniqueName(image.name);
                const destinationPath = `./public/images/product/${img}`;
                allimages.push(img);
                uploadPromise.push(image.mv(destinationPath));
            }

            await Promise.all(uploadPromise)
            await ProductModel.updateOne(
                { _id: id },
                {
                    images: allimages
                }
            )
            await res.send({ msg: "Product Image Upload", flag: 1 })



        } catch (error) {
            console.error("Error while deleting product:", error.message);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async update(req, res) {
        try {
            const productId = req.params.id;
            const updateData = {
                name: req.body.name,
                slug: req.body.slug,
                shortDescription: req.body.shortDescription,
                longDescription: req.body.longDescription,
                originalPrice: req.body.originalPrice,
                discountPercentage: req.body.discountPercentage,
                finalPrice: req.body.finalPrice,
                categoryId: req.body.categoryId,
                colors: JSON.parse(req.body.colors), // Assuming colors are passed as a stringified JSON array
            };

            // Check if a new image file is provided
            if (req.files && req.files.thumbnail) {
                const thumbnail = req.files.thumbnail;
                const image = generateUniqueName(thumbnail.name);
                const destinationPath = `./public/images/product/${image}`;

                // Delete the old image if it exists
                const product = await ProductModel.findById(productId);
                const oldImagePath = `./public/images/product/${product.thumbnail}`;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                // Move the new image
                thumbnail.mv(destinationPath, async (err) => {
                    if (err) {
                        return res.send({ msg: "Unable to upload image", flag: 0 });
                    }

                    updateData.thumbnail = image; // Add new thumbnail image to update data

                    // Update product in the database
                    await ProductModel.findByIdAndUpdate(productId, updateData);
                    res.send({ msg: "Product Updated Successfully", flag: 1 });
                });
            } else {
                // If no new image is uploaded, just update other fields
                await ProductModel.findByIdAndUpdate(productId, updateData);
                res.send({ msg: "Product Updated Successfully", flag: 1 });
            }
        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    }



}
module.exports = productController;
