import { FaSearch, FaFilter, FaBriefcase, FaDoorOpen, FaRupeeSign } from 'react-icons/fa';
import './Job.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosapi';
import VacancyCard from '../DashboardLayout/VacancyCard'
import {useNotification} from '../../contexts/NotificationContext'
import { getCookie } from '../../utils/cookies';

export default function Job() {
    const {notify} = useNotification('')
    const [vacancyList, setVacancyList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [jobTypeFilter, setJobTypeFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [salaryFilter, setSalaryFilter] = useState('All')
    const [usePreferenceFilter, setUsePreferenceFilter] = useState(false)
    const [jobPreferences, setJobPreferences] = useState([])
    const [candidateSalaryPreference, setCandidateSalaryPreference] = useState(0)
    const navigate = useNavigate()
    const role = getCookie('role')
    const canUsePreferenceFilter = role === 'candidate'

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

    useEffect(() => {
        async function fetchCandidatePreferenceFilters() {
            if (!canUsePreferenceFilter) return

            try {
                const [preferenceResp, profileResp] = await Promise.all([
                    api.get('/candidate/job-preference'),
                    api.get('/profile')
                ])

                setJobPreferences(preferenceResp.data || [])
                setCandidateSalaryPreference(Number(profileResp.data?.salary_preference || 0))
            } catch (error) {
                setJobPreferences([])
                setCandidateSalaryPreference(0)
            }
        }

        fetchCandidatePreferenceFilters()
    }, [canUsePreferenceFilter])

    const jobTypes = useMemo(() => (
        ['All', ...new Set(vacancyList.map((vacancy) => vacancy.job_type).filter(Boolean))]
    ), [vacancyList])

    const hasPreferenceCriteria = jobPreferences.length > 0 || candidateSalaryPreference > 0

    useEffect(() => {
        if (!hasPreferenceCriteria && usePreferenceFilter) {
            setUsePreferenceFilter(false)
        }
    }, [hasPreferenceCriteria, usePreferenceFilter])

    const preferenceMetaText = useMemo(() => {
        const parts = []
        if (jobPreferences.length > 0) {
            parts.push(`${jobPreferences.length} role${jobPreferences.length > 1 ? 's' : ''}`)
        }
        if (candidateSalaryPreference > 0) {
            parts.push(`₹${candidateSalaryPreference.toLocaleString()}+`)
        }

        return parts.length > 0 ? parts.join(' • ') : 'Add preferences in profile'
    }, [candidateSalaryPreference, jobPreferences])

    const filteredVacancies = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()
        const normalizedJobPreferences = jobPreferences
            .map((preference) => preference.job_title?.trim().toLowerCase())
            .filter(Boolean)

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

            const normalizedVacancyTitle = vacancy.job_role_title?.trim().toLowerCase() || ''
            const matchesPreferredJobRole =
                !usePreferenceFilter ||
                normalizedJobPreferences.length === 0 ||
                normalizedJobPreferences.some((jobTitle) => (
                    normalizedVacancyTitle.includes(jobTitle) ||
                    jobTitle.includes(normalizedVacancyTitle)
                ))
            const matchesPreferredSalary =
                !usePreferenceFilter ||
                candidateSalaryPreference <= 0 ||
                salary >= candidateSalaryPreference

            return matchesSearch && matchesType && matchesStatus && matchesSalary && matchesPreferredJobRole && matchesPreferredSalary
        })
    }, [candidateSalaryPreference, jobPreferences, jobTypeFilter, statusFilter, salaryFilter, searchTerm, usePreferenceFilter, vacancyList])

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
                    {canUsePreferenceFilter && (
                        <label className={`preference-filter-toggle ${!hasPreferenceCriteria ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                checked={usePreferenceFilter}
                                disabled={!hasPreferenceCriteria}
                                onChange={(e) => setUsePreferenceFilter(e.target.checked)}
                            />
                            <span className="preference-toggle-switch" aria-hidden="true"></span>
                            <span className="preference-toggle-text">
                                See Jobs based on Job role and Salary References
                                <small>{preferenceMetaText}</small>
                            </span>
                        </label>
                    )}
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
                                setUsePreferenceFilter(false)
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
