'use client';

import Banner from "@/components/website/Banner";
import ProductSlider from "@/components/website/ProductSlider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct, getCategory } from "../library/api-call";
import DealsofDay from "@/components/website/DealsofDay";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productJson = await getProduct();
      setProducts(productJson?.products || []);

      const categoryJson = await getCategory();
      setCategories(categoryJson?.categories || []);
    };
    fetchData();
  }, []);

  const popularProducts = products.slice(0, 8);
  const trendingProducts = products.slice(8, 16);
  const topRatedProducts = products.slice(16, 24);
  const fanFavorites = products.slice(24, 32);

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Banner + Sidebar layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-xl p-5 shadow border border-gray-100 flex flex-col justify-between min-h-[450px] md:col-span-1">
            {/* Categories */}
            <div>
              <Link href="/store">
                <button className="w-full bg-yellow-400 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition">
                  Shop All
                </button>
              </Link>

              <ul className="space-y-2 mt-4 text-sm text-gray-800">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <Link
                      href={`/store/${cat.slug}`}
                      className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-yellow-100 transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs font-semibold">({cat.productCount})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hot Deals */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm mt-6">
              <h3 className="text-md font-semibold text-yellow-800 mb-2">🔥 Hot Deals</h3>
              <p className="text-gray-800 text-sm">Floral Print Buttoned</p>
              <p className="text-green-600 font-bold text-sm">₹500.00</p>
              <button className="mt-3 w-full bg-yellow-400 text-white font-medium py-2 rounded hover:bg-yellow-500 transition">
                Add to Cart
              </button>
            </div>
          </aside>

          {/* Banner */}
          <div className="md:col-span-3 flex items-center justify-center">
            <div className="w-full h-full max-h-[450px] overflow-hidden rounded-xl">
              <Banner />
            </div>
          </div>
        </div>

        {/* Product Sections */}
        <div className="mt-12 space-y-12 text-center">

          {/* Promo Banners */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img src="/greencare.jpg" alt="Green Care Collection" className="w-full rounded-xl shadow-md" />
            </div>
            <div>
              <img src="/style.jpg" alt="Style Highlights" className="w-full rounded-xl shadow-md" />
            </div>
          </section>
          <DealsofDay />

          {/* Product Sliders */}
          <ProductSlider title="⚡ Just Dropped" products={popularProducts} />
          <section className="text-center my-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">🚀 On Fire This Week</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base mb-8 px-4">
              Explore this week’s most loved picks – chosen by our customers and trending for all the right reasons.
              Don’t miss out on these hot items lighting up our store right now.
            </p>
            <ProductSlider products={trendingProducts} />
          </section>

          <ProductSlider title="💎 Highly Rated Picks" products={topRatedProducts} />
          <ProductSlider title="💫 Customer’s Choice" products={fanFavorites} />

          {/* All Products */}
          <section className="bg-pink-50 py-12 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
            <p className="text-sm text-gray-600 mb-8">Just Pick, Pack and Ship</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">🛍️ Shop Styles</h3>
                <p className="text-sm text-gray-600">Browse collections for Men, Women, Kids & Many more...</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">📏 Pick Your Fit</h3>
                <p className="text-sm text-gray-600">Use our fit guides and style notes to find your size.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">💳 Checkout Fast</h3>
                <p className="text-sm text-gray-600">Quick checkout with flexible payment options.</p>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
