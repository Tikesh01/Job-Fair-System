import React, { useState } from 'react';
import './Footer.css';
import api from '../api/axiosapi';
import { useNotification } from '../contexts/NotificationContext';
import {FaStar} from  'react-icons/fa'

export default function Footer() {

  const [feedback, setFeedback] = useState({
    sender_name: '',
    sender_email: '',
    msg: '',
    rating: 0
  });
  const {notify} = useNotification('')

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRating = (rating) => {
    setFeedback(prev => ({
      ...prev,
      rating
    }));
  };

  async function handleSubmit(){

    const resp = await api.post('/feedback', feedback)
    
    if(resp.status === 200){
      notify('success', resp.data.msg)
    }
    else{
      notify('error', 'Some Error occured - All fields are Required')
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JobFair</h3>
            <p>Connecting talent with opportunities. Your career journey starts here.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul type='none'>
              <li><a href="/about">About Us</a></li>
              <li><a href="/job">Browse Jobs</a></li>
              <li><a href="/company-list">Companies</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul type='none'>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section feedback-section">
            <h4>Share Your Feedback</h4>
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <input
                  type="text"
                  name="sender_name"
                  placeholder="Your Name"
                  value={feedback.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="sender_email"
                  placeholder="Your Email"
                  value={feedback.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <div className="rating-stars">
                  <span>Rate your experience:</span>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${feedback.rating >= star ? 'active' : ''}`}
                        onClick={() => handleRating(star)}
                      >
                        <FaStar />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <textarea
                  name="msg"
                  placeholder="Your feedback, type rvery Improvement you want...."
                  value={feedback.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>
                
                <button type="button" className="btn btn-s btn-primary" onClick={handleSubmit}>
                  Send Feedback
                </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Made with ❤️ for job seekers and employers</p>
        </div>
      </div>
    </footer>
  );
}