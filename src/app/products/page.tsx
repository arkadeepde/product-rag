"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react"; // Import cart icon from lucide-react
import Link from "next/link";

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Explore Our Products</h1>
      
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-lg bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl h-[420px] flex flex-col justify-between">
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              className="w-full h-48 object-contain rounded-lg"
            />
            <h2 className="text-lg font-semibold mt-3 text-gray-800 line-clamp-2 h-[55px] overflow-hidden" 
                title={product.title}>
                    {product.title}
            </h2>
            <p className="text-gray-600 text-xl font-bold">${product.price}</p>
            <p className="text-sm mt-1 text-gray-500">{product.category}</p>
            <p className="text-yellow-500 font-semibold">⭐ {product.rating.rate} ({product.rating.count} reviews)</p>
            

            <div className="mt-3 flex items-center justify-between">
                <button className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600">
                  <ShoppingCart size={20} />
                </button>
                <Link href={`/product/${product.id}`}>
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700">
                    View More
                  </button>
                </Link>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
