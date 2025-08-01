const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/userController")


UserRouter.post('/register', UserController.register);
UserRouter.post('/login', UserController.login);
UserRouter.put("/address/:userId", UserController.updateAddress);
UserRouter.get("/address/:userId", UserController.getUserAddresses);
UserRouter.post("/add-address", UserController.addAddress);
UserRouter.post("/delete-address", UserController.deleteAddress);
UserRouter.put("/change-password/:userId", UserController.changePassword);




module.exports = UserRouter;