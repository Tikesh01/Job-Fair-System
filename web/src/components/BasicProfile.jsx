import { useState } from 'react'
import axios from 'axios'
import './SignupForm.css'
import { useNotification } from './NotificationProvider'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export default function BasicProfile({ signupData, onCompleted }) {
  const [name, setName] = useState(signupData.name || '')
  const [contact, setContact] = useState(signupData.contact || '')
  const [university, setUniversity] = useState(signupData.university || '')
  const [loading, setLoading] = useState(false)
  const { notify } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !contact.trim() || !university.trim()) {
      notify('error', 'Please fill in name, contact, and university.')
      return
    }

    const payload = {
      ...signupData,
      name: name.trim(),
      contact: contact.trim(),
      university_name: university.trim(),
      role: signupData.role || 'candidate',
    }

    setLoading(true)
    try {
      const resp = await api.post('/signup/complete', payload)
      if (resp.status >= 400) {
        throw new Error(resp.data?.message || `HTTP ${resp.status}`)
      }
      const msg = resp.data.msg
      notify('success', msg) 
      if (onCompleted) { 
        onCompleted(payload)
      }
    } catch (err) {
      const msg = err.response?.data
        ? err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data)
        : err.message
      notify('error', 'Failed to save profile: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-form-wrapper">
      <h2>Complete Candidate Profile</h2>
      <p className="form-message info" style={{ marginBottom: '12px' }}>
        Continue with your signup data and provide your candidate details.
      </p>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Full Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Contact
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </label>
        <label>
          University
          <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Complete Sign Up'}
        </button>
      </form>
    </div>
  )
}
