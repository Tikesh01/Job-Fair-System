import { FaBriefcase, FaUsers, FaChartLine, FaStar } from 'react-icons/fa';
import './Company.css';
import { useState } from 'react';
import api from '../../api/axiosapi';

export default  function Company() {
    const [selectedCompany, setSelectedCompany] = useState(null);

    const companies = api.get('/companies')?.data
    console.log(companies)
    return (
        <div className="company-container">
            {companies}
            {/* <div className="company-header">
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
            )} */}
        </div>
    );
}