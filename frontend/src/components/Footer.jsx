import React from 'react';

export default function Footer() {
  return (
    <footer className="mb-1 p-20 text-center text-sm text-gray-500">
      <div className="font-semibold mb-2">CropWise</div>
      <p className="mb-2">Stay Updated with CropWise</p>
      <input type="email" placeholder="Enter your email" className="border p-2 rounded mr-2" />
      <button className="bg-green-600 font-inter text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">Subscribe</button>
      <div className="mt-4 text-xs">© 2025 CropWise</div>
    </footer>
  );
}
