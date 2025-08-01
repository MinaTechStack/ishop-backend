'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProdLimit() {
    const router = useRouter();
    const [limit, setLimit] = useState(0);

    useEffect(() => {

        router.push(`?limit=${limit}`);

    }, [limit]);

    return (
        <div className='w-full p-4 shadow bg-white'>
            <select
                onChange={(e) => setLimit(Number(e.target.value))}
                className='cursor-pointer border border-gray-300 rounded px-2 py-1'
                defaultValue={0}
            >
                <option value="0" >All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>
        </div>
    )
}
