"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Loader from "../app/components/Loader"; // Import Loader
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="container mx-auto p-6">
      {/* Page title */}
      <Head>
        <title>Explore Our Products | E-Commerce</title>
        <meta
          name="description"
          content="Browse and explore a variety of amazing products."
        />
      </Head>

      {/* Full-width, half-screen slider */}
      {/* <div className="w-full h-[50vh] mb-8">
        <Slider {...sliderSettings}>
            <div key='1' className="relative h-[50vh] w-full">
              <Image
                src=""
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 w-full p-4 text-white text-lg font-semibold">
                
              </div>
            </div>
          
        </Slider>
      </div> */}

      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Explore Our Products
      </h1>

      {/* Search Box */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full max-w-lg p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Show Loader if Loading */}
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-lg bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl h-[420px] flex flex-col justify-between"
            >
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-48 object-contain rounded-lg"
              />
              <h2
                className="text-lg font-semibold mt-3 text-gray-800 line-clamp-2 h-[55px] overflow-hidden"
                title={product.title}
              >
                {product.title}
              </h2>
              <p className="text-gray-600 text-xl font-bold">${product.price}</p>
              <p className="text-sm mt-1 text-gray-500">{product.category}</p>
              <p className="text-yellow-500 font-semibold">
                ⭐ {product.rating.toFixed(1)}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <button className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600">
                  <ShoppingCart size={20} />
                </button>
                <Link
                  href={`/product/${product.id}-${product.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700">
                    View More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
