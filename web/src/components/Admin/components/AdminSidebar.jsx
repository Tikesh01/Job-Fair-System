import { Link } from 'react-router-dom'
import {
    FaChartBar, FaUsers, FaBuilding, FaGraduationCap,
    FaBriefcase, FaFileAlt, FaCalendarAlt, FaComments,
    FaUserTie, FaWalking, FaCog, FaSignOutAlt, FaChevronDown,
    FaTimesCircle,
    FaHamburger,
    FaTimes
} from 'react-icons/fa'
import './AdminSidebar.css'
import { useState } from 'react'
import api from "../../../api/axiosapi";

function AdminSidebar({ isOpen, onToggle, currentPath }) {
    const [openMenu, setOpenMenu] = useState(null)

    const toggleSubmenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu)
    }

    async function handleLogout(){
        const resp = await api.post('/logout');
    
        window.location.href = '/admin/login'
    }

    const isActive = (path) => currentPath === path
    const isSubmenuActive = (paths) => paths.some(path => currentPath.startsWith(path))

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: <FaChartBar />,
            exact: true
        },
        {
            label: 'Management',
            icon: <FaCog />,
            submenu: [
                {
                    label: 'Candidates',
                    path: '/admin/dashboard/candidates',
                    icon: <FaGraduationCap />
                },
                {
                    label: 'Companies',
                    path: '/admin/dashboard/companies',
                    icon: <FaBuilding />
                },
                {
                    label: 'Universities',
                    path: '/admin/dashboard/universities',
                    icon: <FaUsers />
                },
                {
                    label: 'Job Roles',
                    path: '/admin/dashboard/jobroles',
                    icon: <FaBriefcase />
                },
                {
                    label: 'Job Applications',
                    path: '/admin/dashboard/jobapplications',
                    icon: <FaFileAlt />
                }
            ]
        },
        {
            label: 'People Management',
            icon: <FaUsers />,
            submenu: [
                {
                    label: 'HR Managers',
                    path: '/admin/dashboard/hrs',
                    icon: <FaUserTie />
                },
                {
                    label: 'Managers',
                    path: '/admin/dashboard/managers',
                    icon: <FaUserTie />
                },
                {
                    label: 'Volunteers',
                    path: '/admin/dashboard/volunteers',
                    icon: <FaWalking />
                }
            ]
        },
        {
            label: 'Events & Workshops',
            icon: <FaCalendarAlt />,
            submenu: [
                {
                    label: 'Job Fair Dates',
                    path: '/admin/dashboard/jobfairdates',
                    icon: <FaCalendarAlt />
                },
                {
                    label: 'Workshops',
                    path: '/admin/dashboard/workshops',
                    icon: <FaBriefcase />
                }
            ]
        },
        {
            label: 'Feedback',
            path: '/admin/dashboard/feedback',
            icon: <FaComments />,
            exact: true
        }
    ]

    return (
        <>
            <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="sidebar-toggle">
                        {isOpen && <h2>Admin Panel</h2>}
                        <div className="brand-icon"  onClick={onToggle}>{isOpen?<FaTimes />:<FaHamburger />}</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <div key={index} className="nav-item-container">
                            {item.submenu ? (
                                <>
                                    <button
                                        className={`nav-item submenu-toggle ${isSubmenuActive(item.submenu.map(s => s.path)) ? 'active' : ''}`}
                                        onClick={() => toggleSubmenu(item.label)}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        {isOpen && (
                                            <>
                                                <span className="nav-label">{item.label}</span>
                                                <FaChevronDown className={`chevron ${openMenu === item.label ? 'open' : ''}`} />
                                            </>
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className={`submenu ${openMenu === item.label ? 'open' : ''}`}>
                                            {item.submenu.map((subitem, subindex) => (
                                                <Link
                                                    key={subindex}
                                                    to={subitem.path}
                                                    className={`submenu-item ${isActive(subitem.path) ? 'active' : ''}`}
                                                >
                                                    <span className="nav-icon">{subitem.icon}</span>
                                                    <span className="nav-label">{subitem.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    {isOpen && <span className="nav-label">{item.label}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt className="nav-icon" />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

        </>
    )
}

export default AdminSidebar
