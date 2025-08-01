const express = require("express");
const adminController = require("../controllers/adminController");
const AdminRouter = express.Router();

AdminRouter.post("/login", adminController.login);
AdminRouter.get("/logout", (req, res) => {
    res.clearCookie("admin_token", {
        httpOnly: true,
        secure: true, // true if using HTTPS
        sameSite: 'None',
        path: '/',      // this is CRUCIAL
    });
    res.status(200).send({ message: "Logged out" });

})

module.exports = AdminRouter

