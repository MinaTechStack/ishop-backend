const CartModel = require("../models/cartModel");

const cartController = {
    async moveToDb(req, res) {
        try {
            const { user_id, cart } = req.body;
            if (!user_id) {
                return res.status(400).json({ msg: 'User Id is required', flag: 0 });
            }
            if (Array.isArray(cart) && cart.length > 0) {
                const allPromises = cart.map(async (item) => {
                    const { productId, qty } = item;
                    const existingCart = await CartModel.findOne({ user_id, product_id: productId });

                    if (existingCart) {
                        existingCart.qty += Number(qty);
                        await existingCart.save();
                    } else {
                        await CartModel.create({ user_id, product_id: productId, qty: Number(qty) });
                    }
                });
                await Promise.all(allPromises); // Wait for all DB operations to complete
            }
            const updatedCart = await CartModel.find({ user_id }).populate('product_id', '_id finalPrice originalPrice');
            res.status(200).json({ msg: 'Cart saved successfully', flag: 1, cart: updatedCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error', flag: 0 });
        }
    },
    async addToCart(req, res) {
        try {

            const { userId, productId, qty } = req.body;

            if (!userId || !productId || !qty) {
                return res.status(400).json({ msg: "Missing required fields", status: 0 });
            }

            const existingItem = await CartModel.findOne({ user_id: userId, product_id: productId });

            if (existingItem) {
                
                await CartModel.updateOne(
                    { _id: existingItem._id },
                    { $inc: { qty: Number(qty) } }
                );
            } else {
                const newItem = new CartModel({
                    user_id: userId,
                    product_id: productId,
                    qty: Number(qty)
                });
                await newItem.save();
            }
            return res.status(200).json({ msg: "Cart updated successfully", status: 1 });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error", status: 0 });
        }
    },
    async updateQty(req, res) {
        try {
            const { userId, productId, type } = req.body;

            if (!userId || !productId || !type) {
                return res.status(400).json({ msg: "Missing required fields", status: 0 });
            }

            const item = await CartModel.findOne({ user_id: userId, product_id: productId });

            if (!item) {
                return res.status(404).json({ msg: "Cart item not found", status: 0 });
            }

            if (type === 'increment') {
                item.qty += 1;
                await item.save();
            } else if (type === 'decrement') {
                if (item.qty > 1) {
                    item.qty -= 1;
                    await item.save();
                } else {
                    await CartModel.deleteOne({ _id: item._id });
                    return res.status(200).json({ msg: "Item removed from cart", status: 1, removed: true });
                }
            } else {
                return res.status(400).json({ msg: "Invalid type", status: 0 });
            }

            return res.status(200).json({ msg: "Quantity updated", status: 1, qty: item.qty });

        } catch (error) {
            console.error("Error in updateQty:", error);
            return res.status(500).json({ msg: "Internal Server Error", status: 0 });
        }
    }

}
module.exports = cartController;