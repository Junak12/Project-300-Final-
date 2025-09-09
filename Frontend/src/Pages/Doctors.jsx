import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer';
import {AppContext} from '../Context/AppContext'

function Doctorlist() {
  const {speciality} = useParams();
  const {doctors} = useContext(AppContext)
  const [Filt, setFilt] = useState([]);
  const navigate = useNavigate();

  const applyfilter = () => {
    if (speciality) {
      setFilt(doctors.filter(doc => doc.speciality === speciality))
    }
    else {
      setFilt(doctors);
    }
  }

  useEffect(()=> {
    applyfilter();
  },[doctors,speciality])

  return (
    <div className='mt-[100px]'>
      <div>
        <p className='text-gray-600'>Explore Our Specialist Doctors</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
          <div className='flex flex-col gap-4 text-sm text-gray-600'>
            <p 
              onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} 
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer 
                ${speciality === 'General physician' ? 'bg-blue-100 text-blue-700 border-blue-600' : 'border-gray-600'}`}>
              General physician
            </p>
            <p 
              onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')}  
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer 
                ${speciality === 'Gynecologist' ? 'bg-pink-100 text-pink-700 border-pink-600' : 'border-gray-600'}`}>
              Gynecologist
            </p>
            <p 
              onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')}  
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer 
                ${speciality === 'Dermatologist' ? 'bg-yellow-100 text-yellow-700 border-yellow-600' : 'border-gray-600'}`}>
              Dermatologist
            </p>
            <p 
              onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} 
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer 
                ${speciality === 'Pediatricians' ? 'bg-green-100 text-green-700 border-green-600' : 'border-gray-600'}`}>
              Pediatricians
            </p>
            <p 
              onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} 
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer 
                ${speciality === 'Neurologist' ? 'bg-purple-100 text-purple-700 border-purple-600' : 'border-gray-600'}`}>
              Neurologist
            </p>
            <p 
              onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} 
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer 
                ${speciality === 'Gastroenterologist' ? 'bg-orange-100 text-orange-700 border-orange-600' : 'border-gray-600'}`}>
              Gastroenterologist
            </p>
          </div>

          <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0 place-items-center -mt-2'>
            {
              Filt.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className='w-[200px] border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
                  onClick={()=>(navigate(`/appointment/${item._id}`))}
                >
                  <img className='bg-blue-50 w-full h-[180px] object-cover' src={item.image} alt={item.name} />
                  <div className='p-4 text-center'>
                    <div className={`flex items-center justify-center gap-2 text-sm mb-2
                      ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full 
                        ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      <p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-medium font-medium text-gray-900'>{item.name}</p>
                    <p className='text-gray-700 text-sm'>{item.speciality}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Doctorlist;
