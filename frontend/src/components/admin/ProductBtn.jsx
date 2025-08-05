'use client'
import { axiosApiInstance, notify } from '@/app/library/helper'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { FaCheckCircle, FaTimesCircle, FaTag, FaTimes, FaEdit, FaTrash, FaImages, FaEye } from 'react-icons/fa'
import Link from 'next/link'

export default function ProductBtn({ product }) {
    const [toggle, setToggle] = useState(null)
    const router = useRouter()

    function statusHandler(id, flag) {
        axiosApiInstance.patch(`product/status/${id}`, { flag }).then((response) => {
            notify(response.data.msg, response.data.flag)
            if (response.data.flag === 1) router.refresh()
        }).catch(() => {
            notify("Something went wrong", 0)
        })
    }

    function deleteHandler(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ Changes applied here: The success message is now inside the .then() block
                axiosApiInstance.delete(`product/delete/${id}`).then((response) => {
                    if (response.data.flag === 1) {
                        Swal.fire("Deleted!", "Your file has been deleted.", "success")
                        notify(response.data.msg, 1)
                        router.refresh()
                    } else {
                        // This handles cases where the API returns a failed flag
                        Swal.fire("Error!", response.data.msg || "Deletion failed.", "error")
                        notify(response.data.msg, 0)
                    }
                }).catch((error) => {
                    // This block handles network errors or server issues
                    Swal.fire("Error!", "Something went wrong. Please try again.", "error")
                    notify("Something went wrong", 0)
                    console.error("Deletion API Error:", error)
                })
            }
        })
    }

    return (
        <td className="py-3 px-4">
            <div className="flex flex-wrap gap-1 items-center justify-center">
                <button
                    onClick={() => statusHandler(product._id, 1)}
                    className={`p-2 rounded-full text-xs flex items-center justify-center 
                    ${product.topSelling ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} 
                    transition duration-200`}
                    title={product.topSelling ? "Top Selling" : "Not Top Selling"}
                    aria-label="Toggle Top Selling"
                >
                    <FaTag size={14} className="cursor-pointer" />
                </button>
                <button
                    onClick={() => statusHandler(product._id, 2)}
                    className={`p-2 rounded-full text-xs flex items-center justify-center 
                    ${product.stock ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-400 text-white hover:bg-red-500'} 
                    transition duration-200`}
                    title={product.stock ? "In Stock" : "Out of Stock"}
                    aria-label="Toggle Stock Status"
                >
                    {product.stock ? <FaCheckCircle size={14} className="cursor-pointer" /> : <FaTimesCircle size={14} className="cursor-pointer" />}
                </button>
                <button
                    onClick={() => statusHandler(product._id, 3)}
                    className={`p-2 rounded-full text-xs flex items-center justify-center 
                    ${product.status ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-400 text-white hover:bg-gray-500'} 
                    transition duration-200`}
                    title={product.status ? "Active" : "Inactive"}
                    aria-label="Toggle Product Status"
                >
                    {product.status ? <FaCheckCircle size={14} className="cursor-pointer" /> : <FaTimesCircle size={14} className="cursor-pointer" />}
                </button>
                <Link href={`/admin/product/edit/${product._id}`}>
                    <button
                        className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200 flex items-center justify-center"
                        title="Edit Product"
                        aria-label="Edit Product"
                    >
                        <FaEdit size={14} className="cursor-pointer" />
                    </button>
                </Link>
                <button
                    onClick={() => deleteHandler(product._id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200 flex items-center justify-center"
                    title="Delete Product"
                    aria-label="Delete Product"
                >
                    <FaTrash size={14} className="cursor-pointer" />
                </button>
                <Link href={`/admin/product/multiple/${product._id}`}>
                    <button
                        className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition duration-200 flex items-center justify-center"
                        title="Manage Images"
                        aria-label="Manage Product Images"
                    >
                        <FaImages size={14} className="cursor-pointer" />
                    </button>
                </Link>
                <button
                    onClick={() => setToggle(product)}
                    className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition duration-200 flex items-center justify-center"
                    title="Quick View"
                    aria-label="Quick View"
                >
                    <FaEye size={14} className="cursor-pointer" />
                </button>
            </div>
            {toggle && <ViewProductCard product={toggle} onClose={() => setToggle(null)} />}
        </td>
    )
}

const ViewProductCard = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50  bg-opacity-30 backdrop-blur-sm flex justify-center">
    <div className="relative w-[95%] md:w-[90%] max-w-[1200px] max-h-[100vh] overflow-y-auto overflow-x-auto bg-white rounded-xl shadow-2xl animate-fadeInUp p-4 md:p-8">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 w-full space-y-4">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
              alt={product.name}
              className="w-full h-80 object-contain border rounded-lg shadow"
            />
            {product.images?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${img}`}
                    alt={`Image ${idx + 1}`}
                    className="w-16 h-16 object-contain border rounded-md hover:scale-105 transition"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 w-full space-y-5">
            <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 text-sm">{product.shortDescription}</p>
            <div
              className="text-sm text-gray-700  leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
            {product.categoryId?.name && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Category:</span> {product.categoryId.name}
              </p>
            )}
            {product.colors?.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">Colors:</span>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border shadow-inner"
                      style={{ backgroundColor: color.Hexcode }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-green-600">₹{product.finalPrice}</span>
              <span className="line-through text-gray-400 text-base">₹{product.originalPrice}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                {product.discountPercentage}% OFF
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                {product.stock ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.topSelling && (
                <span className="flex items-center gap-1 text-orange-600">
                  <FaTag />
                  Top Selling
                </span>
              )}
              <span
                className={`flex items-center gap-1 ${
                  product.status ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {product.status ? <FaCheckCircle /> : <FaTimesCircle />}
                {product.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};