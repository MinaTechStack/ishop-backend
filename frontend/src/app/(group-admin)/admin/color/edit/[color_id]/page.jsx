'use client'
import { useRef, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { axiosApiInstance, createSlug, notify } from "@/app/library/helper";
import { getColor} from "@/app/library/api-call";

const EditColorForm = ({ params }) => {
    const [color, setColor] = useState(null);
    const nameRef = useRef();
    const slugRef = useRef();
    const hexCodeRef = useRef();

    const changeHandler = (e) => {
        const slug = createSlug(nameRef.current.value);
        slugRef.current.value = slug;
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const data = {
            name: nameRef.current.value,
            slug: slugRef.current.value,
            Hexcode: hexCodeRef.current.value

        }
        axiosApiInstance.put(`color/update/${params?.color_id}`, data).then(
            (res) => {
                notify(res.data.msg, res.data.flag)
                if (res.data.flag == 1) {
                    e.target.reset();
                    console.log(res.data.message)
                }

            }
        ).catch(
            (err) => {
                notify("Something went wrong", 0)
            }
        )


    };

    useEffect(() => {
        const fetchColor = async () => {
          const colorJson = await getColor(params?.color_id);
          const data = colorJson?.colors;
          setColor(data);
        };
        
        fetchColor();
      }, [params?.color_id]);
      

    return (
        <div className="flex flex-col items-center mt-10 px-4 relative">
            {/* Top-Right Back Button */}
            <div className="w-full max-w-2xl flex justify-end mb-4">
                <Link href="/admin/color">
                    <button className="flex  items-center gap-2 cursor-pointer bg-gray-100 text-blue-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium shadow transition">
                        <FaArrowLeft />
                        Back to Colors
                    </button>
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 animate-scaleIn">
                <h2 className="text-2xl cursor-pointer font-semibold text-gray-800 mb-6 text-center">
                    Edit Color
                </h2>

                <form onSubmit={submitHandler} className="space-y-5">
                    {/* Category Name */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Color Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            ref={nameRef}
                            onChange={changeHandler}
                            defaultValue={color?.name}
                            placeholder="Enter color name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Color Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            ref={slugRef}
                            readOnly
                            defaultValue={color?.slug}
                            placeholder="Enter color slug"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Color Code
                        </label>
                        <input
                            type="color"
                            id="Hexcode"
                            ref={hexCodeRef}
                            readOnly
                            placeholder="Enter color code"
                            defaultValue={color?.Hexcode} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <div className="my-4">{color?.Hexcode}</div>
                    </div>

                    {/* Status */}


                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition transform hover:scale-[1.01]"
                        >
                            Edit Color
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditColorForm;
