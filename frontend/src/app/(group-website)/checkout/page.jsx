'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { notify, axiosApiInstance } from '@/app/library/helper';
import { setUser } from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';
import { emptyCart } from '@/redux/features/cartSlice';

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMode, setPaymentMode] = useState(null);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState(user?.data?.shipping_address || []);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    setAddresses(user?.data?.shipping_address || []);
  }, [user]);

  const handleDeleteAddress = async (index) => {
    const userId = user?.data?._id;
    if (!userId) return notify("User ID missing", 0);

    try {
      const res = await axiosApiInstance.post('/user/delete-address', { userId, index });
      notify(res.data.msg, res.data.flag);

      if (res.data.flag) {
        const updated = [...addresses];
        updated.splice(index, 1);
        setAddresses(updated);
        dispatch(setUser({ data: res.data.user }));

        if (selectedAddress === index) setSelectedAddress(null);
        else if (selectedAddress > index) setSelectedAddress(prev => prev - 1);
      }
    } catch (err) {
      notify("Failed to delete address", 0);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await axiosApiInstance.post("/order/order-place", {
        user_id: user.data._id,
        order_total: cart.final_total,
        payment_mode: paymentMode,
        shipping_details: addresses[selectedAddress],
      });

      if (res.data.flag === 1) {
        if (paymentMode === 0) {
          dispatch(emptyCart());
          router.push(`/thank-you/${res.data.order_id}`);
        } else {
          const options = {
            key: process.env.NEXT_PUBLIC_KEY_ID,
            currency: "INR",
            name: "ShopEasy Ecommerce Private Limited",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: res.data.razorpay_order_id,
            handler: function (response) {
              axiosApiInstance.post("/order/success", {
                order_id: res.data.order_id,
                user_id: user?.data?._id,
                razorpay_response: response
              })
                .then((res) => {
                  if (res.data.flag === 1) {
                    dispatch(emptyCart());
                    router.push(`/thank-you/${res.data.order_id}`);
                  } else {
                    notify(res.data.message, res.data.flag);
                  }
                }).catch(
                  (err) => {
                    console.error("Verification failed", err);
                    notify("Payment verification failed", 0);
                  }
                )
            },
            prefill: {
              name: user.data.name,
              email: user.data.email,
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzp1 = new window.Razorpay(options);

          rzp1.on("payment.failed", function (response) {
            alert(response.error.description || "Payment Failed");
          });

          rzp1.open();
        }

        notify(res.data.message, res.data.flag);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      notify("Order could not be placed. Please try again.", 0);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="bg-white p-4 mb-5 rounded">
        <h2 className="text-gray-500 text-sm sm:text-base">
          <Link href="/">Home</Link> / pages /{' '}
          <span className="text-black font-semibold">Checkout</span>
        </h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
        <h2 className="uppercase mb-6 text-lg font-bold text-black">Checkout</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-black mb-4">Select Address</h3>
            <div className="space-y-4">
              {Array.isArray(addresses) && addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <div
                    key={index}
                    className={`relative border rounded-lg p-4 shadow-sm transition-all ${selectedAddress === index
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-300'
                      }`}
                  >
                    <div
                      className="cursor-pointer space-y-1"
                      onClick={() => setSelectedAddress(index)}
                    >
                      <p className="font-semibold text-black">{address.name}</p>
                      <p className="text-sm text-gray-700">{address.addressLine1}</p>
                      {address.addressLine2 && (
                        <p className="text-sm text-gray-700">{address.addressLine2}</p>
                      )}
                      <p className="text-sm text-gray-700">
                        {address.city}, {address.state}, {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-700">{address.country}</p>
                    </div>

                    <div className="mt-3 flex justify-end gap-4">
                      <Link href={`/profile/address/add?index=${index}`}>
                        <button className="text-blue-600 text-xs hover:underline cursor-pointer">Edit</button>
                      </Link>
                      <button
                        onClick={() => handleDeleteAddress(index)}
                        className="text-red-500 cursor-pointer text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No addresses available. Please add one.</p>
              )}

              <Link href="/profile/address/add">
                <button className="mt-2 cursor-pointer border px-4 py-2 rounded bg-[#01A49E] text-white hover:bg-[#028c87] text-sm font-medium">
                  + Add New Address
                </button>
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Payment Mode</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentMode(0)}
                  className={`flex-1 py-3 cursor-pointer text-center rounded-lg font-medium border transition-all ${paymentMode === 0
                    ? 'bg-[#01A49E] text-white border-[#01A49E]'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-500'
                    }`}
                >
                  Cash on Delivery (COD)
                </button>
                <button
                  onClick={() => setPaymentMode(1)}
                  className={`flex-1 py-3 cursor-pointer text-center rounded-lg font-medium border transition-all ${paymentMode === 1
                    ? 'bg-[#01A49E] text-white border-[#01A49E]'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-500'
                    }`}
                >
                  Online Payment
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <h3 className="text-base font-bold text-black mb-4">Order Summary</h3>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 rounded shadow-sm space-y-3 text-sm">
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">Total Amount:</span>
                <span className="text-gray-700">₹{cart.original_total || 0}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">Discount:</span>
                <span className="text-green-600">
                  ₹{(cart.original_total || 0) - (cart.final_total || 0)}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">Final Amount:</span>
                <span className="text-black font-semibold">₹{cart.final_total || 0}</span>
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-5 w-full cursor-pointer text-sm py-2 rounded bg-[#01A49E] hover:bg-[#028c87] text-white disabled:opacity-50"
              disabled={selectedAddress === null || paymentMode === null}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
