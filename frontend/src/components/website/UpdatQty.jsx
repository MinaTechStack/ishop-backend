'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { qtyHandler } from '@/redux/features/cartSlice';
import { axiosApiInstance } from '@/app/library/helper';

export default function UpdateQty({ productId, final_total, original_total, qty }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.data);
  const [loading, setLoading] = useState(false);

  const handleQtyChange = async (type) => {
    if (loading) return;

    dispatch(
      qtyHandler({
        productId,
        type,
        final_price: final_total,
        original_price: original_total,
      })
    );

    if (user != null) {
      setLoading(true);
      try {
        await axiosApiInstance.post('cart/update-qty', {
          userId: user._id,
          productId,
          type,
        });
      } catch (err) {
        console.error('Failed to update quantity in backend:', err);

        // Optional: rollback local state change
        dispatch(
          qtyHandler({
            productId,
            type: type === 'increment' ? 'decrement' : 'increment',
            final_price: final_total,
            original_price: original_total,
          })
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-2 mt-2 items-center">
      <button
        onClick={() => handleQtyChange('decrement')}
        className="bg-red-500 text-white w-6 h-6 cursor-pointer rounded disabled:opacity-50"
        disabled={loading}
      >
        -
      </button>
      <span className="min-w-[20px] text-center">{qty}</span>
      <button
        onClick={() => handleQtyChange('increment')}
        className="bg-green-500 text-white w-6 h-6 cursor-pointer rounded disabled:opacity-50"
        disabled={loading}
      >
        +
      </button>
    </div>
  );
}
