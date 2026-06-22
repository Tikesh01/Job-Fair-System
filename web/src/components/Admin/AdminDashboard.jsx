import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getCookie } from '../../utils/cookies'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import './AdminDashboard.css'

function AdminDashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [adminName, setAdminName] = useState('Admin')

    useEffect(() => {
        // Check if admin is authenticated
        const token = getCookie('token')
        const role = getCookie('role')

        if (!token || role !== 'admin') {
            navigate('/admin/login')
            return
        }

        // Get admin name from localStorage or set default
        const storedAdminName = localStorage.getItem('adminName') || 'Administrator'
        setAdminName(storedAdminName)
    }, [navigate])

    return (
        <div className= {`admin-dashboard-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                currentPath={location.pathname}
            />
            
            <div className="admin-main-content">
                <AdminHeader 
                    adminName={adminName}
                />
                
                <div className="admin-content-area">
                    <Outlet />
                </div>

                <footer className="admin-footer">
                    <p>&copy; 2024 Job Fair System - Admin Panel. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default AdminDashboard
