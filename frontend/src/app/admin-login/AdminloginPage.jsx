// frontend/app/admin-login/AdminLogin.js

'use client';
import React, { useEffect } from 'react';
import { axiosApiInstance, notify } from '../library/helper';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const adminData = localStorage.getItem("admin");

        if (adminData) {
            // If adminData exists, and we are on /admin-login, redirect to /admin
            // This redirect in useEffect handles cases where the user might directly type
            // /admin-login while already logged in. The middleware will also handle this.
            router.replace('/admin');
        }
    }, [router, searchParams]); // searchParams dependency added for completeness, though not strictly used here for initial redirect

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        axiosApiInstance.post("admin/login", data, { withCredentials: true }).then(
            (res) => {
                console.log("Login API Response:", res); // Debug log
                if (res.data.flag === 1) {
                    localStorage.setItem("admin", JSON.stringify(res.data.admin));
                    localStorage.setItem("loginAt", new Date());
                    // --- NEW CRUCIAL LINE ---
                    // Store the raw admin token string in localStorage as a fallback.
                    // This is accessible by client-side JS but is a workaround for middleware issues.
                    localStorage.setItem("admin_token_fallback", res.data.token);

                    notify("Login successful", 1);
                    // --- NEW CRUCIAL LINE ---
                    // Redirect to /admin, passing the token as a query parameter.
                    // The middleware will attempt to read this if req.cookies doesn't work.
                    router.push(`/admin?token=${res.data.token}`);
                } else {
                    notify(res.data.msg || "Login failed", 0);
                }
            }
        ).catch(
            (err) => {
                console.log("Login API Error:", err);
                notify("Server error", 0);
            }
        )
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