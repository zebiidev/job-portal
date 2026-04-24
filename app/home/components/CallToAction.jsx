import Link from "next/link";
import React from "react";
import { FiArrowRight } from "react-icons/fi";

const CallToAction = () => {
  return (
    <section className="w-full bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Content */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Ready to Take Your Career to the Next Level?
          </h2>
          <p className="text-gray-700 max-w-md text-base md:text-lg">
            Join thousands of job seekers and recruiters. Explore the best
            opportunities and grow your career with confidence.
          </p>
        </div>

        {/* Right Button */}
        <div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-base font-medium shadow-lg hover:bg-gray-900 transition-all duration-300"
          >
            Browse Jobs
            <FiArrowRight className="text-lg" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
