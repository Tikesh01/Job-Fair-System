import DashboardNavMenu from './DashboardNavMenu'
import { Outlet } from 'react-router-dom'
import  "./dashboard.css";

export default function Dashboard(){

    return (
        <>
        <div className="dashboard">
            <div className="dashboard-nav"><DashboardNavMenu /></div>
            <div className="dashboard-content"><Outlet /></div>
        </div>
        </>
    )
}