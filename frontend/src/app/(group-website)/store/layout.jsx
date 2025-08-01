import { getCategory, getProduct } from '@/app/library/api-call';
import React from 'react';
import Link from 'next/link';
import ColorFilter from '@/components/website/ColorFilter';
import ProdLimit from '@/components/website/ProdLimit';
import PriceFilter from '@/components/website/PriceFilter';

export default async function Layout({ children, params }) {
    const categoryJson = await getCategory();
    const categories = categoryJson?.categories || [];
    const currentCategorySlug = params?.category_slug || '';

    // Define categories that are allowed for color filter
    const allowedColorFilterCategories = ['mens', 'womens', 'kids', 'beauty', 'gadgets'];

    let showColorFilter = false;

    if (!currentCategorySlug || allowedColorFilterCategories.includes(currentCategorySlug)) {
        const productJson = await getProduct(null, currentCategorySlug, null, 10);
        const products = productJson?.products || [];

        showColorFilter = products.some(prod => Array.isArray(prod.colors) && prod.colors.length > 0);
    }

    const showPriceFilter = true;

    return (
        <div className="w-full px-4 py-8 bg-gradient-to-br from-gray-100 via-[#EEEFF6] to-white min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">

                {/* Sidebar */}
                <aside className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            🗂 Categories
                        </h2>

                        <Link href="/store" className="block mb-3">
                            <button
                                className={`w-full cursor-pointer py-2 px-4 rounded-lg shadow-sm border font-medium transition-all
                                ${!currentCategorySlug
                                    ? "bg-[#01A49E] text-white"
                                    : "bg-[#f9fafb] text-gray-800 hover:bg-[#01A49E] hover:text-white"}`}
                            >
                                All Categories
                            </button>
                        </Link>

                        <ul className="space-y-2 text-gray-700">
                            {categories.map((cat, i) => {
                                const isActive = currentCategorySlug === cat.slug;

                                return (
                                    <li key={i}>
                                        <Link
                                            href={`/store/${cat.slug}`}
                                            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                                            ${isActive ? "bg-[#01A49E] text-white shadow font-semibold" : "hover:bg-[#01A49E] hover:text-white"}`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-xs font-semibold">({cat.productCount})</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Filters */}
                    <div className="space-y-6 border-t border-gray-200 pt-6">
                        {showColorFilter && <ColorFilter />}
                        {showPriceFilter && <PriceFilter />}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-4 bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
                    <div className="flex justify-end">
                        <ProdLimit />
                    </div>

                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
}
