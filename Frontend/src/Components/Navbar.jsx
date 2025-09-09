import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import hospitImg from "../assets/Logo.png";
import Profile from "../assets/profile.png";
import Dropdown from "../assets/dropdown.svg";
import { AppContext } from "../Context/AppContext";

function Navbar() {
  const navigate = useNavigate();
  const {token, setToken, userData} = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    setToken(false);
    localStorage.removeItem('token');
  };

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "ABOUT", to: "/about" },
    { label: "CONTACT", to: "/contact" },
  ];

  const profileLinks = [
    { label: "My Profile", to: "/profile" },
    { label: "My Appointments", to: "/myAppointments" },
    { label: "My Test", to: "/my-test" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-white to-gray-200 shadow-lg border-b border-gray-300 z-50">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img className="w-20 sm:w-24" src={hospitImg} alt="Logo" />
          <h4 className="font-bold text-lg sm:text-xl mt-10 sm:mt-14">
            SMART HOSPITAL
          </h4>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <ul className="flex gap-6 font-semibold text-[15px] sm:text-[16px]">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 border-b-2 border-green-700 pb-1"
                      : "hover:text-green-600 transition duration-200"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile or Login (Desktop) */}
        <div className="hidden md:block">
          {token ? (
            <div className="flex items-center gap-1 cursor-pointer group relative">
              <img
                className="w-[40px] sm:w-[44px]"
                src={userData.image}
                alt="profile"
              />
              <img
                className="w-[26px] sm:w-[30px]"
                src={Dropdown}
                alt="dropdown"
              />

              {/* Dropdown Menu */}
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md">
                  {profileLinks.map(({ label, to }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "text-green-700 border-b-2 border-green-700 pb-1 transition duration-200"
                          : "hover:text-green-600 transition duration-200"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                  <p
                    onClick={logout}
                    className="hover:text-green-600 cursor-pointer transition duration-200"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#3452EB] px-4 py-2 rounded-2xl text-white font-medium hover:bg-[#052BF0] transition duration-200 cursor-pointer"
            >
              Create Account
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none cursor-pointer"
          >
            <div className="space-y-1">
              <span className="block w-6 h-[2px] bg-gray-700"></span>
              <span className="block w-6 h-[2px] bg-gray-700"></span>
              <span className="block w-6 h-[2px] bg-gray-700"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 border-b-2 border-green-700 pb-1"
                      : "hover:text-green-600"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {token ? (
              <>
                {profileLinks.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-green-700 border-b-2 border-green-700 pb-1"
                        : "hover:text-green-600"
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <p
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="hover:text-green-600 cursor-pointer"
                >
                  Logout
                </p>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="bg-[#3452EB] px-4 py-2 rounded-2xl text-white font-medium hover:bg-[#052BF0] transition duration-200"
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
