const express = require('express');
const CategoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const fileUpload = require('express-fileupload');
const authorize = require('../middleware/authorozation');

CategoryRouter.post("/create", fileUpload({ createParentPath: true }), categoryController.create);
CategoryRouter.get("/:id?", categoryController.read);
CategoryRouter.delete("/delete/:id", categoryController.delete);
CategoryRouter.patch("/status/:id",authorize, categoryController.statusUpdate);
CategoryRouter.put("/update/:id", fileUpload({ createParentPath: true }), categoryController.update);
module.exports = CategoryRouter;
