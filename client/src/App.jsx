import { useState } from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Landing from './Components/Landing'
import HeroSection from './Components/HeroSection'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>

     <Navbar />
     <HeroSection />
     <Landing />
     <Footer />
     
    </>
  )
}

export default App
