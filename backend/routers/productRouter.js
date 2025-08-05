const express = require('express');
const ProductRouter = express.Router();
const productController = require('../controllers/productController');
const fileUpload = require('express-fileupload');
const authorize = require('../middleware/authorozation'); // <-- Assuming this is your auth middleware

// ✅ All admin-only routes must have the 'authorize' middleware
ProductRouter.post("/create", authorize, fileUpload({ createParentPath: true }), productController.create);
ProductRouter.get("/:id?", productController.read); // Public read access
ProductRouter.delete("/delete/:id", authorize, productController.delete);
ProductRouter.patch("/status/:id", authorize, productController.status);
ProductRouter.post("/multiple-images/:id", authorize, fileUpload({ createParentPath: true }), productController.multipleImages);
ProductRouter.put("/update/:id", authorize, fileUpload({ createParentPath: true }), productController.update);

module.exports = ProductRouter;