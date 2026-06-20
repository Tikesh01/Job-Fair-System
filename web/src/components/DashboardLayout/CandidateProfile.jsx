import { useNotification } from "../../contexts/NotificationContext"
import { useState, useEffect } from "react"
import profilePic from '../../assets/mobile-login-animate.svg'
import { FaBriefcase, FaCheckCircle, FaCheckDouble, FaInfoCircle, FaTimesCircle, FaEnvelope, FaPhone, FaLock, FaGraduationCap, FaBook, FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaFileAlt, FaMapMarked, FaSearchLocation, FaCalendarAlt, FaTrashAlt, FaPlusCircle, FaCalendar, FaUserAlt, FaHotel, FaUserEdit, FaRegSave, FaSignOutAlt, FaUserTie, FaCity, FaHashtag, FaRecycle, FaRedoAlt, FaUserGraduate } from "react-icons/fa";
import api from "../../api/axiosapi";
import { useNavigate } from "react-router-dom";

const MAX_JOB_PREFERENCES = 3
const MAX_JOB_PREFERENCE_TITLE_LENGTH = 30

function normalizeJobTitle(title) {
    return String(title || '').trim().replace(/\s+/g, ' ')
}

function JobPreferences({candidate_id, editable}) {
    const {notify} = useNotification('')
    const [preferenceList, setPreferenceList] = useState([])
    const [draftTitle, setDraftTitle] = useState('')
    const [error, setError] = useState('')
    const canAddMore = preferenceList.length < MAX_JOB_PREFERENCES

    useEffect(() => {
        async function fetchPreferences() {
            if (!candidate_id) return
            try {
                const resp = await api.get('/candidate/job-preference')
                if (resp.status === 200) {
                    setPreferenceList(resp.data || [])
                    setError('')
                }
            } catch (error) {
                notify('error', error.response?.data?.detail || 'Failed to load job preferences')
            }
        }
        fetchPreferences()
    }, [candidate_id])

    function validatePreferenceTitle(title, currentPreferenceId = null) {
        const nextTitle = normalizeJobTitle(title)

        if (!nextTitle) {
            return 'Enter a job title first'
        }

        if (nextTitle.length > MAX_JOB_PREFERENCE_TITLE_LENGTH) {
            return `Job title cannot exceed ${MAX_JOB_PREFERENCE_TITLE_LENGTH} characters`
        }

        const hasDuplicate = preferenceList.some((preference) => (
            preference.id !== currentPreferenceId &&
            normalizeJobTitle(preference.job_title).toLowerCase() === nextTitle.toLowerCase()
        ))

        return hasDuplicate ? 'This job title is already added' : ''
    }

    function handlePreferenceChange(preferenceId, value) {
        setPreferenceList(prev => prev.map((preference) => (
            preference.id === preferenceId
                ? { ...preference, job_title: value }
                : preference
        )))
    }

    async function addPreference() {
        if (!canAddMore) {
            setError(`You can add up to ${MAX_JOB_PREFERENCES} job preferences only`)
            return
        }

        const validationError = validatePreferenceTitle(draftTitle)
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            const resp = await api.post('/candidate/job-preference', {
                job_title: normalizeJobTitle(draftTitle)
            })
            if (resp.status === 200 || resp.status === 201) {
                setPreferenceList(prev => [...prev, resp.data])
                setDraftTitle('')
                setError('')
                notify('success', 'Job preference added')
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to add job preference')
        }
    }

    async function updatePreference(preferenceId) {
        const preference = preferenceList.find((item) => item.id === preferenceId)
        const validationError = validatePreferenceTitle(preference?.job_title, preferenceId)
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            const payload = { job_title: normalizeJobTitle(preference.job_title) }
            const resp = await api.put(`/candidate/job-preference/${preferenceId}`, payload)
            if (resp.status === 200) {
                setPreferenceList(prev => prev.map((item) => (
                    item.id === preferenceId ? resp.data : item
                )))
                setError('')
                notify('success', 'Job preference updated')
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to update job preference')
        }
    }

    async function deletePreference(preferenceId) {
        try {
            const resp = await api.delete(`/candidate/job-preference/${preferenceId}`)
            if (resp.status === 200) {
                setPreferenceList(prev => prev.filter((preference) => preference.id !== preferenceId))
                setError('')
                notify('success', 'Job preference deleted')
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to delete job preference')
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            addPreference()
        }
    }

    return (
        <div className="form-group">
            <label htmlFor="jobPreferences"><FaBriefcase /> Job Preferences <small>{preferenceList.length}/{MAX_JOB_PREFERENCES}</small></label>
            <div className={`job-preference-control ${!editable ? 'readonly-mode' : ''}`}>
                {!editable && (
                    <div className="job-preference-chips">
                        {preferenceList.length > 0
                            ? preferenceList.map((preference) => (
                                <span className="job-preference-chip btn-outline-modern" key={preference.id}>
                                    {preference.job_title}
                                </span>
                            ))
                            : <span className="info-span"><FaInfoCircle /> No job preference added</span>
                        }
                    </div>
                )}
                {editable && preferenceList.length > 0 && (
                    <div className="job-preference-edit-list">
                        {preferenceList.map((preference) => (
                            <div className="job-preference-item" key={preference.id}>
                                <input
                                    type="text"
                                    className="profile-input job-preference-input"
                                    value={preference.job_title || ''}
                                    placeholder="Job title"
                                    onChange={(event) => handlePreferenceChange(preference.id, event.target.value)}
                                    maxLength={MAX_JOB_PREFERENCE_TITLE_LENGTH}
                                />
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => updatePreference(preference.id)}
                                    title="Save job preference"
                                >
                                    <FaRegSave />
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => deletePreference(preference.id)}
                                    title="Delete job preference"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {editable && (
                    <div className="job-preference-add-row">
                        <input
                            type="text"
                            id="jobPreferences"
                            className="profile-input job-preference-input"
                            value={draftTitle}
                            placeholder={canAddMore ? 'Add job title, e.g. Frontend Developer' : 'Maximum preferences added'}
                            onChange={(event) => setDraftTitle(event.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!canAddMore}
                            maxLength={MAX_JOB_PREFERENCE_TITLE_LENGTH}
                        />
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={addPreference}
                            disabled={!canAddMore}
                            title="Add job preference"
                        >
                            <FaPlusCircle /> Add
                        </button>
                    </div>
                )}
            </div>
            <span className="error-massage">{error || ""}</span>
        </div>
    )
}

function Links({candidate_id,editable}){
    const [urlList,setUrlList] = useState([])
    const {notify} = useNotification('')
    useEffect(()=>{
        async function fetchUrls() {
            if(!candidate_id) return
            try {
                const resp = await api.get(`/candidate/link`)
                if(resp.status === 200){
                    setUrlList(resp.data)
                }
            } catch(error) {
                console.error("Failed to fetch links:", error)
            }
        }
        fetchUrls()
    }  ,[candidate_id])
    function handleUrlChange(e){
        const {id,name, value} = e.target
        // console.log(`${id} = ${value}`);
        
        const updatedUrlList = urlList.map((urlObj, index) => 
            index === parseInt(id) 
                ? { ...urlObj, [name]: value }
                : urlObj
        )
        
        setUrlList(updatedUrlList)
    }   
    async function updateUrl(idx){
        try {
            const payload = urlList[idx]
            const resp = await api.put('candidate/link',payload)
            if(resp.status == 200){
                notify('success', "Url Updated Successfully")
            }
        } catch (error) {
            notify('error', 'Failed to update URL')
        }
    }
    async function addUrl(){
        if(urlList.length >= 4){
            notify('error', 'Maximum 3 URLs allowed')
            return
        }
        try {
            const newUrl = { link_url: '' }
            const resp = await api.post(`candidate/link`, newUrl)
            if(resp.status === 200 || resp.status === 201){
                setUrlList([...urlList, resp.data])
                notify('success', 'New URL added')
            }
        } catch (error) {
            notify('error', 'Failed to add URL')
            console.error(error)
        }
    }
    async function deleteUrl(idx){
        try {
            const urlId = urlList[idx].link_id
            const resp = await api.delete(`candidate/link/${urlId}`)
            if(resp.status === 200){
                setUrlList(urlList.filter((_, index) => index !== idx))
                notify('success', 'URL deleted')
            }
        } catch (error) {
            notify('error', 'Failed to delete URL')
            console.error(error)
        }
    }
    
    return(
        <>
            {urlList.map((urlObj, index)=>(
                <div className="form-group small-group" key={index}>
                    <input type="url" name="link_url"  id={index} value={urlObj.link_url} placeholder="Add url" disabled={editable?false:true} className='profile-input' onChange={handleUrlChange}/>
                    <button type="button" className='btn-secondary' disabled={editable?false:true} onClick={() => updateUrl(index)} title="Save URL"><i className='fas fa-check-circle' ></i></button>
                    <button type="button" className='btn-secondary' disabled={editable?false:true} onClick={() => deleteUrl(index)} title="Delete URL"><FaTrashAlt /></button>
                </div>
            ))}
            {
                urlList.length===0
                ?<span className="info-span"><FaInfoCircle /> No Link found</span>
                :""
            }
            {
                editable && urlList.length<3
                    ?<button type="button" className='btn-secondary' onClick={addUrl} title="Add new URL"><FaPlusCircle /> Add Link</button>
                    :""
            }
            <span className="error-massage"></span>
        </>
    )
}

export default function CandidateProfile({candidateObj}) {
    const {notify} = useNotification('')
    let navigate = useNavigate();
    const [IndStates, setIndStates] = useState([])
    const [allCourses, setAllCourses] = useState([])
    const [candidate, setCandidate] = useState(candidateObj) 
    const [updatedInputs, setUpdatedInputs] = useState({})
    const [errors, setErrors] = useState({})
    const genderList = ['Male','Female', 'Other']
    const [editable,setEditable] = useState(false)

    const totalProfileFields = Object.entries(candidateObj || {}).length
    const completedFieldCount = Object.entries(candidate || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false
        if (typeof value === 'string') return value.trim() !== ''
        return true
    }).length
    const completionPercentage = totalProfileFields
        ? Math.round((completedFieldCount / totalProfileFields) * 100)
        : 0

    const selectedCourse = allCourses.find(
        (courseObj) => String(courseObj.course_id) === String(candidate.course_id)
    ) || candidate.courseObj || {}
    const availableBranches = selectedCourse.branches || []
    async function fetchAllCourses() {
        const resp = await api.get('/courses')
        setAllCourses(resp.data)
    }   

    useEffect(()=>{
        const indian_states = [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
            "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu","Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
        ]
        setIndStates(indian_states)
        setCandidate(candidateObj)
        setUpdatedInputs({})
        setErrors({})
    },[candidateObj])

    useEffect(()=>{
        function handleEditing(){
            const profileInput = document.querySelectorAll(".profile-input")
            
            profileInput.forEach(input => {
                if(editable===false){
                    input.disabled = true;
                }
                else{
                    input.disabled = false;
                }
            });
            console.log('Editable = ', editable)
        }
        handleEditing();
    },[editable])

   
    async function handleProfileUpdate(e) {
        const {name, type, value, checked } = e.target
        const fieldValue = type === 'checkbox' ? checked : value
        console.log(`${name} ${fieldValue}`);
        if (name === 'course_id') {
            const nextCourse = allCourses.find(
                (courseObj) => String(courseObj.course_id) === String(fieldValue)
            )
            const nextBranches = nextCourse?.branches || []
            const nextBranch = nextBranches[0] || {}

            setCandidate(prev => ({
                ...prev,
                course_id: fieldValue,
                courseObj: nextCourse || {},
                branch_id: nextBranch.branch_id || '',
                branchObj: nextBranch
            }))
            setUpdatedInputs(prev =>({
                ...prev,
                course_id: fieldValue,
                branch_id: nextBranch.branch_id || ''
            }))
            return
        }

        if (name === 'branch_id') {
            const nextBranch = availableBranches.find(
                (branchObj) => String(branchObj.branch_id) === String(fieldValue)
            )
            setCandidate(prev => ({
                ...prev,
                branch_id: fieldValue,
                branchObj: nextBranch || {}
            }))
            setUpdatedInputs(prev =>({
                ...prev,
                branch_id: fieldValue
            }))
            return
        }

        setCandidate(prev=>({
            ...prev,
            [name]: fieldValue
        }))
        setUpdatedInputs(prev =>({
            ...prev,
            [name]: fieldValue
        }))
    }

    async function handleSubmit(){
        if(Object.keys(updatedInputs).length === 0){
            notify('info', 'No change Detected')
        }
        else if(Object.hasOwn(updatedInputs, 'email')){
            setErrors({'email' : "Email cannot be changed"})
        }else{
            try{
                const resp = await api.put("/profile", updatedInputs)
                if(resp.status === 200){
                    notify('success',"Profile Updated Successfully")
                }else{
                    notify('error',resp.data.detail)
                    setCandidate(candidateObj)
                }
            }catch(error){
                const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || "Unknown error occurred";
                notify("error", `Something went wrong - ${errorMessage}`);
                setCandidate(candidateObj)
            }
        }
        setEditable(false)
    }
    const handleLogout = async () => {
        try {
            const response = await api.post('/logout');
            if (response.status === 200) {
                notify('info', 'Log Out Suceess');
                navigate('/')
            } else {
                notify('error', response.data?.detail);
            }
        } catch (error) {
            notify('error', error.response?.data?.detail);
        }
    };
    async function removeJoinedUr() {
        try {
            const response = await api.delete('/candidate/joined-university');
            if (response.status === 200) {
                notify('success', 'You are removed from univeristy group');
            } else {
                notify('error', response.data?.detail);
            }
        } catch (error) {
            notify('error', error.response?.data?.detail);
        }
    }
    return(
        <>
            <div className="profile-container">
                <div className="profile-header-modern">
                    <div className="avatar-wrapper">
                       {candidate.avatar
                            ?<div className="avatar">
                                <img 
                                src={candidate.avatar} 
                                alt="Profile" 
                                className="profile-img-modern"
                                />
                            </div>
                            :<div className="avatar-alt">
                                <FaUserGraduate className="profile-img-modern" />
                            </div>
                        }
                        <div className="role-badge-wrapper">
                            <span className="role-badge">Student</span>
                        </div>
                    </div>

                    <div className="profile-info-modern">
                        <div className="info-row-primary">
                            <div className="name-role-group">
                                <input
                                    id="profileName"
                                    name="name"
                                    onChange={handleProfileUpdate}
                                    type="text"
                                    className={`profile-name-input ${!editable ? 'readonly-mode' : ''}`}
                                    value={candidate.name ? candidate.name : ""}
                                    placeholder="Your full name here"
                                    readOnly={!editable}
                                    disabled={!editable}
                                />
                                
                            </div>
                            <div className="action-buttons-group-profile">
                                {!editable ? (
                                <button className="btn-outline-modern" onClick={() => setEditable(true)}>
                                    <FaUserEdit /> Edit Profile
                                </button>
                                ) : (
                                <button className="btn-primary-modern" onClick={handleSubmit}>
                                    <FaRegSave /> Save Changes
                                </button>
                                )}
                                {editable && (
                                <button className="btn-outline-modern" onClick={() => setEditable(false)}>
                                    <FaTimesCircle /> Cancel
                                </button>
                                )}
                                <button className="btn-logout-modern" onClick={handleLogout}>
                                    <FaSignOutAlt /> Log Out
                                </button>
                            </div>
                        </div>

                        <div className="stats-row-modern">
                            <div className="stat-card-modern">
                                <FaCalendarAlt className="stat-icon" />
                                <div className="stat-info">
                                <span className="stat-label">Joined</span>
                                <strong className="stat-value">{candidate.created_at || '—'}</strong>
                                </div>
                            </div>
                            <div className="stat-card-modern">
                                <FaBriefcase className="stat-icon" />
                                <div className="stat-info">
                                <span className="stat-label">Applications</span>
                                <strong className="stat-value">{candidate.job_application_count || 0}/5</strong>
                                </div>
                            </div>
                        </div>

                        <div className="badges-row-modern">
                            {candidate.is_verified ? (
                                <span className="badge-modern badge-success">
                                <FaCheckDouble /> Verified
                                </span>
                            ) : (
                                <span className="badge-modern badge-danger">
                                <FaTimesCircle /> Not Verified
                                </span>
                            )}
                            {candidate.is_active ? (
                                <span className="badge-modern badge-active">
                                <FaCheckCircle /> Active Profile
                                </span>
                            ) : (
                                <span className="badge-modern badge-inactive">
                                <FaInfoCircle /> Inactive
                                </span>
                            )}
                        </div>
                        <div className="profile-completion-card">
                            <div className="profile-completion-header">
                                <span className="profile-completion-label">Profile Completion</span>
                                <span className="profile-completion-meta">
                                    {completedFieldCount} of {totalProfileFields} fields completed
                                </span>
                                <strong className="profile-completion-value">{completionPercentage}%</strong>
                            </div>
                            <input
                                type="range"
                                className="profile-completion-range"
                                max={totalProfileFields}
                                readOnly
                                disabled
                                value={completedFieldCount}
                                style={{
                                    background: `linear-gradient(90deg, #2563eb 0%, #0ea5e9 ${completionPercentage}%, #dbeafe ${completionPercentage}%, #dbeafe 100%)`
                                }}
                            />
                           
                        </div>
                    </div>
                </div>
                <div className="profile-grid">
                    <div className="partition" id="partition-1">
                        <div className='partition-box' id="contact-info">
                            <h3>Contact Info</h3>
                            <div className="form-group">
                                <label htmlFor="email"><FaEnvelope /> Email Address <small>(readonly)</small></label>
                                <input id="email" type='email' readOnly disabled value={candidate.email} placeholder='Your Email' />
                                <span className="error-massage">{errors.email || ""}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><FaLock /> Password <small>(readonly)</small></label>
                                <input id="password" type="password" readOnly className='profile-input' value={candidate.password} />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact"><FaPhone /> Mobile Number</label>
                                <input id="contact" type='text' name='contact' className='profile-input' value={candidate.contact?candidate.contact:""} placeholder='Add Mobile number' onChange={handleProfileUpdate} />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                        <div className='partition-box' id="academics">
                            <h3>Academics</h3>
                            <div className="form-group">
                                <label htmlFor="university"><FaUniversity /> University</label>
                                <input id="university" type='text' name='university_name' readOnly={candidate.joined_ur_name?true:false} disabled={candidate.joined_ur_name?true:false} className='profile-input' value={candidate.university_name?candidate.university_name:""} placeholder='Add university name' onChange={handleProfileUpdate} />
                                {candidate.joined_ur_name?<small>You have joined the University, can't be changed</small>:null}
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="course"><FaBook /> Course</label>
                                <select id="course" className='profile-input' name='course_id' onChange={handleProfileUpdate} value={candidate.course_id || ''} onClick={fetchAllCourses}>
                                    {!editable
                                        ?candidate.courseObj?.course_id
                                            ?<option value={candidate.courseObj.course_id}>{candidate.courseObj.course_title}</option>
                                            :<option value="">Select Course</option>
                                        :(
                                            <>
                                               <option value="" disabled>{candidate.courseObj?.course_title || 'Select Course'}</option>
                                               {
                                                allCourses.map((courseObj,index)=>(
                                                    <option key={index} value={courseObj.course_id} style={{color:'black'}}>{courseObj.course_title}</option>
                                                ))
                                               }
                                            </>
                                        )
                                    }
                                </select>
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="branch"><FaGraduationCap /> Branch</label>
                                <select id="branch" name='branch_id' onChange={handleProfileUpdate} className='profile-input' value={candidate.branch_id || ''}>
                                    {!editable
                                        ?candidate.branchObj?.branch_id
                                            ?<option value={candidate.branchObj.branch_id||""}>{candidate.branchObj.branch_title}</option>
                                            :<option value="">Select Branch</option>
                                        :(
                                            <>
                                                <option value="" disabled>{candidate.branchObj?.branch_title || 'Select Branch'}</option>
                                               {
                                                availableBranches.map((branchObj, index)=>(
                                                    <option key={index} value={branchObj.branch_id} style={{color:'black'}}>{branchObj.branch_title}</option>
                                                ))
                                               }
                                            </>
                                        )
                                    }
                                </select>
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="marksheet"><FaFileAlt /> Marksheet</label>
                                {
                                    candidate.last_marksheet
                                    ?<img src={candidate.last_marksheet ?? ""} alt="Marksheet-img" />
                                    :<>
                                        <input type="file" name="last_marksheet" className="profile-input" disabled={editable?false:true} id="marksheet" accept='.jpeg, .png, .jpg,' onChange={handleProfileUpdate}/> 
                                        <small>Be Eligible by uploading last Marksheet</small>
                                    </>                                  
                                }
                                <span className="error-massage"></span>
                            </div>
                        </div>
                        <div className='partition-box' id="preferences">
                            <h3>Preferences</h3>
                            <JobPreferences
                                candidate_id={candidateObj.candidate_id}
                                editable={editable}
                            />
                            <div className="form-group">
                                <label htmlFor="salaryPreferences"><FaMoneyBillWave /> Salary Preference</label>
                                <input id="salaryPreferences" type="number" name='salary_preference' className='profile-input' value={candidate.salary_preference?candidate.salary_preference:""} placeholder='Add Salary Preferences' onChange={handleProfileUpdate} />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                    </div>
                    <div className="partition" id="partition-2">
                        <div className='partition-box' id="about">
                            <h3>About Me</h3>
                            <div className="form-group">
                                <label htmlFor="dob"><FaCalendar />Date of Birth</label>
                                <input type="date" name="date_of_birth" id="dob" value={candidate.date_of_birth || ""} onChange={handleProfileUpdate} className='profile-input'/>
                            </div>
                            <div className="form-group small-group">
                                <label htmlFor="gender"><FaUserAlt /> Gender</label>
                                {genderList.map((g, index) => {
                                    const inputId = `gender-${index}`;

                                    return (
                                        <div className="small-group" key={g}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                id={inputId}
                                                value={g}
                                                className='profile-input'
                                                checked={candidate.gender === g}
                                                onChange={handleProfileUpdate}
                                                disabled={!editable}
                                            />
                                            <label htmlFor={inputId}>{g}</label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="form-group">
                                <label htmlFor="aboutMe"><FaBook /> Your Bio</label>
                                <textarea id="aboutMe" className='profile-input' name='about' value={candidate.about?candidate.about:""} rows={7} placeholder='Write your bio' onChange={handleProfileUpdate} ></textarea>
                                <span className="error-massage"></span>
                            </div>
                        </div>
                         <div className='partition-box' id="Full address">
                           <h3>Complete Address</h3>
                           <div className="form-group">
                                <label htmlFor="address"><FaMapMarked /> Address</label>
                                <input id="address" type='text' name='address' className='profile-input' value={candidate.address?candidate.address:""} placeholder='Add Your Building Name or street' onChange={handleProfileUpdate} />
                                <span className="error-massage" ></span>
                           </div>
                           <div className="form-group">
                                <label htmlFor="city"><FaCity /> City</label>
                                <input id="city" type='text' name='city' className='profile-input' value={candidate.city?candidate.city:""} placeholder='Enter City' onChange={handleProfileUpdate}/>
                                <span className="error-massage"></span>
                           </div>
                           <div className="form-group">
                                <label htmlFor="state"><FaSearchLocation /> State</label>
                                <select id="state" name='state' className='profile-input' value={candidate.state || ''} onChange={handleProfileUpdate} >
                                    {!editable ? (
                                        candidate.state
                                            ? <option value={candidate.state}>{candidate.state}</option>
                                            : <option value="" disabled hidden>Select state</option>
                                    ) : (
                                        <>
                                            <option value="" disabled>{candidate.state ? candidate.state : 'Select a state'}</option>
                                            {IndStates.map((stateItem, index) => (
                                                <option key={index + 1} value={stateItem} style={{ color: 'black' }}>
                                                    {index + 1}. {stateItem}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                <span className="error-massage"></span>
                           </div>
                           <div className="form-group">
                                <label htmlFor="pincode"><FaMapMarkerAlt /> Pincode</label>
                                <input id="pincode" type='number' name='pincode' className='profile-input' value={candidate.pincode?candidate.pincode:""} placeholder='Add your Pincode' onChange={handleProfileUpdate} />
                                <span className="error-massage"></span>
                           </div>
                           <div className="form-group small-group">
                                <label htmlFor="hostel_required"><FaHotel /> Do you need hostel or stay: </label>
                                <input 
                                    type="checkbox" 
                                    name="hostel_required" 
                                    id="hostel_required" 
                                    className='profile-input' 
                                    checked={candidate.hostel_required || false}
                                    onChange={handleProfileUpdate}
                                    disabled={!editable}
                                />
                           </div>
                        </div>
                        <div className='partition-box' id="Links">
                            <h3>Links</h3>
                            <Links candidate_id={candidateObj.candidate_id} editable={editable}/>
                        </div>
                        <div className='partition-box' id="Actions">
                            <h3>Actions</h3>       
                            {candidate.joined_ur_name
                                ?<div className="form-group">
                                    <button type="button" className="btn-primary" onClick={removeJoinedUr}><FaTrashAlt /> Remove University collaboration</button>
                                </div>
                                :<div className="form-group">
                                    <label><FaHashtag /> Join University group using token</label>     
                                    <input type="text" className="profile-input" name="ur_joining_token" placeholder="Put the token shared by your University" onChange={handleProfileUpdate}/>
                                    <span className="error-massage"></span>
                                    
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
