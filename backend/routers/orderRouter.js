const express = require("express");
const OrderRouter = express.Router();
const OrderController = require("../controllers/orderController")


OrderRouter.post('/order-place', OrderController.orderPlace);
OrderRouter.post('/success', OrderController.orderSuccess);
OrderRouter.get('/all',authorize, OrderController.getAllOrders);
OrderRouter.get('/details/:order_id', OrderController.getOrderDetails);
OrderRouter.get('/user/:user_id', OrderController.getUserOrders);
OrderRouter.post('/cancel', OrderController.cancelOrder);


module.exports = OrderRouter;