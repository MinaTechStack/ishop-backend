'use client';
import React from 'react';
import { axiosApiInstance, notify } from '../library/helper';
// useRouter is no longer needed since we're using a full page reload
// import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    // The useEffect hook and router are removed as they are no longer necessary.
    // The middleware now handles all redirection.

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {
            // withCredentials is crucial for sending the httpOnly cookie
            const res = await axiosApiInstance.post("admin/login", data, { withCredentials: true });
            
            if (res.data.flag === 1) {
                notify("Login successful", 1);
                // Use a full page reload to let the middleware handle authentication
                window.location.href = '/admin';
            } else {
                notify(res.data.msg || "Login failed", 0);
            }
        } catch (err) {
            console.log("Login API Error:", err);
            notify("Server error", 0);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name='email'
                            required
                            className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}