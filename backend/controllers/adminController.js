const AdminModel = require("../models/adminModel");
var jwt = require('jsonwebtoken');

const adminController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const admin = await AdminModel.findOne({ email: email });

            if (!admin) {
                return res.send({ msg: "Admin doesn't exist", flag: 0 });
            }

            if (password === admin.password) {
                var token = jwt.sign({ admin_id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
                res.cookie('admin_token', token, {
                    httpOnly: false,
                    secure: true,  
                  maxAge: 24 * 60 * 60 * 1000,
                    sameSite: 'Lax',
                    path: '/',
                });


                return res.send({ msg: "Logged in successfully", admin: { ...admin.toJSON(), password: "", token }, flag: 1 });
            } else {
                return res.send({ msg: "Incorrect password", flag: 0 });
            }

        } catch (error) {
            console.error("Login Error:", error);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    }
};

module.exports = adminController;
