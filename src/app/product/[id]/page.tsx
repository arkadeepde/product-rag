"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import Head from "next/head";
import Loader from "../../components/Loader"; // Import Loader
import ChatLauncher from "../../components/ChatLauncher"; // Import ChatLauncher

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
  }[];
  stock: number;
}

// Fetch product details based on ID
async function getProduct(productId: string) {
  const res = await fetch(`https://dummyjson.com/products/${productId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }
  return res.json();
}

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState<string | null>("");
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const productId = unwrappedParams.id.split("-")[0]; // Extract ID from URL
    setLoading(true);
    getProduct(productId)
      .then((data) => {
        setProduct(data);
        localStorage.setItem("productData", JSON.stringify(data));
        setProductData(JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg text-gray-600">Product not found!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Page title for product details */}
      <Head>
        <title>{product.title} | Product Details</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="flex flex-col md:flex-row items-center">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={400}
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="md:ml-8 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600 text-lg mt-2">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mt-4">${product.price}</p>
          <p className="text-sm text-gray-500 mt-2">Category: {product.category}</p>
          <p className="text-yellow-500 font-semibold mt-2">
            ⭐ {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Chat Launcher */}
      <ChatLauncher
        productTitle={product.title}
        productDescription={product.description}
        productMetaData={productData || ""}
      />

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        {product.reviews?.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md bg-gray-50"
              >
                <p className="text-gray-700 font-semibold">
                  {review.reviewerName} - ⭐ {review.rating}
                </p>
                <p className="text-sm text-gray-500">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
