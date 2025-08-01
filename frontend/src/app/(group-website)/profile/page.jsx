'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { FaArrowRight } from 'react-icons/fa';
import { axiosApiInstance, notify } from '@/app/library/helper';
import { setUser } from '@/redux/features/userSlice';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.data);
    const userId = user?._id;

    const [activeSection, setActiveSection] = useState('account');
    const [myOrders, setMyOrders] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [address, setAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const getOrderStatus = (status) => {
        const statuses = [
            'Order Placed',
            'Confirmed',
            'Shipped',
            'Delivered',
            'Cancelled',
            'Returned',
            'Failed',
            'Refunded',
        ];
        return statuses[status] || 'Unknown';
    };

    useEffect(() => {
        if (userId) {
            axiosApiInstance.get(`/user/address/${userId}`).then((res) => {
                setUserAddresses(res.data.addresses || []);
            });

            axiosApiInstance.get(`/order/user/${userId}`).then((res) => {
                setMyOrders(res.data.orders || []);
            });
        }
    }, [userId]);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosApiInstance.put(`/user/address/${userId}`, address);
            notify(res.data.msg, res.data.flag);

            if (res.data.flag) {
                dispatch(setUser({ data: res.data.user, token: null }));
                setAddress({
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                });
                setUserAddresses(res.data.user.shipping_address || []);
            }
        } catch {
            notify('Failed to add address', 0);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosApiInstance.put(`/user/change-password/${userId}`, passwordForm);
            notify(res.data.msg, res.data.flag);

            if (res.data.flag) {
                setPasswordForm({ currentPassword: '', newPassword: '' });
            }
        } catch {
            notify('Failed to change password', 0);
        }
    };

    const handleDeleteAddress = async (index) => {
        try {
            const res = await axiosApiInstance.post('/user/delete-address', { userId, index });
            notify(res.data.msg, res.data.flag);

            if (res.data.flag) {
                const updated = [...userAddresses];
                updated.splice(index, 1);
                setUserAddresses(updated);
                dispatch(setUser({ data: res.data.user }));
                if (selectedAddress === index) setSelectedAddress(null);
                else if (selectedAddress > index) setSelectedAddress((prev) => prev - 1);
            }
        } catch {
            notify('Failed to delete address', 0);
        }
    };

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
        if (!confirmCancel) return;

        try {
            const res = await axiosApiInstance.post('/order/cancel', {
                order_id: orderId,
                user_id: userId,
            });

            notify(res.data.msg, res.data.flag);

            if (res.data.flag) {
                setMyOrders((prev) =>
                    prev.map((order) =>
                        order._id === orderId ? { ...order, order_status: 4 } : order
                    )
                );
            }
        } catch {
            notify('Failed to cancel order', 0);
        }
    };


    if (!userId) {
        return (
            <div className="max-w-screen-xl mx-auto px-4 py-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Please log in to access your profile</h2>
                <Link href="/login">
                    <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700">Go to Login</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white p-4 mb-5 rounded">
                <h2 className="text-gray-500 text-sm">
                    <Link href="/">Home</Link> / pages / <span className="text-black font-semibold">Profile</span>
                </h2>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:max-w-xs bg-white shadow-md rounded-xl p-6">
                    <div className="flex flex-col items-center text-center">
                        <img src="/minukr.jpg" alt="User" className="w-20 h-20 rounded-full object-cover" />
                        <h2 className="text-lg font-semibold mt-2">{user?.name || 'Your Name'}</h2>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {['account', 'order', 'address', 'password'].map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`w-full cursor-pointer flex justify-between items-center text-sm px-4 py-2 rounded-md ${activeSection === section
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white border hover:bg-gray-100'
                                    }`}
                            >
                                {{
                                    account: 'My Account',
                                    order: 'My Orders',
                                    address: 'My Address',
                                    password: 'Change Password',
                                }[section]}
                                <FaArrowRight />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {activeSection === 'account' && (
                        <div className="p-4 sm:p-6">
                            <h1 className="text-2xl font-bold mb-6">My Account</h1>
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Phone:</strong> {user?.contact || 'Not provided'}</p>
                        </div>
                    )}

                    {activeSection === 'order' && (
                        <div className="p-4 sm:p-6 bg-gray-50 rounded">
                            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                            {myOrders.length > 0 ? (
                                <div className="grid gap-6">
                                    {myOrders.map((order, i) => (
                                        <div
                                            key={i}
                                            className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition duration-300"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                                    <p className="text-gray-500 text-sm">
                                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-semibold ${order.order_status === 4 ? 'text-red-600' : 'text-teal-600'}`}>
                                                        {order.order_status === 4
                                                            ? 'Order Cancelled'
                                                            : `Status: ${getOrderStatus(order.order_status)}`}
                                                    </p>
                                                    {order.order_status < 4 && (
                                                        <p className="text-blue-600 text-sm">
                                                            Track: {getOrderStatus(order.order_status)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid gap-4 border-t pt-4">
                                                {order.product_details.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 items-center">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${item.product_id?.thumbnail}`}
                                                            alt={item.product_id?.name}
                                                            className="w-16 h-16 rounded border object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-medium">{item.product_id?.name}</p>
                                                            <p className="text-gray-500 text-sm">
                                                                Qty: {item.qty} × ₹{item.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4">
                                                <div className="text-sm text-gray-600">
                                                    <p><strong>Shipping to:</strong></p>
                                                    <p>{order.shipping_details.addressLine1}</p>
                                                    {order.shipping_details.addressLine2 && <p>{order.shipping_details.addressLine2}</p>}
                                                    <p>
                                                        {order.shipping_details.city}, {order.shipping_details.state} - {order.shipping_details.postalCode}
                                                    </p>
                                                    <p>{order.shipping_details.country}</p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 text-right">
                                                    <p className="font-semibold text-lg">₹{order.order_total}</p>
                                                    <p className="text-gray-500 text-sm">
                                                        {order.payment_mode ? 'Prepaid' : 'Cash on Delivery'}
                                                    </p>

                                                    {(order.order_status === 0 || order.order_status === 1) && (
                                                        <button
                                                            onClick={() => handleCancelOrder(order._id)}
                                                            className="mt-2 inline-block bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center">You haven't placed any orders yet.</p>
                            )}

                        </div>
                    )}


                    {activeSection === 'address' && (
                        <div className="p-4 sm:p-6 bg-gray-50 rounded">
                            <h2 className="text-xl font-semibold mb-4">My Address</h2>
                            {userAddresses.map((addr, i) => (
                                <div key={i} className="mb-4 p-4 border rounded bg-white shadow-sm">
                                    <p>{addr.addressLine1}</p>
                                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                    <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                                    <p>{addr.country}</p>
                                    <div className="mt-3 flex justify-end gap-4">
                                        <Link href={`/profile/address/add?index=${i}`}>
                                            <button className="text-blue-600 text-xs hover:underline cursor-pointer">Edit</button>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteAddress(i)}
                                            className="text-red-500 text-xs hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <form onSubmit={handleAddressSubmit} className="mt-6 space-y-4">
                                {['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'].map((field) => (
                                    <div key={field}>
                                        <label className="block font-medium mb-1">
                                            {field === 'addressLine1' && 'Address Line 1'}
                                            {field === 'addressLine2' && 'Address Line 2 (Optional)'}
                                            {field === 'city' && 'City'}
                                            {field === 'state' && 'State'}
                                            {field === 'postalCode' && 'Postal Code'}
                                            {field === 'country' && 'Country'}
                                        </label>
                                        <input
                                            type="text"
                                            name={field}
                                            value={address[field]}
                                            onChange={handleChange}
                                            required={field !== 'addressLine2'}
                                            className="w-full border rounded-md px-4 py-2"
                                        />
                                    </div>
                                ))}
                                <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700">
                                    Add Address
                                </button>
                            </form>

                        </div>
                    )}

                    {activeSection === 'password' && (
                        <div className="p-4 sm:p-6 bg-gray-50 rounded">
                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full border rounded-md px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full border rounded-md px-4 py-2"
                                    />
                                </div>
                                <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700">
                                    Change Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
