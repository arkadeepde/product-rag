"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Loader from "../app/components/Loader";

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
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);

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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < filteredProducts.slice(0, 5).length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProducts.slice(0, 5).length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredProducts[activeSuggestionIndex];
      if (selected) {
        setSearchTerm(selected.title);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>Explore Our Products | E-Commerce</title>
        <meta name="description" content="Browse and explore a variety of amazing products." />
      </Head>

      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Explore Our Products
      </h1>

      {/* Autocomplete Search Box */}
      <div className="flex justify-center mb-6 relative w-full">
        <div className="relative w-full max-w-lg">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
              setActiveSuggestionIndex(-1);
            }}
            onFocus={() => {
              if (searchTerm) setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 100);
            }}
            onKeyDown={handleKeyDown}
          />
          {showSuggestions && searchTerm && (
            <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredProducts.slice(0, 5).map((product, index) => (
                <li
                  key={product.id}
                  className={`px-4 py-2 cursor-pointer ${
                    index === activeSuggestionIndex ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onMouseDown={() => {
                    setSearchTerm(product.title);
                    setShowSuggestions(false);
                    setActiveSuggestionIndex(-1);
                  }}
                >
                  {product.title}
                </li>
              ))}
              {filteredProducts.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No products found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Loader or Product Grid */}
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
                className="text-lg font-semibold mt-3 text-gray-800 line-clamp-2 h-[55px]"
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
