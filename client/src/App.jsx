import { useState } from 'react'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import LandingPage from './Pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage'
import Sidebar from './Components/Sidebar';
import Middle from './Components/Middle';
import Username from './Pages/Username';
import Profile from './Pages/Profile';
import BookMarks from './Pages/BookMarks';
import ForgetPasswordPage from './Pages/ForgetPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import AboutUs from './Pages/AboutUs';

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
        <Route path="/username" element={<Username />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookmarks" element={<BookMarks />} />
        <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
