import React from "react";
import AboutImg from "../assets/About.jpg";

function About() {
  return (
    <div className="mt-[100px] sm:mt-[120px] max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="flex justify-center">
        <p className="text-[20px] sm:text-[24px] font-medium text-black">
          About <span className="text-green-600">Us</span>
        </p>
      </div>

      {/* Image and Text Section */}
      <div className="mt-8 sm:mt-10 flex flex-col md:flex-row flex-wrap gap-6 sm:gap-8 justify-center items-start">
        {/* Image */}
        <div className="w-full md:w-[40%]">
          <img
            className="w-full rounded-lg shadow-md"
            src={AboutImg}
            alt="about"
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-[50%]">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            At Smart Hospital, we are dedicated to providing world-class
            healthcare services with compassion and excellence. Our mission is
            to ensure every patient receives personalized care in a safe and
            comfortable environment. With state-of-the-art technology and a team
            of experienced professionals, we focus on prevention, treatment, and
            recovery. We believe healthcare is not just about curing illnesses
            but also about improving the quality of life. Together, we strive to
            make every life healthier, happier, and more fulfilling.
          </p>

          <h4 className="text-xl sm:text-2xl mt-6 sm:mt-8 font-semibold">
            Our Vision
          </h4>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-3 sm:mt-4">
            Our vision is to provide exceptional healthcare through innovation
            and compassion. We strive to build a healthier community with
            accessible and quality medical services for all.
          </p>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-[24px] sm:text-[28px] font-semibold text-center mb-6 sm:mb-8">
          Why <span className="text-green-600">Us</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {/* Box 1 */}
          <div className="bg-white shadow-md rounded-lg p-5 sm:p-6 w-full sm:w-[280px] md:w-[300px] text-center
            transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <h4 className="font-semibold text-base sm:text-lg mb-2">
              ✅ Expert Medical Professionals
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm">
              Highly skilled doctors and staff dedicated to providing the best
              care.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-white shadow-md rounded-lg p-5 sm:p-6 w-full sm:w-[280px] md:w-[300px] text-center
            transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <h4 className="font-semibold text-base sm:text-lg mb-2">
              ✅ Advanced Technology
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm">
              Equipped with modern medical equipment for accurate diagnosis and
              treatment.
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-white shadow-md rounded-lg p-5 sm:p-6 w-full sm:w-[280px] md:w-[300px] text-center
            transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <h4 className="font-semibold text-base sm:text-lg mb-2">
              ✅ Patient-Centered Care
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm">
              Compassionate services focused on comfort, safety, and well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
