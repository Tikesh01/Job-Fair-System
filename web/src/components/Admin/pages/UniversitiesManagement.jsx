import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function UniversitiesManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [universities, setUniversities] = useState([
        { id: 1, name: 'MIT Pune', email: 'admin@mitpune.edu', contact: '9876543210', city: 'Pune', state: 'Maharashtra', status: 'Active' },
        { id: 2, name: 'BITS Pilani', email: 'admin@bitspilani.edu', contact: '9876543211', city: 'Pilani', state: 'Rajasthan', status: 'Active' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'University Name' },
        { key: 'email', label: 'Email' },
        { key: 'contact', label: 'Contact' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'name', label: 'University Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'contact', label: 'Contact Number', type: 'tel', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'state', label: 'State', type: 'text', required: true },
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
            setUniversities(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setUniversities(prev => [...prev, { id: Date.now(), ...formData, status: 'Active' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUniversities(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Universities Management</h1>
                <p>Manage all universities participating in the job fair</p>
            </div>

            <DataTable
                columns={columns}
                data={universities}
                title="All Universities"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit University' : 'Add New University'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete University"
                message={`Are you sure you want to delete ${selectedRecord?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default UniversitiesManagement
