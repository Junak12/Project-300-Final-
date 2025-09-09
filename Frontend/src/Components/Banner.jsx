import React from 'react'
import BannerImg from '../assets/banner.webp';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';


const Banner = () => {
    const navigate = useNavigate();
  return (
    <div className='flex bg-blue-500 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/*Left side */}
        <div className='flex-1 py-8  sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-xl  sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                <p>Trusted by Thousands: </p>
                <p className='mt-4'>Book with 100+ Doctors</p>
            </div>
            <button 
            className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-110 transition-all cursor-pointer'
            onClick={()=>{
                navigate('/login');
                scrollTo(0,0);
            }}
            >Create Account</button>
        </div>
        {/* right side */}
        <div className='hidden md:block md:w-1/2 lg: w-[380px] relative'>
            <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
        </div>
    </div>
  )
}

export default Banner