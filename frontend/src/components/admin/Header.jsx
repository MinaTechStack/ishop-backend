'use client'
import { axiosApiInstance } from '@/app/library/helper';
import React, { useEffect, useState } from 'react';
import { FiMenu, FiBell, FiUser, FiSearch, FiMail } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { removeAdmin, setAdmin } from '@/redux/features/adminSlice';

const navLinks = [
  { name: 'Dashboard', href: '#' },
  { name: 'Users', href: '#' },
  { name: 'Settings', href: '#' },
];

// Utility function to convert timestamp to "time ago"
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `Logged in ${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Logged in just now';
}

export default function Header() {
  const dispatcher = useDispatch();
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    const lsAdmin = localStorage.getItem("admin");
    const loginAt = localStorage.getItem("loginAt");

    if (lsAdmin) {
      dispatcher(
        setAdmin({
          admin: JSON.parse(lsAdmin),
          loginAt: loginAt
        })
      );
    }
  }, [dispatcher]);

  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  function logoutHandler(e) {
    e.preventDefault();

    // Perform the logout API call
    axiosApiInstance.get("admin/logout", { withCredentials: true })
      .then(() => {
        // This block runs only if the API call is successful
        dispatcher(removeAdmin()); // Clear the Redux state and localStorage
        router.push("/admin-login"); // Redirect the user to the login page
      })
      .catch((error) => {
        // Handle errors if the API call fails
        console.error("Logout failed:", error);
        // It's still good practice to clear the local state and redirect
        // to prevent the user from being stuck in an invalid state.
        dispatcher(removeAdmin());
        router.push("/admin-login");
      });
  }

  return (
    <header className="bg-white shadow-md w-full">
      <div className="px-2 sm:px-4 md:px-6 lg:px-0">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-start flex-col justify-center text-black font-semibold text-xl">
            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
              <FiUser size={26} />
              Hi, {admin?.data?.name}
            </div>
            {admin?.loginAt &&
              <span className="text-sm text-gray-500 mt-1 ml-1">{timeAgo(admin.loginAt)}</span>
            }
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <FiMenu size={24} />
            </button>
          </div>

          <nav className="hidden md:flex space-x-8 ml-10">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4 ml-4 border border-gray-300 rounded-full px-4 py-2 bg-gray-50">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none bg-transparent text-gray-600 placeholder-gray-400 w-32"
            />
            <FiSearch size={18} className="text-gray-600" />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-200 text-gray-600 focus:outline-none">
              <FiMail size={22} />
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button className="relative p-2 rounded-full hover:bg-gray-200 text-gray-600 focus:outline-none">
              <FiBell size={22} />
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={logoutHandler}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition duration-300"
            >
              <FiUser size={18} />
              Logout
            </button>
          </div>
        </div>

        <div
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-md absolute top-20 left-0 w-full p-4 space-y-4`}
        >
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-black px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col space-y-2">
            <button className="flex items-center gap-2 text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              <FiSearch size={18} />
              Search
            </button>
            <button className="flex items-center gap-2 text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              <FiMail size={18} />
              Messages
            </button>
            <button className="flex items-center gap-2 text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              <FiBell size={18} />
              Notifications
            </button>
            <button className="flex items-center gap-2 text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              <FiUser size={18} />
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}