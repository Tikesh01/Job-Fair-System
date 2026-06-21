import { Navigate } from 'react-router-dom'
import { getCookie } from '../../utils/cookies'

function ProtectedRoute({ children, requiredRole }) {
    const token = getCookie('token')
    const role = getCookie('role')

    if (!token) {
        return <Navigate to="/admin/login" replace />
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/admin/login" replace />
    }

    return children
}

export default ProtectedRoute
