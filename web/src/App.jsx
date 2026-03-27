import './App.css'
import { NotificationProvider} 
from './contexts/NotificationContext'
import './contexts/Notification.css'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Home from './components/Home';
import Company from './components/company';
import { BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {

  return (
    <NotificationProvider>
    <BrowserRouter>
        <Navbar />
        <Footer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/signup" element ={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/company' element={<Company />} />
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  )
}

export default App
