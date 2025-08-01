'use client'
import { getProduct } from "@/app/library/api-call";
import AddToCart from "@/components/website/AddToCart";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const StorePage = () => {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const color = searchParams.get('color');
        const limit = searchParams.get('limit');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        const response = await getProduct(null, null, color, limit, minPrice, maxPrice);
        setProducts(response?.products || []);
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">🛍️ Our Products</h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                            >
                                <Link href={`/productDetail/${product.slug}`}>
                                    <div className="overflow-hidden h-48 bg-white flex items-center justify-center">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-green-600 text-sm font-bold">
                                                ₹{product.finalPrice}
                                            </span>
                                            <span className="text-xs line-through text-gray-400">
                                                ₹{product.originalPrice}
                                            </span>
                                            <span className="text-xs text-red-500">
                                                {product.discountPercentage}% OFF
                                            </span>
                                        </div>

                                        {Array.isArray(product.colors) && product.colors.length > 0 && (
                                            <div className="flex items-center gap-1 mb-3">
                                                {product.colors.map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: color.Hexcode }}
                                                        title={color.name}
                                                    ></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="px-4 pb-4 mt-auto flex justify-center">
                                    <AddToCart product={product} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-black text-xl mt-20 bg-white py-6 px-4 rounded-lg shadow-md">
                        😔 No products available for the selected filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StorePage;
