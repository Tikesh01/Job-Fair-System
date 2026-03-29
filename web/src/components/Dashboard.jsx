import MobileNavMenu from './MobileNavMenu'
import { Outlet } from 'react-router-dom'

export default function Dashboard(){

    return (
        <>
        <MobileNavMenu />
        <Outlet />
        </>
    )
}