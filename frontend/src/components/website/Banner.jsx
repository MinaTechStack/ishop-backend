'use client';
import React from 'react';

const Banner = () => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative shadow">
      <img
        src="/homepage.jpg" // Ensure this image is inside /public folder
        alt="Banner"
        className="w-full h-full object-cover"
      />

      {/* Optional overlay text */}
      
    </div>
  );
};

export default Banner;
