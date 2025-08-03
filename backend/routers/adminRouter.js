const express = require("express");
const adminController = require("../controllers/adminController");
const authorize = require("../middleware/authorozation");
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

});
AdminRouter.get("/verify-token",authorize, (req, res) => {
    // If the 'authorize' middleware successfully executed, it means:
    // 1. An 'admin_token' cookie was present in the request to this endpoint.
    // 2. The token was successfully verified using process.env.SECRET_KEY.
    // 3. req.user now contains the decoded payload (e.g., { admin_id: '...' }).

    // So, we just need to respond that it's valid.
    res.status(200).json({ valid: true, admin_id: req.user.admin_id });
});

module.exports = AdminRouter

