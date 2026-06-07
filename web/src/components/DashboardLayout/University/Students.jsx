import { useEffect, useMemo, useState } from "react";
import {
    FaBook,
    FaEnvelope,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhone,
    FaSearch,
    FaTrashAlt,
    FaUserCheck,
    FaUserGraduate
} from "react-icons/fa";
import api from "../../../api/axiosapi";
import { useNotification } from "../../../contexts/NotificationContext";
import "./Students.css";

function StudentCard({ student, onRemove, removing }) {
    const educationLine = [student.course_title, student.branch_title].filter(Boolean).join(" - ");
    const locationLine = [student.city, student.state].filter(Boolean).join(", ");

    return (
        <article className="university-student-card">
            <div className="university-student-card-head">
                <h3><FaUserGraduate /> {student.name || "Unnamed Candidate"}</h3>
               <button
                    type="button"
                    className="student-remove-button"
                    onClick={() => onRemove(student)}
                    disabled={removing}
                >
                    <FaTrashAlt /> {removing ? "Removing..." : "Remove"}
                </button>
            </div>

            <div className="university-student-card-grid">
                <div>
                    <strong><FaEnvelope /> Email</strong>
                    <span>{student.email || "Not added"}</span>
                </div>
                <div>
                    <strong><FaPhone /> Contact</strong>
                    <span>{student.contact || "Not added"}</span>
                </div>
                <div>
                    <strong><FaBook /> Course</strong>
                    <span>{educationLine || "Not added"}</span>
                </div>
                <div>
                    <strong><FaMapMarkerAlt /> Location</strong>
                    <span>{locationLine || "Not added"}</span>
                </div>
            </div>
        </article>
    );
}

export default function Students() {
    const [students, setStudents] = useState([]);
    const [removingId, setRemovingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { notify } = useNotification("");

    useEffect(() => {
        async function fetchUniversityStudents() {
            try {
                setLoading(true);
                const resp = await api.get("/university/candidates");
                if (resp.status === 200) {
                    setStudents(resp.data || []);
                }
            } catch (error) {
                notify("error", error.response?.data?.detail || "Unable to load university candidates");
                setStudents([]);
            } finally {
                setLoading(false);
            }
        }

        fetchUniversityStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            return students;
        }

        return students.filter((student) =>
            [
                student.name,
                student.email,
                student.contact,
                student.course_title,
                student.branch_title,
                student.city,
                student.state
            ].some((value) => value?.toLowerCase().includes(normalizedSearch))
        );
    }, [students, searchTerm]);

    const activeStudents = students.filter((student) => Boolean(student.is_active)).length;

    async function handleRemoveStudent(student) {
        const candidateId = student?.candidate_id;
        if (!candidateId) {
            notify("error", "Candidate id is missing");
            return;
        }

        const shouldRemove = window.confirm(
            `Remove ${student.name || "this candidate"} from your university group?`
        );

        if (!shouldRemove) {
            return;
        }

        try {
            setRemovingId(candidateId);
            const resp = await api.delete(`/university/candidates/${candidateId}`);
            if (resp.status === 200) {
                setStudents((prev) => prev.filter((item) => item.candidate_id !== candidateId));
                notify("success", resp.data?.message || "Candidate removed successfully");
            }
        } catch (error) {
            notify("error", error.response?.data?.detail || "Unable to remove candidate");
        } finally {
            setRemovingId(null);
        }
    }

    return (
        <div className="university-students-page">
            <div className="university-students-header">
                <div>
                    <h2>Manage Candidates</h2>
                    <p>Review the students currently linked to your university and quickly search through their academic details.</p>
                </div>
                <div className="university-students-stats">
                    <span>{students.length} Students</span>
                    <span>{activeStudents} Active</span>
                </div>
            </div>

            <div className="university-students-toolbar">
                <label className="university-students-search">
                    <FaSearch />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, course, branch, city..."
                    />
                </label>
            </div>

            <section className="university-students-section">
                <div className="university-students-grid">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <StudentCard
                                key={student.candidate_id || `${student.email}-${index}`}
                                student={student}
                                onRemove={handleRemoveStudent}
                                removing={removingId === student.candidate_id}
                            />
                        ))
                    ) : (
                        <div className="university-students-empty">
                            <FaInfoCircle />
                            <h4>{loading ? "Loading candidates..." : "No matching candidates found"}</h4>
                            <p>
                                {loading
                                    ? "Please wait while we fetch your linked students."
                                    : "Try a different search term, or share your joining token so students can join your university."}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
