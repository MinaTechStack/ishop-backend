import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from "react-icons/fa";

export default function ContactForm() {
  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="bg-white p-4 my-5 rounded">
        <h2 className="text-gray-500 text-sm sm:text-base">
          Home / pages / <span className="text-black font-semibold">Contact</span>
        </h2>
      </div>

      <div className="my-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8">
          <h2 className="text-base sm:text-lg font-bold uppercase mb-2">Ready to work with us</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">Contact us for all your questions and opinions</p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Form */}
            <form className="md:col-span-3 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <label className="text-sm text-black mb-1 block">First Name<span className="text-red-500">*</span></label>
                  <input type="text" className="border border-gray-300 p-2 rounded w-full" required />
                </div>
                <div className="w-full">
                  <label className="text-sm text-black mb-1 block">Last Name<span className="text-red-500">*</span></label>
                  <input type="text" className="border border-gray-300 p-2 rounded w-full" required />
                </div>
              </div>

              <div>
                <label className="text-sm text-black mb-1 block">Email Address<span className="text-red-500">*</span></label>
                <input type="email" className="border border-gray-300 p-2 rounded w-full" required />
              </div>

              <div>
                <label className="text-sm text-black mb-1 block">Phone Number (Optional)</label>
                <input type="tel" className="border border-gray-300 p-2 rounded w-full" />
              </div>

              <div>
                <label className="text-sm text-black mb-1 block">Country<span className="text-red-500">*</span></label>
                <select className="border border-gray-300 p-2 rounded w-full" required>
                  <option>India</option>
                  <option>United States (US)</option>
                  <option>United Kingdom (UK)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-black mb-1 block">Subject (Optional)</label>
                <input type="text" className="border border-gray-300 p-2 rounded w-full" />
              </div>

              <div>
                <label className="text-sm text-black mb-1 block">Message</label>
                <textarea className="border border-gray-300 p-2 rounded w-full h-28" placeholder="Note about your order..." />
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mr-2 mt-1" />
                <label className="text-sm text-black">
                  I want to receive news and updates. By submitting, I agree to the{" "}
                  <span className="text-green-600 underline cursor-pointer">Terms & Conditions</span>
                </label>
              </div>

              <button type="submit" className="bg-teal-600 text-white text-sm px-6 py-2 rounded hover:bg-green-700">
                SEND MESSAGE
              </button>
            </form>

            <div className="md:col-span-2 w-full space-y-6">
              <div className="bg-gray-100 py-6 px-4 sm:px-6 rounded-lg space-y-5">
                <div>
                  <p className="uppercase text-xs text-gray-500 font-medium">India (Head Office)</p>
                  <p className="text-sm text-gray-800 mt-2">5th Floor, Brigade Gateway, Rajajinagar, Bangalore - 560055</p>
                  <p className="text-sm text-gray-800 mt-1">(+91) 9886 2516 25</p>
                  <a href="mailto:hello@swattechmart.com" className="text-sm text-green-600 mt-1 block">hello@swiftttechmart.com</a>
                </div>


                <div>
                  <p className="uppercase text-xs text-gray-500 font-medium">India (Branch)</p>
                  <p className="text-sm text-gray-800 mt-2">2nd Floor, Cyber Park, Malviya Nagar, Jaipur - 302017</p>
                  <p className="text-sm text-gray-800 mt-1">(+91) 9875 5350 25</p>
                  <a href="mailto:contact@swattechmart.co.in" className="text-sm text-green-600 mt-1 block">contact@swifttechmart.co.in</a>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {[FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaPinterestP].map((Icon, idx) => (
                    <div key={idx} className="bg-white rounded-full p-2 hover:bg-gray-200">
                      <Icon className="text-black text-base cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>

              <img src="/laptop.png" alt="Laptop" className="rounded w-full h-64 sm:h-80 object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-md shadow-md my-10">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">FIND US ON GOOGLE MAP</h2>
        <div className="w-full aspect-video rounded-md overflow-hidden border-2 border-gray-200 shadow">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2889.865866201396!2d10.50283567625389!3d43.84569984070106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a9a50661a002f%3A0x36b70f14e5f9f222!2sChiesa%20di%20San%20Francesco%2C%2055100%20Lucca%20LU%2C%20Italy!5e0!3m2!1sen!2sin!4v1715074922671!5m2!1sen!2sin"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
