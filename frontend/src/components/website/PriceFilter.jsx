'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiFilter } from 'react-icons/fi'; // ✅ Importing from react-icons

export default function PriceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);

        minPrice ? params.set('minPrice', minPrice) : params.delete('minPrice');
        maxPrice ? params.set('maxPrice', maxPrice) : params.delete('maxPrice');

        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    return (
        <div className="rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg border border-gray-200 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                💰 Filter by Price
            </h2>

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="px-1 py-2 text-sm border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-gray-400"
                />
                <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="px-1  py-2 text-sm border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-gray-400"
                />
            </div>

            <button
                onClick={applyPriceFilter}
                className="w-full flex items-center justify-center gap-2  bg-[#01A49E] cursor-pointer hover:bg-teal-800 text-white font-medium text-[16px] py-2.5 rounded-lg transition-transform hover:scale-[1.03] shadow"
            >
                <FiFilter className="w-4 h-4" /> {/* ✅ Using FiFilter */}
                Apply Filter
            </button>
        </div>
    );
}
