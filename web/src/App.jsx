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
import About from './components/NavMenu/About';
import Job from './components/NavMenu/Job';
import Contact from './components/NavMenu/Contact';
import JobfairDates from './components/NavMenu/JobfairDates';
import Dashboard from './components/dashboard';
import Error404 from './components/error404';
import Profile from './components/DashboardLayout/Profile';
import { useState, useEffect } from 'react';
import JobApplication from './components/DashboardLayout/Candidate/JobApplication';
import Workshop from './components/DashboardLayout/Candidate/Workshop';
import CompanyList from './components/NavMenu/CompanyList';
import JobApplicationByCandidate from './components/DashboardLayout/Company/JobApplication';
import Vacancy from './components/DashboardLayout/Company/Vacancy'
import Hr from './components/DashboardLayout/Company/Hr'

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
                        <Route path='/company-list' element={<CompanyList />} />
                        <Route path='/job' element={<Job />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/imp-dates' element={<JobfairDates />} />
                        {token && role? 
                            <>
                                <Route path={`/candidate`} element={<Dashboard />} >
                                    <Route index element={<Profile />} />
                                    <Route path='/candidate/company' element={<CompanyList />} />
                                    <Route path='/candidate/job' element={<Job />} />
                                    <Route path='/candidate/job/applications' element={<JobApplication />} />
                                    <Route path='/candidate/workshop' element={<Workshop />} />
                                </Route>
                                <Route path='/company' element={<Dashboard />}>
                                    <Route index element={<Profile />} />
                                    <Route path='/company/job/applications' element={<JobApplicationByCandidate />} />
                                    <Route path='/company/vacancy' element={<Vacancy />} />
                                    <Route path='/company/hr' element={<Hr />} />
                                </Route>
                            </>
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
