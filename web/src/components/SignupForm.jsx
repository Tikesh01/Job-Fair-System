import { useState } from 'react'
import axios from 'axios'
import './SignupForm.css'
import { useNotification } from './NotificationProvider'

const api = axios.create({ baseURL: 'http://localhost:8000' })
export default function SignupForm({ onSignupSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const { notify } = useNotification()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      notify('error', 'Email and password are required')
      return
    }

    const payload = { email, password, role }

    try {
      const resp = await api.post('/signup', role === 'candidate' ? { ...payload, partial: true } : payload)

      if (resp.status >= 400) {
        const msg = resp.data?.detail || resp.data?.message || `HTTP ${resp.status}`
        notify('error', `Signup failed: ${msg}`)
      } else {
        if (role === 'candidate' && onSignupSuccess) {
          const backendMessage = resp.data?.msg || 'Signup step 1 successful.'
          notify('success', backendMessage)
          onSignupSuccess({ email, password, role })
        } else {
          const backendMessage = resp.data.msg || 'Signup complete.'
          notify('success', backendMessage)
          setEmail('')
          setPassword('')
          setRole('candidate')
        }
      }
    } catch (err) {
      const msg = err.response?.data
        ? err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data)
        : err.message
      notify('error', 'Signup failed: ' + msg)
    }
  }

  return (
    <div className="signup-form-wrapper">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Sign up as
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="university">University</option>
            <option value="company">Company</option>
          </select>
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}