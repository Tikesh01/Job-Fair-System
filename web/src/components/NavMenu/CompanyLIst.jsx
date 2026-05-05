import { FaBuilding, FaSearch, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './CompanyList.css';
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axiosapi';
import CompanyCard from './CompanyCard';
import { useNotification } from '../../contexts/NotificationContext';

export default  function CompanyList() {
    const [companyList, setCompanyList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { notify } = useNotification('');

    useEffect(() => {
        async function fetchCompanies() {
            try {
                setLoading(true);
                const resp = await api.get('/companies');
                if (resp.status === 200) {
                    setCompanyList(resp.data || []);
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    notify('error', error.response?.data?.detail || 'Unable to load companies');
                }
                setCompanyList([]);
            } finally {
                setLoading(false);
            }
        }

        fetchCompanies();
    }, []);

    const filteredCompanies = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return companyList.filter((company) => {
            if (!normalizedSearch) {
                return true;
            }

            return [
                company.name,
                company.email,
                company.city,
                company.state,
                company.about,
                company.industry_type_name,
            ].some((value) => value?.toLowerCase().includes(normalizedSearch));
        });
    }, [companyList, searchTerm]);

    return (
        <div className="company-list-page">
            <div className="company-list-header">
                <div>
                    <h2>Verified Companies</h2>
                    <p>Browse verified recruiters and explore the organizations participating in the job fair.</p>
                </div>
                <div className="company-search-bar">
                    <label className="search-company-inp">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by company, city, state, or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                    <div className="company-list-stats">
                        <span><FaCheckCircle /> {filteredCompanies.length} shown</span>
                        <span><FaBuilding /> {companyList.length} verified</span>
                    </div>
                </div>
            </div>

            <div className="company-card-grid">
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                        <CompanyCard key={company.company_id} company={company} />
                    ))
                ) : (
                    <div className="company-list-empty">
                        <FaInfoCircle />
                        <h3>{loading ? 'Loading companies...' : 'No verified companies found'}</h3>
                        <p>
                            {loading
                                ? 'Please wait while we fetch the verified company list.'
                                : 'Try changing the search text or add verified companies to the database.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
