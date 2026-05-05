import { FaSearch, FaFilter, FaBriefcase, FaDoorOpen, FaRupeeSign } from 'react-icons/fa';
import './Job.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosapi';
import VacancyCard from '../DashboardLayout/VacancyCard'
import {useNotification} from '../../contexts/NotificationContext'

export default function Job() {
    const {notify} = useNotification('')
    const [vacancyList, setVacancyList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [jobTypeFilter, setJobTypeFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [salaryFilter, setSalaryFilter] = useState('All')
    const navigate = useNavigate()

    async function selectVacancy(jobRoleId) {
        try {
            const resp = await api.post(`/candidate/vacancy/${jobRoleId}/select`)
            if(resp.status === 200){
                 notify('success','Job vacancy saved to your applications')
            }
        } catch (error) {
            notify('error', error.response?.data?.detail || 'Unable to process vacancy action')
            return false
        }
    }

    async function applyVacancy(jobRoleId) {
        try {
            const resp = await api.post(`/candidate/vacancy/${jobRoleId}/apply`)
            if(resp.status === 200){
                notify('success','Application submitted successfully')
                navigate('/candidate/job/applications')
            }
        } catch (error) {
            if (error.response?.status === 200 || error.response?.data?.detail === 'Appplication Filed') {
                notify('success', 'Application submitted successfully')
                navigate('/candidate/job/applications')
                return
            }

            notify('error', error.response?.data?.detail || 'Unable to process vacancy action')
        }
    }

    useEffect(() => {
        async function fetchPostedVacancy() {
            try {
                const resp = await api.get('/vacancy/posted')
                if (resp.status === 200) {
                    setVacancyList(resp.data)
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchPostedVacancy()
    }, [])

    const jobTypes = useMemo(() => (
        ['All', ...new Set(vacancyList.map((vacancy) => vacancy.job_type).filter(Boolean))]
    ), [vacancyList])

    const filteredVacancies = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()
        return vacancyList.filter((vacancy) => {
            const matchesSearch = !normalizedSearch || [
                vacancy.job_role_title,
                vacancy.job_role_description,
                vacancy.eligibility,
                vacancy.selection_flow,
                vacancy.job_location,
            ].some((value) => value?.toLowerCase().includes(normalizedSearch))

            const matchesType = jobTypeFilter === 'All' || vacancy.job_type === jobTypeFilter
            const matchesStatus = statusFilter === 'All' || vacancy.is_closed === parseInt(statusFilter)

            const salary = Number(vacancy.salary || 0)
            const matchesSalary =
                salaryFilter === 'All' ||
                (salaryFilter === 'Under 300000' && salary < 300000) ||
                (salaryFilter === '300000-600000' && salary >= 300000 && salary <= 600000) ||
                (salaryFilter === '600000-1000000' && salary > 600000 && salary <= 1000000) ||
                (salaryFilter === '1000000+' && salary > 1000000)

            return matchesSearch && matchesType && matchesStatus && matchesSalary
        })
    }, [jobTypeFilter, statusFilter, salaryFilter, searchTerm, vacancyList])

    return (
        <div className="vacancy-list-container">
            <div className="job-list-header">
                <div className='title-section'>
                    <h2>Vacancies <span className="vacancy-total-count">{filteredVacancies.length} / {vacancyList.length}</span></h2>
                    <p>Browse active job roles and apply to the ones that match your profile.</p>
                </div>
                <div className="vacancy-filter-bar">
                    <label className="search-filter">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by title, skill, location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                    <div className="filter-actions">
                        <label className="vacancy-filter">
                            <FaBriefcase />
                            <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
                                {jobTypes.map((jobType) => (
                                    <option key={jobType} value={jobType}>{jobType}</option>
                                ))}
                            </select>
                        </label>

                        <label className="vacancy-filter">
                            <FaDoorOpen />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="All">All</option>
                                <option value={0}>Opened</option>
                                <option value={1}>Closed</option>
                            </select>
                        </label>

                        <label className="vacancy-filter">
                            <FaRupeeSign />
                            <select value={salaryFilter} onChange={(e) => setSalaryFilter(e.target.value)}>
                                <option value="All">All</option>
                                <option value="Under 300000">Under 3 LPA</option>
                                <option value="300000-600000">3 - 6 LPA</option>
                                <option value="600000-1000000">6 - 10 LPA</option>
                                <option value="1000000+">10+ LPA</option>
                            </select>
                        </label>

                        <button
                            type="button"
                            className="vacancy-filter reset-filter"
                            onClick={() => {
                                setSearchTerm('')
                                setJobTypeFilter('All')
                                setStatusFilter('All')
                                setSalaryFilter('All')
                            }}
                        >
                            <FaFilter />
                            Reset
                        </button>
                    </div>
                </div>
                
            </div>

            

            <div className="vacancy-list-grid">
                {filteredVacancies.length > 0 ? (
                    filteredVacancies.map((vacancyObj) => (
                        <div key={vacancyObj.job_role_id}>
                            <VacancyCard vacancy={vacancyObj} onSelect={selectVacancy} onApply={applyVacancy} />
                        </div>
                    ))
                ) : (
                    <div className="empty-vacancy-state">
                        <h3>No vacancies match your filters</h3>
                        <p>Try changing the search text or clearing the filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
