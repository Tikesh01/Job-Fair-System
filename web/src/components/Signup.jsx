import { useState } from 'react';
import './Signup.css';
import './RoleOption.css';
import api from '../api/axiosapi'
import signupImage from '../assets/signup-bro.svg';
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../contexts/NotificationContext';
import { FaBuilding, FaGraduationCap, FaUniversity } from 'react-icons/fa';

export default function Signup() {
  const {notify} = useNotification('')
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'candidate',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: 'candidate', label: 'Candidate', icon: <FaGraduationCap /> },
    { value: 'university', label: 'University', icon: <FaUniversity /> },
    { value: 'company', label: 'Company', icon: <FaBuilding /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNext = async () => {
    const newErrors = {};

    if (step === 1) {
      setErrors({});
      if (!formData.role) newErrors.role = 'Please select a role';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      
      if (Object.keys(newErrors).length === 0) {
        try {
          const payload = { role: formData.role, email: formData.email };
          const resp = await api.post("/generate/otp", payload);
          
          if (resp.status === 200) {
            setStep(2);
          }
          else {
            const errDetail = resp.data?.detail;
            newErrors.email = typeof errDetail === 'string' ? errDetail : 'Failed to send OTP. Please try again.';
          }
        } catch (error) {
          const errDetail = error.response?.data?.detail;
          newErrors.email = typeof errDetail === 'string' ? errDetail : 'Failed to send OTP. Please try again.';
        }
      }
    } else if (step === 2) {
      setErrors({});
      if (!formData.otp) newErrors.otp = 'OTP is required';
      else if (formData.otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';

      if (Object.keys(newErrors).length === 0) {
        try {
          const payload = { email: formData.email, otp: formData.otp };
          const resp = await api.post("/verify/otp", payload);
          if (resp.status === 200) {
            setStep(3);
          } else {
            const errDetail = resp.data?.detail;
            newErrors.otp = typeof errDetail === 'string' ? errDetail : 'Invalid OTP. Please try again.';
          }
        } catch (error) {
          const errDetail = error.response?.data?.detail;
          newErrors.otp = typeof errDetail === 'string' ? errDetail : 'Failed to verify OTP. Please try again.';
        }
      }
    } else if (step === 3) {
      setErrors({});
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

      if (Object.keys(newErrors).length === 0) {
        handleSubmit();
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      const payload = { 
        email: formData.email, 
        otp:formData.otp, 
        role: formData.role, 
        password: formData.password, 
        cnfm_password: formData.password 
      };
      const resp = await api.post("/register", payload);
      if (resp.status === 200) {
          notify('success', "Signed Up Successfully");
          navigate('/login', { replace: true });
          return;
      } else {
        const errDetail = resp.data?.detail;
        const errMsg = typeof errDetail === 'string' ? errDetail : 'Registration failed. Please try again.';
        notify('error', errMsg);
      }
    } catch (error) {
        const errDetail = error.response?.data?.detail;
        const errMsg = typeof errDetail === 'string' ? errDetail : 'Registration failed. Please try again.';
        notify('error', errMsg);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const handleResendOtp = async () =>{
    const newErrors={}
    try {
      const payload = { role: formData.role, email: formData.email };
      const resp = await api.post("/generate/otp", payload);
      if (resp.status === 200) {
        notify('OTP Resent Successfully')
      }
      else {
        const errDetail = resp.data?.detail;
        newErrors.otp = typeof errDetail === 'string' ? errDetail : 'Failed to send OTP. Please try again.';
      }
    } catch (error) {
      const errDetail = error.response?.data?.detail;
      newErrors.otp = typeof errDetail === 'string' ? errDetail : 'Failed to send OTP. Please try again.';
    }
    setErrors(newErrors)
  }
  
  return (<>
      <div className="signup-container">
      <div className="signup-container-header">
          <h1>Create Your Account</h1>
          <p>Get Job || Give Job</p>
       

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>{step > 1 ? <i className="fas fa-user-check"></i>:<i className="fas fa-user-plus"></i>} </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}><i className="fas fa-comment-sms"></i></div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}><i className="fas fa-lock"></i></div>
        </div>
      </div>
      <div className="signup-wrapper">
        <div className='signup-rafiki-img'>
          <img src={signupImage} alt="signup-image" />
        </div>
        <form className="signup-form">
          {/* Step 1: Role and Email */}
          {step === 1 && (
            <div className="form-step active">
              <h2>Let's get started</h2>

              <div className="form-group" >
                <label>Select Your Role</label>
                <div className={`role-options ${errors.role ? 'error' : ''}`}>
                  {roleOptions.map((role) => (
                    <label key={role.value} className={`role-option ${formData.role === role.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleInputChange}
                      />
                      <i className='role-icon'>{role.icon}</i>
                      <span className="role-label">{role.label}</span>
                    </label>
                  ))}
                </div>
                {errors.role && <span className="error-massage">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email"><i className="fas fa-envelope"></i> Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-massage">{errors.email}</span>}
              </div>

              <button type="button" onClick={handleNext} className="btn btn-s btn-primary">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="form-step active">
              <h2>Verify Your Email</h2>
              <p className="form-subtitle">We've sent a verification code to {formData.email}</p>

              <div className="form-group">
                <label htmlFor="otp"><i className="fas fa-key"></i> Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="000000"
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className={`form-input otp-input ${errors.otp ? 'error' : ''}`}
                />
                {errors.otp && <span className="error-massage">{errors.otp}</span>}
              </div>

              <p className="resend-text">
                Didn't receive the code? <span onClick={handleResendOtp} className="resend-link">Resend OTP</span>
              </p>

              <div className="btn-group">
                <button type="button" onClick={handleBack} className="btn btn-secondary">
                  Back
                </button>
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Password Setup */}
          {step === 3 && (
            <div className="form-step active">
              <h2>Create Your Password</h2>
              <p className="form-subtitle">Make it strong and unique</p>

              <div className="form-group">
                <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="error-massage">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword"><i className="fas fa-lock"></i> Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-massage">{errors.confirmPassword}</span>}
              </div>

              <div className="password-requirements">
                <p>Password requirements:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? 'met' : ''}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>One uppercase letter</li>
                  <li className={/[0-9]/.test(formData.password) ? 'met' : ''}>One number</li>
                  <li className={/[!@#$%^&*]/.test(formData.password) ? 'met' : ''}>One special character</li>
                </ul>
              </div>

              <div className="btn-group">
                <button type="button" onClick={handleBack} className="btn btn-secondary">
                  Back
                </button>
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  Sign Up
                </button>
              </div>
            </div>
          )}
          <p className="signup-footer">
            Already have an account? <a href="/login" className="login-link">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  
  </>);
}