import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function CandidatesManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [loading, setLoading] = useState(false)

    // Mock data - will be replaced with API calls
    const [candidates, setCandidates] = useState([
        {
            id: 1,
            email: 'student1@university.edu',
            name: 'Rajesh Kumar',
            contact: '9876543210',
            university: 'MIT Pune',
            course: 'B.Tech',
            branch: 'Computer Science',
            status: 'Verified'
        },
        {
            id: 2,
            email: 'student2@university.edu',
            name: 'Priya Singh',
            contact: '9876543211',
            university: 'BITS Pilani',
            course: 'B.Tech',
            branch: 'Electronics',
            status: 'Pending'
        },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'contact', label: 'Contact' },
        { key: 'university', label: 'University' },
        { key: 'branch', label: 'Branch' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`badge badge-${value.toLowerCase()}`}>
                    {value}
                </span>
            )
        }
    ]

    const formFields = [
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'user@example.com' },
        { name: 'contact', label: 'Contact Number', type: 'tel', required: true, placeholder: '10-digit number' },
        { name: 'university', label: 'University', type: 'select', required: true, 
            options: [
                { value: 'mit', label: 'MIT Pune' },
                { value: 'bits', label: 'BITS Pilani' },
                { value: 'iit', label: 'IIT Bombay' }
            ]
        },
        { name: 'course', label: 'Course', type: 'select', required: true,
            options: [
                { value: 'btech', label: 'B.Tech' },
                { value: 'mtech', label: 'M.Tech' }
            ]
        },
        { name: 'branch', label: 'Branch', type: 'select', required: true,
            options: [
                { value: 'cse', label: 'Computer Science' },
                { value: 'ece', label: 'Electronics' },
                { value: 'me', label: 'Mechanical' }
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
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (selectedRecord) {
                // Update existing
                setCandidates(prev => prev.map(item =>
                    item.id === selectedRecord.id ? { ...item, ...formData } : item
                ))
            } else {
                // Add new
                setCandidates(prev => [...prev, { id: Date.now(), ...formData, status: 'Pending' }])
            }
            setShowModal(false)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmDelete = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setCandidates(prev => prev.filter(item => item.id !== selectedRecord.id))
            setShowConfirm(false)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Candidates Management</h1>
                <p>Manage student candidates registered in the system</p>
            </div>

            <DataTable
                columns={columns}
                data={candidates}
                title="All Candidates"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
                loading={loading}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Candidate' : 'Add New Candidate'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Candidate"
                message={`Are you sure you want to delete ${selectedRecord?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                confirmText="Delete"
                type="warning"
            />
        </div>
    )
}

export default CandidatesManagement
