import { useState } from 'react'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import LandingPage from './Pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage'
import Sidebar from './Components/Sidebar';
import Middle from './Components/Middle';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
    {/* <HomePage /> */}
    {/* <Sidebar /> */}
    </>
  )
}

export default App
