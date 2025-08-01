'use client'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { axiosApiInstance } from '@/app/library/helper';
import { notify } from '@/app/library/helper';

export default function DeleteBtn({deleteUrl}) {
    const router = useRouter();
    const handleDelete = () => {
        axiosApiInstance.delete(deleteUrl).then(
            (response) => {
                notify(response.data.msg, response.data.flag)
                console.log(response)
                if (response.data.flag === 1) {
                    router.refresh()
                }

            }
        ).catch(
            (error) => {
                console.log(error)
                notify("Something went wrong", 0)
            }
        )
    }
    return (
        <button onClick={handleDelete} className="text-red-600 hover:text-red-800 cursor-pointer" title="Delete">
            <FaTrash />
        </button>
    )
}
