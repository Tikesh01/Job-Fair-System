import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function VolunteersManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [volunteers, setVolunteers] = useState([
        { id: 1, name: 'Aditya Kumar', email: 'aditya@volunteer.com', contact: '9876543210', university: 'MIT Pune', department: 'IT', status: 'Active' },
        { id: 2, name: 'Shreya Singh', email: 'shreya@volunteer.com', contact: '9876543211', university: 'BITS Pilani', department: 'ECE', status: 'Active' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'contact', label: 'Contact' },
        { key: 'university', label: 'University' },
        { key: 'department', label: 'Department' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'contact', label: 'Contact Number', type: 'tel', required: true },
        { name: 'university', label: 'University', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'text', required: true },
        { name: 'address', label: 'Address', type: 'textarea', required: false },
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
            setVolunteers(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setVolunteers(prev => [...prev, { id: Date.now(), ...formData, status: 'Active' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setVolunteers(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Volunteers Management</h1>
                <p>Manage volunteers helping with the job fair</p>
            </div>

            <DataTable
                columns={columns}
                data={volunteers}
                title="All Volunteers"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Volunteer' : 'Add New Volunteer'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Volunteer"
                message={`Are you sure you want to delete ${selectedRecord?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default VolunteersManagement
