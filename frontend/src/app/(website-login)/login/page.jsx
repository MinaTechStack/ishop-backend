'use client'
import React, { useState, useEffect } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";
import { axiosApiInstance } from "@/app/library/helper";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/userSlice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const AuthForm = () => {
    const router = useRouter();
    const params = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [cart, setCart] = useState([]);
    const dispatcher = useDispatch();

    // ✅ Safely read cart from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const lsCart = JSON.parse(localStorage.getItem('cart'));
            setCart(lsCart?.items || []);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        try {
            const res = await axiosApiInstance.post("user/login", data);
            if (res.data.flag === 1) {
                dispatcher(setUser({
                    data: res.data.user,
                    token: res.data.token
                }));

                const updatedCart = await axiosApiInstance.post("cart/move-to-db", {
                    user_id: res.data?.user?._id,
                    cart: cart.length > 0 ? cart : null
                });

                let final_total = 0;
                let original_total = 0;
                const dbCart = updatedCart.data?.cart?.map(cd => {
                    if (!cd.product_id) return null;

                    final_total += (cd.product_id?.finalPrice * cd.qty);
                    original_total += (cd.product_id?.originalPrice * cd.qty);
                    return {
                        productId: cd.product_id._id,
                        qty: cd.qty
                    };
                });
                

                localStorage.setItem("cart", JSON.stringify({
                    items: dbCart,
                    final_total,
                    original_total
                }));

                if (params.get("ref") === "checkout") {
                    router.push("/checkout");
                } else {
                    router.push("/");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {
            const res = await axiosApiInstance.post("user/register", data);
            if (res.data.flag === 1) {
                dispatcher(setUser({
                    data: res.data.user,
                    token: res.data.token
                }));
                router.push("/");
            }
        } catch (err) {
            console.error("Registration error:", err);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto min-h-screen flex flex-col pt-4">
            <div className="bg-white p-4 px-8 rounded mb-5">
                <h2 className="text-gray-500">
                    <Link href="/">Home</Link> / pages /{" "}
                    <span className="text-black font-semibold">{isLogin ? "login" : "register"}</span>
                </h2>
            </div>

            <div className="bg-white">
                <div className="flex justify-center gap-8 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-6 py-2 font-semibold text-lg rounded-t-lg border-b-4 transition-colors ${isLogin ? "border-[#01A49E] text-[#01A49E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-6 py-2 font-semibold text-lg rounded-t-lg border-b-4 transition-colors ${!isLogin ? "border-[#01A49E] text-[#01A49E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Register
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row bg-white rounded shadow-md p-5">
                    <div className="w-full lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0">
                        <img src="/login.svg.png" alt="Auth Illustration" className="w-3/4 md:w-1/2 lg:w-3/4" />
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-[507px] mx-auto">
                        <h2 className="text-[28px] font-bold text-[#01A49E] mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-gray-400 mb-8 text-[14px] uppercase tracking-wider">
                            {isLogin ? "Login to continue" : "Register to get started"}
                        </p>

                        {isLogin ? (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-black font-medium">Email Address</label>
                                    <input type="email" id="email" name="email" placeholder="Example@gmail.com"
                                        className="w-full p-3 rounded-[6px] border-[1px] border-[#cccccc] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block mb-2 text-black font-medium">Password</label>
                                    <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter password"
                                        className="w-full p-3 border-[1px] border-[#cccccc] bg-[#FFFFFF] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                    <div onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-12 cursor-pointer text-gray-500">
                                        {showPassword ? <FaEyeSlash /> : <FiEyeOff />}
                                    </div>
                                </div>

                                <div className="text-left">
                                    <a href="#" className="text-sm text-gray-400 hover:underline">Forget Password?</a>
                                </div>

                                <button type="submit"
                                    className="rounded-[10px] cursor-pointer max-w-[162px] w-full md:w-auto p-[30px] bg-[#01A49E] hover:translate-y-1 hover:scale-110 text-white font-bold py-3 transition-all duration-300">
                                    LOGIN
                                </button>

                                <div className="text-left text-[13px] mt-4 text-gray-400">
                                    NEW USER?{" "}
                                    <button type="button" onClick={() => setIsLogin(false)}
                                        className="text-green-500 font-bold hover:underline">
                                        SIGN UP
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={registerSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-black font-medium">Name</label>
                                    <input type="text" id="name" name="name" placeholder="Your full name"
                                        className="w-full p-3 rounded-[6px] border-[1px] border-[#cccccc] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block mb-2 text-black font-medium">Email Address</label>
                                    <input type="email" id="email" name="email" placeholder="Example@gmail.com"
                                        className="w-full p-3 rounded-[6px] border-[1px] border-[#cccccc] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block mb-2 text-black font-medium">Password</label>
                                    <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter password"
                                        className="w-full p-3 border-[1px] border-[#cccccc] bg-[#FFFFFF] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                    <div onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-12 cursor-pointer text-gray-500">
                                        {showPassword ? <FaEyeSlash /> : <FiEyeOff />}
                                    </div>
                                </div>

                                <button type="submit"
                                    className="rounded-[10px] max-w-[162px] w-full md:w-auto p-[30px] bg-[#01A49E] hover:translate-y-1 hover:scale-110 text-white font-bold py-3 transition-all duration-300">
                                    REGISTER
                                </button>

                                <div className="text-left text-[13px] mt-4 text-gray-400">
                                    ALREADY HAVE AN ACCOUNT?{" "}
                                    <button type="button" onClick={() => setIsLogin(true)}
                                        className="text-green-500 bg-[#01A49E] font-bold hover:underline">
                                        LOGIN
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
