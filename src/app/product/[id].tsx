import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";

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

export default function ProductDetail({ product }: { product: Product }) {
  if (!product) {
    return <p className="text-center text-xl mt-10">Product not found</p>;
  }

  return (
    <>
      <Head>
        <title>{product.title} - Fake Store</title>
      </Head>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            className="w-80 h-80 object-contain rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-xl text-gray-700 mt-2">${product.price}</p>
            <p className="text-gray-600 mt-4">{product.description}</p>
            <p className="text-sm mt-2 text-gray-500">Category: {product.category}</p>
            <p className="text-yellow-500 font-semibold mt-2">⭐ {product.rating.rate} ({product.rating.count} reviews)</p>

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:bg-blue-600">
                Add to Cart
              </button>
              <button className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:bg-gray-600">
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Fetch product data based on ID
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  return {
    props: { product },
  };
};
