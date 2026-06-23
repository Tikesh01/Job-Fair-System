import { useEffect, useState } from "react"
import api from "../../../api/axiosapi"
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaChevronCircleDown, FaChevronCircleUp, FaChevronDown, FaChevronUp, FaInfoCircle, FaBriefcase, FaClock, FaMapMarkerAlt, FaDollarSign, FaUsers, FaFileAlt, FaCheckCircle, FaTasks, FaCalendarAlt, FaToggleOn, FaEye, FaBuilding, FaTrashAlt, FaPenAlt, FaExpand, FaCompress } from "react-icons/fa"
import './Vacancy.css';
import  VacancyCard  from "../VacancyCard";
import {useNotification} from '../../../contexts/NotificationContext'

export default function Vacancy(){
    const [jobRoleList,setJobRoleList] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [showDemoVac, setShowDemoVac] = useState(false)
    const [ vacancyForm, setVacancyForm] = useState({})
    const {notify} = useNotification('')
    const [ errors, setErrors] = useState({})
    
    useEffect(()=>{
        async function fetchJobRoles(){
            const resp = await api.get('/company/vacancy')
            if(resp.status == 200){
                setJobRoleList(resp.data)
            }
        }
        fetchJobRoles()
    },[setJobRoleList])

    function handleInputChange(e) {
        const {name, value} = e.target
        setVacancyForm(prev=>({
            ...prev,
            [name]:value
        })   
        )
    }
    async function createVacancy() {
        console.log("Form data before conversion:", vacancyForm);
        
        const requiredFields = ['job_role_title', 'job_type', 'job_location', 'salary', 'vacancy_count', 'max_application_count', 'job_role_description', 'eligibility', 'selection_flow'];
        const missingFields = requiredFields.filter(field => !vacancyForm[field] || vacancyForm[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
            notify('error', `Please fill all required fields: ${missingFields.join(', ')}`)
            return
        }
        
        try {
            const salary = parseFloat(vacancyForm.salary);
            const vacancy_count = parseInt(vacancyForm.vacancy_count);
            const max_application_count = parseInt(vacancyForm.max_application_count);
            
            if (isNaN(salary) || isNaN(vacancy_count) || isNaN(max_application_count)) {
                notify('error', 'Invalid numeric values. Please check salary, vacancies, and max applications.')
                return
            }

            const formData = {
                job_role_title: vacancyForm.job_role_title.trim(),
                job_role_description: vacancyForm.job_role_description.trim(),
                job_type: vacancyForm.job_type,
                job_location: vacancyForm.job_location.trim(),
                salary: salary,
                vacancy_count: vacancy_count,
                max_application_count: max_application_count,
                eligibility: vacancyForm.eligibility.trim(),
                selection_flow: vacancyForm.selection_flow.trim()
            }
            
            console.log("Form data being sent to backend:", formData);
            
            const resp = await api.post('/company/vacancy', formData)
            
            if(resp.status === 200 || resp.status === 201){
                notify('success', `Success: ${resp.data?.msg || 'Vacancy created successfully'}`)
                setVacancyForm({}) 
                setErrors({}) 
                setShowForm(false)
            }
            else{
                notify('error', resp.data?.detail || 'Failed to create vacancy')
            }
        } catch (error) {
            console.error('Error creating vacancy:', error.response?.data || error.message)
            notify('error', error.response?.data?.detail || error.message || 'An error occurred')
            setErrors(prev => ({...prev, main: error.response?.data?.detail || error.message}))
        }
    }

    async function handleDeleteVacancy(job_role_id) {
        try {
            const resp = await api.delete(`/company/vacancy/${job_role_id}`)
            if (resp.status === 200) {
                notify('success', 'Vacancy deleted successfully')
                setJobRoleList(prev => prev.filter(job => job.job_role_id !== job_role_id))
            }
        } catch (error) {
            console.error('Error deleting vacancy:', error.response?.data || error.message)
            notify('error', error.response?.data?.detail || 'Failed to delete vacancy')
        }
    }

    async function handleUpdateVacancy(vacancy) {
        setVacancyForm({
            job_role_id: vacancy.job_role_id,
            job_role_title: vacancy.job_role_title,
            job_role_description: vacancy.job_role_description,
            job_type: vacancy.job_type,
            job_location: vacancy.job_location,
            salary: vacancy.salary,
            vacancy_count: vacancy.vacancy_count,
            max_application_count: vacancy.max_application_count,
            eligibility: vacancy.eligibility,
            selection_flow: vacancy.selection_flow,
            is_closed: vacancy.is_closed,
            date_of_interview: vacancy.date_of_interview,
            alloted_time: vacancy.alloted_time,
            alloted_location: vacancy.alloted_location,
            is_posted: vacancy.is_posted
        })
        setShowForm(true)
    }

    async function handlePostToggle(job_role_id, is_posted, is_closed = null) {
        try {
            const updateData = {}
            if (is_closed !== null) {
                updateData.is_closed = is_closed
            } else {
                updateData.is_posted = is_posted
            }
            
            const resp = await api.put(`/company/vacancy/${job_role_id}`, updateData)
            if (resp.status === 200) {
                const successMsg = is_closed === true 
                    ? 'Vacancy closed successfully'
                    : is_closed === false
                    ? 'Vacancy opened successfully'
                    : is_posted 
                    ? 'Vacancy posted successfully'
                    : 'Vacancy unposted successfully'
                notify('success', successMsg)
                
                setJobRoleList(prev => prev.map(job => 
                    job.job_role_id === job_role_id 
                        ? { 
                            ...job, 
                            is_posted: is_closed !== null ? job.is_posted : is_posted,
                            is_closed: is_closed !== null ? is_closed : job.is_closed
                          }
                        : job
                ))
            }
        } catch (error) {
            console.error('Error updating vacancy:', error.response?.data || error.message)
            notify('error', error.response?.data?.detail || 'Failed to update vacancy')
        }
    }

    async function updateExistingVacancy() {
        console.log("Updating vacancy with ID:", vacancyForm.job_role_id);
        
        if (!vacancyForm.job_role_id) {
            notify('error', 'No vacancy selected for update')
            return
        }
        
        const requiredFields = ['job_role_title', 'job_type', 'job_location', 'salary', 'vacancy_count', 'max_application_count', 'job_role_description', 'eligibility', 'selection_flow'];
        const missingFields = requiredFields.filter(field => !vacancyForm[field] || vacancyForm[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
            notify('error', `Please fill all required fields: ${missingFields.join(', ')}`)
            return
        }
        
        try {
            const salary = parseFloat(vacancyForm.salary);
            const vacancy_count = parseInt(vacancyForm.vacancy_count);
            const max_application_count = parseInt(vacancyForm.max_application_count);
            
            if (isNaN(salary) || isNaN(vacancy_count) || isNaN(max_application_count)) {
                notify('error', 'Invalid numeric values. Please check salary, vacancies, and max applications.')
                return
            }
            
            const formData = {
                job_role_title: vacancyForm.job_role_title.trim(),
                job_role_description: vacancyForm.job_role_description.trim(),
                job_type: vacancyForm.job_type,
                job_location: vacancyForm.job_location.trim(),
                salary: salary,
                vacancy_count: vacancy_count,
                max_application_count: max_application_count,
                eligibility: vacancyForm.eligibility.trim(),
                selection_flow: vacancyForm.selection_flow.trim()
            }
            
            console.log("Form data being sent for update:", formData);
            
            const resp = await api.put(`/company/vacancy/${vacancyForm.job_role_id}`, formData)
            
            if(resp.status === 200){
                notify('success', 'Vacancy updated successfully')
                setJobRoleList(prev => prev.map(job => 
                    job.job_role_id === vacancyForm.job_role_id 
                        ? { ...job, ...formData }
                        : job
                ))
                setVacancyForm({}) 
                setErrors({}) 
                setShowForm(false)
            }
            else{
                notify('error', resp.data?.detail || 'Failed to update vacancy')
            }
        } catch (error) {
            console.error('Error updating vacancy:', error.response?.data || error.message)
            notify('error', error.response?.data?.detail || error.message || 'An error occurred')
            setErrors(prev => ({...prev, main: error.response?.data?.detail || error.message}))
        }
    }

    return(
        <>
            <div className="vacancy-container">
                <div className="vacancy-list-wrapper">
                    <div className="vacancy-list-header">
                        <h2>Job Vacancies</h2>
                        <div className="vacancy-stat">
                            <span className="vacancy-count">{jobRoleList.length} Created</span>
                            <span className="vacancy-posted-count">{jobRoleList.filter((obj)=>obj.is_posted === 1).length} Posted</span>
                            <span className="vacancy-closed-count">{jobRoleList.filter((obj)=>obj.is_closed === 1).length} Closed</span>
                        </div>
                    </div>
                    
                    {jobRoleList && jobRoleList.length > 0
                        ?<div className="vacancy-card-grid">
                            {jobRoleList && jobRoleList.length > 0
                                ? jobRoleList.map(jobRoleObj => (
                                    <div className="card" key={jobRoleObj.job_role_id || jobRoleObj.id} > 
                                        <VacancyCard 
                                            key={jobRoleObj.job_role_id || jobRoleObj.id} 
                                            vacancy={jobRoleObj} 
                                            onDelete={handleDeleteVacancy}
                                            onUpdate={handleUpdateVacancy}
                                            onPostToggle={handlePostToggle}
                                        />
                                    </div>
                                ))
                                :null
                            }
                        </div>
                    :<div className="no-vacancies">
                        <FaInfoCircle /> 
                        <span className="info-span">No Roles Created Yet</span>
                    </div>}
                    <div className="vacancy-list-footer">
                        <p className="info-span"><FaInfoCircle /> Note :- Once Posted Vacancy cannot be deleted or Edited, but can be closed </p>
                    </div>
                </div>

                <div className="demo-vacancy-wrapper">
                    <div className="demo-vacancy-header" onClick={()=>setShowDemoVac(!showDemoVac)}>
                        <h3>
                            Demo Vacancy Card
                        </h3>
                        <span>{showDemoVac?<FaChevronCircleUp />:<FaChevronCircleDown />}</span>
                    </div>
                    <div className="demo">
                        {showDemoVac &&  <VacancyCard 
                            isDemo={true}
                            vacancy={{
                                job_role_id: 1,
                                job_role_title: "Senior Software Engineer",
                                job_type: "Full time",
                                job_location: "Bangalore, India",
                                salary: 1200000,
                                vacancy_count: 5,
                                max_application_count: 100,
                                job_role_description: "We are looking for experienced software engineers with strong problem-solving skills. You will work on cutting-edge technologies and contribute to our flagship products.",
                                eligibility: "B.Tech in CS/IT with 7.0+ CGPA or equivalent. 2-3 years of experience in software development.",
                                selection_flow: "Online Coding Round → Technical Interview → HR Interview",
                                date_of_interview: "2026-05-15",
                                alloted_time: "10:00 AM",
                                alloted_location: "Conference Room 1",
                                is_closed: false,
                                is_posted: true,
                                application_count: 42
                            }}
                        />}
                    </div>
                </div>

                <div className="vacancy-form-wrapper">
                    <div className="vacancy-form-header" onClick={()=>setShowForm(!showForm)}>
                        <h2>Create Vacancy </h2>
                        <span>{showForm?<FaChevronCircleUp />:<FaChevronCircleDown />}</span>
                    </div>
                    {showForm && (<div className="vacancy-form">
                        <div className="vacancy-form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-briefcase"></i>
                                    Job Title <span className="required">*</span>
                                </label>
                                <input value={vacancyForm.job_role_title || ""} onChange={handleInputChange} list="job_title" type="text" className="form-input" name="job_role_title" placeholder="Enter job title" required />
                                <span className="error-massage"></span>
                                <datalist id='job_title' >
                                    <option value="sfa" />
                                    <option value="asfa">sfa</option>
                                </datalist>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-hourglass-half"></i>
                                    Job Type <span className="required">*</span>
                                </label>
                                <select value={vacancyForm.job_type || ""} onChange={handleInputChange} className="form-input-select" name="job_type" required>
                                    <option value="">Select Job Type</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Full time">Full Time</option>
                                    <option value="Part time">Part Time</option>
                                </select>
                                <span className="error-massage"></span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-map-marker-alt"></i>
                                    Job Location <span className="required">*</span>
                                </label>
                                <input value={vacancyForm.job_location || ""} onChange={handleInputChange} type="text" className="form-input" name="job_location" placeholder="Enter job location" required />
                                <span className="error-massage"></span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-money-bill-wave"></i>
                                    Salary Rupees /year <span className="required">*</span>
                                </label>
                                <input value={vacancyForm.salary || ""} onChange={handleInputChange} type="number" className="form-input" name="salary" placeholder="Enter salary" required />
                                <span className="error-massage"></span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-users"></i>
                                    Number of Vacancies <span className="required">*</span>
                                </label>
                                <input value={vacancyForm.vacancy_count || ""} onChange={handleInputChange} type="number" className="form-input" name="vacancy_count" placeholder="Enter vacancy count" required />
                                <span className="error-massage"></span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-inbox"></i>
                                    Max Applications <span className="required">*</span>
                                </label>
                                <input value={vacancyForm.max_application_count || ""} onChange={handleInputChange} type="number" className="form-input" name="max_application_count" placeholder="Enter max applications count" required />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group full">
                                <label className="form-label">
                                    <i className="fas fa-align-left"></i>
                                    Job Description <span className="required">*</span>
                                </label>
                                <textarea value={vacancyForm.job_role_description || ""} onChange={handleInputChange} className="form-input-textarea" name="job_role_description" placeholder="Enter detailed job description" required></textarea>
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group full">
                                <label className="form-label">
                                    <i className="fas fa-check-circle"></i>
                                    Eligibility Criteria <span className="required">*</span>
                                </label>
                                <textarea value={vacancyForm.eligibility || ""} onChange={handleInputChange} className="form-input-textarea" name="eligibility" placeholder="Enter eligibility criteria (e.g., GPA, skills, etc.)" required></textarea>
                                <span className="error-massage"></span>
                            </div>

                            <div className="form-group full">
                                <label className="form-label">
                                    <i className="fas fa-tasks"></i>
                                    Selection Process <span className="required">*</span>
                                </label>
                                <textarea value={vacancyForm.selection_flow || ""} onChange={handleInputChange} className="form-input-textarea" name="selection_flow" placeholder="Describe the selection process (written test, interview rounds, etc.)" required></textarea>
                                <span className="error-massage"></span>
                            </div>
                             
                        </div>
                        <span className="error-massage">{errors.main}</span>
                        <div className="form-actions btn-group">
                            <button type="reset" className="btn btn-secondary" onClick={()=>{setVacancyForm({}); setErrors({})}}>
                                <i className="fas fa-undo"></i> Reset
                            </button>
                            <button type="submit" className="btn btn-primary" onClick={()=> vacancyForm.job_role_id ? updateExistingVacancy() : createVacancy()}>
                                <i className="fas fa-box"></i> {vacancyForm.job_role_id ? 'Update Vacancy' : 'Create Vacancy'}
                            </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
    )
}