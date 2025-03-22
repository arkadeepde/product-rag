"use client";

import Link from "next/link";
import { ShoppingCart, LogIn } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [cartCount, setCartCount] = useState(0); // Mock cart count

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/logo.png" // Replace with your logo path
            alt="Site Logo"
            className="h-10 w-10"
          />
          <span className="text-2xl font-bold text-gray-800">
            MyShop
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6 items-center">
          {/* Login Button */}
          <Link href="/login">
            <button className="flex items-center text-gray-700 hover:text-blue-500 font-medium transition">
              <LogIn size={20} className="mr-1" />
              Login
            </button>
          </Link>

          {/* Cart Button */}
          <Link href="/cart" className="relative">
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
              <ShoppingCart size={20} />
              <span className="ml-2">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
