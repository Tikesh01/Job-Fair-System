import './DashboardNav.css'
import {getCookie} from '../utils/cookies';
import { Link } from 'react-router-dom';

const candidateDashMenu = [
    {title:'Manage Applications',to:'/candidate/job/applications', text:'Applcation', icon:<i className='fas fa-briefcase'></i>},
    {title:'Select Vacancies',to:'/candidate/job', text:'Vacancy', icon:<i className='fas fa-cubes'></i>},
    {title:'See Companies',to:'/candidate/company', text:'Company', icon:<i className='fas fa-building'></i>},
    {title:'Select Workshops',to:'/candidate/workshop', text:'Workshop', icon:<i className='fas fa-graduation-cap'></i>},
    {title:'Profile',to:'/candidate', text:'Pofile', icon:<i className='fas fa-user'></i>}
];

const companyDashMenu = [
    {title:'Manage Apllications',to:'/company/job/applications', text:'Applications', icon:<i className='fas fa-file-alt'></i>},
    {title:'Manage Vacancies',to:'/company/vacancy', text:'Job Roles', icon:<i className='fas fa-edit'></i>},
    {title:'Manage HRs',to:'/company/hr', text:'HR', icon:<i className='fas fa-users'></i>},
    {title:'Profile',to:'/company', text:'Profile', icon:<i className='fas fa-user'></i>}
];

const UniversityDashMenu = [
    {title:'Manage Candidates',to:'/dashboard', text:'Candidates', icon:<i className='fas fa-users'></i>},
    {title:'Profile',to:'/dashboard', text:'Profile', icon:<i className='fas fa-user'></i>}
];

const publicDashMenu = [
    {title:'All Listed Job Roles',to:'/job', text:'Jobs', icon:<i className='fas fa-list'></i>},
    {title:'Listed Companies',to:'/company', text:'Companies', icon:<i className='fas fa-building'></i>},
];

export default function DashboardNav(){
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
                                <span className='db-nav-icon'>{link.icon}</span>
                                <span className="db-nav-text"> {link.text}</span>
                            </Link>
                        ))
                    }
                </div>
            :role==='company'?
                <div className="smaller-nav-menu">
                    {
                        companyDashMenu.map(link=>(
                            <Link key={link.to} title={link.title} className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}>
                                <span className='db-nav-icon'>{link.icon}</span>
                                <span className="db-nav-text"> {link.text}</span>
                            </Link>
                        ))
                    }
                </div>
            :
                <div className="smaller-nav-menu">
                    {
                        UniversityDashMenu.map(link=>(
                            <Link key={link.to} title={link.title} className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}>
                                <span className='db-nav-icon'>{link.icon}</span>
                                <span className="db-nav-text"> {link.text}</span>
                            </Link>
                        ))
                    }
                </div>
        :
            <div className="smaller-nav-menu">
                {
                    publicDashMenu.map(link=>(
                        <Link key={link.to} title={link.title} className={link.to === currentPath ?'dashboardlink active':'dashboardlink'} to={link.to}>
                            <span className='db-nav-icon'>{link.icon}</span>
                            <span className="db-nav-text"> {link.text}</span>
                        </Link>
                    ))
                }
            </div>
        }
        </>
    )
}