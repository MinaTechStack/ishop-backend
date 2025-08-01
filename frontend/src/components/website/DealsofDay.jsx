'use client';

import { useEffect, useState } from 'react';
import { getProduct } from '@/app/library/api-call';
import Link from 'next/link';

export default function DealsofDay() {
  const [dealProduct, setDealProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      const result = await getProduct();
      const deals = result?.products?.filter(p => p.stock && p.status);
      if (deals?.length > 0) {
        const product = deals[6];
        setDealProduct(product);
        setMainImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`);
      }
    };
    fetchDeals();
  }, []);

  if (!dealProduct) return null;

  return (
    <section className="mt-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Deal Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5">
          <div className="text-white text-sm font-semibold bg-[#01A49E] px-5 py-2 w-full rounded-xl inline-block mb-5">
            DEALS OF THE DAY
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Images */}
            <div className="lg:w-1/3">
              <img
                src={mainImage}
                alt={dealProduct.name}
                className="w-full h-64 object-contain bg-gray-100 rounded-xl"
              />
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {dealProduct.images?.map((img, idx) => {
                  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${img}`;
                  const isSelected = mainImage.endsWith(img);
                  return (
                    <img
                      key={idx}
                      src={imageUrl}
                      onClick={() => setMainImage(imageUrl)}
                      className={`w-10 h-10 rounded-md border object-contain cursor-pointer transition-transform duration-150 hover:scale-105 ${
                        isSelected ? 'ring-2 ring-[#01A49E]' : ''
                      }`}
                      alt={`Thumb ${idx}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{dealProduct.name}</h3>

              <div className="flex items-center gap-3 text-lg">
                <span className="text-green-600 font-bold">₹{dealProduct.finalPrice}</span>
                <span className="text-sm text-gray-400 line-through">₹{dealProduct.originalPrice}</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md font-medium">
                  {dealProduct.discountPercentage}% OFF
                </span>
              </div>

              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                <li>High performance specs</li>
                <li>Free shipping & gift included</li>
                <li>Limited time offer</li>
              </ul>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">FREE SHIPPING</span>
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">FREE GIFT</span>
              </div>

              <div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#01A49E] h-2.5 rounded-full w-[35%]"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Sold: 26 / 75</p>
              </div>

              <Link href={`/productDetail/${dealProduct.slug}`}>
                <button className="mt-3 cursor-pointer px-5 py-2 bg-[#01A49E] text-white text-sm rounded-lg hover:bg-teal-700 transition">
                  View Deal
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Side Banners */}
        <div className="space-y-4 w-full lg:w-[296px]">
          <img src="/deal1.png" alt="Deal 1" className="w-full h-[130px] rounded-xl object-cover" />
          <img src="/deal2.png" alt="Deal 2" className="w-full h-[130px] rounded-xl object-cover" />
          <img src="/deal3.png" alt="Deal 3" className="w-full h-[130px] rounded-xl object-cover" />
        </div>
      </div>
    </section>
  );
}
