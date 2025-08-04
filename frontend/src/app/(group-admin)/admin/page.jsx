// frontend/app/(group-admin)/admin/page.js
// Or if Dashboard is a separate component, place this code there.

'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosApiInstance } from "@/app/library/helper"; // Ensure this is correctly configured for your backend BASE_URL
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
  const [loadingAuth, setLoadingAuth] = useState(true); // New state for authentication loading
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication status

  const router = useRouter();

  useEffect(() => {
    // async function checkAuthAndFetchData() {
    //   const token = localStorage.getItem('admin_token_fallback');
    //   if (!token) {
    //     console.log("Client-side Dashboard: No token in localStorage. Redirecting.");
    //     router.replace('/admin-login');
    //     setLoadingAuth(false); // Stop loading if no token
    //     return;
    //   }

    //   try {
    //     // DIRECTLY CALL YOUR BACKEND'S VERIFY ENDPOINT
    //     const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token'; 
    //     console.log(`Client-side Dashboard: Calling backend verify endpoint: ${backendVerifyUrl}`);

    //     const authResponse = await fetch(backendVerifyUrl, {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`, // Send token from localStorage
    //         'Content-Type': 'application/json'
    //       },
    //     });

    //     if (authResponse.ok) {
    //       console.log("Client-side Dashboard: Token verified by backend.");
    //       setIsAuthenticated(true);
    //       // Only fetch dashboard data if authenticated
    //       await fetchOrders(); 
    //     } else {
    //       console.log("Client-side Dashboard: Backend verification failed. Clearing localStorage and redirecting.");
    //       localStorage.removeItem('admin_token_fallback'); 
    //       localStorage.removeItem('admin');
    //       localStorage.removeItem('loginAt');
    //       router.replace('/admin-login');
    //     }
    //   } catch (error) {
    //     console.error('Client-side Dashboard: Error during token verification fetch:', error);
    //     localStorage.removeItem('admin_token_fallback');
    //     localStorage.removeItem('admin');
    //     localStorage.removeItem('loginAt');
    //     router.replace('/admin-login');
    //   } finally {
    //     setLoadingAuth(false); // Authentication check finished
    //   }
    // }

    const fetchOrders = async () => {
      try {
        // Ensure axiosApiInstance is set up to send Authorization header if needed,
        // or configure it here to use the token from localStorage.
        // If your backend /order/all endpoint also requires authentication,
        // you should include the Authorization header for this request as well.
        const token = ""
        // localStorage.getItem('admin_token_fallback'); // Get token again for this request

        const res = await axiosApiInstance.get("/order/all", {
          headers: {
            Authorization: `Bearer ${token}` // Add this header
          }
        });

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
        // Handle error: if orders fetch fails, consider redirecting or showing an error
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Token likely expired or invalid for data fetching too
          console.log("Client-side Dashboard: Order fetch failed due to authentication. Redirecting.");
          localStorage.removeItem('admin_token_fallback');
          localStorage.removeItem('admin');
          localStorage.removeItem('loginAt');
          router.replace('/admin-login');
        }
      }
    };

    checkAuthAndFetchData(); // Start the combined auth and data fetch process
  }, [router]); // Depend on router to ensure effect runs if router changes (though unlikely here)

  const COLORS = ["#0088FE", "#FF8042"];

  // Display loading state while authenticating
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading Dashboard securely...</p>
        {/* You can add a spinner here */}
      </div>
    );
  }

  // If not authenticated (and loading is complete), return null as router.replace will handle redirect
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the dashboard content
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