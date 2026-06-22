import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axiosapi'
import { useNotification } from '../../contexts/NotificationContext'
import { FaRegEye, FaRegEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa'
import './AdminLogin.css'

function AdminLogin() {
    const navigate = useNavigate()
    const { notify } = useNotification()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setErrors({})
        const newErrors = {}

        if (!email) newErrors.email = "Email is required"
        if (!validateEmail(email)) newErrors.email = "Enter a valid email"
        if (!password) newErrors.password = "Password is required"
        if (password.length < 8) newErrors.password = "Password must be at least 8 characters"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setLoading(true)
            const response = await api.post('/login', {
                role: 'admin',
                email: email,
                password: password
            })

            if (response.status == 200) {
                
                // Notify browser about auth update
                window.dispatchEvent(new Event('authUpdated'))
                
                notify('success','Admin login successful!')
                navigate('/admin/dashboard')
            }
        } catch (error) {
            console.error('Login error:', error)
            const errorMsg = error.response?.data?.message || 'Login failed. Please try again.'
            notify('error',errorMsg)
            setErrors({ form: errorMsg })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-wrapper">
                <div className="admin-login-content">
                    <div className="admin-login-header">
                        <div className="admin-login-icon">🔐</div>
                        <h1>Admin Login</h1>
                        <p>Job Fair System Management</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="admin-email">
                                <FaEnvelope className="icon" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="admin-email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@jobfair.com"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="admin-password">
                                <FaLock className="icon" />
                                Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="admin-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={errors.password ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        {errors.form && <div className="form-error">{errors.form}</div>}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p>For security reasons, only authorized administrators can access this panel.</p>
                    </div>
                </div>

                <div className="admin-login-background">
                    <div className="bg-shape bg-shape-1"></div>
                    <div className="bg-shape bg-shape-2"></div>
                    <div className="bg-shape bg-shape-3"></div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
