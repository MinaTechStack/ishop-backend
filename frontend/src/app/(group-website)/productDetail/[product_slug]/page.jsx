'use client';

import { useEffect, useState } from 'react';
import { getProduct } from '@/app/library/api-call';
import { FaCheckCircle, FaTimesCircle, FaTag } from 'react-icons/fa';
import AddToCart from '@/components/website/AddToCart';

const ProductDetailPage = ({ params }) => {
    const { product_slug } = params;

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            const productJson = await getProduct(null, null, null, 0, null, null, product_slug);
            const foundProduct = productJson?.products?.find(p => p.slug === product_slug);
            setProduct(foundProduct);

            if (foundProduct) {
                setMainImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${foundProduct.thumbnail}`);
            }
        };

        fetchProduct();
    }, [product_slug]);

    if (!product) {
        return <p className="text-center mt-10 text-gray-500">Loading product...</p>;
    }

    return (
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-5 sm:p-8">

                <div>
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-[300px] sm:h-[400px] object-contain rounded-xl bg-gray-50"
                    />

                    {product.images?.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                            {product.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${img}`}
                                    alt={`Product ${i + 1}`}
                                    className={`w-14 h-14 object-contain rounded-md border cursor-pointer transition hover:scale-105 ${mainImage.includes(img) ? 'ring-2 ring-[#01A49E]' : ''
                                        }`}
                                    onClick={() => setMainImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${img}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
                    <p className="text-gray-600 text-sm sm:text-base">{product.shortDescription}</p>

                    <div className="flex items-center gap-3 flex-wrap text-lg">
                        <span className="text-green-600 font-semibold">₹{product.finalPrice}</span>
                        <span className="line-through text-gray-400 text-sm">₹{product.originalPrice}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            {product.discountPercentage}% OFF
                        </span>
                    </div>

                    {product.categoryId?.name && (
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Category:</span> {product.categoryId.name}
                        </p>
                    )}

                    {Array.isArray(product.colors) && product.colors.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 flex-wrap">
                            <span className="font-semibold">Colors:</span>
                            <div className="flex gap-2">
                                {product.colors.map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="w-6 h-6 rounded-full border border-gray-400 shadow"
                                        style={{ backgroundColor: color.Hexcode }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 pt-3 text-sm text-gray-700">
                        <span className="flex items-center gap-1">
                            <FaCheckCircle className="text-green-500" />
                            {product.stock ? 'In Stock' : 'Out of Stock'}
                        </span>

                        {product.topSelling && (
                            <span className="flex items-center gap-1 text-orange-600">
                                <FaTag />
                                Top Selling
                            </span>
                        )}

                        <span className={`flex items-center gap-1 ${product.status ? 'text-green-600' : 'text-red-500'}`}>
                            {product.status ? <FaCheckCircle /> : <FaTimesCircle />}
                            {product.status ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="pt-4">
                        <AddToCart product={product} />
                    </div>
                </div>
            </div>

            <div className="mt-10 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
                <h2 className="text-md font-semibold text-gray-800 mb-3">Product Details</h2>

                <div className="w-full overflow-auto max-w-full">
                    <div
                        className="min-w-[700px] text-gray-700 text-sm leading-relaxed break-words
            [&_table]:min-w-[700px] [&_table]:w-max [&_table]:text-left [&_table]:border-collapse
            [&_td]:border [&_td]:p-2 [&_td]:align-top
            [&_th]:border [&_th]:p-2 [&_th]:align-top [&_th]:font-semibold
            [&_tr:nth-child(even)]:bg-gray-50
            [&_p]:my-1 [&_p]:text-sm [&_p]:text-gray-700
            whitespace-normal"
                        dangerouslySetInnerHTML={{ __html: product.longDescription }}
                    />
                </div>
            </div>

        </main>
    );
};

export default ProductDetailPage;
