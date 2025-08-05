const AdminModel = require("../models/adminModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const adminController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await AdminModel.findOne({ email: email });

      if (!admin) {
        return res.send({ msg: "Admin doesn't exist", flag: 0 });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign({ admin_id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('admin_token', token, {
          httpOnly: true,
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'None',
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
