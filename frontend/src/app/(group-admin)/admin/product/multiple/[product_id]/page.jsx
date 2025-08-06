'use client'
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { axiosApiInstance, notify } from "@/app/library/helper";


const AddProductImage = ({ params }) => {
    const id = params.product_id;

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let image of e.target.productImage.files) {
            formData.append("image", image)
        }


        axiosApiInstance.post("product/multiple-images/" + id, formData).then(
            (response) => {
                notify(response.data.msg, response.data.flag)
                if (response.data.flag === 1) {
                    console.log(response)
                }

            }
        ).catch(
            (err) => {
                notify("Something went wrong", 0);
            }
        )
    }


    return (
        <div className="flex justify-center mt-12 px-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-8">

                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">Add New Products</h2>
                    <Link href="/admin/product">
                        <button className="flex items-center cursor-pointer gap-2 text-sm bg-gray-100 text-blue-700 hover:bg-gray-200 px-4 py-2 rounded-md font-medium shadow-sm transition">
                            <FaArrowLeft />
                            Back
                        </button>
                    </Link>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                            <input type="file" id="productImage" name="productImage" multiple required
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                        </div>

                    </div>
                    <div className="text-center pt-4">
                        <button type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-md shadow transition transform hover:scale-105">
                            + Add Product Image
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProductImage;
