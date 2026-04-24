import React from "react";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">ZebiJobs</h2>
          <p className="text-gray-400 text-sm">
            Connecting university students with career opportunities. Fast,
            reliable, and student-friendly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/jobs" className="hover:text-white transition">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link href="/post-job" className="hover:text-white transition">
                Post a Job
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h3 className="font-semibold">Resources</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/faq" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-semibold">Contact</h3>
          <p className="flex items-center gap-2 text-gray-400">
            <FiMapPin /> 123 University Rd, City, Country
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <FiPhone /> +123 456 7890
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <FiMail /> support@unijobs.com
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} UniJobs. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
