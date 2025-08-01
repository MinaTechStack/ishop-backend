'use client'
import { useRef, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { axiosApiInstance, createSlug, notify } from "@/app/library/helper";
import { getCategory } from "@/app/library/api-call";

const EditCategoryForm = ({ params }) => {
    const [category, setCategory] = useState(null);
    const nameRef = useRef();
    const slugRef = useRef();
    const imageRef = useRef();

    const changeHandler = () => {
        const slug = createSlug(nameRef.current.value);
        slugRef.current.value = slug;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);

        if (imageRef.current.files[0]) {
            formData.append("categoryImage", imageRef.current.files[0]);
        }

        axiosApiInstance.put(`category/update/${params?.category_id}`, formData).then(
            (res) => {
                notify(res.data.msg, res.data.flag);
                if (res.data.flag === 1) {
                    console.log(res.data.msg);
                }
            }
        ).catch(() => {
            notify("Something went wrong", 0);
        });
    };


    async function getdataById() {
        const categoryJson = await getCategory(params?.category_id);
        const data = categoryJson?.categories;
        setCategory(data);
    };

    useEffect(() => {
        getdataById();
    }, [params?.category_id]);

    return (
        <div className="flex flex-col items-center mt-10 px-4 relative">
            {/* Top-Right Back Button */}
            <div className="w-full max-w-2xl flex justify-end mb-4">
                <Link href="/admin/category">
                    <button className="flex items-center gap-2 cursor-pointer bg-gray-100 text-blue-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium shadow transition">
                        <FaArrowLeft />
                        Back to Categories
                    </button>
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 animate-scaleIn">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Edit Category
                </h2>

                <form onSubmit={submitHandler} className="space-y-5">
                    {/* Category Name */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Category Name
                        </label>
                        <input
                            type="text"
                            ref={nameRef}
                            onChange={changeHandler}
                            defaultValue={category?.name}
                            placeholder="Enter category name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Category Slug */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Category Slug
                        </label>
                        <input
                            type="text"
                            ref={slugRef}
                            readOnly
                            defaultValue={category?.slug}
                            placeholder="Enter category slug"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Category Image */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Category Image
                        </label>
                        <input
                            type="file"
                            ref={imageRef}
                            name="categoryImage"
                            className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        {category?.categoryImage && (
                            <>
                                {console.log(category?.categoryImage)} {/* Debug log */}
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/category/${category.categoryImage}`}
                                    alt="Current category"
                                    className="mt-2 w-32 h-32 object-cover rounded border"
                                />

                            </>
                        )}

                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition transform hover:scale-[1.01]"
                        >
                            Edit Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryForm;
