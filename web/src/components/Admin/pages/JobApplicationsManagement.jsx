import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function JobApplicationsManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [applications, setApplications] = useState([
        { id: 1, candidateName: 'Rajesh Kumar', jobTitle: 'Software Engineer', company: 'Tech Corp', appliedDate: '2024-06-15', status: 'Pending' },
        { id: 2, candidateName: 'Priya Singh', jobTitle: 'Data Analyst', company: 'Finance Ltd', appliedDate: '2024-06-14', status: 'Approved' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'candidateName', label: 'Candidate' },
        { key: 'jobTitle', label: 'Job Title' },
        { key: 'company', label: 'Company' },
        { key: 'appliedDate', label: 'Applied Date' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'candidateName', label: 'Candidate Name', type: 'text', required: true },
        { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'appliedDate', label: 'Applied Date', type: 'date', required: true },
        { name: 'status', label: 'Status', type: 'select', required: true,
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'declined', label: 'Declined' }
            ]
        },
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
            setApplications(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setApplications(prev => [...prev, { id: Date.now(), ...formData }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setApplications(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Job Applications Management</h1>
                <p>View and manage all job applications</p>
            </div>

            <DataTable
                columns={columns}
                data={applications}
                title="All Job Applications"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Application' : 'Add New Application'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Application"
                message={`Are you sure you want to delete this application? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default JobApplicationsManagement
