import React from 'react'
import TopDoctors from '../Components/TopDoctors'
import Doctorlist from '../Components/Doctorlist'
import SpecialityMenu from '../Components/SpecialityMenu'

const AppointmentMain = () => {
  return (
    <div>
      <div className='mt-[100px]'>
        <SpecialityMenu/>
        <TopDoctors/>
      </div>
    </div>
  )
}

export default AppointmentMain