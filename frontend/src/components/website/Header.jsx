'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "@/app/library/api-call";
import { emptyCart, lsToCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { logoutUser, lsToUser } from "@/redux/features/userSlice";
import UpdateQty from "./UpdatQty";

const Header = () => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [products, setProducts] = useState([]);
    const cart = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user);
    const dispatcher = useDispatch();

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const toggleHandler = () => setToggle(!toggle);

    async function fetchProducts() {
        const response = await getProduct();
        const products = response?.products || [];
        setProducts(products);
    }

    useEffect(() => {
        fetchProducts();
        dispatcher(lsToCart());
        dispatcher(lsToUser());
    }, []);

    function checkoutHandler() {
        if (!user?.data) {
            router.push("/login?ref=checkout");
        } else {
            router.push("/checkout");
        }
    }

    const clearCartHandler = () => dispatcher(emptyCart());

    function logoutHandler() {
        dispatcher(logoutUser());
        dispatcher(emptyCart());
        router.push("/login");
    }

    return (
        <>
            {/* Slide-in Cart */}
            <div className={`fixed top-0 right-0 z-50 h-full w-[90%] sm:w-[400px] overflow-y-auto bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${toggle ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-end p-4 border-b">
                    <button onClick={toggleHandler} className="text-gray-500 cursor-pointer hover:text-red-500 text-lg font-bold">×</button>
                </div>
                <div className="overflow-y-auto h-[70%] px-4 py-2 space-y-4">
                    {cart?.items.length > 0 ? (
                        cart.items
                            .filter(item => item && item.productId)
                            .map((item, index) => {
                                const product = products.find(p => p._id === item.productId);
                                if (!product) return null;
                                return (
                                    <div key={index} className="flex gap-3 bg-gray-100 rounded-lg p-3 shadow-sm">
                                        <div className="w-20 h-20 bg-gray-300 flex items-center justify-center text-sm font-medium rounded">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between flex-grow">
                                            <div>
                                                <h3 className="font-medium text-sm">{product.name}</h3>
                                                <p className="text-xs text-gray-500">₹{product.finalPrice * item.qty}</p>
                                            </div>
                                            <UpdateQty
                                                productId={item.productId}
                                                final_total={product.finalPrice}
                                                original_total={product.originalPrice}
                                                qty={item.qty}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="text-center text-gray-500 mt-20">Your cart is empty</div>
                    )}
                </div>

                <div className="p-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Original Total</span>
                        <span className="font-semibold">₹{cart?.original_total}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Final Total</span>
                        <span className="line-through">₹{cart?.final_total}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                        <span>You Save</span>
                        <span>-₹{cart?.original_total - cart?.final_total}</span>
                    </div>
                    <button
                        onClick={checkoutHandler}
                        disabled={cart.items.length === 0}
                        className={`w-full py-2 mt-3 text-sm font-semibold rounded-md ${cart.items.length === 0
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-[#01A49E] text-white cursor-pointer'
                            }`}
                    >
                        Proceed to Checkout
                    </button>

                    <button onClick={clearCartHandler} className="bg-red-600 w-full py-2 text-white rounded-md hover:bg-red-700 mt-2 text-sm font-semibold">
                        Clear Cart
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="w-full bg-white rounded-[10px]">
                <div className="max-w-screen-xl mx-auto px-4">
                    {/* Top Bar */}
                    <div className="hidden md:flex text-sm text-gray-700 py-2 flex-col md:flex-row justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#EBEEF6] text-xs px-2 py-1 font-normal rounded">Hotline 24/7</span>
                            <span className="text-xs font-bold">(025) 3886 25 16</span>
                        </div>
                        <div className="flex flex-wrap justify-center font-normal text-[14px] gap-4 text-xs">
                            <span className="cursor-pointer hover:underline">Sell on Swift</span>
                            <span className="cursor-pointer hover:underline">Order Track</span>
                            <span className="cursor-pointer hover:underline">USD ▾</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:underline">
                                <Image src="/img.png" alt="flag" width={15} height={15} />
                                <span>Eng ▾</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Nav */}
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="hidden md:flex items-center gap-2">
                            <Image src="/Swiftcart.png" alt="logo" width={80} height={80} />
                            <div>
                                <h1 className="text-sm font-bold">SWiFT</h1>
                                <p className="text-xs -mt-1 font-bold">CART</p>
                            </div>
                        </Link>

                        {/* Updated for iPad (md:flex) */}
                        <ul className="hidden md:flex gap-6 text-sm font-bold">
                            <Link href="/"><li className="cursor-pointer hover:text-gray-500">HOME</li></Link>
                            <Link href="/store"><li className="cursor-pointer hover:text-gray-500">STORE</li></Link>
                            <Link href="/about"><li className="cursor-pointer hover:text-gray-500">ABOUT</li></Link>
                            <Link href="/contact"><li className="cursor-pointer hover:text-gray-500">CONTACT</li></Link>
                        </ul>

                        <div className="lg:hidden md:hidden text-2xl text-gray-600 cursor-pointer" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="hidden md:flex items-center gap-4">
                                {user?.data && (
                                    <Link href="/profile">
                                        <div className="bg-[#EBEEF6] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition">
                                            <FaUser className="text-gray-500" />
                                        </div>
                                    </Link>
                                )}

                                <div className="flex flex-col justify-center">
                                    {user?.data ? (
                                        <>
                                            <p className="text-[11px] text-[#666666]">{user.data.name}</p>
                                            <div className="text-[14px] font-semibold">
                                                <div onClick={logoutHandler} className="cursor-pointer hover:underline">LOG OUT</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[11px] text-[#666666]">WELCOME</p>
                                            <Link href="/login?ref=header">
                                                <div className="text-[14px] font-semibold cursor-pointer hover:underline">
                                                    LOG IN / REGISTER
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div onClick={toggleHandler} className="flex items-center gap-1 cursor-pointer relative">
                                <div className="bg-[#EBEEF6] w-10 h-10 rounded-full flex items-center justify-center relative">
                                    <HiOutlineShoppingBag className="text-gray-500" />
                                    <div className="bg-[#1ABA1A] w-5 h-5 rounded-full absolute -bottom-1 -right-1 flex items-center justify-center text-white text-xs font-bold">
                                        {cart?.items.length}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-[#666666]">Cart</span>
                                    <span className="text-sm font-semibold">₹{cart?.final_total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <ul className="lg:hidden flex flex-col gap-3 bg-white py-4 px-4 rounded-md shadow text-sm font-medium mt-2">
                            <Link href="/"><li className="cursor-pointer hover:underline">HOME</li></Link>
                            <Link href="/store"><li className="cursor-pointer hover:underline">STORE</li></Link>
                            <Link href="/about"><li className="cursor-pointer hover:underline">ABOUT</li></Link>
                            <Link href="/contact"><li className="cursor-pointer hover:underline">CONTACT</li></Link>
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
