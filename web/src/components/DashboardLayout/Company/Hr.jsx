import { useEffect, useState } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaInfoCircle,
  FaStar,
  FaUserTie,
} from "react-icons/fa";
import api from "../../../api/axiosapi";
import { useNotification } from "../../../contexts/NotificationContext";
import HrCard from "./HrCard";
import "./Hr.css";

const initialHrForm = {
  name: "",
  email: "",
  contact: "",
  designation: "",
  department: "",
  linkedin_url: "",
  is_primary: false,
};

export default function Hr() {
  const [hrList, setHrList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [hrForm, setHrForm] = useState(initialHrForm);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({});
  const { notify } = useNotification("");

  useEffect(() => {
    async function loadData() {
      try {
        const [userResp, hrResp] = await Promise.all([
          api.get("/profile"),
          api.get("/company/hr"),
        ]);
        setUserData(userResp.data || {});
        setHrList(hrResp.data || []);
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        notify("error", `Something went wrong - ${errorMessage}`);
      }
    }

    loadData();
  }, []);

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setHrForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateForm() {
    const requiredFields = ["name", "email", "contact", "designation"];
    const missingFields = requiredFields.filter((field) => !hrForm[field]?.toString().trim());

    if (missingFields.length > 0) {
      notify("error", `Please fill all required fields: ${missingFields.join(", ")}`);
      return false;
    }

    if (!/^\d{10}$/.test(hrForm.contact.trim())) {
      notify("error", "Contact must contain exactly 10 digits");
      return false;
    }

    if (hrForm.linkedin_url && !/^https?:\/\//i.test(hrForm.linkedin_url.trim())) {
      notify("error", "LinkedIn URL should start with http:// or https://");
      return false;
    }

    return true;
  }

  function buildPayload() {
    return {
      name: hrForm.name.trim(),
      email: hrForm.email.trim(),
      contact: hrForm.contact.trim(),
      designation: hrForm.designation.trim(),
      department: hrForm.department.trim() || null,
      linkedin_url: hrForm.linkedin_url.trim() || null,
      is_primary: !!hrForm.is_primary,
    };
  }

  async function createHr() {
    if (!validateForm()) return;

    try {
      const payload = buildPayload();
      const resp = await api.post("/company/hr", payload);
      if (resp.status === 200 || resp.status === 201) {
        notify("success", resp.data?.message || "HR created successfully");
        setHrForm(initialHrForm);
        setErrors({});
        setShowForm(false);
        const refresh = await api.get("/company/hr");
        setHrList(refresh.data || []);
      }
    } catch (error) {
      notify("error", error.response?.data?.detail || error.message || "Failed to create HR");
      setErrors((prev) => ({ ...prev, main: error.response?.data?.detail || error.message }));
    }
  }

  async function updateHr() {
    if (!hrForm.id || !validateForm()) return;

    try {
      const payload = buildPayload();
      const resp = await api.put(`/company/hr/${hrForm.id}`, payload);
      if (resp.status === 200) {
        notify("success", resp.data?.message || "HR updated successfully");
        setHrForm(initialHrForm);
        setErrors({});
        setShowForm(false);
        const refresh = await api.get("/company/hr");
        setHrList(refresh.data || []);
      }
    } catch (error) {
      notify("error", error.response?.data?.detail || error.message || "Failed to update HR");
      setErrors((prev) => ({ ...prev, main: error.response?.data?.detail || error.message }));
    }
  }

  async function handleDeleteHr(hrId) {
    try {
      const resp = await api.delete(`/company/hr/${hrId}`);
      if (resp.status === 200) {
        notify("success", "HR deleted successfully");
        setHrList((prev) => prev.filter((item) => item.id !== hrId));
      }
    } catch (error) {
      notify("error", error.response?.data?.detail || "Failed to delete HR");
    }
  }

  function handleUpdateHr(hr) {
    setHrForm({
      id: hr.id,
      name: hr.name || "",
      email: hr.email || "",
      contact: hr.contact || "",
      designation: hr.designation || "",
      department: hr.department || "",
      linkedin_url: hr.linkedin_url || "",
      is_primary: !!hr.is_primary,
    });
    setShowForm(true);
  }

  return (
    <div className="hr-page-container">
      <div className="hr-list-wrapper">
        <div className="hr-list-header">
          <h2>Company HR Contacts</h2>
          <div className="hr-stat">
            <span>{hrList.length} Created</span>
            <span>{hrList.filter((item) => item.is_primary).length} Primary</span>
          </div>
        </div>

        {hrList.length > 0 ? 
          <div className="hr-card-grid">
            {hrList.map((hr) => (
              <div className="card" key={hr.id}>
                <HrCard
                  hr={hr}
                  companyName={userData.name}
                  onDelete={handleDeleteHr}
                  onUpdate={handleUpdateHr}
                />
              </div>
            ))}
          </div>
          :<div className="no-vacancies">
            <FaInfoCircle />
            <span className="info-span">No HR Contacts Created Yet</span>
          </div>
        }
       
      </div>

      <div className="hr-demo-wrapper">
        <h3 onClick={() => setShowDemo(!showDemo)}>
          Demo HR Card
          <span>{showDemo ? <FaChevronCircleUp /> : <FaChevronCircleDown />}</span>
        </h3>
        <div className="demo">
          {showDemo ? (
            <HrCard
              isDemo={true}
              companyName={userData.name || "Your Company"}
              hr={{
                id: 0,
                name: "Priya Sharma",
                email: "priya.hr@company.com",
                contact: "9876543210",
                designation: "Senior HR Manager",
                department: "Talent Acquisition",
                linkedin_url: "https://www.linkedin.com/",
                is_primary: true,
                company_id: userData.company_id || 0,
              }}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          ) : null}
        </div>
      </div>

      <div className="hr-form-wrapper">
        <h2 onClick={() => setShowForm(!showForm)}>
          {hrForm.id ? "Update HR" : "Create HR"}
          <span>{showForm ? <FaChevronCircleUp /> : <FaChevronCircleDown />}</span>
        </h2>

        {showForm ? (
          <div className="hr-form">
            <div className="hr-form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FaUserTie />
                  HR Name <span className="required">*</span>
                </label>
                <input
                  value={hrForm.name}
                  onChange={handleInputChange}
                  type="text"
                  className="form-input"
                  name="name"
                  placeholder="Enter HR name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-envelope"></i>
                  Email <span className="required">*</span>
                </label>
                <input
                  value={hrForm.email}
                  onChange={handleInputChange}
                  type="email"
                  className="form-input"
                  name="email"
                  placeholder="Enter HR email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-phone"></i>
                  Contact <span className="required">*</span>
                </label>
                <input
                  value={hrForm.contact}
                  onChange={handleInputChange}
                  type="text"
                  className="form-input"
                  name="contact"
                  placeholder="Enter 10 digit contact"
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-briefcase"></i>
                  Designation <span className="required">*</span>
                </label>
                <input
                  value={hrForm.designation}
                  onChange={handleInputChange}
                  type="text"
                  className="form-input"
                  name="designation"
                  placeholder="Enter designation"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-building"></i>
                  Department
                </label>
                <input
                  value={hrForm.department}
                  onChange={handleInputChange}
                  type="text"
                  className="form-input"
                  name="department"
                  placeholder="Enter department"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fab fa-linkedin"></i>
                  LinkedIn URL
                </label>
                <input
                  value={hrForm.linkedin_url}
                  onChange={handleInputChange}
                  type="url"
                  className="form-input"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group full small-group">
                <input
                  checked={hrForm.is_primary}
                  onChange={handleInputChange}
                  type="checkbox"
                  name="is_primary"
                  id="is_primary"
                />
                <label htmlFor="is_primary">
                  <FaStar />
                  Mark as primary HR contact
                </label>
              </div>
            </div>

            <span className="error-massage">{errors.main}</span>
            <div className="form-actions btn-group">
              <button
                type="reset"
                className="btn btn-secondary"
                onClick={() => {
                  setHrForm(initialHrForm);
                  setErrors({});
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => (hrForm.id ? updateHr() : createHr())}
              >
                {hrForm.id ? "Update HR" : "Create HR"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
