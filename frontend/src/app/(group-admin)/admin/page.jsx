'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosApiInstance } from "@/app/library/helper";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosApiInstance.get("/order/all");
        const fetchedOrders = res.data.orders;
        setOrders(fetchedOrders);

        // Total revenue
        const total = fetchedOrders.reduce((acc, order) => acc + order.order_total, 0);
        setTotalRevenue(total);

        // Monthly Sales Overview
        const groupedSales = {};
        fetchedOrders.forEach(order => {
          const date = new Date(order.createdAt);
          const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          groupedSales[month] = (groupedSales[month] || 0) + order.order_total;
        });
        const salesArray = Object.entries(groupedSales).map(([month, total]) => ({
          month, total
        }));
        setSalesData(salesArray);

        // Payment Method Split
        const paymentSplit = {
          Online: 0,
          COD: 0,
        };
        fetchedOrders.forEach(order => {
          order.payment_mode ? paymentSplit.Online++ : paymentSplit.COD++;
        });
        setPaymentData([
          { name: "Online Payment", value: paymentSplit.Online },
          { name: "Cash on Delivery", value: paymentSplit.COD },
        ]);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-2">📊 Dashboard Overview</h2>
        <p className="text-lg text-gray-700">
          Total Revenue: <span className="font-semibold text-green-600">₹{totalRevenue.toFixed(2)}</span>
        </p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Sales Overview */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-md font-semibold mb-2">📈 Monthly Sales Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Method Split */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-md font-semibold mb-2">💳 Payment Method Split</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Orders Table */}
      <div className="bg-white rounded-lg p-6 shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">📋 Last Orders</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
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
                <td className="py-2 text-blue-600 underline">{order._id}</td>
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

export default Dashboard;
