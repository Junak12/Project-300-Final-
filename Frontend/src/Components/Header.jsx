import React, { useEffect, useState, useRef } from "react";
import Headimage from "../assets/HeaderImage.jpg";
import arrow from "../assets/Arrow.jpg";
import { useNavigate } from "react-router-dom";

function Header() {
  const [showLines, setShowLines] = useState([false, false, false, false, false]);
  const navigate = useNavigate();

  const arrowRef1 = useRef(null);
  const arrowRef2 = useRef(null);
  const arrowRef3 = useRef(null);

  const Handle = (ref, route) => {
    if (ref.current) {
      navigate(route);
    }
  };

  useEffect(() => {
    const timers = showLines.map((_, i) =>
      setTimeout(() => {
        setShowLines((prev) => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }, i * 600)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#e6f7f8] to-[#d2f0ef] shadow-[0_20px_80px_#c1eeec] min-h-screen p-6 sm:p-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start">
          {/* Left column */}
          <div className="w-full md:w-[40%] mt-8 md:mt-12 md:ml-7 text-center md:text-left">
            
            {/* ✅ Welcome Line (now above heading) */}
            <h1
              className={`text-green-400 font-semibold text-[20px] sm:text-[24px] mb-4 transition-all duration-1000 transform ${
                showLines[0]
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              Welcome to Smart Hospital
            </h1>

            {/* ✅ Animated heading */}
            <p className="text-[32px] sm:text-[40px] md:text-[48px] text-[#09090A] font-semibold leading-tight space-y-2">
              {["In Pursuit of", "Better", "Health", "Solution."].map((line, i) => (
                <span
                  key={i}
                  className={`block transition-all duration-700 transform ${
                    showLines[i + 1]
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                >
                  {line}
                </span>
              ))}
            </p>

            {/* Paragraph */}
            <div className="mt-4 mb-8 max-w-md mx-auto md:mx-0">
              <p className="text-[14px] sm:text-[16px] leading-relaxed text-gray-700">
                At Smart Hospital, we believe health is not just about treatment —
                it’s about care, compassion, and connection. Our dedicated team is
                here to guide you every step of the way, toward a healthier, happier
                life.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-0 md:gap-6 lg:gap-8">
              {/* Appointment */}
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-200 to-white shadow-md h-[60px] px-4 rounded-lg">
                <button
                  onClick={() => {navigate("/main-app"); scrollTo(0,0)}}
                  className="text-gray-800 font-semibold text-[14px] sm:text-[16px] hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  Book Appointment
                </button>
                <img
                  ref={arrowRef1}
                  onClick={() => Handle(arrowRef1, "/appointment/:docId")}
                  className="w-6 sm:w-8 cursor-pointer"
                  src={arrow}
                  alt="arrow"
                />
              </div>

              {/* Test */}
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-200 to-white shadow-md h-[60px] px-4 rounded-lg">
                <button
                  onClick={() => navigate("/test")}
                  className="text-gray-800 font-semibold text-[14px] sm:text-[16px] hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  Test Appointment
                </button>
                <img
                  ref={arrowRef2}
                  onClick={() => Handle(arrowRef2, "/test")}
                  className="w-6 sm:w-8 cursor-pointer"
                  src={arrow}
                  alt="arrow"
                />
              </div>

              {/* Pharmacy */}
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-200 to-white shadow-md h-[60px] px-4 rounded-lg">
                <button
                  onClick={() => navigate("/pharmacy")}
                  className="text-gray-800 font-semibold text-[14px] sm:text-[16px] hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  Pharmacy
                </button>
                <img
                  ref={arrowRef3}
                  onClick={() => Handle(arrowRef3, "/pharmacy")}
                  className="w-6 sm:w-8 cursor-pointer"
                  src={arrow}
                  alt="arrow"
                />
              </div>
            </div>
          </div>

          {/* Right column: Image */}
          <div className="w-full md:w-[50%] mt-10 md:mt-6 flex justify-center">
            <img
              className="max-w-full h-auto rounded-md"
              src={Headimage}
              alt="img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
