import { useState } from 'react';
import './Navbar.css';
import { getCookie } from '../utils/cookies';
import api from '../api/axiosapi';
import { useNotification} from '../contexts/NotificationContext' 
import { useNavigate } from 'react-router-dom'
export default function Navbar() {
  const token = getCookie('token')
  const role = getCookie('role')
  const {notify} = useNotification()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const active = localStorage.getItem('currentLoc')
  const navigate = useNavigate()
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await api.post('/logout')
      if(response.status === 200){
        notify('info',"Log Out Suceess")
        navigate('/')
      }
      else{
        notify('error',response.data?.detail)
      }
    } catch (error) {
      notify('error', error.response?.data?.detail)
    }
  }
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>JobFair</h2>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" title='/' className={(active==='/')?"navbar-link active": 'navbar-link'} >Home</a>
          <a href="/about"  title="/about" className={(active==='/about')?"navbar-link active": 'navbar-link'} >About</a>
          <a href="/contact" title="/contact" className={(active==='/contact')?"navbar-link active": 'navbar-link'} >Contact</a>
          <a href="/job" title="/job" className={(active==='/job')?"navbar-link active": 'navbar-link'} >Jobs</a>
          <a href="/company" title="/company" className={(active==='/company')?"navbar-link active": 'navbar-link'}>Companies</a>
          <div className="navbar-actions">
            {token && role ?<a href="/Dashboard"><i className="fas fa-dashboard"></i> Dashboard</a>:<a href="/login" className="btn-secondary-nav"><i className="fas fa-arrow-right-to-bracket"></i> Login</a>}
            {token && role ? <button type="button" className="btn-primary-nav" onClick={handleLogout} >Log out</button>:<a href='/signup' className="btn-primary-nav">Sign Up</a>}
          </div>
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        
      </div>
    </nav>
  );
}