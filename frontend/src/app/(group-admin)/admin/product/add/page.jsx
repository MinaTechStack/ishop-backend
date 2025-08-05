'use client'
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { axiosApiInstance, createSlug, notify } from "@/app/library/helper";
import { getCategory, getColor } from "@/app/library/api-call";
import Select from 'react-select'
import RichTextEditor from "@/components/admin/RichTextEditor";



const AddProductForm = () => {
    const [category, setCategory] = useState();
    const [color, setColor] = useState();
    const [selColors, selSetColors] = useState([]);
    const [description, setDescription] = useState("");

    const nameRef = useRef();
    const slugRef = useRef();
    const originalPriceRef = useRef();
    const discountPriceRef = useRef();
    const finalPriceRef = useRef();

    const fetchData = async () => {
        const categoryJson = await getCategory();
        const categories = categoryJson.categories;
        setCategory(categories)

        const colorJson = await getColor();
        const colors = await colorJson?.colors;
        setColor(colors)
    }



    const changeHandler = (e) => {
        const slug = createSlug(nameRef.current.value);
        slugRef.current.value = slug;
    };
    const finalPrice = () => {
        const op = originalPriceRef.current.value;
        const dp = discountPriceRef.current.value;

        const final = Math.floor(op - op * (dp / 100));
        finalPriceRef.current.value = final;
    }




    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(description)

        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);
        formData.append("shortDescription", e.target.shortDesc.value);
        formData.append("longDescription", description);
        formData.append("originalPrice", originalPriceRef.current.value);
        formData.append("discountPercentage", discountPriceRef.current.value);
        formData.append("finalPrice", finalPriceRef.current.value);
        formData.append("categoryId", e.target.categoryId.value);
        formData.append("colors", JSON.stringify(selColors));
        formData.append("thumbnail", e.target.productImage.files[0]);


        axiosApiInstance.post("product/create", formData).then(
            (response) => {
                notify(response.data.msg, response.data.flag)
                if (response.data.flag === 1) {
                    e.target.reset();
                    setDescription("")
                }

            }
        ).catch(
            (err) => {
                notify("Something went wrong", 0);
            }
        )
    }
    useEffect(
        () => {
            fetchData()
        },
        []
    )


    return (
        <div className="flex justify-center mt-12 px-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
                    <Link href="/admin/product">
                        <button className="flex items-center cursor-pointer gap-2 text-sm bg-gray-100 text-blue-700 hover:bg-gray-200 px-4 py-2 rounded-md font-medium shadow-sm transition">
                            <FaArrowLeft />
                            Back
                        </button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-6">

                    {/* Product Name & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" id="productName" name="productName" ref={nameRef} onChange={changeHandler} placeholder="e.g. iPhone 15 Pro" required
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Slug</label>
                            <input type="text" id="productSlug" ref={slugRef} name="productSlug" readOnly placeholder="Auto-generated or enter manually"
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                            <input type="text" id="shortDesc" name="shortDesc" placeholder="Brief description"
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                            <RichTextEditor value={description} changeHandler={
                                (desc) => {
                                    setDescription(desc)
                                }
                            } />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                <input type="number" id="originalPrice" name="originalPrice" ref={originalPriceRef} onChange={finalPrice} defaultValue="100" required
                                    className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                                <input type="number" id="discountPrice" name="discountPrice" ref={discountPriceRef} onChange={finalPrice} defaultValue="2" required
                                    className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Final Price</label>
                                <input type="number" id="finalPrice" name="finalPrice" ref={finalPriceRef} readOnly min="50" required
                                    className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Category & Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <Select name="categoryId" options={
                                category?.map(
                                    (cat, i) => {
                                        return { value: cat._id, label: cat.name }
                                    }
                                )

                            } />


                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                            <Select onChange={
                                (color) => {
                                    const selectCol = color.map(o => o.value)
                                    selSetColors(selectCol)

                                }
                            } isMulti closeMenuOnSelect={false} options={
                                color?.map(
                                    (col, i) => {
                                        return { value: col._id, label: col.name }
                                    }
                                )

                            } />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                            <input type="file" id="productImage" name="productImage" required
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                        </div>

                    </div>

                    {/* Product Options */}
                    {/* <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Options</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="stock" className="w-4 h-4" />
                                <label htmlFor="stock" className="text-sm font-medium text-gray-700">In Stock</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="topSelling" className="w-4 h-4" />
                                <label htmlFor="topSelling" className="text-sm font-medium text-gray-700">Top Selling</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="status" defaultChecked className="w-4 h-4" />
                                <label htmlFor="status" className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                        </div>
                    </div> */}

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                        <button type="submit"
                            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-md shadow transition transform hover:scale-105">
                            Add Product
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
