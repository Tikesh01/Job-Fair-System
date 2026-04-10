import './DashboardNavMenu.css'
import {getCookie} from '../utils/cookies';
import { FaBriefcase, FaList, FaBuilding, FaGraduationCap, FaUser, FaEdit, FaUsers, FaFolder, FaRegFolder, FaFile, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const candidateDashMenu = [
    {title:'Job Applications',to:'/dashboard/std-application', text:'Applcation', icon:<FaBriefcase />},
    {title:'Job Roles',to:'/dashboard/job', text:'Vacancy', icon:<FaList />},
    {title:'Companies',to:'/dashboard/company', text:'Company', icon:<FaBuilding />},
    {title:'Workshops',to:'/dashboard/workshop', text:'Workshop', icon:<FaGraduationCap />},
    {title:'Job Applications',to:'/dashboard', text:'Pofile', icon:<FaUser />}
];
const companyDashMenu = [
    {title:'Applications from Candidates',to:'/dashboard', text:'Applications', icon:<FaFileAlt />},
    {title:'Your Created Job Roles',to:'/dashboard', text:'Vacancy', icon:<FaEdit />},
    {title:'Your HR',to:'/dashboard', text:'HR', icon:<FaUsers />},
    {title:'Profile',to:'/dashboard', text:'Profile', icon:<FaUser />}
];

const UniversityDashMenu = [
    {title:'Your Candidates',to:'/dashboard', text:'Candidates', icon:<FaUsers />},
    {title:'Profile',to:'/dashboard', text:'Profile', icon:<FaUser />}
];

const publicDashMenu = [
    {title:'All Listed Job Roles',to:'/job', text:'Jobs', icon:<FaList />},
    {title:'Listed Companies',to:'/company', text:'Companies', icon:<FaBuilding />},
];
export default function MobileNavMenu(){
    const token = getCookie("token")
    const role = getCookie("role")
    const currentPath = localStorage.getItem('currentLoc')

    return(
        <>
        { token && role?
            role === 'candidate'?
                <div className="smaller-nav-menu">
                    {
                        candidateDashMenu.map(link=>(
                            <Link 
                                key={link.to} 
                                title={link.title} 
                                className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}
                            >
                                <span className='link-icon'>{link.icon}</span>
                                <span className="link-text"> {link.text}</span>
                            </Link>
                        ))
                    }
                </div>
            :role==='company'?
                <div className="smaller-nav-menu">
                    {
                        companyDashMenu.map(link=>(
                            <Link key={link.to} title={link.title} className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}>{link.icon} {link.text}</Link>
                        ))
                    }
                </div>
            :
                <div className="smaller-nav-menu">
                    {
                        UniversityDashMenu.map(link=>(
                            <Link key={link.to} title={link.title} className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}>{link.icon} {link.text}</Link>
                        ))
                    }
                </div>
        :
            <div className="smaller-nav-menu">
                {
                    publicDashMenu.map(link=>(
                        <Link key={link.to} title={link.title} className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}>{link.icon} {link.text}</Link>
                    ))
                }
            </div>
        }
        </>
    )
}