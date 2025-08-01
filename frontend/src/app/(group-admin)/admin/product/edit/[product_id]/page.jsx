'use client'
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { axiosApiInstance, createSlug, notify } from "@/app/library/helper";
import { getCategory, getColor, getProduct } from "@/app/library/api-call";
import Select from 'react-select';
import RichTextEditor from "@/components/admin/RichTextEditor";

const EditProductForm = ({ params }) => {
    const [category, setCategory] = useState([]);
    const [color, setColor] = useState([]);
    const [selColors, selSetColors] = useState([]);
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [product, setProduct] = useState(null);  
    const [previewImage, setPreviewImage] = useState(null);

    const nameRef = useRef();
    const slugRef = useRef();
    const shortDescRef = useRef();
    const originalPriceRef = useRef();
    const discountPriceRef = useRef();
    const finalPriceRef = useRef();
    const thumbnailRef = useRef(); 

    const fetchMetaData = async () => {
        try {
            const categoryJson = await getCategory();
            setCategory(categoryJson?.categories || []);
            const colorJson = await getColor();
            setColor(colorJson?.colors || []);
        } catch (error) {
            console.error("Error fetching metadata:", error);
        }
    };

    const setProductDetails = (fetchedProduct) => {
        setProduct(fetchedProduct);

        nameRef.current.value = fetchedProduct.name;
        slugRef.current.value = fetchedProduct.slug;
        shortDescRef.current.value = fetchedProduct.shortDescription;
        originalPriceRef.current.value = fetchedProduct.originalPrice;
        discountPriceRef.current.value = fetchedProduct.discountPercentage;
        finalPriceRef.current.value = fetchedProduct.finalPrice;

        setDescription(fetchedProduct.longDescription);
        setSelectedCategory({
            value: fetchedProduct.categoryId._id,
            label: fetchedProduct.categoryId.name,
        });

        const colorIds = fetchedProduct.colors.map(col => col._id);
        selSetColors(colorIds);
    };

    const fetchProductData = async () => {
        try {
            const productJson = await getProduct(params?.product_id);
            const fetchedProduct = productJson?.products;
            if (fetchedProduct) {
                setProductDetails(fetchedProduct); 
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const changeHandler = () => {
        const slug = createSlug(nameRef.current.value);
        slugRef.current.value = slug;
    };

    const finalPrice = () => {
        const op = originalPriceRef.current.value;
        const dp = discountPriceRef.current.value;
        const final = Math.floor(op - op * (dp / 100));
        finalPriceRef.current.value = final;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);
        formData.append("shortDescription", shortDescRef.current.value);
        formData.append("longDescription", description);
        formData.append("originalPrice", originalPriceRef.current.value);
        formData.append("discountPercentage", discountPriceRef.current.value);
        formData.append("finalPrice", finalPriceRef.current.value);
        formData.append("categoryId", selectedCategory?.value);
        formData.append("colors", JSON.stringify(selColors));

        if (thumbnailRef.current.files[0]) {
            formData.append("thumbnail", thumbnailRef.current.files[0]);
        }

        try {
            const response = await axiosApiInstance.put(`/product/update/${params?.product_id}`, formData);
            notify(response.data.msg, response.data.flag);
        } catch (error) {
            notify(error?.response?.data?.msg || "Something went wrong", 0);
        }
    };

    useEffect(() => {
        fetchMetaData();
        fetchProductData();
    }, [params?.product_id]);

    return (
        <div className="flex justify-center mt-12 px-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">Edit Product</h2>
                    <Link href="/admin/product">
                        <button className="flex cursor-pointer items-center gap-2 text-sm bg-gray-100 text-blue-700 hover:bg-gray-200 px-4 py-2 rounded-md font-medium shadow-sm">
                            <FaArrowLeft />
                            Back
                        </button>
                    </Link>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" ref={nameRef} onChange={changeHandler} required className="w-full border rounded-md px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Slug</label>
                            <input type="text" ref={slugRef} readOnly className="w-full border rounded-md px-4 py-2" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                            <input type="text" ref={shortDescRef} className="w-full border rounded-md px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                            <RichTextEditor value={description} changeHandler={setDescription} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                            <input type="number" ref={originalPriceRef} onChange={finalPrice} required className="w-full border rounded-md px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                            <input type="number" ref={discountPriceRef} onChange={finalPrice} required className="w-full border rounded-md px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Final Price</label>
                            <input type="number" ref={finalPriceRef} readOnly className="w-full border rounded-md px-4 py-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <Select name="categoryId"
                                value={selectedCategory}
                                onChange={(selected) => setSelectedCategory(selected)}
                                options={category?.map(cat => ({ value: cat._id, label: cat.name }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                            <Select isMulti closeMenuOnSelect={false}
                                onChange={(color) => selSetColors(color.map(o => o.value))}
                                value={color?.filter(col => selColors.includes(col._id)).map(col => ({ value: col._id, label: col.name }))}
                                options={color?.map(col => ({ value: col._id, label: col.name }))} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image (optional)</label>
                        <input type="file" name="productImage"
                            ref={thumbnailRef}
                            className="w-full border rounded-md px-4 py-2 cursor-pointer" />
                        {product?.thumbnail && (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                                alt="Current Thumbnail"
                                className="mt-2 w-32 h-32 object-cover rounded border"
                            />
                        )}
                    </div>

                    <div className="text-center pt-4">
                        <button type="submit"
                            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-md shadow transition transform hover:scale-105">
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
