import React from "react";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">About Us</h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        Welcome to <span className="font-semibold">Jolly Shoes e-Store</span>, your
        trusted online marketplace. We are passionate about bringing you the
        best quality products with a smooth and reliable shopping experience.
      </p>
      <p className="text-gray-700 leading-relaxed mb-6">
        Our mission is simple: to provide an easy, affordable, and secure way
        for customers to shop online. Whether you're looking for fashion,
        accessories, or daily essentials, we’ve got you covered.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Thank you for choosing us. We’re excited to serve you!
      </p>
    </div></>
  );
}

export default About;
