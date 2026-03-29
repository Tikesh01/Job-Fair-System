import './MobileNavMenu.css'
import {getCookie} from '../utils/cookies';
import { FaBriefcase, FaList, FaBuilding, FaGraduationCap, FaUser, FaEdit, FaUsers } from 'react-icons/fa';

export default function MobileNavMenu(){
    const token = getCookie("token")
    const role = getCookie("role")
    

    return(
        <>
        { token && role?
            role === 'candidate'?
                <ul type='none' className="smaller-nav-menu">
                    <li title="Job Application"><FaBriefcase /> Application</li>
                    <li title="All listed Job Roles"><FaList /> Roles</li>
                    <li title="Listed Companies"><FaBuilding /> Companies</li>
                    <li title="Workshops"><FaGraduationCap /> Workshops</li>
                    <li title="Profile"><FaUser /> Profile</li>
                </ul>
            :role==='company'?
                <ul type='none' className="smaller-nav-menu">
                    <li title="Applications from Candidates"><FaUsers /> Applications</li>
                    <li title="Your Created Job Roles"><FaEdit /> Job Roles</li>
                    <li title="Your HR"><FaUsers /> HR</li>
                    <li title="Profile"><FaUser /> Profile</li>
                </ul>
            :
                <ul type='none' className="smaller-nav-menu">
                    <li title="Your Candidates"><FaUsers /> Candidates</li>
                    <li title="Profile"><FaUser /> Profile</li>
                </ul>
        :
            <ul type='none' className="smaller-nav-menu">
                <li title="All Listed Job Roles"><FaList /> Job Roles</li>
                <li title="Listed Companies"><FaBuilding /> Companies</li>
            </ul>
        }
        </>
    )
}