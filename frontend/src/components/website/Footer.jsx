'use client';

import Image from 'next/image';
import { LiaEnvelope } from "react-icons/lia";
import { CiMobile1 } from "react-icons/ci";
import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPinterestP,
    FaCcVisa,
    FaCcPaypal,
    FaCcStripe,
} from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-white text-sm px-4 text-gray-700 pt-10">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

                    {/* Company Info */}
                    <div className="space-y-4 sm:px-4">
                        <h2 className="font-semibold text-black" style={{ width: "358px" }}>
                            SWIFT - 1ST NYC TECH ONLINE MARKET
                        </h2>
                        <div>
                            <p className="text-gray-500">HOTLINE 24/7</p>
                            <p className="text-green-600 text-xl font-bold">(025) 3686 25 16</p>
                        </div>
                        <div className="text-gray-500 space-y-1">
                            <p>257 Thatcher Road St, Brooklyn, Manhattan,</p>
                            <p>NY 10092</p>
                            <p>contact@swifttechmart.com</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex space-x-3 pt-2 text-gray-600 text-lg">
                            {[FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaPinterestP].map(
                                (Icon, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#E1E3EB] w-[45px] h-[35px] rounded-[17.5px] flex items-center justify-center hover:text-blue-500 cursor-pointer"
                                    >
                                        <Icon className="text-[14px] text-black" />
                                    </div>
                                )
                            )}
                        </div>

                        {/* Language & Currency */}
                        <div className="my-12 flex flex-col sm:flex-row justify-start items-start gap-4">
                            <div className="flex items-center gap-2 bg-[#F7F7F7] px-4 py-2 rounded-md cursor-pointer text-sm  font-medium">
                                <span className="text-black">USD</span>
                                <span className="text-xs text-black">▾</span>
                            </div>
                            <div className="flex items-center gap-2 bg-[#F7F7F7] px-4 py-2 rounded-md cursor-pointer text-sm  font-medium">
                                <Image src="/img.png" alt="flag" width={15} height={15} />
                                <span className="text-black">Eng</span>
                                <span className="text-xs text-black">▾</span>
                            </div>
                        </div>
                    </div>

                    {[{
                        title: 'TOP CATEGORIES',
                        items: ['Laptops', 'PC & Computers', 'Cell Phones', 'Tablets', 'Gaming & VR', 'Networks', 'Cameras', 'Sounds', 'Office'],
                    },
                    {
                        title: 'COMPANY',
                        items: ['About Swift', 'Contact', 'Career', 'Blog', 'Sitemap', 'Store Locations'],
                    },
                    {
                        title: 'HELP CENTER',
                        items: ['Customer Service', 'Policy', 'Terms & Conditions', 'Track Order', 'FAQs', 'My Account', 'Product Support'],
                    },
                    {
                        title: 'PARTNER',
                        items: ['Become Seller', 'Affiliate', 'Advertise', 'Partnership'],
                    }]
                        .map((section) => (
                            <div className="text-left sm:text-left space-y-2 px-7 sm:px-0 ml-0 sm:ml-30" key={section.title}>
                                <h3 className="font-semibold text-black" style={{ width: "159px" }}>{section.title}</h3>
                                {section.items.map((item) => (
                                    <p key={item} className="hover:underline cursor-pointer text-gray-600">
                                        {item}
                                    </p>
                                ))}
                            </div>
                        ))}
                </div>

                <div className="mt-10 border-gray-300 pt-6 text-center">
                    <p className="text-black font-semibold mb-4 text-[18px]">
                        SUBSCRIBE & GET <span className="text-red-500">10% OFF</span> FOR YOUR FIRST ORDER
                    </p>
                    <div className="flex justify-center">
                        <form className="flex mr-7 flex-col sm:flex-row items-center gap-2 max-w-[857px] mx-auto mt-4 w-full lg:w-8/12">
                            <div className="w-full flex flex-col md:flex-row items-center justify-between max-w-[856px] mx-auto border-b-2 border-gray-300 py-4">
                                <div className="flex items-center flex-1 w-full">
                                    <span className="pl-3 pr-2 text-2xl text-black">
                                        <LiaEnvelope />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="flex-1 py-2 focus:outline-none placeholder:text-[#757575] text-black"
                                    />
                                </div>

                                {/* Subscribe button */}
                                <button
                                    type="submit"
                                    className="text-green-600 font-semibold whitespace-nowrap mt-4 md:mt-0 md:ml-8 hover:underline"
                                >
                                    SUBSCRIBE →
                                </button>
                            </div>
                        </form>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                        By subscribing, you're accepting our{' '}
                        <span className="underline cursor-pointer">Policy</span>
                    </p>

                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-300 mt-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center py-8 text-xs text-gray-600">
                        {/* Left - Copyright */}
                        <p className="text-center text-[14px] sm:text-left">
                            © 2024 <span className="font-semibold text-black">Swift</span>. All Rights Reserved
                        </p>

                        {/* Center - Payment Icons */}
                        <div className="flex items-center gap-4 text-lg justify-center">
                            <Image src="/1.png" alt="logo" width={14} height={15} />
                            <Image src="/2.png" alt="logo" width={26} height={15} />
                            <Image src="/3.png" alt="logo" width={40} height={15} />
                            <Image src="/4.png" alt="logo" width={38} height={15} />
                            <Image src="/5.png" alt="logo" width={71} height={15} />
                            <FaCcStripe />
                        </div>

                        {/* Right - Mobile Site */}
                        <div className='flex items-center gap-1'>
                            <span className='text-[16px] text-[#0D6EFD]'><CiMobile1 /></span>
                            <span className="text-sm text-[#0D6EFD] text-[14px] cursor-pointer">
                                Mobile Site
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
