import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 sm:mt-16 px-4 sm:px-6 py-8 sm:py-10 shadow-inner">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-8 sm:gap-10 text-center md:text-left">
        {/* Hospital Brief */}
        <div className="md:w-[40%]">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Smart Hospital
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            We’re redefining healthcare through technology, compassion, and
            innovation. Whether you're looking for a routine checkup or advanced
            care, our team is here to serve you — because your health is our
            priority.
          </p>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-gray-600 text-xs sm:text-sm">
            <li>
              <Link to="/" className="hover:text-gray-800">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-800">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-800">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/appointment" className="hover:text-gray-800">
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Summary */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Contact
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-gray-600 text-xs sm:text-sm">
            <li>📍 123 Medical Blvd, City, Country</li>
            <li>📞 +0-000-000-000</li>
            <li>✉️ support@smarthospital.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-gray-400 text-[10px] sm:text-xs mt-8 sm:mt-10 border-t pt-3 sm:pt-4">
        &copy; {new Date().getFullYear()} Smart Hospital. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
