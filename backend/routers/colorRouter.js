const express = require('express'); 
const colorRouter = express.Router();
const colorController = require('../controllers/colorController');
const authorize = require('../middleware/authorozation');

colorRouter.post("/create",authorize, colorController.create);
colorRouter.get("/:id?", colorController.read);
colorRouter.delete("/delete/:id",authorize, colorController.delete);
colorRouter.patch("/status/:id", authorize, colorController.statusUpdate);
colorRouter.put("/update/:id",authorize, colorController.update);
module.exports = colorRouter;
