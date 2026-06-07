import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaGlobeAsia,
  FaHandshake,
  FaUserGraduate,
  FaUsers,
} from 'react-icons/fa';
import heroArt from '../assets/itm_front_img_2.png';
import supportArt from '../assets/mobile-login-animate.svg';
import './Home.css';

const spotlightStats = [
  { value: '60+', label: 'Hiring companies in one place' },
  { value: '3000+', label: 'Students expected to participate' },
  { value: '2 Days', label: 'Of high-energy hiring and networking' },
];

const highlights = [
  {
    icon: <FaBriefcase />,
    title: 'Career-ready opportunities',
    text: 'Discover internships, fresher roles, live projects, and full-time openings curated for ambitious students.',
  },
  {
    icon: <FaHandshake />,
    title: 'Direct recruiter access',
    text: 'Skip the cold outreach and meet HR teams, recruiters, and company representatives in one guided platform.',
  },
  {
    icon: <FaChartLine />,
    title: 'Built for conversion',
    text: 'Polished profiles, verified eligibility, and structured applications help candidates move faster toward interviews.',
  },
];

const journeySteps = [
  {
    id: '01',
    title: 'Create your profile',
    text: 'Add your academic details, skills, links, and preferences so recruiters get a complete first impression.',
  },
  {
    id: '02',
    title: 'Explore companies and jobs',
    text: 'Browse participating employers, compare openings, and focus on the roles that actually match your goals.',
  },
  {
    id: '03',
    title: 'Apply with confidence',
    text: 'Track applications, stay ready for updates, and move from interest to interview with less friction.',
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero-section">
        <div className="hero-backdrop hero-backdrop-left"></div>
        <div className="hero-backdrop hero-backdrop-right"></div>

        <div className="home-hero-copy">
          <span className="home-eyebrow">
            <FaGlobeAsia /> ITM University is organizing Mega Job Fair 2026
          </span>
          <h1>Where campus talent meets real hiring momentum.</h1>
          <p className="home-hero-lead">
            A polished digital hub for students, universities, and employers to connect,
            apply, shortlist, and grow careers through one powerful job fair experience.
          </p>

          <div className="home-hero-actions">
            <Link to="/signup" className="home-btn home-btn-primary">
              Join The Fair <FaArrowRight />
            </Link>
            <Link to="/company-list" className="home-btn home-btn-secondary">
              Explore Companies
            </Link>
          </div>

          <div className="hero-mini-proof">
            <span><FaCheckCircle /> Student-friendly profile flow</span>
            <span><FaCheckCircle /> Recruiter-ready applications</span>
            <span><FaCheckCircle /> University collaboration</span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-visual-card hero-visual-main">
            <img src={heroArt} alt="Illustration of students preparing for digital opportunities" />
          </div>

          <div className="hero-floating-card hero-floating-card-top">
            <FaUsers />
            <div>
              <strong>Campus-first network</strong>
              <span>Students, HRs, and universities together</span>
            </div>
          </div>

          <div className="hero-floating-card hero-floating-card-bottom">
            <FaCalendarAlt />
            <div>
              <strong>Simple event journey</strong>
              <span>Register, apply, track, and prepare</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats-strip">
        {spotlightStats.map((item) => (
          <article key={item.label} className="home-stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="home-feature-layout">
        <div className="home-section-heading">
          <span className="section-tag">Why this platform works</span>
          <h2>Designed to feel premium, clear, and action-focused from the first click.</h2>
          <p>
            The experience is built to reduce confusion for students, create trust for recruiters,
            and make university coordination smoother during the fair.
          </p>
        </div>

        <div className="home-feature-grid">
          {highlights.map((feature) => (
            <article key={feature.title} className="home-feature-card">
              <div className="home-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-showcase-panel">
        <div className="home-showcase-visual">
          <div className="showcase-image-shell">
            <img src={supportArt} alt="Illustration showing digital collaboration for job fair success" />
          </div>
        </div>

        <div className="home-showcase-copy">
          <span className="section-tag">One platform, three audiences</span>
          <h2>Built for candidates, companies, and universities to move together.</h2>
          <p>
            Candidates can maintain stronger profiles, companies can review interested talent
            faster, and universities can support participation with more visibility.
          </p>

          <div className="home-audience-list">
            <div className="audience-pill">
              <FaUserGraduate />
              <span>Students build a stronger first impression</span>
            </div>
            <div className="audience-pill">
              <FaBuilding />
              <span>Companies discover organized applicant pipelines</span>
            </div>
            <div className="audience-pill">
              <FaHandshake />
              <span>Universities guide and verify participation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-journey-section">
        <div className="home-section-heading align-left">
          <span className="section-tag">Your fair journey</span>
          <h2>Three simple steps from registration to opportunity.</h2>
        </div>

        <div className="home-journey-grid">
          {journeySteps.map((step) => (
            <article key={step.id} className="journey-card">
              <span className="journey-number">{step.id}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta-banner">
        <div className="home-cta-copy">
          <span className="section-tag">Ready to begin?</span>
          <h2>Step into the Mega Job Fair with a profile that feels worth noticing.</h2>
          <p>
            Register now, complete your profile, and start exploring companies and roles
            that match your career direction.
          </p>
        </div>

        <div className="home-cta-actions">
          <Link to="/signup" className="home-btn home-btn-primary">
            Create Account
          </Link>
          <Link to="/job" className="home-btn home-btn-secondary">
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;