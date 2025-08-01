'use client'
import React from "react";
import { FaChartPie, FaThLarge, FaProductHunt, FaLayerGroup } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoIosColorPalette } from "react-icons/io";
import { LuBox } from "react-icons/lu";
import Link from "next/link";

const SideMenu = () => {
    return (
        <div className="w-76 min-h-screen bg-[#3B82F6] text-white p-4 space-y-6">
            {/* Brand Logo */}
            <div className="text-2xl font-bold text-white mb-6">
                <span className="text-white">I</span>
                <span className="text-yellow-400">SHOP</span>
            </div>

            {/* Menu Section */}
            <div>
                <p className="text-white font-bold text-[14px] uppercase mb-2">Menu</p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
                        <FaChartPie />
                        <Link href="/admin"><span>Dashboards</span></Link>
                    </li>
                    <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
                        <FaThLarge />
                        <span>Apps</span>
                    </li>
                    <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer relative">
                        <FaLayerGroup />
                        <span>Layouts</span>
                        <span className="ml-auto bg-red-500 text-xs px-2 py-0.5 rounded-full text-white">Hot</span>
                    </li>
                </ul>
            </div>

            {/* Pages Section */}
            <div>
                <p className="text-white font-bold text-[14px] uppercase mb-2">Pages</p>
                <ul className="space-y-2">
                    <Link href="/admin/category">
                        <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
                            <BiCategory />
                            <span>Categories</span>
                        </li>
                    </Link>

                    <Link href="/admin/product">
                        <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
                            <FaProductHunt />
                            <span>Product</span>
                        </li>
                    </Link>
                    <Link href="/admin/color">
                        <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
                            <IoIosColorPalette />
                            <span>Color</span>
                        </li>
                    </Link>
                </ul>
            </div>

            {/* Components Section */}
            {/* Components Section */}
            <div>
                <p className="text-white font-bold text-[14px] uppercase mb-2">Other</p>
                <ul className="space-y-2">
                    <Link href="/admin/orders">
                        <li className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
                            <LuBox />
                            <span>Order</span>
                        </li>
                    </Link>
                </ul>
            </div>

        </div>
    );
};

export default SideMenu; 