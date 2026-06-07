import './Profile.css'
import './Profile_header.css'
import {useEffect, useState} from 'react';
import  api from '../../api/axiosapi';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import CompanyProfile  from './CompanyProfile';
import CandidateProfile from './CandidateProfile';
import UniversityProfile from './UniversityProfile'

/*
    1. name prop in input field should be same as the column it is representing 
 
*/

export default function Profile(){
    const [user, setUser] = useState({})
    const [role, setRole] = useState('')
    const {notify} = useNotification('')
    const navigate = useNavigate()

    useEffect(()=>{
        async function fetchUser(){
            try{
                const response = await api.get('/profile')
                const userData = response?.data
                setUser(userData)
                setRole(userData['role'])
                
            }
            catch(error){
                const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || "Unknown error occurred";
                notify("error", `Something went wrong - ${errorMessage}`);
            }
        }
        fetchUser()
    },[])

    if(role==='candidate'){
        return <CandidateProfile candidateObj={user} />
        
    }else if(role==='company'){
        return <CompanyProfile companyObj={user} />
    }
    else if(role==='university'){
        return <UniversityProfile urstObj={user} />
    }
}
