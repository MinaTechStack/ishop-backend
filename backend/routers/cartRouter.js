const express = require("express");
const CartRouter = express.Router();
const CartController = require("../controllers/cartController")


CartRouter.post('/move-to-db', CartController.moveToDb);
CartRouter.post('/add-to-cart',CartController.addToCart);
CartRouter.post('/update-qty', CartController.updateQty);




module.exports = CartRouter;