import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import Link from "next/link";
import { getCategory } from "@/app/library/api-call";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";

const CategoryPage = async () => {
    const categoryJson = await getCategory();
    const categories = await categoryJson?.categories;

    return (
        <div className="p-6 bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 min-h-screen">
            <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                    <MdOutlineCategory className="text-purple-600 text-5xl" />
                    Manage Categories
                </h1>

                <Link href="/admin/category/add">
                    <button className="flex cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-transform hover:scale-105">
                        <FaPlus />
                        Add Category
                    </button>
                </Link>
            </div>

            <div className="flex justify-center w-full">
                <div className="w-full max-w-6xl overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-200">
                        <thead>
                            <tr className="bg-purple-100 text-left text-gray-700 text-sm">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(categories) && categories.map((cat, index) => (
                                <tr key={cat._id} className="border-t border-gray-100 hover:bg-purple-50">
                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>

                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${cat.categoryImage}`}
                                                alt={cat.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <span>{cat.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">{cat.slug}</td>

                                    <td className="px-6 py-4">
                                        <StatusBtn statusUrl={`category/status/${cat._id}`} status={cat.status} />
                                    </td>

                                    <td className="px-6 py-4 text-sm text-right space-x-2 flex justify-end">
                                        <Link href={`/admin/category/edit/${cat._id}`}>
                                            <button className="flex cursor-pointer items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                                                <FaEdit />
                                            </button>
                                        </Link>
                                        <DeleteBtn deleteUrl={`category/delete/${cat._id}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
