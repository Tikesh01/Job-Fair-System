import { useNotification } from "../../contexts/NotificationContext"
import { useState, useEffect } from "react"
import profilePic from '../../assets/mobile-login-animate.svg'
import { FaBriefcase, FaCheckCircle, FaCheckDouble, FaInfoCircle, FaTimesCircle, FaEnvelope, FaPhone, FaLock, FaGraduationCap, FaBook, FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaFileAlt, FaMapMarked, FaSearchLocation, FaCalendarAlt, FaTrashAlt, FaPlusCircle, FaCalendar, FaUserAlt, FaHotel, FaUserEdit, FaRegSave, FaSignOutAlt, FaUserTie, FaCity } from "react-icons/fa";
import api from "../../api/axiosapi";
import { useNavigate } from "react-router-dom";

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
            const resp = await api.post(`candidate/link/`, newUrl)
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
    const [course, setCourse] = useState({})
    const [branch, setBranch] = useState({})
    const [IndStates, setIndStates] = useState([])
    const [allCourses, setAllCourses] = useState([])
    const [candidate, setCandidate] = useState(candidateObj) 
    const [updatedInputs, setUpdatedInputs] = useState({})
    const [errors, setErrors] = useState({})
    const course_id = candidate.course_id;
    const branch_id = candidate.branch_id;
    const genderList = ['Male','Female', 'Other']
    const [editable,setEditable] = useState(false)

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
                }
            }catch(error){
                const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || "Unknown error occurred";
                notify("error", `Something went wrong - ${errorMessage}`);
            }
        }
        setEditable(false)
    }
    async function fetchCourseById(courseId){
        const resp = await api.get(`/course/${courseId}`)
        return resp.data || {}
    }
    useEffect(() => {
        async function fetchCourse() {
            const courseObj = await fetchCourseById(course_id)
            // console.log(courseObj)
            setCourse(courseObj)
        }
        async function fetchAllCourses() {
            const resp = await api.get('/courses')
            setAllCourses(resp.data)
           
        }   
        async function fetchBranch() {
            const resp = await api.get(`/branch/${branch_id}`)
            if(resp.status === 400){
                notify(resp.data.detail)
            }
            setBranch(resp.data)
        }
       
        
        fetchAllCourses()
        if(course_id){
            fetchCourse()
        }
        if(branch_id){
            fetchBranch();
        }
    }, [course_id, branch_id]);
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
                                <FaUserTie className="profile-img-modern" />
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
                                <strong className="stat-value">{candidate.job_application_count}/5</strong>
                                </div>
                            </div>
                        </div>

                        <div className="badges-row-modern">
                            {candidate.is_eligible ? (
                                <span className="badge-modern badge-success">
                                <FaCheckDouble /> Eligibilty Confirmed
                                </span>
                            ) : (
                                <span className="badge-modern badge-danger">
                                <FaTimesCircle /> Not Eligible
                                </span>
                            )}
                            {candidate.is_verfied?<span className="badge-modern badge-danger">Verified</span>:null}
                            {candidate.is_active ? (
                                <span className="badge-modern badge-active">
                                <FaCheckCircle /> Active Account
                                </span>
                            ) : (
                                <span className="badge-modern badge-inactive">
                                <FaInfoCircle /> Inactive
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="profile-grid">
                    <div className="partition" id="partition-1">
                        <div className='partition-box' id="contact-info">
                            <h3>Contact Info</h3>
                            <div className="form-group">
                                <label htmlFor="email"><FaEnvelope /> Email Address</label>
                                <input id="email" type='email' readOnly disabled value={candidate.email} placeholder='Your Email' />
                                <span className="error-massage">{errors.email || ""}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact"><FaPhone /> Mobile Number</label>
                                <input id="contact" type='text' name='contact' className='profile-input' value={candidate.contact?candidate.contact:""} placeholder='Add Mobile number' onChange={handleProfileUpdate} />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><FaLock /> Password</label>
                                <input id="password" type="password" readOnly className='profile-input' value={candidate.password} />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                        <div className='partition-box' id="academics">
                            <h3>Academics</h3>
                            <div className="form-group">
                                <label htmlFor="university"><FaUniversity /> University</label>
                                <input id="university" type='text' name='university_name' className='profile-input' value={candidate.university_name?candidate.university_name:""} placeholder='Add university name' onChange={handleProfileUpdate} />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="course"><FaBook /> Course</label>
                                <select id="course" className='profile-input' name='course_id' onChange={handleProfileUpdate} value={candidate.course_id || ''}>
                                    {!editable
                                        ?course && course_id
                                            ?<option value={course.course_id}>{course.course_title}</option>
                                            :<option value="">Select Course</option>
                                        :(
                                            <>
                                               <option value={course.course_id} disabled >{course.course_title}</option>
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
                                <select id="branch" name='branch_id' onChange={handleProfileUpdate} className='profile-input' value={branch.branch_id || ''}>
                                    {!editable
                                        ?branch.branch_id
                                            ?<option value={branch.branch_id||""}>{branch.branch_title}</option>
                                            :<option value="">Select Branch</option>
                                        :(
                                            <>
                                               {
                                                course.branches && course.branches.map((branchObj, index)=>(
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
                            <div className="form-group">
                                <label htmlFor="jobPreferences"><FaBriefcase /> Job Preference</label>
                                <input type='text' id="jobPreferences" rows={5} type="text" name="job_preference" className='profile-input' value={candidate.job_preference?candidate.job_preference:""} placeholder='Add Role Preferences' onChange={handleProfileUpdate} />
                                <span className="error-massage"></span>
                            </div>
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
                                {!candidate.gender && !editable ? (
                                    <span className="error-massage">Gender not added</span>
                                ) : null}
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
                           <div className="form-group">
                               <label><i className="fas fa-trash-alt"></i> Delete Account</label>
                               <span className="error-massage"></span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}