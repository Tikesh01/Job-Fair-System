import './Profile.css'
import {useEffect, useState} from 'react';
import profilePic from "../../assets/login-bro.svg"
import { FaBriefcase, FaCheckCircle, FaCheckDouble, FaInfoCircle, FaTimesCircle, FaEnvelope, FaPhone, FaLock, FaGraduationCap, FaBook, FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaLink, FaFileAlt, FaSearchLocation, FaMap, FaMapPin, FaMapMarked } from "react-icons/fa";
import  api from '../../api/axiosapi';
import {getCookie} from '../../utils/cookies';
import axios from 'axios';


function CandidateProfile({candidate,editable,updateEditable }) {
    const [course, setCourse] = useState({})
    const [branch, setBranch] = useState({})
    const [IndStates, setIndStates] = useState([])
    const [allCourses, setAllCourses] = useState([])

    const course_id = candidate.course_id;
    const branch_id = candidate.branch_id;

    function handleProfileUpdate() {
        
    }
   
    useEffect(() => {
        async function fetchCourse() {
            const resp = await api.get(`/course/${course_id}`)
            setCourse(resp.data)
            
        }
        async function fetchAllCourses() {
            const resp = await api.get('/courses')
            setAllCourses(resp.data)
           
        }   
        async function fetchBranch() {
            const resp = await api.get(`/branch/${branch_id}`)
            setBranch(resp.data)
            console.log(resp.data)
        }
        
        fetchAllCourses()
      
        if(course_id){
            fetchCourse()
        }
        if(branch_id){
            fetchBranch();
        }
    }, [course_id, branch_id]);

    // caliing state api
    useEffect(()=>{
        async function getIndStates() {
            axios.get('https://api.countrystatecity.in/v1/countries/IN/states',{headers:{'X-CSCAPI-KEY':'88a8b331654eb5b636390046631e21fcdeb2668f92107f847be46415f98d5836'}}).then(response => setIndStates(response.data || []))
        }
       
        getIndStates();

    },[setIndStates])
    return(
        <>
            <div className="profile-container">
                <div className="profile-header-bg"></div>
                <div className="profile-header">
                    <img src={profilePic} alt="Profile" className='profile-img'/>
                    <div className="profile-header-content">
                        <div className="profile-header-box">
                           
                            <input id="profileName" name='name' onChange={handleProfileUpdate} type='text' className="profile-input profile-name" value={candidate.name?candidate.name:""} placeholder='Your fullname here' />
                           
                            <p className='profile-role'>Student</p>
                        
                            <div className="profile-header-buttons">
                                {editable===false
                                    ?<button className="btn-secondary" onClick={(e)=>updateEditable(true)}>Edit</button>
                                    :<button className="btn-secondary">Save</button>
                                }
                                &nbsp;&nbsp;
                                {editable===true
                                    ?<button className="btn-secondary" onClick={(e)=>updateEditable(false)}>Cancel</button>
                                    :""
                                }
                                &nbsp;&nbsp;
                                <button className="btn-primary">Log Out</button>
                            </div>
                        </div>
                        <div className="profile-header-box">
                            <div className="profile-stat-card">
                                <span className="stat-label">Joined: </span> 
                                <strong> {candidate.created_at || '—'}</strong>
                            </div>
                            <div className="profile-stat-card">
                                <span className="stat-label">Applications: </span>
                                <strong>{candidate.total_applications}</strong>
                            </div>
                        </div>
                        <div className="profile-header-box">
                            {candidate.is_verified
                                ?<span className='user-status verified'><FaCheckDouble /> Verified</span>
                                :<span className='user-status unverified'><FaTimesCircle /> Unverified</span>}
                            {candidate.is_active
                                ?<span className='user-status verified'><FaCheckCircle/> Active</span>
                                :<span className='user-status unverified'><FaInfoCircle /> Inactive</span>
                            }
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
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact"><FaPhone /> Mobile Number</label>
                                <input id="contact" type='text' name='contact' className='profile-input' value={candidate.contact?candidate.contact:""} placeholder='Add Mobile number' />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><FaLock /> Password</label>
                                <input id="password" type="password" className='profile-input' value={candidate.password} />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                        <div className='partition-box' id="academics">
                            <h3>Academics</h3>
                            <div className="form-group">
                                <label htmlFor="university"><FaUniversity /> University</label>
                                <input id="university" type='text' name='university' className='profile-input' value={candidate.university?candidate.university:""} placeholder='Add university name' />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="course"><FaBook /> Course</label>
                                <select id="course" className='profile-input' name='course_id' value={course.course_title || ''}>
                                    {!editable
                                        ?course
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
                                <select id="branch" name='branch_id' className='profile-input' value={branch.branch_id || ''}>
                                    {!editable
                                        ?branch.branch_id
                                            ?<option value={branch.branch_id}>{branch.branch_title}</option>
                                            :<option value="">Select Branch</option>
                                        :(
                                            <>
                                               <option value={branch.branch_id || ""} disabled >{branch.branch_title || "Select Branch"}</option>
                                               {
                                                course.branches.map((branchObj, index)=>(
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
                                <input id="marksheet" type="image" name='last_marksheet' className='profile-input' src={candidate.last_marksheet} alt="No Marksheet uploaded" />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                        <div className='partition-box' id="preferences">
                            <h3>Preferences</h3>
                            <div className="form-group">
                                <label htmlFor="jobPreferences"><FaBriefcase /> Job Preferences</label>
                                <input id="jobPreferences" type="text" name="job_preferences" className='profile-input' value={candidate.job_preferences?candidate.job_preferences:""} placeholder='Add Role Preferences'/>
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="salaryPreferences"><FaMoneyBillWave /> Salary Preference</label>
                                <input id="salaryPreferences" type="number" name='salary_preference' className='profile-input' value={candidate.salary_preference?candidate.salary_preferences:""} placeholder='Add Salary Preferences' />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                    </div>
                    <div className="partition" id="partition-2">
                        <div className='partition-box' id="about">
                            <h3>About Me</h3>
                            <div className="form-group">
                                <textarea id="aboutMe" className='profile-input' name='about' value={candidate.about?candidate.about:""} rows={7} placeholder='Write your bio'></textarea>
                                <span className="error-massage"></span>
                            </div>
                        </div>
                         <div className='partition-box' id="Full address">
                           <h3>FULL address</h3>
                           <div className="form-group">
                                <label htmlFor="address"><FaMapMarked /> Address</label>
                                <input id="address" type='text' name='address' className='profile-input' value={candidate.address} placeholder='Add Your Building Name or street' />
                                <span className="error-massage"></span>
                           </div>
                           <div className="form-group">
                                <label htmlFor="city"><FaMapMarkerAlt /> City</label>
                                <input id="city" type='text' className='profile-input' value={candidate.city} placeholder='Enter City'/>
                                <span className="error-massage"></span>
                           </div>
                           <div className="form-group">
                                <label htmlFor="state"><FaSearchLocation /> State</label>
                                <select id="state" className='profile-input' value={candidate.state || ''}>
                                    {!editable ? (
                                        candidate.state
                                            ? <option value={candidate.state}>{candidate.state}</option>
                                            : <option value="" disabled hidden>Select state</option>
                                    ) : (
                                        <>
                                            <option value="" disabled>{candidate.state ? candidate.state : 'Select a state'}</option>
                                            {IndStates.map((stateItem, index) => (
                                                <option key={index + 1} value={stateItem.name} style={{ color: 'black' }}>
                                                    {index + 1}. {stateItem.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                <span className="error-massage"></span>
                           </div>
                           <div className="form-group">
                                <label htmlFor="pincode"><FaMapMarkerAlt /> Pincode</label>
                                <input id="pincode" type='number' className='profile-input' value={candidate.pincode} placeholder='Add your Pincode' />
                                <span className="error-massage"></span>
                           </div>
                        </div>
                        <div className='partition-box' id="Full address">
                           <h3>Links</h3>
                           <div className="form-group">
                               <label><FaLink /> External Links</label>
                               <span className="error-massage"></span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function Profile(){
    const [user, setUser] = useState({})
    const role = getCookie('role')
    const [editable,setEditable] = useState(false)
    // useEffect - it does not stuck in infinite loop, works on dependency
    useEffect(()=>{
        function handleEditing(){
            const profileInput = document.querySelectorAll(".profile-input")
            console.log(editable);
            
            profileInput.forEach(input => {
                if(editable===false){
                    input.disabled = true;
                }
                else{
                    input.disabled = false;
                }
            });
        }
        handleEditing();
    },[editable, setEditable])
    useEffect(()=>{
        async function fetchUser(){
            try{
                const response = await api.get('/user/detail')
                const userData = response?.data
                setUser(userData)
                
            }
            catch(error){
                notify(error.response?.data?.detail)
            }
        }
        fetchUser()
    },[])

    if(role==='candidate'){
        return <CandidateProfile candidate={user} editable={editable} updateEditable={setEditable} />
        
    }else if(role==='company'){

    }
    else if(role==='university'){
        
    }
}
