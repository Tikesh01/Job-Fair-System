import DashboardNav from './DashboardNav'
import { Outlet } from 'react-router-dom'
import  "./dashboard.css";

export default function Dashboard(){

    return (
        <>
        <div className="dashboard">
            <div className="dashboard-nav"><DashboardNav /></div>
            <div className="dashboard-content"><Outlet /></div>
        </div>
        </>
    )
}