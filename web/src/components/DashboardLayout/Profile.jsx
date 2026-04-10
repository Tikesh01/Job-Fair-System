import './Profile.css'
import profilePic from "../../assets/login-bro.svg"

export default function Profile(){

    return(
        <>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={profilePic} alt="" className='profile-img'/>
                    <div className="profile-header-content">
                        <h2 className="name">Your Full Name</h2>
                    </div>
                </div>
                <div className="profile-grid">
                    <div className="partition" id="partition-1"></div>
                    <div className="partition" id="partition-2"></div>
                </div>
           </div>
        </>
    )
}