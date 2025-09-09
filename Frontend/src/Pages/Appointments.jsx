import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctor from '../Components/RelatedDoctor'
import { toast } from 'react-toastify';
import axios from 'axios';

function Appointments() {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorData } = useContext(AppContext);

  const [doc_Info, setDoc_info] = useState(null);
  const [docSlot, setdocSlot] = useState([]);
  const [slotIndex, setslotIndex] = useState(0);
  const [slotTime, setslotTime] = useState('');

  const navigate = useNavigate();

  const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // Corrected order for getDay()

  // Fetch doctor info once doctors are loaded or docId changes
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const docInfo = doctors.find(doc => doc._id === docId);
      if (docInfo) setDoc_info(docInfo);
    }
  }, [doctors, docId]);

  // Generate available slots only after doc_Info is loaded and slots_booked exists
  useEffect(() => {
    if (doc_Info && doc_Info.slots_booked) {
      GetavailableSlot();
    }
  }, [doc_Info]);

  const GetavailableSlot = () => {
    setdocSlot([]);

    let today = new Date();
    for (let i = 0; i < 7; ++i) {
      let currdate = new Date(today);
      currdate.setDate(today.getDate() + i);

      let endtime = new Date(today);
      endtime.setDate(endtime.getDate() + i);
      endtime.setHours(21, 0, 0, 0);

      if (today.getDate() === currdate.getDate()) {
        currdate.setHours(currdate.getHours() > 10 ? currdate.getHours() + 1 : 10);
        currdate.setMinutes(currdate.getMinutes() > 30 ? 30 : 0);
      } else {
        currdate.setHours(10);
        currdate.setMinutes(0);
      }

      let timeslot = [];
      while (currdate < endtime) {
        let formattedTime = currdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currdate.getDate();
        let month = currdate.getMonth() + 1;
        let year = currdate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        const isSlotBooked = doc_Info.slots_booked[slotDate]?.includes(formattedTime);

        if (!isSlotBooked) {
          timeslot.push({
            datetime: new Date(currdate),
            time: formattedTime,
          });
        }
        currdate.setMinutes(currdate.getMinutes() + 30);
      }
      setdocSlot(prev => [...prev, timeslot]);
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please Login to get services');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    try {
      const date = docSlot[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorData(); // call the function!
        navigate('/myAppointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  if (!doc_Info) {
    // Optionally show a loading state or message
    return <p className="mt-[100px] text-center">Loading doctor information...</p>;
  }

  return (
    <div className='mt-[100px]'>
      <div>
        {/* Doctor Details */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-red-700 w-full sm:max-w-72 rounded-lg' src={doc_Info.image} alt={doc_Info.name} />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {doc_Info.name} <img className='w-5' src={assets.verified_icon} alt="Verified" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{doc_Info.degree} - {doc_Info.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{doc_Info.experience}</button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt="Info" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'> {doc_Info.about} </p>
            </div>
            <p className='text-amber-800 font-medium mt-4'>
              Appointment Fee: <span className='text-blue-400'>{currencySymbol}{doc_Info.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking slot */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll lg:overflow-x-hidden mt-4'>
            {
              docSlot.length > 0 && docSlot.map((item, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-red-700 text-white' : 'border border-gray-200'}`}
                  key={index}
                  onClick={() => setslotIndex(index)}
                >
                  <p>{item[0] && weeks[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className='flex items-center gap-3 w-full mt-4 overflow-x-scroll'>
            {
              docSlot.length > 0 && docSlot[slotIndex] && docSlot[slotIndex].map((item, index) => (
                <p
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-red-700 text-white' : 'border border-gray-300'}`}
                  key={index}
                  onClick={() => setslotTime(item.time)}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            }
          </div>
          <button
            onClick={bookAppointment}
            className='bg-blue-500 text-white rounded-full px-14 py-2 my-6 font-medium hover:cursor-pointer hover:bg-blue-700'
          >
            Book an Appointment
          </button>
        </div>
      </div>

      <RelatedDoctor docId={docId} speciality={doc_Info.speciality} />
    </div>
  );
}

export default Appointments;
