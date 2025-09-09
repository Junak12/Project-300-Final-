import React from "react";
import contactimg from "../assets/Contact.jpg";

function Contact() {
  return (
    <div className="mt-[100px] sm:mt-[120px] max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="flex justify-center">
        <p className="text-[20px] sm:text-[24px] font-medium text-black">
          Contact <span className="text-red-600">Us</span>
        </p>
      </div>

      {/* Contact Content */}
      <div className="mt-8 sm:mt-10 flex flex-col md:flex-row flex-wrap gap-6 sm:gap-8 items-center md:items-start">
        {/* Left Image */}
        <div className="w-full md:w-[45%] flex justify-center md:justify-start">
          <img
            className="w-full sm:w-[90%] max-w-[450px] rounded-lg shadow-md"
            src={contactimg}
            alt="contact"
          />
        </div>

        {/* Right Contact Info */}
        <div className="w-full md:w-[45%] flex flex-col justify-center text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">
            Get in Touch
          </h3>
          <p className="text-sm sm:text-base mb-2">
            📍 <strong>Office Location:</strong> 123 Health St., Wellness City,
            Country
          </p>
          <p className="text-sm sm:text-base mb-2">
            📞 <strong>Phone:</strong> +1 (234) 567-8900
          </p>
          <p className="text-sm sm:text-base mb-2">
            📧 <strong>Email:</strong> contact@smarthospital.com
          </p>
          <p className="text-sm sm:text-base mb-2">
            ⏰ <strong>Hours:</strong> Mon - Fri: 8:00 AM - 6:00 PM
          </p>
          <p className="text-sm sm:text-base mb-2">
            🌐 <strong>Website:</strong> www.smarthospital.com
          </p>
        </div>
      </div>

    </div>
  );
}

export default Contact;
