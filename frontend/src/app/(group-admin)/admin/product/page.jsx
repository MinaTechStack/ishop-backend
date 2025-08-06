import { getProduct } from '@/app/library/api-call';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import ProductBtn from '@/components/admin/ProductBtn';

const ProductPage = async () => {
  const productJson = await getProduct();
  const products = productJson?.products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">📦 Manage Products</h1>
          <Link href="/admin/product/add">
            <button className="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-transform transform hover:scale-105">
              <FaPlus />
              <span>Add Product</span>
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white/80 cursor-pointer backdrop-blur-md border border-gray-200 rounded-xl shadow overflow-hidden">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-800 text-left">
                <th className="py-4 px-6 font-semibold">S.No.</th> {/* Serial Number header */}
                <th className="py-4 px-6 font-semibold">Name</th>
                <th className="py-4 px-6 font-semibold">Thumbnail</th>
                <th className="py-4 px-6 font-semibold">Slug</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-b group hover:bg-purple-50 hover:shadow-md transition-all duration-200 ease-in-out rounded-xl"
                >
                  <td className="py-4 px-6 font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                  </td>

                  <td className="py-4 px-6 font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                    {product.name}
                  </td>

                  <td className="py-4 px-6">
                    {product.thumbnail ? (
                      <div className="w-20 h-20 bg-white rounded flex items-center justify-center shadow">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No Image</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-gray-600 group-hover:text-purple-700 transition-colors">
                    {product.slug}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-800 font-semibold group-hover:text-purple-700 transition-colors">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-red-500 text-xs">{product.discountPercentage}% OFF</span>
                      <span className="text-green-600 font-bold">₹{product.finalPrice}</span>
                    </div>
                  </td>

                  <ProductBtn product={product} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
