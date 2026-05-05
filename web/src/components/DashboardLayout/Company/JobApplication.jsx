import { useEffect, useMemo, useState } from "react"
import {
    FaBriefcase,
    FaEnvelope,
    FaFileAlt,
    FaGraduationCap,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhone,
    FaSearch,
    FaUserCheck,
    FaUserGraduate
} from "react-icons/fa"
import api from "../../../api/axiosapi"
import VacancyCard from "../VacancyCard"
import { useNotification } from "../../../contexts/NotificationContext"
import "./JobApplication.css"

function CandidateApplicationCard({ application }) {
    const candidateName = application.candidate_name || "Unnamed candidate"
    const studyLine = [application.course_title, application.branch_title].filter(Boolean).join(" - ")
    const locationLine = [application.city, application.state].filter(Boolean).join(", ")

    return (
        <article className="company-application-candidate-card">
            <div className="company-application-candidate-head">
                <h2><FaUserGraduate /> {candidateName}</h2>
            </div>
            <div className="company-application-candidate-grid">
                <div>
                    <strong><FaGraduationCap /> Education</strong>
                    <span>{studyLine}, <strong>{application.university_name}</strong></span>
                </div>
                {application.about && (
                    <div className="company-application-candidate-about">
                        <strong>About Candidate</strong>
                        <p>{application.about}</p>
                    </div>
                )}
            </div>
        </article>
    )
}

export default function JobApplicationByCandidate(){
    const [applicationRows, setApplicationRows] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [loading, setLoading] = useState(true)
    const { notify } = useNotification("")

    useEffect(() => {
        async function fetchApplications() {
            try {
                setLoading(true)
                const resp = await api.get("/company/job/applications")
                if (resp.status === 200) {
                    setApplicationRows(resp.data || [])
                }
            } catch (error) {
                notify("error", error.response?.data?.detail || "Unable to load company applications")
                setApplicationRows([])
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const groupedVacancies = useMemo(() => {
        const groupedMap = new Map()

        applicationRows.forEach((row) => {
            if (!groupedMap.has(row.job_role_id)) {
                groupedMap.set(row.job_role_id, {
                    vacancy: {
                        job_role_id: row.job_role_id,
                        job_role_title: row.job_role_title,
                        job_role_description: row.job_role_description,
                        job_type: row.job_type,
                        job_location: row.job_location,
                        salary: row.salary,
                        vacancy_count: row.vacancy_count,
                        application_count: row.application_count,
                        max_application_count: row.max_application_count,
                        eligibility: row.eligibility,
                        selection_flow: row.selection_flow,
                        is_closed: row.is_closed,
                        date_of_interview: row.date_of_interview,
                        alloted_time: row.alloted_time,
                        alloted_location: row.alloted_location,
                        is_posted: row.is_posted,
                        company_id: row.company_id,
                    },
                    candidates: [],
                })
            }

            if (row.applicant_id) {
                groupedMap.get(row.job_role_id).candidates.push(row)
            }
        })

        return Array.from(groupedMap.values())
    }, [applicationRows])

    const filteredVacancies = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return groupedVacancies.filter(({ vacancy, candidates }) => {
            const matchesSearch = !normalizedSearch || [
                vacancy.job_role_title,
                vacancy.job_location,
                ...candidates.flatMap((candidate) => [
                    candidate.candidate_name,
                    candidate.candidate_email,
                    candidate.course_title,
                    candidate.branch_title,
                    candidate.job_preferences,
                ]),
            ].some((value) => value?.toLowerCase().includes(normalizedSearch))

            const matchesStatus =
                statusFilter === "All" ||
                (statusFilter === "Open" && !vacancy.is_closed) ||
                (statusFilter === "Closed" && vacancy.is_closed)

            return matchesSearch && matchesStatus
        })
    }, [groupedVacancies, searchTerm, statusFilter])

    const totalApplications = groupedVacancies.reduce((count, group) => count + group.candidates.length, 0)

    return(
        <div className="company-job-application-page">
            <div className="company-job-application-header">
                <div>
                    <h2>Candidate Applications</h2>
                    <p>Review candidates who applied to your posted vacancies, grouped role by role.</p>
                </div>
                <div className="company-job-application-stats">
                    <span>{groupedVacancies.length} Vacancies</span>
                    <span>{totalApplications} Applications</span>
                </div>
            </div><hr />

            <div className="company-job-application-groups">
                {filteredVacancies.length > 0 ? (
                    filteredVacancies.map(({ vacancy, candidates }) => (
                        <section className="company-job-application-group" key={vacancy.job_role_id}>
                            <div className="company-job-vacancy-card">
                                <VacancyCard
                                    vacancy={vacancy}
                                    showSelectButton={false}
                                    showApplyButton={false}
                                    statusText={candidates.length > 0 ? `${candidates.length} candidate application${candidates.length > 1 ? "s" : ""}` : "No applications yet"}
                                    height={{'height':'100px'}}
                                />
                            </div>

                            <div className="company-job-applicants-panel">
                                <div className="company-job-applicants-header">
                                    <h3><FaUserCheck /> Applicants</h3>
                                    <span>{candidates.length} </span>

                                </div>

                                <div className="company-job-applicants-list">
                                    {candidates.length > 0 ? (
                                        candidates.map((application) => (
                                            <CandidateApplicationCard
                                                key={application.job_application_id}
                                                application={application}
                                            />
                                        ))
                                    ) : (
                                        <div className="company-job-empty">
                                            <FaInfoCircle />
                                            <h4>{loading ? "Loading applications..." : "No candidate has applied yet"}</h4>
                                            <p>{loading ? "Please wait while we fetch the latest submissions." : "Once candidates apply to this vacancy, they will appear here."}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <hr />
                        </section>
                    ))
                ) : (
                    <div className="company-job-empty page-empty">
                        <FaInfoCircle />
                        <h4>{loading ? "Loading company applications..." : "No matching vacancies found"}</h4>
                        <p>{loading ? "Please wait while we fetch your created roles and applications." : "Try changing the search or status filter, or create and post a vacancy first."}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
