import React from 'react';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import { FaCheckCircle, FaTruck, FaDollarSign } from "react-icons/fa";
import { FaArrowRight } from 'react-icons/fa';

export default function AboutPage() {
    const features = [
        {
            title: (
                <>
                    100% authentic in online
                    <br />
                    <span className="block">products</span>
                </>
            ),
            description:
                "Swift Tech Mart just distribute 100% authorized products & guarantee quality. Nulla porta nulla nec orci vulputate, id rutrum sapien varius.",
        },
        {
            title: (
                <>
                    Fast
                    <br />
                    <span className="block">Delivery</span>
                </>
            ),
            description:
                "Fast shipping with a lots of option to delivery. 100% guarantee that your goods alway on time and perserve quality.",
        },
        {
            title: (
                <>
                    Affordable
                    <br />
                    <span className="block">Price</span>
                </>
            ),
            description:
                "We offer an affordable & competitive price with a lots of special promotions.",
        },
    ];
    const leaders = [
        {
            name: 'Henry Avery',
            position: 'CHAIRMAN',
            image: '/H.png',
        },
        {
            name: 'Michael Edward',
            position: 'VICE PRESIDENT',
            image: '/M.png',
        },
        {
            name: 'Eden Hazard',
            position: 'CEO',
            image: '/E.png',
        },
        {
            name: 'Robert Downey Jr',
            position: 'CEO',
            image: '/R.png',
        },
        {
            name: 'Nathan Drake',
            position: 'STRATEGIST DIRECTOR',
            image: '/N.png',
        },
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-3">
            <div className="bg-white p-4 mb-4 rounded">
                <h2 className="text-gray-500 text-sm sm:text-base">
                    Home / pages / <span className="text-black font-semibold">About</span>
                </h2>
            </div>

            <div className="bg-[#ffffff] p-6">
                <div className='border rounded-[10px] border-[#DEE2E6]'>
                    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between md:bg-[url('/box.png')] md:bg-no-repeat md:bg-[length:1300px_auto] md:bg-[position:right_top] min-h-[325px]">
                        <div className="md:w-1/2">
                            <h1 className="text-[45px] font-bold leading-tight text-black">
                                Best experience <br />
                                <span className="font-normal">always wins</span>
                            </h1>
                            <p className="mt-4 text-gray-600 text-[14px]">
                                #1 Online Marketplace for Electronic & Technology <br /> in Manhattan, CA
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 rounded-[10px] p-6 md:p-10 bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="md:w-1/2">
                                <p className="font-bold text-[18px]">
                                    OUR PURPOSE IS TO <br />
                                    <span className="text-green-600">ENRICH</span> AND <span className="text-green-600">ENHANCE</span><br />
                                    LIVES THROUGH TECHNOLOGY
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:w-1/2">
                                <div>
                                    <h2 className="text-[40px] font-bold text-black">$12.5M</h2>
                                    <p className="text-[12px] text-[#666666] mt-2 leading-snug">
                                        TOTAL REVENUE FROM <br />
                                        2001 - 2023
                                    </p>
                                </div>
                                <div>
                                    <h2 className="text-[40px] font-bold text-black">12K+</h2>
                                    <p className="text-[12px] text-[#666666] mt-2 leading-snug">
                                        ORDERS DELIVERED <br />
                                        SUCCESSFUL ON EVERYDAY
                                    </p>
                                </div>
                                <div>
                                    <h2 className="text-[40px] font-bold text-black">725+</h2>
                                    <p className="text-[12px] text-[#666666] mt-2 leading-snug">
                                        STORE AND OFFICE IN U.S <br />
                                        AND WORLDWIDE
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image & Showreel Section */}
                <div className="flex flex-col gap-2 md:flex-row rounded-[10px] overflow-hidden mt-12">
                    <div className="bg-[#01A49E] rounded-[10px] p-6 md:w-1/2 flex justify-center items-center">
                        <img src="product.jpg" width={646} height={420} alt="" />
                    </div>
                    <div className="p-6 md:w-1/2 bg-[#E2E4EB] rounded-[10px] flex flex-col justify-center">
                        <h3 className="text-[18px] md:text-xl font-bold mb-4 text-[#000000]">
                            We connect millions of buyers and sellers around the world, empowering people & creating economic opportunity for all.
                        </h3>
                        <p className="text-[14px] text-gray-700 leading-relaxed mb-6">
                            Within our markets, millions of people around the world connect, both online and offline,
                            to make, sell and buy unique goods. We also offer a wide range of Seller Services and tools
                            that help creative entrepreneurs start, manage & scale their businesses.
                        </p>
                        <button className="flex items-center gap-2 bg-[#01A49E] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#018e8a] w-fit">
                            <FaPlay className="text-sm" />
                            OUR SHOWREEL
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 rounded-[10px] sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4"
                        >
                            <div className='flex justify-between items-center'>
                                <h3 className="text-[18px] font-bold uppercase">{feature.title}</h3>
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                    <img src="span.icon.png" alt="" />
                                </div>
                            </div>
                            <p className="text-[#666666] text-[14px]">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl bg-[#ffffff]  p-8 mx-auto px-4 my-5">
                {/* Mission and Vision */}
                <section className="mb-12">
                    <h2 className="text-[18px] font-bold mb-4">OUR MISSION AND VISION</h2>
                    <p className="text-[14px] text-[#000000] mb-4">
                        Nam maximus nunc a augue pulvinar, non euismod mauris tempus. Cras non elit vel magna molestie pellentesque in eu dui.
                        Donec laoreet quis erat vitae finibus. Vestibulum enim eros, porta eget quam et, euismod dictum elit. Nullam eu tempus magna.
                        Fusce malesuada nisi id felis placerat porta vel sed augue. <span className="font-semibold">Vivamus mollis mauris vitae</span> rhoncus egestas.
                    </p>
                    <div className="rounded-xl overflow-hidden">
                        <div className="rounded-xl overflow-hidden w-full h-[250px] sm:h-[350px]">
                            <img
                                src="building.png"
                                alt="Our building"
                                className="w-full h-full object-cover"
                            />
                        </div>

                    </div>
                </section>

                {/* Timeline */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">FROM A RETAIL STORE TO THE GLOBAL CHAIN OF STORES</h2>
                    <p className="text-[14px] text-[#000000] mb-6">
                        Pellentesque laoreet justo nec ex sodales euismod. Aliquam orci tortor, bibendum nec ultricies ac, auctor nec purus.
                        Maecenas in consectetur erat.
                    </p><div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-gray-700">
                        <div>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">1997:</span> A small store located in Brooklyn Town, USA</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">1998:</span> Reader will be distracted by readable content</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2000:</span> Dummy text of the printing and typesetting industry</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2002:</span> Industry’s standard dummy text ever since</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2004:</span> Contrary to popular belief, not simply random text</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2005:</span> The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2006:</span>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2010:</span> Repeat predefined chunks</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2013:</span> Comes from sections 1.10.32</p>
                        </div>
                        <div>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2014:</span> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2016:</span> All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2020:</span> Comes from sections 1.10.32</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2021:</span> First true generator on the Internet</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2022:</span> Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour</p>
                            <p className='text-[14px] text-[#666666] mb-2'><span className="font-semibold text-[14px] text-[#000000]">2023:</span> here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</p>
                        </div>
                    </div>

                </section>

                {/* Leadership */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[18px] font-bold">LEADERSHIPS</h2>
                        <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                            View All <FaArrowRight className="text-xs" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {leaders.map((leader, index) => (
                            <div key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center">
                                <div className="w-full h-72 relative rounded-xl overflow-hidden mb-4">
                                    <Image
                                        src={leader.image}
                                        fill
                                        alt={leader.name}
                                        className="object-cover object-top"
                                    />

                                </div>
                                <h3 className="font-semibold text-[15px] text-gray-800">{leader.name}</h3>
                                <p className="text-[12px] text-gray-500 uppercase mt-1">{leader.position}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
