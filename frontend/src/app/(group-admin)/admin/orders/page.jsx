'use client';
import React, { useEffect, useState } from "react";
import { axiosApiInstance } from "@/app/library/helper";
import { useRouter } from "next/navigation";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosApiInstance.get("/order/all");
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">All Orders</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="text-left py-2">Order ID</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/orders/${order._id}`)}
              >
                <td className="text-blue-600 underline py-2">{order._id}</td>
                <td>{order.user_id?.name || "N/A"}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.order_total}</td>
                <td>{order.payment_mode ? "Online Payment" : "Cash on Delivery"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
