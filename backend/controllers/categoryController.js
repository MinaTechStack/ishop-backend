const { generateUniqueName } = require("../helper");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const fs = require("fs");

const categoryController = {
    async create(req, res) {
        try {
            if (!req.body.name || !req.body.slug || !req.files?.categoryImage) {
                return res.send({ msg: "Please fill all the fields", flag: 0 });
            }

            const categoryImage = req.files.categoryImage;
            const category_image = generateUniqueName(categoryImage.name);
            const destinationPath = `./public/images/category/${category_image}`;

            categoryImage.mv(destinationPath, async (err) => {
                if (err) {
                    return res.send({ msg: "Unable to upload image", flag: 0 });
                }

                const findCategory = await CategoryModel.findOne({ name: req.body.name });
                if (findCategory) {
                    return res.send({ msg: "Category Already Exists", flag: 0 });
                }

                const category = new CategoryModel({
                    name: req.body.name,
                    slug: req.body.slug,
                    categoryImage: category_image,
                });

                try {
                    await category.save();
                    res.send({ msg: "Category Created Successfully", flag: 1 });
                } catch (err) {
                    res.send({ msg: "Unable to Create Category", flag: 0, errmsg: err.message });
                }
            });
        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async read(req, res) {
        try {
            const id = req.params.id;

            if (id) {
                const category = await CategoryModel.findById(id);
                return res.send({ msg: "Category found successfully", flag: 1, categories: category });
            }

            const categories = await CategoryModel.find().sort({ createdAt: -1 });
            const data = [];

            const allPromise = categories.map(async (cat) => {
                const productCount = await ProductModel.countDocuments({ categoryId: cat._id });
                data.push({
                    ...cat.toObject(),
                    productCount
                });
            });

            await Promise.all(allPromise);

            res.send({ msg: "Categories found successfully", flag: 1, categories: data });
        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;
            const category = await CategoryModel.findById(id);

            if (!category) {
                return res.send({ msg: "Category not found", flag: 0 });
            }

            const imagePath = `./public/images/category/${category.categoryImage}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log("Image deleted successfully:", imagePath);
            } else {
                console.log("Image file does not exist:", imagePath);
            }

            await CategoryModel.findByIdAndDelete(id);
            res.send({ msg: "Category Deleted Successfully", flag: 1 });
        } catch (error) {
            console.error("Error while deleting category:", error.message);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async statusUpdate(req, res) {
        try {
            const id = req.params.id;
            const category = await CategoryModel.findById(id);

            if (!category) {
                return res.send({ msg: "Category not found", flag: 0 });
            }

            await CategoryModel.updateOne({ _id: id }, { $set: { status: !category.status } });
            res.send({ msg: "Category Status Updated Successfully", flag: 1 });
        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id;
            const categoryImage = req.files?.categoryImage;
            const category = await CategoryModel.findById(id);

            if (!category) {
                return res.send({ msg: "Category not found", flag: 0 });
            }

            let updatedImageName = category.categoryImage;

            if (categoryImage) {
                const oldImagePath = `./public/images/category/${category.categoryImage}`;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                updatedImageName = generateUniqueName(categoryImage.name);
                const destinationPath = `./public/images/category/${updatedImageName}`;
                await categoryImage.mv(destinationPath);
            }

            const existing = await CategoryModel.findOne({ name: req.body.name, _id: { $ne: id } });
            if (existing) {
                return res.send({ msg: "Category Already Exists", flag: 0 });
            }

            category.name = req.body.name;
            category.slug = req.body.slug;
            category.categoryImage = updatedImageName;

            await category.save();
            res.send({ msg: "Category Updated Successfully", flag: 1 });
        } catch (error) {
            console.log("Update error:", error.message);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    }
};

module.exports = categoryController;
