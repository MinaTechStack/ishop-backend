const OrderModel = require("../models/orderModel");
const CartModel = require("../models/cartModel");
const Razorpay = require('razorpay');
const crypto = require("crypto");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const OrderController = {
    async orderPlace(req, res) {
        try {
            const { user_id, order_total, payment_mode, shipping_details } = req.body;

            if (!user_id || !order_total || payment_mode === undefined || !shipping_details) {
                return res.status(400).send({ message: "Missing required fields", flag: 0 });
            }

            const cartItems = await CartModel.find({ user_id }).populate("product_id", "_id finalPrice");

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).send({ message: "No items in cart", flag: 0 });
            }

            const productDetails = cartItems.map((item) => ({
                product_id: item.product_id._id,
                qty: item.qty,
                price: item.product_id.finalPrice,
                total: parseFloat((item.product_id.finalPrice * item.qty).toFixed(2)),
            }));

            const newOrder = new OrderModel({
                user_id,
                product_details: productDetails,
                order_total,
                payment_mode,
                shipping_details,
                order_status: 0,
                payment_status: 0,
            });

            await newOrder.save();
            await CartModel.deleteMany({ user_id });

            if (payment_mode === 0) {
                // COD
                return res.status(200).send({
                    message: "Order placed successfully (COD)",
                    flag: 1,
                    order_id: newOrder._id
                });
            } else {
                // Razorpay
                const options = {
                    amount: order_total * 100, // in paise
                    currency: "INR",
                    receipt: newOrder._id.toString(),
                };

                instance.orders.create(options, async (err, order) => {
                    if (err) {
                        console.error("Razorpay Order Error:", err);
                        return res.status(500).send({ message: "Payment initiation failed", flag: 0 });
                    }

                    newOrder.razorpay_order_id = order.id;
                    await newOrder.save();

                    return res.status(200).send({
                        message: "Order initiated for online payment",
                        flag: 1,
                        razorpay_order_id: order.id,
                        order_id: newOrder._id
                    });
                });
            }

        } catch (error) {
            console.error("Order Placement Error:", error);
            return res.status(500).send({ message: "Internal Server Error", flag: 0 });
        }
    },

    async orderSuccess(req, res) { 
        try {
            const { order_id, user_id, razorpay_response } = req.body;

            if (!order_id || !user_id || !razorpay_response) {
                return res.status(400).send({ message: "Missing parameters", flag: 0 });
            }

            const order = await OrderModel.findById(order_id);
            if (!order) return res.status(404).send({ message: "Order not found", flag: 0 });

            const user = await UserModel.findById(user_id);
            if (!user) return res.status(404).send({ message: "User not found", flag: 0 });

            if (order.payment_status === 1) {
                return res.status(409).send({ message: "Order already paid", flag: 0 });
            }

            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = razorpay_response;

            const generated_signature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");

            if (generated_signature !== razorpay_signature) {
                return res.status(400).send({ message: "Payment verification failed", flag: 0 });
            }

            order.payment_status = 1;
            order.order_status = 1;
            order.razorpay_payment_id = razorpay_payment_id;
            await order.save();

            await CartModel.deleteMany({ user_id });

            return res.status(200).send({
                message: "Order placed successfully",
                flag: 1,
                order_id: order._id
            });

        } catch (error) {
            console.error("Order Success Error:", error.message);
            return res.status(500).send({ message: "Internal server error", flag: 0 });
        }
    },
    async getAllOrders(req, res) {
        try {
            const orders = await OrderModel.find()
                .populate("user_id", "name email") // Include customer name & email
                .select("_id createdAt order_total order_status payment_mode user_id") // Include payment_mode
                .sort({ createdAt: -1 }); // Sort by newest first

            return res.status(200).send({
                message: "All orders fetched successfully",
                flag: 1,
                orders
            });
        } catch (error) {
            console.error("Get All Orders Error:", error);
            return res.status(500).send({
                message: "Internal Server Error",
                flag: 0
            });
        }
    },

    async getOrderDetails(req, res) {
        try {
            const { order_id } = req.params;

            if (!order_id) {
                return res.status(400).send({ message: "Order ID is required", flag: 0 });
            }

            const order = await OrderModel.findById(order_id)
                .populate("user_id", "name email")
                .populate("product_details.product_id", "_id name finalPrice thumbnail")

            if (!order) {
                return res.status(404).send({ message: "Order not found", flag: 0 });
            }

            return res.status(200).send({
                message: "Order details retrieved successfully",
                flag: 1,
                order
            });

        } catch (error) {
            console.error("🔥 Get Order Details Error:", error);
            return res.status(500).send({
                message: "Internal Server Error",
                error: error.message,
                flag: 0
            });
        }
    },
    async getUserOrders(req, res) {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).send({ message: "User ID is required", flag: 0 });
            }

            const orders = await OrderModel.find({ user_id })
                .populate("product_details.product_id", "_id name finalPrice thumbnail")
                .sort({ createdAt: -1 });

            return res.status(200).send({
                message: "User orders fetched successfully",
                flag: 1,
                orders
            });
        } catch (error) {
            console.error("Get User Orders Error:", error);
            return res.status(500).send({
                message: "Internal Server Error",
                flag: 0
            });
        }
    },
    async cancelOrder(req, res) {
        try {
            const { order_id, user_id } = req.body;

            if (!order_id || !user_id) {
                return res.status(400).send({ message: "Order ID and User ID are required", flag: 0 });
            }

            const order = await OrderModel.findById(order_id);

            if (!order) {
                return res.status(404).send({ message: "Order not found", flag: 0 });
            }

            if (order.user_id.toString() !== user_id) {
                return res.status(403).send({ message: "Unauthorized", flag: 0 });
            }

            if (order.order_status >= 2) {
                return res.status(400).send({ message: "Cannot cancel processed/delivered orders", flag: 0 });
            }

            order.order_status = 6; // Assuming 6 = Cancelled
            await order.save();

            return res.status(200).send({ message: "Order cancelled successfully", flag: 1 });

        } catch (error) {
            console.error("Cancel Order Error:", error);
            return res.status(500).send({ message: "Internal Server Error", flag: 0 });
        }
    }
};

module.exports = OrderController;
