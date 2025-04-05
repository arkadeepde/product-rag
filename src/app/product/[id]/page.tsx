"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import Head from "next/head";
import Loader from "../../components/Loader";
import ChatLauncher from "../../components/ChatLauncher";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  availabilityStatus: string;
  thumbnail: string;
  rating: number;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
  }[];
  stock: number;
  brand: string;
  returnPolicy: string;
  warrantyInformation: string;
  discountPercentage: number;
  minimumOrderQuantity: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  images: string[];
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
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const productId = unwrappedParams.id.split("-")[0];
    setLoading(true);
    getProduct(productId)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
        localStorage.setItem("productData", JSON.stringify(data));
        setProductData(JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg text-gray-600">Product not found!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>{product.title} | Product Details</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Images */}
        <div className="flex md:flex-col gap-2 md:mr-4 mb-4 md:mb-0">
          {product.images?.map((img, index) => (
            <div
              key={index}
              className={`border rounded-lg p-1 cursor-pointer ${
                img === selectedImage ? "border-blue-500" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                width={60}
                height={60}
                className="object-contain rounded"
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1">
          <Zoom>
          <Image
            src={selectedImage}
            alt={product.title}
            width={500}
            height={500}
            className="w-full object-contain rounded-lg shadow-lg"
          />
          </Zoom>
        </div>

        {/* Product Info */}
        <div className="md:ml-8 mt-6 md:mt-0 w-full md:w-[35%]">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600 text-lg mt-2">{product.description}</p>

          <div className="mt-4">
            {product.discountPercentage > 0 ? (
              <>
                <p className="text-lg text-gray-500 line-through">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}{" "}
                  <span className="text-green-600 text-sm font-semibold">
                    ({product.discountPercentage}% OFF)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">Category: {product.category}</p>
          <p className="text-yellow-500 font-semibold mt-2">
            ⭐ {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
          </p>
          <p className="text-sm text-gray-500 mt-1">{product.availabilityStatus}</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Information</h2>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-2">
          <ul className="text-gray-700 space-y-2">
            <li>
              <span className="font-semibold">Brand:</span> {product.brand}
            </li>
            <li>
              <span className="font-semibold">Return Policy:</span> {product.returnPolicy}
            </li>
            <li>
              <span className="font-semibold">Warranty:</span> {product.warrantyInformation}
            </li>
            {product.dimensions && (
              <li>
                <span className="font-semibold">Dimensions:</span>{" "}
                {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D
              </li>
            )}
          </ul>
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
