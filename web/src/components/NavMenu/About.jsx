import { FaArrowsAlt, FaLightbulb, FaHandshake } from 'react-icons/fa';
import './About.css';
import aboutImg from '../../assets/team-work-animate.svg'

export default function About() {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About Job Fair</h1>
                <p>Connecting Talents with Opportunities</p>
            </div>

            <section className="about-section">
                <div className='mission'>
                    <h2>Our Mission</h2>
                    <p>
                        To create a seamless platform where job seekers and companies can connect,
                        collaborate, and grow together. We believe in empowering candidates with
                        opportunities and helping companies find the right talent.
                    </p>
                </div>
                <div className="about-img">
                    <img src={aboutImg} alt="About Img...."/>
                </div>
            </section>

            <section className="about-values">
                <h2>Our Core Values</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <FaArrowsAlt className="value-icon" />
                        <h3>Opportunity</h3>
                        <p>Providing equal opportunities for all job seekers to showcase their skills.</p>
                    </div>
                    <div className="value-card">
                        <FaLightbulb className="value-icon" />
                        <h3>Innovation</h3>
                        <p>Continuously improving to deliver the best experience in talent matching.</p>
                    </div>
                    <div className="value-card">
                        <FaHandshake className="value-icon" />
                        <h3>Partnership</h3>
                        <p>Building strong relationships between candidates and employers.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}