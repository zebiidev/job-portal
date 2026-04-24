"use client";

import { FiSearch, FiMapPin } from "react-icons/fi";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 ">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-black leading-tight mb-6">
              Find Your <span className="">Dream Job</span>
              <br /> Build Your Career
            </h1>

            <p className="text-gray-600 text-lg max-w-xl mb-10 leading-relaxed">
              Discover thousands of job opportunities from top companies. Apply
              easily, track applications, and get hired faster.
            </p>

            {/* Search Box */}
            <div className="bg-[#f3f3f3] rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl flex-1">
                <FiSearch className="text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl flex-1">
                <FiMapPin className="text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all">
                Search Jobs
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              <div>
                <h3 className="text-2xl font-bold text-black">10k+</h3>
                <p className="text-gray-500 text-sm">Jobs Available</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">5k+</h3>
                <p className="text-gray-500 text-sm">Companies</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">20k+</h3>
                <p className="text-gray-500 text-sm">Job Seekers</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          {/* Right Visual */}
          <div className="relative hidden lg:flex items-center overflow-x-hidden justify-center">
            {/* Soft background shape */}
            <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full blur-3xl" />

            {/* Image wrapper */}
            <div className="relative   w-full max-w-md xl:max-w-lg">
              <Image
                src="/hero.png"
                alt="Job search illustration"
                width={700}
                height={400}
                priority
                className="w-full h-[500px] rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
