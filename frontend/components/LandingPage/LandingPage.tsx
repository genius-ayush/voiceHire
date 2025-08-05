import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Features from './Features'
import Footer from './Footer'

function LandingPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header/>
      <Hero/>
      <Features/>
      <Footer/>
      </div>
  )
}

export default LandingPage