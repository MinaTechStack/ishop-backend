'use client'

import { getColor } from '@/app/library/api-call';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ColorFilter() {
    const router = useRouter();
    const [colors, setColors] = useState([]);
    const [usercolor, setUserColor] = useState(null);

    async function getColors() {
        const colorJson = await getColor();
        const allcolors = await colorJson?.colors;
        setColors(allcolors)
    }


    useEffect(() => {
        if (usercolor) {
            const query = new URLSearchParams();
            query.set("color", usercolor);
            router.push(`?${query.toString()}`, { scroll: false });
        }
    }, [usercolor]);

    useEffect(
        () => {
            getColors()
        },
        []
    )

    return (
        <div className="mt-6">
            <h2 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 border-b pb-1 sm:pb-2">
                COLORS
            </h2>
            <ul className="flex flex-wrap gap-2 text-gray-700">
                {colors.map((color, i) => (
                    <li
                        onClick={() => setUserColor(color.slug)}
                        key={i}
                        className="cursor-pointer transition font-medium px-2 py-1 rounded hover:bg-[#01A49E] hover:text-white"
                    >
                        <div
                            className="w-5 h-5 rounded-full border"
                            style={{ backgroundColor: color.Hexcode }}
                            title={color.Hexcode}
                        ></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
