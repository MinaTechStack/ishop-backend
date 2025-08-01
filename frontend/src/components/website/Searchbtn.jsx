import React from 'react'
import { FaSearch } from "react-icons/fa";

export default function Searchbtn() {
  return (
    <div className="w-full bg-teal-600 rounded-[10px] text-white px-4">
                <div className="max-w-screen-xl mx-auto py-3 flex flex-col lg:flex-row items-center gap-4 justify-between">
                    {/* Search Bar */}
                    <div className="bg-white flex items-center rounded-[30px] overflow-hidden w-full lg:w-[40%]">
                        <select className="bg-gray-100 text-gray-700 px-2 py-2 text-xs outline-none cursor-pointer w-[30%]">
                            <option>All Categories</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="flex-1 px-2 py-2 text-sm outline-none text-gray-400"
                        />
                        <button className="px-3 cursor-pointer text-gray-500 hover:text-gray-700">
                            <FaSearch />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-medium justify-center lg:justify-end">
                        {[
                            "FREE SHIPPING OVER $199",
                            "30 DAYS MONEY BACK",
                            "100% SECURE PAYMENT",
                        ].map((offer, idx) => (
                            <p key={idx} className="font-medium text-[13px] hover:underline">{offer}</p>
                        ))}
                    </div>
                </div>
            </div>
  )
}
