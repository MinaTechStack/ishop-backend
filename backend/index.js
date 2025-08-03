require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const CategoryRouter = require('./routers/categoryRouter');
const colorRouter = require('./routers/colorRouter');
const ProductRouter = require('./routers/productRouter');
const AdminRouter = require('./routers/adminRouter');
const UserRouter = require('./routers/userRouter');
const CartRouter = require('./routers/cartRouter');
const OrderRouter = require('./routers/orderRouter');

const server = express();
server.use(express.static("public"));

// Middleware
server.use(express.json());
server.use(cookieParser());
server.use(cors({
    origin: "https://ishop-frontend-90uz.onrender.com/",
    credentials: true,
    allowedHeaders: ["Content-Type"], // removed "Authorization"
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

server.use("/category", CategoryRouter);
server.use("/color", colorRouter);
server.use("/product", ProductRouter);
server.use("/admin", AdminRouter);
server.use("/user", UserRouter);
server.use("/cart", CartRouter);
server.use("/order", OrderRouter);

const PORT = process.env.PORT || 5000;

// ✅ MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => {
        server.listen(PORT, () => {
            console.log("`Server is running on port ${PORT}`");
        });
        console.log('MongoDB Atlas connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });