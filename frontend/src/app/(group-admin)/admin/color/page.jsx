import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import Link from "next/link";
import { getColor } from "@/app/library/api-call";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";

const ColorPage = async () => {
  const colorJson = await getColor();
  const colors = await colorJson?.colors;

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">🎨 Manage Colors</h1>
        <Link href="/admin/color/add">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer">
            <FaPlus className="text-sm" />
            <span className="text-sm font-medium">Add Color</span>
          </button>
        </Link>
      </div>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-200">
            <thead>
              <tr className="bg-purple-100 text-left text-gray-700 text-sm">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Hex</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(colors) &&
                colors.map((color, index) => (
                  <tr
                    key={color._id}
                    className="border-t border-gray-100 hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium flex items-center gap-2">
                      <MdOutlineCategory className="text-purple-500 text-lg" />
                      {color.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{color.slug}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 inline-block rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: color.Hexcode }}
                          title={color.Hexcode}
                        />
                        <span className="text-sm text-gray-600">{color.Hexcode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBtn
                        statusUrl={`color/status/${color._id}`}
                        status={color.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                      <Link href={`/admin/color/edit/${color._id}`}>
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <DeleteBtn deleteUrl={`color/delete/${color._id}`} />
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

export default ColorPage;
