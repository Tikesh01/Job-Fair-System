import { useEffect, useState } from "react"
import { FaBookmark, FaCheckCircle, FaInfoCircle } from "react-icons/fa"
import api from "../../../api/axiosapi"
import VacancyCard from "../VacancyCard"
import {useNotification} from "../../../contexts/NotificationContext"
import "./JobApplication.css"

export default function JobApplication(){
    const [selectedVacancies, setSelectedVacancies] = useState([])
    const [appliedVacancies, setAppliedVacancies] = useState([])
    const [loading, setLoading] = useState(true)
    const {notify} = useNotification('')

    async function fetchCandidateVacancies() {
        try {
            setLoading(true)
            const resp = await api.get('/candidate/vacancy')
            if (resp.status === 200) {
                setSelectedVacancies(resp.data.selected || [])
                setAppliedVacancies(resp.data.applied || [])
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                notify('error', error.response?.data?.detail || 'Unable to load your vacancies')
            }
            setSelectedVacancies([])
            setAppliedVacancies([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCandidateVacancies()
    }, [])

    async function handleApply(jobRoleId) {
        const appliedVacancy = selectedVacancies.find((vacancy) => vacancy.job_role_id === jobRoleId)

        try {
            const resp = await api.post(`/candidate/vacancy/${jobRoleId}/apply`)
            if (resp.status === 200) {
                notify('success', 'Application submitted successfully')
                setSelectedVacancies((prev) => prev.filter((vacancy) => vacancy.job_role_id !== jobRoleId))
                if (appliedVacancy) {
                    setAppliedVacancies((prev) => [{ ...appliedVacancy, is_applied: 1 }, ...prev])
                } else {
                    fetchCandidateVacancies()
                }
            }
        } catch (error) {
            if (error.response?.status === 200 || error.response?.data?.detail === 'Appplication Filed') {
                notify('success', 'Application submitted successfully')
                fetchCandidateVacancies()
                return
            }

            notify('error', error.response?.data?.detail || 'Unable to apply for this vacancy')
        }
    }

    async function handleRemove(jobRoleId) {
        try {
            const resp = await api.delete(`/candidate/vacancy/${jobRoleId}`)
            if (resp.status === 200) {
                notify('success', 'Selected vacancy removed successfully')
                setSelectedVacancies((prev) => prev.filter((vacancy) => vacancy.job_role_id !== jobRoleId))
            }
        } catch (error) {
            notify('error', error.response?.data?.detail || 'Unable to remove selected vacancy')
        }
    }

    const totalCount = selectedVacancies.length + appliedVacancies.length

    return(
        <div className="candidate-job-application-page">
            <div className="candidate-job-application-header">
                <div>
                    <h2>My Job Vacancies</h2>
                </div>
                <div className="candidate-job-stats">
                    <span>{totalCount} Total</span>
                    <span>{selectedVacancies.length} / 10 Selected</span>
                    <span>{appliedVacancies.length} / 5 Applied</span>
                </div>
            </div>

            <section className="candidate-job-section">
                <div className="candidate-job-section-header">
                    <h3><FaBookmark /> Selected Vacancies</h3>
                    <p>Review these saved roles, apply when ready, or remove them from your list.</p>
                </div>

                <div className="candidate-job-grid">
                    {selectedVacancies.length > 0 ? (
                        selectedVacancies.map((vacancy) => (
                            <VacancyCard
                                key={vacancy.job_role_id}
                                vacancy={vacancy}
                                onApply={handleApply}
                                onRemove={handleRemove}
                                showSelectButton={false}
                                showApplyButton={true}
                                removeButtonLabel="Remove"
                                statusText="Selected and editable"
                                statusTone="warning"
                            />
                        ))
                    ) : (
                        <div className="candidate-job-empty">
                            <FaInfoCircle />
                            <h4>{loading ? 'Loading selected vacancies...' : 'No selected vacancies yet'}</h4>
                            <p>{loading ? 'Please wait while we fetch your saved roles.' : 'Go to the vacancies page and save roles you want to track before applying.'}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="candidate-job-section">
                <div className="candidate-job-section-header">
                    <h3><FaCheckCircle /> Applied Vacancies</h3>
                    <p>These applications have already been filed and are now read-only.</p>
                </div>

                <div className="candidate-job-grid">
                    {appliedVacancies.length > 0 ? (
                        appliedVacancies.map((vacancy) => (
                            <VacancyCard
                                key={vacancy.job_role_id}
                                vacancy={vacancy}
                                showSelectButton={false}
                                showApplyButton={false}
                                statusText="Applied and locked"
                                statusTone="success"
                            />
                        ))
                    ) : (
                        <div className="candidate-job-empty">
                            <FaInfoCircle />
                            <h4>{loading ? 'Loading applied vacancies...' : 'No applied vacancies yet'}</h4>
                            <p>{loading ? 'Please wait while we fetch your submitted applications.' : 'Applied vacancies will appear here after you submit an application.'}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
