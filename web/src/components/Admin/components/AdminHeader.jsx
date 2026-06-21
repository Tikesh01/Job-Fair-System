import { FaBars, FaSearch, FaBell, FaUserCircle, FaCog } from 'react-icons/fa'
import { useState } from 'react'
import './AdminHeader.css'

function AdminHeader({ adminName, onMenuToggle }) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)

    const handleLogout = () => {
        document.cookie = 'token=; path=/; max-age=0'
        document.cookie = 'role=; path=/; max-age=0'
        document.cookie = 'adminId=; path=/; max-age=0'
        window.dispatchEvent(new Event('authUpdated'))
        window.location.href = '/admin/login'
    }

    return (
        <header className="admin-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onMenuToggle}>
                    <FaBars />
                </button>
            </div>

            <div className="header-center">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        disabled
                    />
                </div>
            </div>

            <div className="header-right">
                <button className="notification-btn" title="Notifications">
                    <FaBell />
                    <span className="notification-badge">0</span>
                </button>

                <div className="profile-section">
                    <button
                        className="profile-btn"
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        <FaUserCircle className="profile-icon" />
                        <span className="admin-name">{adminName}</span>
                    </button>

                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <FaUserCircle className="dropdown-icon" />
                                <div>
                                    <p className="dropdown-name">{adminName}</p>
                                    <p className="dropdown-role">Administrator</p>
                                </div>
                            </div>
                            <hr className="dropdown-divider" />
                            <button className="dropdown-item">
                                <FaCog /> Settings
                            </button>
                            <hr className="dropdown-divider" />
                            <button 
                                className="dropdown-item logout-item"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default AdminHeader
