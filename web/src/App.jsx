import './App.css'
import { NotificationProvider} 
from './contexts/NotificationContext'
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
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './components/dashboard'
import { getCookie } from './utils/cookies'
import Error404 from './components/error404'


function App() {
    const token = getCookie('token')
    const role = getCookie('role')
    return (
        <NotificationProvider>
            <BrowserRouter>
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
                        {token && role? 
                            <Route path='/Dashboard' element={<Dashboard />} >
                                
                            </Route>
                        :
                            <Route path="*" element={<Error404 />} />
                        }
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </NotificationProvider>
    )
}
export default App
