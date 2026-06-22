import { FaUsers, FaBuilding, FaBriefcase, FaFileAlt, FaCalendarAlt, FaComments } from 'react-icons/fa'
import './DashboardOverview.css'

function DashboardOverview() {
    // These would be fetched from the backend API
    const stats = [
        {
            icon: <FaUsers />,
            label: 'Total Candidates',
            value: '1,250',
            color: '#4299e1',
            bgColor: '#ebf8ff'
        },
        {
            icon: <FaBuilding />,
            label: 'Companies',
            value: '45',
            color: '#48bb78',
            bgColor: '#f0fff4'
        },
        {
            icon: <FaUsers />,
            label: 'Universities',
            value: '15',
            color: '#ed8936',
            bgColor: '#fffaf0'
        },
        {
            icon: <FaBriefcase />,
            label: 'Job Roles',
            value: '230',
            color: '#9f7aea',
            bgColor: '#faf5ff'
        },
        {
            icon: <FaFileAlt />,
            label: 'Job Applications',
            value: '850',
            color: '#ed64a6',
            bgColor: '#fff5f7'
        },
        {
            icon: <FaComments />,
            label: 'Total Feedback',
            value: '120',
            color: '#38a169',
            bgColor: '#f0fdf4'
        }
    ]

    return (
        <div className="dashboard-overview">
            <div className="overview-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome to the Job Fair System Admin Panel</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div 
                            className="stat-icon-admin"
                            style={{ 
                                color: stat.color, 
                                backgroundColor: stat.bgColor 
                            }}
                        >
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-value-admin">{stat.value}</h3>
                            <p className="stat-label-admin">{stat.label}</p>
                        </div>
                        <div className="stat-trend-admin">↑ 12%</div>
                    </div>
                ))}
            </div>

            <div className="overview-sections">
                <div className="section">
                    <h2>Recent Activities</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-indicator" style={{ backgroundColor: '#4299e1' }}></div>
                            <div className="activity-content">
                                <p className="activity-title">New Candidate Registered</p>
                                <p className="activity-time">2 hours ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-indicator" style={{ backgroundColor: '#48bb78' }}></div>
                            <div className="activity-content">
                                <p className="activity-title">Company Profile Updated</p>
                                <p className="activity-time">5 hours ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-indicator" style={{ backgroundColor: '#ed8936' }}></div>
                            <div className="activity-content">
                                <p className="activity-title">New Job Role Posted</p>
                                <p className="activity-time">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2>Quick Stats</h2>
                    <div className="quick-stats">
                        <div className="quick-stat-item">
                            <span className="stat-label">Active Users</span>
                            <span className="stat-value">324</span>
                        </div>
                        <div className="quick-stat-item">
                            <span className="stat-label">Pending Approvals</span>
                            <span className="stat-value">12</span>
                        </div>
                        <div className="quick-stat-item">
                            <span className="stat-label">Today's Applications</span>
                            <span className="stat-value">45</span>
                        </div>
                        <div className="quick-stat-item">
                            <span className="stat-label">System Uptime</span>
                            <span className="stat-value">99.9%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h2>System Information</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <label>Last Database Backup</label>
                        <span>Today at 02:30 AM</span>
                    </div>
                    <div className="info-item">
                        <label>Total Database Size</label>
                        <span>245 MB</span>
                    </div>
                    <div className="info-item">
                        <label>API Response Time</label>
                        <span>125 ms</span>
                    </div>
                    <div className="info-item">
                        <label>Total Users</label>
                        <span>2,450</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
