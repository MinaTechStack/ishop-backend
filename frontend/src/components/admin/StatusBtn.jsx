'use client';
import { axiosApiInstance, getCookies, notify } from '@/app/library/helper';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function StatusBtn({ status, statusUrl }) {
  const router = useRouter();
  const token = getCookies('admin_token');

  const handleStatusChange = () => {
    axiosApiInstance
      .patch(statusUrl, null, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        notify(response.data.msg, response.data.flag);
        if (response.data.flag === 1) {
          router.refresh();
        }
      })
      .catch(() => {
        notify('Something went wrong', 0);
      });
  };

  return (
    <button
      onClick={handleStatusChange}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-200 
        ${
          status
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        } cursor-pointer`}
      title={status ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
    >
      {status ? (
        <>
          <FaToggleOn className="text-green-500 text-lg" />
          Active
        </>
      ) : (
        <>
          <FaToggleOff className="text-red-500 text-lg" />
          Inactive
        </>
      )}
    </button>
  );
}
