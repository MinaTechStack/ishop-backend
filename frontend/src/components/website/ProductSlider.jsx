'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import { getProduct } from '@/app/library/api-call';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductSlider = ({ title = 'New Products', products: propProducts }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      if (propProducts && propProducts.length > 0) {
        setProducts(propProducts);
      } else {
        const res = await getProduct();
        if (res?.products) {
          setProducts(res.products.slice(0, 10));
        }
      }
    };
    loadProducts();
  }, [propProducts]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="my-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product._id} className="p-2">
            <Link href={`/productDetail/${product.slug}`}>
              <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col hover:shadow-xl transition-all cursor-pointer">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/product/${product.thumbnail}`}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-2"
                />
                <h3 className="text-base font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                <div className="text-green-600 font-bold">₹{product.finalPrice}</div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductSlider;
