import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import './Contact.css';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1>Get In Touch</h1>
                <p>We'd love to hear from you. Send us a message!</p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <div className="info-item">
                        <FaPhone className="icon" />
                        <div>
                            <h4>Phone</h4>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <FaEnvelope className="icon" />
                        <div>
                            <h4>Email</h4>
                            <p>info@jobfairsystem.com</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <FaMapMarkerAlt className="icon" />
                        <div>
                            <h4>Address</h4>
                            <p>123 Tech Street, San Francisco, CA 94105</p>
                        </div>
                    </div>

                    <div className="social-links">
                        <h4>Follow Us</h4>
                        <div className="socials">
                            <a href="#" className="social-icon"><FaLinkedin /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                            <a href="#" className="social-icon"><FaFacebook /></a>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Subject"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Your message..."
                            rows="5"
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </div>
        </div>
    );
}