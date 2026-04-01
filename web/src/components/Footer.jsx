import { useState } from 'react';
import './Footer.css';

export default function Footer() {

  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log('Feedback submitted:', feedback);
    // Reset form
    setFeedback({
      name: '',
      email: '',
      message: '',
      rating: 0
    });
    alert('Thank you for your feedback!');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JobFair</h3>
            <p>Connecting talent with opportunities. Your career journey starts here.</p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">💼</a>
              <a href="#" className="social-link">📧</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul type='none'>
              <li><a href="#about">About Us</a></li>
              <li><a href="#jobs">Browse Jobs</a></li>
              <li><a href="#companies">Companies</a></li>
              <li><a href="#contact">Contact</a></li>
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
                  name="name"
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
                  name="email"
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
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your feedback..."
                  value={feedback.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>
                
                <button type="submit" className="btn btn-s btn-primary">
                  Send Feedback
                </button>

            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 JobFair. All rights reserved.</p>
          <p>Made with ❤️ for job seekers and employers</p>
        </div>
      </div>
    </footer>
  );
}