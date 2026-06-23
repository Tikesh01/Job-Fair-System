import {  FaBriefcase, FaUsers, FaCheckCircle, FaTasks, FaExpand, FaCompress, FaBuilding, FaCalendarCheck, FaRupeeSign, FaMoneyBill, FaCalendarAlt, FaRegHeart, FaChevronCircleDown, FaChevronCircleUp, FaShare, FaShareAlt } from "react-icons/fa"
import { getCookie } from '../../utils/cookies';
import { useEffect, useState } from "react"
import './VacancyCard.css';

export default function VacancyCard({
    vacancy,
    onDelete,
    onUpdate,
    onPostToggle,
    onSelect,
    onApply,
    onRemove,
    showSelectButton,
    showApplyButton,
    removeButtonLabel = 'Remove',
    statusText,
    height={'maxHeight' : '250px'},
    expand = false
}) {
    const [expanded, setExpanded] = useState(expand)
    const role = getCookie('role')
    const userId =  getCookie(`company_id`)
    const canShowSelectButton = showSelectButton ?? (role === 'candidate')
    const canShowApplyButton = showApplyButton ?? (role === 'candidate')
     
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this vacancy?')) {
            onDelete(vacancy.job_role_id)
        }
    }
    
    const handleUpdate = () => {
        onUpdate(vacancy)
    }
    
    const handlePostToggle = () => {
        onPostToggle(vacancy.job_role_id, !vacancy.is_posted)
    }
    
    const handleClose = () => {
        onPostToggle(vacancy.job_role_id, true, true)
    }
    const handleOpen = () => {
        onPostToggle(vacancy.job_role_id, true, false)
    }
    const heandleSelection = () => {
        onSelect(vacancy.job_role_id)
    }
    const handleApply = () => {
        onApply(vacancy.job_role_id)
    }
    const handleRemove = () => {
        onRemove(vacancy.job_role_id)
    }
    const [textToCopy, setTextToCopy] = useState(`http://localhost:5173/vacancy/details/${vacancy.job_role_id}`);
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); 

        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };
    return (
        <div className={`vacancy-card ${expanded ? 'expanded' : ''}`} style={expanded?null:height} >
            <div className="row vacancy-card-header">
                <div className="vacancy-title-section">
                    <h2><FaBriefcase className="vacancy-icon" /> <a href = {`/vacancy/details/${vacancy.job_role_id}`} target="_blank"> {vacancy.job_role_title} </a></h2>
                    <span className={`job-type-badge ${vacancy.job_type}`}>
                        {vacancy.job_type}&nbsp;
                        in {vacancy.job_location}
                    </span>
                </div>
                <div className="action-buttons-group">
                    <div className="vacancy-header-stat">
                        {vacancy.application_count !== undefined && (
                            <div className="application-count">
                                <span className="app-count">{vacancy.application_count} / {vacancy.max_application_count}</span>
                                <span className="status-label"> Applied</span>
                            </div>
                        )}
                        {vacancy.vacancy_count !== undefined && (
                            <div className="vacancy-count">
                                <FaUsers className="info-icon" />
                                <span className="info-label">Vacancies:</span>
                                <span className="info-value"> {vacancy.vacancy_count}</span>
                            </div>
                        )}
                    </div>
                    <div className="vacancy-header-buttons">
                        {role==='company' && userId && parseInt(userId) === vacancy.company_id &&
                            (vacancy.is_posted
                                ?(vacancy.is_closed
                                    ? <button className="post" onClick={handleOpen}>Open</button>  
                                    : <button className="delete" onClick={handleClose} >Close</button>) 
                                :<>
                                <button className="delete" onClick={handleDelete} title="Delete Vacancy"><i className="fas fa-trash-alt"></i></button>
                                <button className="update" onClick={handleUpdate} title="Edit Vacancy"><i className="fas fa-pen-alt"></i></button>
                                <button className="post" onClick={handlePostToggle} title="Post Vacancy">Post</button>
                            </>)
                        }
                        {(canShowSelectButton || canShowApplyButton || onRemove)
                            ?<>   
                                {canShowSelectButton && onSelect &&
                                    <button className='delete' onClick={heandleSelection} ><FaRegHeart /></button>
                                }
                                {canShowApplyButton && onApply &&
                                    <button className="post" onClick={handleApply}>Apply</button>
                                }
                                {onRemove &&
                                    <button className="delete" onClick={handleRemove}>{removeButtonLabel}</button>
                                }
                                <button 
                                    onClick={handleCopy}
                                    className="update"
                                >
                                    {isCopied ? <FaCheckCircle /> : <FaShareAlt />}
                                </button>
                            </>
                            :null
                        }
                    </div>
                </div>
            </div>

            <div className="row interview-details">
                <div className="">
                    <strong className="info-icon"><FaRupeeSign /> </strong>
                    <span className="info-value">₹{vacancy.salary?.toLocaleString() || 'N/A'} /year</span>
                </div>
                <div className="">
                    <strong className="info-icon"><FaCalendarAlt /> </strong>
                    <span className="info-value">{vacancy.alloted_time || '<time>'}, {vacancy.date_of_interview || '<date>'} at {vacancy.alloted_location || '<location>'}</span>
                </div>
                {vacancy.company_name
                    ?<div className='company-name=vacancy-card'>
                        <strong className="info-icon"><FaBuilding /> </strong>
                        <span className="info-value">{vacancy.company_name}</span>
                    </div>
                    :''
                }
            </div>

            <div className="row vacancy-detailed-info">
                <div className="detail-section">
                    <p>{vacancy.job_role_description}</p>
                </div>

                <div className="detail-section">
                    <h4><FaCheckCircle /> Eligibility Criteria</h4>
                    <p>{vacancy.eligibility}</p>
                </div>
            </div>
            <div className="row">
                <div>
                    <h4><FaTasks /> Selection Process</h4>
                    <p>{vacancy.selection_flow}</p>
                </div>
            </div>
            <span className={`vacancy-status ${vacancy.is_closed?'closed':'opened'}`}>
                {vacancy.is_closed?'Closed':'Opened'}
            </span>
            <button 
                className="expand-btn"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? "Collapse" : "Expand"}
            >
                {expanded ? <FaChevronCircleUp/> : <FaChevronCircleDown /> }
            </button>
        </div>
    )
}
