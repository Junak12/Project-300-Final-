import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-4 text-gray-800">
      <h1 className="text-3xl font-medium text-center">Find Doctors By Speciality</h1>
      <p className="sm:w-1/2 w-full max-w-md text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      {/* Container for specialties */}
      <div className="flex pt-5 w-full
                      overflow-x-auto
                      scrollbar-hide
                      sm:overflow-x-visible sm:flex-wrap sm:justify-center">
        {specialityData.map((item, index) => (
          <Link
            onClick={()=>{scrollTo(0,0)}}
            key={index}
            to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center min-w-[100px] sm:min-w-[150px] cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={item.image}
              alt={item.speciality}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <p className="mt-2 text-center text-xs sm:text-sm">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
