const express = require('express'); 
const colorRouter = express.Router();
const colorController = require('../controllers/colorController');

colorRouter.post("/create", colorController.create);
colorRouter.get("/:id?", colorController.read);
colorRouter.delete("/delete/:id", colorController.delete);
colorRouter.patch("/status/:id", colorController.statusUpdate);
colorRouter.put("/update/:id", colorController.update);
module.exports = colorRouter;
