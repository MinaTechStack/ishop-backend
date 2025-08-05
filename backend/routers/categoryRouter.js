const express = require('express');
const CategoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const fileUpload = require('express-fileupload');
const authorize = require('../middleware/authorozation');

CategoryRouter.post("/create",authorize, fileUpload({ createParentPath: true }), categoryController.create);
CategoryRouter.get("/:id?", categoryController.read);
CategoryRouter.delete("/delete/:id", authorize,categoryController.delete);
CategoryRouter.patch("/status/:id",authorize, categoryController.statusUpdate);
CategoryRouter.put("/update/:id",authorize, fileUpload({ createParentPath: true }), categoryController.update);
module.exports = CategoryRouter;
