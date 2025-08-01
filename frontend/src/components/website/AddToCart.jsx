'use client'
import { axiosApiInstance, notify } from '@/app/library/helper';
import { addItem } from '@/redux/features/cartSlice';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function AddToCart({ product }) {
    const dispatcher = useDispatch();
    const user = useSelector((state) => state.user?.data)

   function addToCart() {
    if (user != null) {
        axiosApiInstance.post("cart/add-to-cart", {
            userId: user?._id,
            productId: product._id,
            qty: 1
        }).then((res) => {
            if (res.data.status === 1) {
                notify("Added to cart", 1);
            } else {
                notify(res.data.msg, 0);
            }
        }).catch((err) => {
            console.log(err);
            notify("Something went wrong", 0);
        });
    }

    dispatcher(addItem({
        productId: product._id,
        original_price: product.originalPrice,
        final_price: product.finalPrice
    }));
}

    return (
        <button
            onClick={addToCart}
            className="mt-auto bg-[#01A49E] hover:bg-[#018c89] cursor-pointer transition-colors text-white py-2 px-6 rounded-lg font-medium shadow-sm hover:shadow-md"
        >
            Add to Cart
        </button>
    )
}
