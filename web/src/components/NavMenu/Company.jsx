

import { FaBriefcase, FaUsers, FaChartLine, FaStar } from 'react-icons/fa';
import './Company.css';
import { useState } from 'react';

export default function Company() {
    const [selectedCompany, setSelectedCompany] = useState(null);

    const companies = [
        {
            id: 1,
            name: 'Tech Solutions Inc',
            industry: 'Software Development',
            size: '500-1000 employees',
            rating: 4.8,
            location: 'New York, NY',
            description: 'Leading software development company specializing in cloud solutions.',
            openPositions: 12
        },
        {
            id: 2,
            name: 'Cloud Innovations',
            industry: 'Cloud Computing',
            size: '1000-5000 employees',
            rating: 4.6,
            location: 'San Francisco, CA',
            description: 'Enterprise cloud infrastructure and services provider.',
            openPositions: 25
        },
        {
            id: 3,
            name: 'Creative Studios',
            industry: 'Design & UX',
            size: '100-500 employees',
            rating: 4.9,
            location: 'Los Angeles, CA',
            description: 'Award-winning design and creative agency.',
            openPositions: 8
        },
        {
            id: 4,
            name: 'AI Solutions',
            industry: 'Artificial Intelligence',
            size: '50-100 employees',
            rating: 4.7,
            location: 'Boston, MA',
            description: 'Cutting-edge AI and machine learning company.',
            openPositions: 15
        }
    ];

    return (
        <div className="company-container">
            <div className="company-header">
                <h1>Hiring Companies</h1>
                <p>Discover amazing companies looking for talented professionals</p>
            </div>

            <div className="company-grid">
                {companies.map(company => (
                    <div key={company.id} className="company-card">
                        <div className="company-card-header">
                            <FaBriefcase className="company-icon" />
                            <div className="company-rating">
                                <FaStar />
                                <span>{company.rating}</span>
                            </div>
                        </div>
                        <h3>{company.name}</h3>
                        <p className="company-industry">{company.industry}</p>

                        <div className="company-info">
                            <div className="info-item">
                                <FaUsers />
                                <span>{company.size}</span>
                            </div>
                            <div className="info-item">
                                <FaChartLine />
                                <span>{company.openPositions} Open Jobs</span>
                            </div>
                        </div>

                        <p className="company-description">{company.description}</p>
                        <button className="view-btn" onClick={() => setSelectedCompany(company)}>View Profile</button>
                    </div>
                ))}
            </div>

            {selectedCompany && (
                <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedCompany(null)}>×</button>
                        <h2>{selectedCompany.name}</h2>
                        <p className="modal-description">{selectedCompany.description}</p>
                        <div className="modal-details">
                            <p><strong>Industry:</strong> {selectedCompany.industry}</p>
                            <p><strong>Size:</strong> {selectedCompany.size}</p>
                            <p><strong>Location:</strong> {selectedCompany.location}</p>
                            <p><strong>Open Positions:</strong> {selectedCompany.openPositions}</p>
                            <p><strong>Rating:</strong> ⭐ {selectedCompany.rating}/5</p>
                        </div>
                        <button className="apply-company-btn">View All Jobs</button>
                    </div>
                </div>
            )}
        </div>
    );
}