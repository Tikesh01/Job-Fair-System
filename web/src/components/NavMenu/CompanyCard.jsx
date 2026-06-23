import { useState } from "react";
import {
    FaBuilding,
    FaCheckCircle,
    FaEnvelope,
    FaExpand,
    FaCompress,
    FaGlobeAsia,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaBriefcase,
    FaCalendarAlt,
} from "react-icons/fa";
import "./CompanyCard.css";

export default function CompanyCard({ company }) {
    const [expanded, setExpanded] = useState(false);

    const fullAddress = [company.address, company.city, company.state, company.pincode]
        .filter(Boolean)
        .join(", ");

    return (
        <div className={`company-card ${expanded ? "expanded" : ""}`}>
            <div className="row company-card-header">
                <div className="company-card-title">
                    <div className="company-card-avatar">
                        {company.avatar
                            ?<img src={company.avatar} />
                            :<FaBuilding />
                        }
                    </div>
                    <div>
                        <h2>{company.name || "Unnamed Company"}</h2>
                        <div className="company-card-badges">
                            <span className="company-badge verified">
                                <FaCheckCircle /> Verified
                            </span>
                            {company.is_active ? (
                                <span className="company-badge active">Active</span>
                            ) : (
                                <span className="company-badge inactive">Inactive</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="company-card-actions">
                    <button
                        className="expand-btn"
                        onClick={() => setExpanded(!expanded)}
                        title={expanded ? "Collapse" : "Expand"}
                    >
                        {expanded ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>

            <div className="row company-card-meta">
                <div>
                    <FaBriefcase className="info-icon" />
                    <span>{company.industry_type_name || "Industry not added"}</span>
                </div>
                <div>
                    <FaMapMarkerAlt className="info-icon" />
                    <span>{`${company.city?company.city:''} ${company.state?company.state:''}` || "Location not added"}</span>
                </div>
            </div>

            <div className="row company-card-contact">
                <div>
                    <FaEnvelope className="info-icon" />
                    <span>{company.contact_email || company.email || ""}</span>
                </div>
                <div>
                    <FaPhoneAlt className="info-icon" />
                    <span>{company.contact || "Contact not added"}</span>
                </div>
                <div>
                    <FaGlobeAsia className="info-icon" />
                    <span>{company.job_application_count || 0} applications</span>
                </div>
            </div>

            <div className="row">
                <div className="detail-section">
                    <h4>About</h4>
                    <p>{company.about || "This company has not added an about section yet."}</p>
                </div>
                <div className="detail-section">
                    <h4>Address</h4>
                    <p>{fullAddress || "Address not added yet."}</p>
                </div>
            </div>
        </div>
    );
}
