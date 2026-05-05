import { useState } from "react";
import {
	FaBriefcase,
	FaBuilding,
	FaCompress,
	FaEnvelope,
	FaExpand,
	FaLinkedin,
	FaPhoneAlt,
	FaPenAlt,
	FaStar,
	FaTrashAlt,
	FaUserTie,
} from "react-icons/fa";
import { getCookie } from "../../../utils/cookies";
import "./HrCard.css";

export default function HrCard({hr, companyName, onDelete,onUpdate, isDemo = false}) {
	const [expanded, setExpanded] = useState(false);
	const role = getCookie("role");
	const companyId = getCookie("company_id");

	const canManage =
		isDemo ||
		(role === "company" &&
			companyId &&
			parseInt(companyId, 10) === hr.company_id);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this HR contact?")) {
			onDelete(hr.id);
		}
	};

	return (
		<div className={`hr-card ${expanded ? "expanded" : ""}`}>
			<div className="row hr-card-header">
				<div className="hr-title-section">
					<div className="hr-avatar">
						<FaUserTie />
					</div>
					<div>
						<h2>{hr.name}</h2>
						<div className="hr-badges">
							<span className="hr-role-badge">
								<FaBriefcase /> {hr.designation}
							</span>
							{hr.is_primary ? (
								<span className="hr-primary-badge">
									<FaStar /> Primary HR
								</span>
							) : null}
						</div>
					</div>
				</div>

				<div className="action-buttons-group">
					<div className="vacancy-header-buttons">
						{canManage ? (
							<>
								<button
									className="delete"
									onClick={handleDelete}
									title="Delete HR"
								>
									<FaTrashAlt />
								</button>
								<button
									className="update"
									onClick={() => onUpdate(hr)}
									title="Edit HR"
								>
									<FaPenAlt />
								</button>
							</>
						) : null}
						<button
							className="expand-btn"
							onClick={() => setExpanded(!expanded)}
							title={expanded ? "Collapse" : "Expand"}
						>
							{expanded ? <FaCompress /> : <FaExpand />}
						</button>
					</div>
				</div>
			</div>

			<div className="row hr-quick-info">
				<div>
					<FaEnvelope className="info-icon" /> <span>{hr.email}</span>
				</div>
				<div>
					<FaPhoneAlt className="info-icon" /> <span>{hr.contact}</span>
				</div>
				{companyName ? (
					<div>
						<FaBuilding className="info-icon" /> <span>{companyName}</span>
					</div>
				) : null}
			</div>

			<div className="row hr-detailed-info">
				<div className="detail-section">
					<h4>Department</h4>
					<p>{hr.department || "Not added yet"}</p>
				</div>

				<div className="detail-section">
					<h4>LinkedIn</h4>
					{hr.linkedin_url ? (
						<a
							href={hr.linkedin_url}
							target="_blank"
							rel="noreferrer"
							className="linkedin-link"
						>
							<FaLinkedin /> View profile
						</a>
					) : (
						<p>Not added yet</p>
					)}
				</div>
			</div>
		</div>
	);
}
