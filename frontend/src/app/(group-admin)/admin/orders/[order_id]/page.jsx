'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { axiosApiInstance } from '@/app/library/helper';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.order_id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data } = await axiosApiInstance.get(`/order/details/${orderId}`);
        setOrder(data?.order || null);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError("Unable to load order");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading order details...</div>;
  }

  if (error || !order) {
    return <div className="p-6 text-center text-red-500">Failed to load order details.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Order Summary</h1>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Order ID:</span> {order._id}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
              order.order_status === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {order.order_status === 0 ? 'Pending' : 'Completed'}
            </span>
          </p>
          <p><span className="font-medium">Total Amount:</span> ₹{order.order_total}</p>
          <p><span className="font-medium">Placed At:</span> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Items in Order</h2>
        <div className="space-y-4">
          {order.product_details?.map((item, i) => {
            const product = item.product_id;
            return (
              <div key={i} className="flex items-center gap-5 bg-gray-50 rounded-xl p-4 shadow-sm">
                <div className="w-20 h-20 flex-shrink-0 border rounded-xl overflow-hidden bg-white">
                  {product?.thumbnail ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-lg text-gray-800">{product?.name || 'Unknown Product'}</p>
                  <p className="text-sm text-gray-500">Product ID: {product?._id}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                  <p className="text-sm font-semibold text-gray-700">Subtotal: ₹{item.qty * item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="text-gray-700 leading-relaxed">
          <p>{order.shipping_details?.addressLine1}, {order.shipping_details?.addressLine2}</p>
          <p>{order.shipping_details?.city}, {order.shipping_details?.state} - {order.shipping_details?.postalCode}</p>
          <p>{order.shipping_details?.country}</p>
        </div>
      </div>
    </div>
  );
}
