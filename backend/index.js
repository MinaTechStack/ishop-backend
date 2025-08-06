require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // ✅ Required for static path

const CategoryRouter = require('./routers/categoryRouter');
const colorRouter = require('./routers/colorRouter');
const ProductRouter = require('./routers/productRouter');
const AdminRouter = require('./routers/adminRouter');
const UserRouter = require('./routers/userRouter');
const CartRouter = require('./routers/cartRouter');
const OrderRouter = require('./routers/orderRouter');

const server = express();

// ✅ Serve images from /images URL path
server.use('/images', express.static(path.join(__dirname, 'public/images')));

server.use(express.static("public"));
server.use(express.json());
server.use(cookieParser());
server.use(cors({
    origin: "https://ishop-backend-nu.vercel.app",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));

server.use("/category", CategoryRouter);
server.use("/color", colorRouter);
server.use("/product", ProductRouter);
server.use("/admin", AdminRouter);
server.use("/user", UserRouter);
server.use("/cart", CartRouter);
server.use("/order", OrderRouter);

// ✅ MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        server.listen(5000, () => {
            console.log("Server is running on http://localhost:5000");
        });
        console.log('MongoDB Atlas connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
