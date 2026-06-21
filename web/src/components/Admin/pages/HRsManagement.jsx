import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function HRsManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [hrs, setHRs] = useState([
        { id: 1, name: 'Amit Sharma', email: 'amit@techcorp.com', contact: '9876543210', company: 'Tech Corp', designation: 'HR Manager', status: 'Active' },
        { id: 2, name: 'Neha Patel', email: 'neha@financelltd.com', contact: '9876543211', company: 'Finance Ltd', designation: 'HR Executive', status: 'Active' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'contact', label: 'Contact' },
        { key: 'company', label: 'Company' },
        { key: 'designation', label: 'Designation' },
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
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'designation', label: 'Designation', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'text', required: false },
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
            setHRs(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setHRs(prev => [...prev, { id: Date.now(), ...formData, status: 'Active' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setHRs(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>HR Managers Management</h1>
                <p>Manage HR representatives from companies</p>
            </div>

            <DataTable
                columns={columns}
                data={hrs}
                title="All HR Managers"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit HR Manager' : 'Add New HR Manager'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete HR Manager"
                message={`Are you sure you want to delete ${selectedRecord?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default HRsManagement
