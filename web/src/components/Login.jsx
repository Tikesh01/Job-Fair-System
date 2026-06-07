import './Login.css'
import './RoleOption.css'
import loginImg  from '../assets/tablet-login-animate.svg'
import { useState } from 'react'
import api from '../api/axiosapi'
import { useNotification } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import {FaBuilding, FaGraduationCap, FaLifeRing, FaUniversity, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Login(){
    const navigate = useNavigate()
    const {notify} = useNotification('')
    const [email, setEmail] = useState('')
    const [userRole, setRole] = useState('candidate')
    const [errors, setErrors] = useState({})
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const roleOptions = [
        { value: 'candidate', label: 'Candidate', icon: <FaGraduationCap /> },
        { value: 'university', label: 'University', icon: <FaUniversity /> },
        { value: 'company', label: 'Company', icon: <FaBuilding /> },
    ];
    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === 'login-email') {
            setEmail(value)
        } else if (name === 'login-password') {
            setPassword(value)
        }
        if(name === 'role'){
            setRole(value)
        }
    }

    const validateEmail = (email) =>{
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    const handleSubmit = async (event)=>{
        event.preventDefault()
        setErrors({});
        const newErrors = {}
        if(!validateEmail(email))newErrors.email="Enter Valid Email Id"
        if(!userRole)newErrors.role="Select a Role"
        if(!email){newErrors.email="Enter the email first"}
        if(!password){newErrors.password="Password is required"}
        

        if(Object.keys(newErrors).length === 0) {
            try {
                const payload = {'email':email,'password':password, 'role':userRole}
                const response = await api.post("/login", payload)
                if(response.status === 200){
                    setErrors({})
                    window.dispatchEvent(new Event('authUpdated'))
                    notify('success', "You Are Logged In Successfully")
                    return navigate(`/${userRole}`)

                }
            } catch (error) {
                const errorMessage = error.response?.data?.detail || "An error occurred"
                newErrors.error = errorMessage
                notify('error', errorMessage)
                setErrors(newErrors)
            }
        } else {
            setErrors(newErrors)
        }
    }
    return(<>
        <div className="login-container">
            <div className="login-rafiki-image">
                <img src={loginImg} alt="Login Img loading....." />
            </div>
            {/* <div className="partition">
                <hr className='vertical-hr' /><FaLifeRing /><hr className='vertical-hr' />
            </div> */}
            <div className="login-form-wrapper">
                <div className="login-wrapper-header">
                    <h2>Welcome Back</h2>
                    <p>Login to Get Authorized</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group" >
                        <label><i className="fas fa-users"></i> Select Your Role</label>
                        <div className={`role-options ${errors.role ? 'error' : ''}`}>
                        {roleOptions.map((role) => (
                            <label key={role.value} className={`role-option ${userRole === role.value ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value={role.value}
                                    checked={userRole === role.value}
                                    onChange={handleChange}
                                />
                                <i className="role-icon" title={role.label}>{role.icon}</i>
                                <span className={`role-label ${userRole === role.value ? 'selected' : ''}`}>{role.label}</span>
                            </label>
                        ))}
                        </div>
                        {errors.role && <span className="error-message">{errors.role}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-email"><i className="fas fa-globe"></i> Email Address</label>
                        <input 
                            type="Email"
                            name="login-email"
                            id='login-email'
                            placeholder='example@mail.domain'
                            value={email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error-massage">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password"><i className="fas fa-lock"></i> Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name="login-password"
                                id='login-password'
                                placeholder='Enter the password'
                                value={password}
                                onChange={handleChange}
                            />
                            <span type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <span><FaRegEyeSlash /></span> : <span><FaRegEye /></span> }
                            </span>
                        </div>
                        {errors.password && <span className="error-massage">{errors.password}</span>}
                    </div>
                    
                    {errors.error && <span className="error-massage"><br />{errors.error}</span>}
                   
                    <button type="submit" className="btn btn-s btn-primary">Login</button>

                    <small className='signup-text'>
                        Don't have an account? <a href="/signup" className="signup-link"> Sign Up</a>
                    </small>
                </form>
            </div>
        </div>
    </>)
}

export default Login