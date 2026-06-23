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
import VacancyDetails from './components/VacancyDetails';
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
import Students from './components/DashboardLayout/University/Students';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import DashboardOverview from './components/Admin/pages/DashboardOverview';
import CandidatesManagement from './components/Admin/pages/CandidatesManagement';
import CompaniesManagement from './components/Admin/pages/CompaniesManagement';
import UniversitiesManagement from './components/Admin/pages/UniversitiesManagement';
import JobRolesManagement from './components/Admin/pages/JobRolesManagement';
import JobApplicationsManagement from './components/Admin/pages/JobApplicationsManagement';
import HRsManagement from './components/Admin/pages/HRsManagement';
import ManagersManagement from './components/Admin/pages/ManagersManagement';
import VolunteersManagement from './components/Admin/pages/VolunteersManagement';
import WorkshopsManagement from './components/Admin/pages/WorkshopsManagement';
import JobFairDatesManagement from './components/Admin/pages/JobFairDatesManagement';
import FeedbackManagement from './components/Admin/pages/FeedbackManagement';

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
                        <Route path='/vacancy/details/:vacancyId' element={<VacancyDetails />} />
                        
                        {/* Admin Routes */}
                        <Route path='/admin/login' element={<AdminLogin />} />
                        <Route path='/admin/dashboard' element={<AdminDashboard />}>
                            <Route index element={<DashboardOverview />} />
                            <Route path='candidates' element={<CandidatesManagement />} />
                            <Route path='companies' element={<CompaniesManagement />} />
                            <Route path='universities' element={<UniversitiesManagement />} />
                            <Route path='jobroles' element={<JobRolesManagement />} />
                            <Route path='jobapplications' element={<JobApplicationsManagement />} />
                            <Route path='hrs' element={<HRsManagement />} />
                            <Route path='managers' element={<ManagersManagement />} />
                            <Route path='volunteers' element={<VolunteersManagement />} />
                            <Route path='workshops' element={<WorkshopsManagement />} />
                            <Route path='jobfairdates' element={<JobFairDatesManagement />} />
                            <Route path='feedback' element={<FeedbackManagement />} />
                        </Route>

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
                                <Route path='/university' element={<Dashboard />}>
                                    <Route index element={<Profile />} />
                                    <Route path='/university/students' element={<Students />} />
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
