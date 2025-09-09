import React from 'react'
import Header from '../Components/Header'
import Footer from '../components/Footer';
import SpecialityMenu from '../Components/SpecialityMenu'
import TopDoctors from '../Components/TopDoctors'
import Banner from '../Components/Banner'

function Home() {
  return (
    <div className = 'mt-20'>
      <Header/>
      <Banner/>
    </div>
  )
}

export default Home