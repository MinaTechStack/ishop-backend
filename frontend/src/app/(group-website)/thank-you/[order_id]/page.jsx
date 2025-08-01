// app/(group)/thank-you/[order_id]/page.jsx
import React from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function ThankYouPage({ params }) {
    const order_id = params.order_id;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <FaCheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Thank You!</h1>
                <p className="text-gray-600 mb-4">
                    Your order has been placed successfully.
                </p>
                <div className="bg-gray-100 rounded p-4 mb-4">
                    <span className="text-gray-500 text-sm">Order ID:</span>
                    <div className="text-lg font-mono font-semibold text-gray-800">{order_id}</div>
                </div>
                <p className="text-gray-500 text-sm">
                    You will receive a confirmation email with your order details soon.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block bg-[#01A49E] text-white px-6 py-2 rounded"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
