import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaCheckDouble, FaInfoCircle, FaTimesCircle, FaCalendarAlt, FaEnvelope, FaPhone,FaLock,FaBook, FaCodeBranch, FaCodepen, FaMapMarked, FaMapMarkerAlt, FaSearchLocation, FaUserEdit, FaCross, FaSave, FaRegSave, FaSignOutAlt, FaUserTie, FaBuilding, FaRegBuilding} from "react-icons/fa";
import api from '../../api/axiosapi';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function CompanyProfile({companyObj}){
    const {notify} = useNotification('')
    const  navigate = useNavigate('')
    const [company, setCompany] = useState(companyObj)
    const [errors, setErrors] = useState({})
    const [editable,setEditable] = useState(false)
    const [companyTypeList, setCompanyTypeList] = useState([])
    const [updatedInputs, setUpdatedInputs] = useState({})
    const [IndStates, setIndStates] = useState([])


    const comp_types = ['IT/Tech','Banking','Consulting','Consumer Goods','Construction','Education','Energy','Engineering','Entertainment','Finance',
        'Food&Beverage','Government','Healthcare','Hospitality','Insurance','Logistics','Manufacturing','Media','Non-profit','RealEstate','Retail','Startup','Telecom','Transportation','Other']
    const indian_states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu","Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ]
    useEffect(()=>{
        function handleEditing(){
            const profileInput = document.querySelectorAll(".profile-input")
            
            profileInput.forEach(input => {
               input.disabled = !editable
            });
            console.log('Editable = ', editable)
        }
        handleEditing();
        setIndStates(indian_states)
        setCompanyTypeList(comp_types)
    },[editable])

    useEffect(()=>{
        setCompany(companyObj)
    },[companyObj])

    async function handleProfileUpdate(e) {
        const {name, type, value, checked } = e.target
        const fieldValue = type === 'checkbox' ? checked : value
        console.log(`${name} ${fieldValue}`);
        setCompany(prev=>({
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

    const handleLogoutCompany = async () => {
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
                        {company.avatar
                            ?<div className="avatar">
                                <img 
                                src={company.avatar} 
                                alt="Profile" 
                                className="profile-img-modern"
                                />
                            </div>
                            :<div className="avatar-alt">
                                <FaRegBuilding className="profile-img-modern" />
                            </div>
                        }
                        <div className="avatar-status-badge">
                        {company.is_active ? '🟢' : '⚫'}
                        </div>
                        
                        <div className="role-badge-wrapper">
                            <span className="role-badge">Company</span>
                        </div>
                    </div>

                    <div className="profile-info-modern">
                        <div className="info-row-primary">
                            <div className="name-role-group">
                                <input onChange={handleProfileUpdate}
                                    id="profileName"
                                    name="name"
                                    
                                    type="text"
                                    className={`profile-name-input ${!editable ? 'readonly-mode' : ''}`}
                                    value={company.name ? company.name : ""}
                                    placeholder="Company name here"
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
                                    <FaRegSave/> Save Changes
                                </button>
                                )}
                                {editable && (
                                <button className="btn-outline-modern" onClick={() => setEditable(false)}>
                                   <FaTimesCircle /> Cancel
                                </button>
                                )}
                                <button className="btn-logout-modern" onClick={handleLogoutCompany}>
                                    <FaSignOutAlt /> Log Out
                                </button>
                            </div>
                        </div>

                        <div className="stats-row-modern">
                            <div className="stat-card-modern">
                                <FaCalendarAlt className="stat-icon" />
                                <div className="stat-info">
                                <span className="stat-label">Joined</span>
                                <strong className="stat-value">{company.created_at || '—'}</strong>
                                </div>
                            </div>
                            <div className="stat-card-modern">
                                <FaBriefcase className="stat-icon" />
                                <div className="stat-info">
                                <span className="stat-label">Applications</span>
                                <strong className="stat-value">{company.job_application_count || 0}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="badges-row-modern">
                            {company.is_verified ? (
                                <span className="badge-modern badge-success">
                                <FaCheckDouble /> Verified Profile
                                </span>
                            ) : (
                                <span className="badge-modern badge-danger">
                                <FaTimesCircle /> Not Verified
                                </span>
                            )}
                            {company.is_active ? (
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
                    <div className="partition" id='partition-1'>
                        <div className="partition-box">
                            <h3>Account detail</h3>
                            <div className="form-group">
                                <label htmlFor="email"><FaEnvelope /> Email Address <small>(readonly)</small></label>
                                <input id="email" type='email' readOnly disabled value={company.email} placeholder='Your Email' />
                                <span className="error-massage">{errors.email || ""}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><FaCodepen /> GSTIN <small>(readonly)</small></label>
                                <input id="GSTN" type='text' readOnly disabled value={company.company_gstin || ''} placeholder='Company GSTIN number' />
                                <span className="error-massage">{}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><FaLock /> Password <small>(readonly)</small></label>
                                <input id="password" type="password" readOnly className='profile-input' value={company.password} />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact"><FaPhone /> Mobile Number</label>
                                <input onChange={handleProfileUpdate} id="contact" type='text' name='contact' className='profile-input' value={company.contact?company.contact:""} placeholder='Add Mobile number'  />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                         <div className="partition-box">
                            <h3>Industry Type</h3>
                            <div className="form-group">
                                <select onChange={handleProfileUpdate} name="company_type" className='profile-input' value={company.company_type|| ''}>
                                    {
                                        !editable
                                            ?<option value={company.company_type || "" }>{company.company_type || "Select Company Type"}</option>
                                            
                                            :companyTypeList.map(type=>(
                                                <option value={type}>{type}</option>
                                            ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="partition-box">
                            <h3>Document</h3>
                        </div>
                    </div>
                    <div className="partition" id='partition-2'>
                        <div className="partition-box">
                            <h3>About Company</h3>
                            <div className="form-group">
                                <label htmlFor="aboutMe"><FaBook /> About</label>
                                <textarea onChange={handleProfileUpdate} id="aboutMe" className='profile-input' name='about' value={company.about || ""} rows={7} placeholder='Write About company'  ></textarea>
                                <span className="error-massage"></span>
                            </div>
                        </div>

                       
                        <div className='partition-box' id="Full address">
                            <h3>Complete Address</h3>
                            <div className="form-group">
                                <label htmlFor="address"><FaMapMarked /> Address</label>
                                <input onChange={handleProfileUpdate} id="address" type='text' name='address' className='profile-input' value={company.address?company.address:""} placeholder='Add Your Building Name or street'  />
                                <span className="error-massage" ></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city"><FaMapMarkerAlt /> City</label>
                                <input onChange={handleProfileUpdate} id="city" type='text' name='city' className='profile-input' value={company.city?company.city:""} placeholder='Enter City' />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="state"><FaSearchLocation /> State</label>
                                <select onChange={handleProfileUpdate} id="state" name='state' className='profile-input' value={company.state || ''}  >
                                    {!editable 
                                        ? <option value={company.state}>{company.state}</option>
                                        : <>
                                            <option value="" disabled>{company.state ? company.state : 'Select a state'}</option>
                                            {IndStates.map((stateItem, index) => (
                                                <option key={index + 1} value={stateItem} style={{ color: 'black' }}>
                                                    {index + 1}. {stateItem}
                                                </option>
                                            ))}
                                        </>
                                    }
                                        
                                </select>
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pincode"><FaMapMarkerAlt /> Pincode</label>
                                <input onChange={handleProfileUpdate} id="pincode" type='number' name='pincode' className='profile-input' value={company.pincode?company.pincode:""} placeholder='Add your Pincode'  />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
