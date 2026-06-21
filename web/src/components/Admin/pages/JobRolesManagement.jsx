import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function JobRolesManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [jobRoles, setJobRoles] = useState([
        { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'Pune', salary: '8 LPA', type: 'Full Time', vacancies: 5, status: 'Open' },
        { id: 2, title: 'Data Analyst', company: 'Finance Ltd', location: 'Mumbai', salary: '6 LPA', type: 'Full Time', vacancies: 3, status: 'Open' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Job Title' },
        { key: 'company', label: 'Company' },
        { key: 'location', label: 'Location' },
        { key: 'salary', label: 'Salary' },
        { key: 'type', label: 'Type' },
        { key: 'vacancies', label: 'Vacancies' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'title', label: 'Job Title', type: 'text', required: true },
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'salary', label: 'Salary', type: 'text', required: true },
        { name: 'type', label: 'Job Type', type: 'select', required: true,
            options: [
                { value: 'fulltime', label: 'Full Time' },
                { value: 'parttime', label: 'Part Time' },
                { value: 'internship', label: 'Internship' }
            ]
        },
        { name: 'vacancies', label: 'Number of Vacancies', type: 'text', required: true },
        { name: 'description', label: 'Job Description', type: 'textarea', required: false },
    ]

    const handleAdd = () => {
        setSelectedRecord(null)
        setShowModal(true)
    }

    const handleEdit = (record) => {
        setSelectedRecord(record)
        setShowModal(true)
    }

    const handleDelete = (record) => {
        setSelectedRecord(record)
        setShowConfirm(true)
    }

    const handleFormSubmit = async (formData) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (selectedRecord) {
            setJobRoles(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setJobRoles(prev => [...prev, { id: Date.now(), ...formData, status: 'Open' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setJobRoles(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Job Roles Management</h1>
                <p>Manage all job positions posted by companies</p>
            </div>

            <DataTable
                columns={columns}
                data={jobRoles}
                title="All Job Roles"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Job Role' : 'Add New Job Role'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Job Role"
                message={`Are you sure you want to delete this job role? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default JobRolesManagement
