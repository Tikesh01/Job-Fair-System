import { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaCheckDouble,
    FaEnvelope,
    FaInfoCircle,
    FaLock,
    FaMapMarked,
    FaMapMarkerAlt,
    FaPhone,
    FaRegSave,
    FaSearchLocation,
    FaSignOutAlt,
    FaTimesCircle,
    FaUniversity,
    FaUserEdit,
    FaUserTie,
    FaCity,
    FaHashtag,
    FaCopy,
    FaUserFriends,
    FaStackExchange,
    FaRedoAlt
} from "react-icons/fa";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosapi";

export default function UniversityProfile({ urstObj }) {
    const [university, setUniversity] = useState(urstObj || {});
    const { notify } = useNotification("");
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);
    const [updatedInputs, setUpdatedInputs] = useState({});
    const [indStates, setIndStates] = useState([]);

    useEffect(() => {
        const indianStates = [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
            "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
            "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
            "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
        ];
        setIndStates(indianStates);
    }, []);

    async function copyToken() {
        const token = university.student_joining_token;

        if (!token) {
            notify("info", "No token available to copy");
            return;
        }

        try {
            await navigator.clipboard.writeText(token);
            notify("success", "Token copied successfully");
        } catch (error) {
            notify("error", "Failed to copy token");
        }
    }

    async function createToken() {
        try {
            if(window.confirm("Do You want change the Student Joing Code!")){
                const resp = await api.get("/university/student-token");
                const token = resp.data?.student_joining_token;

                if (resp.status === 200 && token) {
                    setUniversity((prev) => ({
                        ...prev,
                        student_joining_token: token
                    }));
                    notify("success", "Student joining token updated");
                } else {
                    notify("error", resp.data?.detail || "Failed to generate token");
                }
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unknown error occurred";
            notify("error", `Failed to generate token - ${errorMessage}`);
        }
    }

    useEffect(() => {
        function handleEditing() {
            const profileInput = document.querySelectorAll(".profile-input");

            profileInput.forEach((input) => {
                input.disabled = !editable;
            });
        }

        handleEditing();
    }, [editable]);

    useEffect(() => {
        setUniversity(urstObj || {});
        setUpdatedInputs({});
        setErrors({});
    }, [urstObj]);

    function handleProfileUpdate(e) {
        const { name, type, value, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setUniversity((prev) => ({
            ...prev,
            [name]: fieldValue
        }));

        setUpdatedInputs((prev) => ({
            ...prev,
            [name]: fieldValue
        }));
    }

    async function handleSubmit() {
        if (Object.keys(updatedInputs).length === 0) {
            notify("info", "No change Detected");
            setEditable(false);
            return;
        }

        if (Object.hasOwn(updatedInputs, "email")) {
            setErrors({ email: "Email cannot be changed" });
            setEditable(false);
            return;
        }

        try {
            const resp = await api.put("/profile", updatedInputs);
            if (resp.status === 200) {
                notify("success", "Profile Updated Successfully");
            } else {
                notify("error", resp.data.detail);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unknown error occurred";
            notify("error", `Something went wrong - ${errorMessage}`);
        }

        setEditable(false);
    }

    const handleLogout = async () => {
        try {
            const response = await api.post("/logout");
            if (response.status === 200) {
                notify("info", "Log Out Suceess");
                navigate("/");
            } else {
                notify("error", response.data?.detail);
            }
        } catch (error) {
            notify("error", error.response?.data?.detail);
        }
    };

    return (
        <>
            <div className="profile-container">
                <div className="profile-header-modern">
                    <div className="avatar-wrapper">
                        {university.avatar ? (
                            <div className="avatar">
                                <img
                                    src={university.avatar}
                                    alt="Profile"
                                    className="profile-img-modern"
                                />
                            </div>
                        ) : (
                            <div className="avatar-alt">
                                <FaUniversity className="profile-img-modern" />
                            </div>
                        )}
                        <div className="role-badge-wrapper">
                            <span className="role-badge">University</span>
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
                                    className={`profile-name-input ${!editable ? "readonly-mode" : ""}`}
                                    value={university.name || ""}
                                    placeholder="University name here"
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
                                    <button
                                        className="btn-outline-modern"
                                        onClick={() => {
                                            setUniversity(urstObj || {});
                                            setUpdatedInputs({});
                                            setErrors({});
                                            setEditable(false);
                                        }}
                                    >
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
                                    <strong className="stat-value">{university.created_at || "-"}</strong>
                                </div>
                            </div>
                            <div className="stat-card-modern">
                                <FaUserTie className="stat-icon" />
                                <div className="stat-info">
                                    <span className="stat-label">Candidates</span>
                                    <strong className="stat-value">{university.student_count || 0}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="badges-row-modern">
                            {(university.is_verified || university.is_verfied) ? (
                                <span className="badge-modern badge-success">
                                    <FaCheckDouble /> Verified Profile
                                </span>
                            ) : (
                                <span className="badge-modern badge-danger">
                                    <FaTimesCircle /> Not Verified
                                </span>
                            )}
                            {university.is_active ? (
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
                        <div className="partition-box">
                            <h3>Account Detail</h3>
                            <div className="form-group">
                                <label htmlFor="email"><FaEnvelope /> Email Address <small>(readonly)</small></label>
                                <input id="email" type="email" readOnly disabled value={university.email || ""} placeholder="University email" />
                                <span className="error-massage">{errors.email || ""}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><FaLock /> Password <small>(readonly)</small></label>
                                <input
                                    id="password"
                                    type="password"
                                    readOnly
                                    disabled
                                    className="profile-input"
                                    value={university.password || ""}
                                />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact"><FaPhone /> Contact Number</label>
                                <input
                                    id="contact"
                                    type="text"
                                    name="contact"
                                    className="profile-input"
                                    value={university.contact || ""}
                                    placeholder="Add contact number"
                                    onChange={handleProfileUpdate}
                                />
                                <span className="error-massage"></span>
                            </div>
                        </div>

                        <div className="partition-box">
                            <h3>University Access</h3>
                            <div className="form-group">
                                <label htmlFor="student_joining_token"><FaHashtag /> Student Joining Token</label>
                                <div className="form-group small-group" >
                                    <input
                                        id="student_joining_token"
                                        type="text"
                                        readOnly
                                        disabled
                                        value={university.student_joining_token || ""}
                                        placeholder="Token will appear here"
                                    />
                                    <button type="button" className="btn-secondary" onClick={copyToken}>
                                        <FaCopy />
                                    </button>
                                    <button type="button" className="btn-secondary" onClick={createToken}><FaRedoAlt /> </button>
                                </div>
                                <small><i className="fas fa-info-circle"></i> This token helps your student to be part of University Group, access & share it by being VERIFIED.</small>
                                <span className="error-massage"></span>
                            </div>
                        </div>
                    </div>

                    <div className="partition" id="partition-2">
                        <div className="partition-box" id="Full address">
                            <h3>Complete Address</h3>
                            <div className="form-group">
                                <label htmlFor="address"><FaMapMarked /> Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    className="profile-input"
                                    value={university.address || ""}
                                    placeholder="Add campus address"
                                    onChange={handleProfileUpdate}
                                />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city"><FaCity /> City</label>
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    className="profile-input"
                                    value={university.city || ""}
                                    placeholder="Enter city"
                                    onChange={handleProfileUpdate}
                                />
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="state"><FaSearchLocation /> State</label>
                                <select
                                    id="state"
                                    name="state"
                                    className="profile-input"
                                    value={university.state || ""}
                                    onChange={handleProfileUpdate}
                                >
                                    {!editable ? (
                                        university.state ? (
                                            <option value={university.state}>{university.state}</option>
                                        ) : (
                                            <option value="">State not added</option>
                                        )
                                    ) : (
                                        <>
                                            <option value="" disabled>
                                                {university.state || "Select a state"}
                                            </option>
                                            {indStates.map((stateItem, index) => (
                                                <option key={index + 1} value={stateItem} style={{ color: "black" }}>
                                                    {stateItem}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                <span className="error-massage"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pin_code"><FaMapMarkerAlt /> Pincode</label>
                                <input
                                    id="pin_code"
                                    type="text"
                                    name="pin_code"
                                    className="profile-input"
                                    value={university.pin_code || ""}
                                    placeholder="Add pincode"
                                    onChange={handleProfileUpdate}
                                />
                                <span className="error-massage"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
