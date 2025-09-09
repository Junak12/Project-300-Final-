import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctor = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const [reldoc, setreldoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsdata = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setreldoc(doctorsdata);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center my-16 gap-4 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium text-center">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-gray-600">
        Discover a network of top-rated, dependable medical professionals ready to serve you.
      </p>

      {/* Grid for doctors */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0 place-items-center">
        {reldoc.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="w-[200px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
          >
            <img
              className="bg-blue-50 w-full h-[180px] object-cover"
              src={item.image}
              alt={item.name}
            />
            <div className="p-4 text-center">
              <div
                className={`flex items-center justify-center gap-2 text-sm ${
                  item.available ? 'text-green-500' : 'text-gray-500'
                } mb-2`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.available ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></span>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className="text-medium font-medium text-gray-900">{item.name}</p>
              <p className="text-gray-700 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctor;
