import { FaBriefcase, FaUsers, FaChartLine, FaStar } from 'react-icons/fa';
import './Company.css';
import { useState } from 'react';
import api from '../../api/axiosapi';

export default  function Company() {
    const [selectedCompany, setSelectedCompany] = useState(null);

    const response = api.get('/companies')
    console.log(response?.data?.detail)
    return (
        <div className="company-container">
            
        </div>
    );
}