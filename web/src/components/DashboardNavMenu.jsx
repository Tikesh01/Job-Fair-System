import './DashboardNavMenu.css'
import {getCookie} from '../utils/cookies';
import { FaBriefcase, FaList, FaBuilding, FaGraduationCap, FaUser, FaEdit, FaUsers, FaFolder, FaRegFolder, FaFile, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function MobileNavMenu(){
    const token = getCookie("token")
    const role = getCookie("role")
    

    return(
        <>
        { token && role?
            role === 'candidate'?
                <ul type='none' className="smaller-nav-menu">
                    <li title="Job Application"><Link to={'/dashboard'} title='Application'><FaBriefcase /> Application</Link></li>
                    <li title="All listed Job Roles"><Link to={'/dashboard/job'}><FaList /> Roles</Link></li>
                    <li title="Listed Companies"><Link to={'/dashboard/company'}><FaBuilding /> Companies</Link></li>
                    <li title="Workshops"><Link to={'/dashboard'}><FaGraduationCap /> Workshops</Link></li>
                    <li title="Profile"><Link to={'/dashboard'}><FaUser /> Profile</Link></li>
                </ul>
            :role==='company'?
                <ul type='none' className="smaller-nav-menu">
                    <li title="Applications from Candidates"><Link to={'/dashboard'}><FaFileAlt /> Applications</Link></li>
                    <li title="Your Created Job Roles"><Link to={'/dashboard'}><FaEdit /> Vacancy</Link></li>
                    <li title="Your HR"><Link to={'/dashboard'}><FaUsers /> HR</Link></li>
                    <li title="Profile"><Link to={'/dashboard'}><FaUser /> Profile</Link></li>
                </ul>
            :
                <ul type='none' className="smaller-nav-menu">
                    <li title="Your Candidates"><Link to={'/dashboard'}><FaUsers /> Candidates</Link></li>
                    <li title="Profile"><Link to={'/dashboard'}><FaUser /> Profile</Link></li>
                </ul>
        :
            <ul type='none' className="smaller-nav-menu">
                <li title="All Listed Job Roles"><Link to={'/job'}><FaList /> Jobs</Link></li>
                <li title="Listed Companies"><Link to={'/company'}><FaBuilding /> Companies</Link></li>
            </ul>
        }
        </>
    )
}