import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './Error404.css';

export default function Error404(){
    return(
        <div className="error404-container">
            <div className="error404-content">
                <div className="error404-icon">
                    <FaExclamationTriangle />
                </div>
                <h1 className="error404-code">404</h1>
                <h2 className="error404-title">Page Not Found</h2>
                <p className="error404-message">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="error404-button">
                    <FaHome /> Go Back Home
                </Link>
            </div>
        </div>
    )
}