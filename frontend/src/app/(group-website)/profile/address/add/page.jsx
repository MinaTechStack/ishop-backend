'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { axiosApiInstance, notify } from '@/app/library/helper';
import { setUser } from '@/redux/features/userSlice';

const AddAddress = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const index = searchParams.get('index');  
  const user = useSelector((state) => state.user.data);

  const [address, setAddress] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) {
      notify('Please login first', 'error');
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (index !== null && user?.shipping_address?.[index]) {
      setAddress(user.shipping_address[index]);
    }
  }, [index, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        userId: user._id,
        address,
        ...(index !== null ? { index: Number(index) } : {})  
      };

      const res = await axiosApiInstance.post('/user/add-address', payload);
      const { msg, flag, user: updatedUser } = res.data;

      if (flag) {
        dispatch(setUser({ data: updatedUser, token: null }));
        notify(msg || 'Address saved successfully!', 'success');
        router.push('/checkout');
      } else {
        notify(msg || 'Failed to save address.', 'error');
      }
    } catch (err) {
      notify(err?.response?.data?.msg || 'Something went wrong!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 mb-6 bg-white shadow rounded">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {index !== null ? 'Edit Address' : 'Add New Address'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={
              field === 'addressLine2'
                ? 'Address Line 2 (optional)'
                : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
            }
            value={address[field]}
            onChange={handleChange}
            required={field !== 'addressLine2'}
            className="w-full border p-2 rounded"
            disabled={loading}
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#01A49E] cursor-pointer text-white py-2 px-4 rounded transition ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#018b87]'
          }`}
        >
          {loading ? 'Saving...' : index !== null ? 'Update Address' : 'Save Address'}
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
