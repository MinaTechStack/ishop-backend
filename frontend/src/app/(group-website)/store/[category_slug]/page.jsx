import { getProduct } from "@/app/library/api-call";
import AddToCart from "@/components/website/AddToCart";
import React from "react";

const Page = async ({ params, searchParams }) => {
    const productJson = await getProduct(null, params?.category_slug, searchParams?.color, searchParams?.limit, searchParams.minPrice, searchParams.maxPrice);
    const products = productJson?.products || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">🛍️ Our Products</h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                            >
                                <div className="h-56 overflow-hidden flex items-center justify-center bg-white">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                                        alt={product.name}
                                        className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>


                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-green-600 text-lg font-bold">
                                            ₹{product.finalPrice}
                                        </span>
                                        <span className="text-sm line-through text-gray-400">
                                            ₹{product.originalPrice}
                                        </span>
                                        <span className="text-sm text-red-500">
                                            {product.discountPercentage}% OFF
                                        </span>
                                    </div>

                                    {Array.isArray(product.colors) && product.colors.length > 0 && (
                                        <div className="flex items-center gap-2 mb-4">
                                            {product.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="w-5 h-5 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color.Hexcode }}
                                                    title={color.name}
                                                ></div>
                                            ))}
                                        </div>
                                    )}

                                    <AddToCart product={product} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (

                    <div className="flex justify-center items-center h-96">
                        <div className="text-center text-gray-600 text-lg">
                            No products available.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
