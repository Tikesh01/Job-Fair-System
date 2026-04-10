import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import { getCookie } from './utils/cookies'
import './App.css'
import { NotificationProvider} from './contexts/NotificationContext'
import './contexts/Notification.css'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Home from './components/Home';
import Company from './components/NavMenu/Company';
import About from './components/NavMenu/About';
import Job from './components/NavMenu/Job';
import Contact from './components/NavMenu/Contact';
import JobfairDates from './components/NavMenu/JobfairDates';
import Dashboard from './components/dashboard'
import Error404 from './components/error404'
import Profile from './components/DashboardLayout/Profile';
import { useState, useEffect } from 'react';


function App() {
    const [token, setToken] = useState(getCookie('token'))
    const [role, setRole] = useState(getCookie('role'))
    const location = useLocation()
    localStorage.setItem('currentLoc',location.pathname)
    
    useEffect(() => {
        const handleAuthChange = () => {
            setToken(getCookie('token'))
            setRole(getCookie('role'))
        }

        window.addEventListener('authUpdated', handleAuthChange)
        
        return () => {
            window.removeEventListener('authUpdated', handleAuthChange)
        }
    }, [])
    return (
        <NotificationProvider>
                <Navbar />
                <main>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/signup" element ={<Signup />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/company' element={<Company />} />
                        <Route path='/job' element={<Job />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/imp-dates' element={<JobfairDates />} />
                        {token && role? 
                            <Route path='/dashboard' element={<Dashboard />} >
                                <Route index element={<Profile />} />
                                <Route path='/dashboard/company' element={<Company />} />
                                <Route path='/dashboard/job' element={<Job />} />
                            </Route>
                        :
                            <Route path="*" element={<Error404 />} />
                        }
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </main>
                <Footer />
        </NotificationProvider>
    )
}
export default App
