const jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);

const userController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.send({ msg: "Please fill all fields", flag: 0 });
            }

            const existingUser = await UserModel.findOne({ email: email });
            if (existingUser) {
                return res.send({ msg: "Already Registered", flag: 0 });
            }

            const encPassword = cryptr.encrypt(password);
            const user = new UserModel({ name, email, password: encPassword });

            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "24h" });

            res.send({ msg: "Account created successfully", flag: 1, token, user: { ...user.toJSON(), password: "" } });

        } catch (error) {
            console.log(error);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.send({ msg: "Please fill all fields", flag: 0 });
            }

            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return res.send({ msg: "User not exist", flag: 0 });
            }

            if (password === cryptr.decrypt(user.password)) {
                const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
                res.send({ msg: "Login successfully", token, user: { ...user.toJSON(), password: "" }, flag: 1 });
            } else {
                res.send({ msg: "Incorrect password", flag: 0 });
            }
        } catch (error) {
            console.log(error);
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async updateAddress(req, res) {
        try {
            const { userId } = req.params;
            const newAddress = req.body;

            const user = await UserModel.findById(userId);
            if (!user) return res.send({ msg: "User not found", flag: 0 });

            const alreadyExists = user.shipping_address.some(addr =>
                addr.addressLine1 === newAddress.addressLine1 &&
                addr.city === newAddress.city &&
                addr.state === newAddress.state &&
                addr.postalCode === newAddress.postalCode &&
                addr.country === newAddress.country
            );

            if (alreadyExists) {
                return res.send({ msg: "Address already exists", flag: 0 });
            }

            user.shipping_address.push(newAddress);
            await user.save();

            const updatedUser = user.toObject();
            delete updatedUser.password;

            res.send({ msg: "Address added successfully", flag: 1, user: updatedUser });
        } catch (error) {
            console.error(error);
            res.send({ msg: "Failed to add address", flag: 0 });
        }
    },
    async getUserAddresses(req, res) {
        try {
            const { userId } = req.params;
            const user = await UserModel.findById(userId);
            if (!user) return res.send({ msg: "User not found", flag: 0 });

            res.send({ addresses: user.shipping_address || [] });
        } catch (error) {
            console.error(error);
            res.send({ msg: "Failed to fetch addresses", flag: 0 });
        }
    },
    async addAddress(req, res) {
        try {
            const { userId, address, index } = req.body;

            if (!userId) return res.status(400).send({ msg: "User ID is required", flag: 0 });

            const user = await UserModel.findById(userId);
            if (!user) return res.status(404).send({ msg: "User not found", flag: 0 });

            if (typeof index === 'number') {
                // Edit existing address
                if (index < 0 || index >= user.shipping_address.length) {
                    return res.status(400).send({ msg: "Invalid address index", flag: 0 });
                }

                user.shipping_address[index] = address;
            } else {
                // Add new address (prevent duplicates)
                const duplicate = user.shipping_address.some(addr =>
                    addr.addressLine1 === address.addressLine1 &&
                    addr.city === address.city &&
                    addr.state === address.state &&
                    addr.postalCode === address.postalCode &&
                    addr.country === address.country
                );

                if (duplicate) {
                    return res.send({ msg: "Address already exists", flag: 0 });
                }

                user.shipping_address.push(address);
            }

            await user.save();

            const updatedUser = user.toObject();
            delete updatedUser.password;

            res.send({ msg: index !== undefined ? "Address updated successfully" : "Address added successfully", flag: 1, user: updatedUser });
        } catch (err) {
            console.error(err);
            res.status(500).send({ msg: "Server error", flag: 0 });
        }
    },

    async deleteAddress(req, res) {
        try {
            const { userId, index } = req.body;

            // Validate input
            if (typeof index !== "number" || index < 0) {
                return res.status(400).send({ msg: "Invalid index", flag: 0 });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send({ msg: "User not found", flag: 0 });
            }

            // Check index bounds
            if (index >= user.shipping_address.length) {
                return res.status(400).send({ msg: "Address index out of range", flag: 0 });
            }

            // Remove address by index
            user.shipping_address.splice(index, 1);
            await user.save();

            const updatedUser = user.toObject();
            if (!updatedUser._id) updatedUser._id = user._id;
            delete updatedUser.password;


            res.send({ msg: "Address deleted successfully", flag: 1, user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Server error", flag: 0 });
        }
    },
    async changePassword(req, res) {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.send({ msg: "Both current and new passwords are required", flag: 0 });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.send({ msg: "User not found", flag: 0 });
        }

        const decryptedPassword = cryptr.decrypt(user.password);

        if (decryptedPassword !== currentPassword) {
            return res.send({ msg: "Current password is incorrect", flag: 0 });
        }

        user.password = cryptr.encrypt(newPassword);
        await user.save();

        res.send({ msg: "Password changed successfully", flag: 1 });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal Server Error", flag: 0 });
    }
}



}

module.exports = userController;
