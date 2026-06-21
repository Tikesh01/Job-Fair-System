import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function CompaniesManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [companies, setCompanies] = useState([
        { id: 1, name: 'Tech Corp', email: 'hr@techcorp.com', contact: '9876543210', city: 'Pune', industry: 'IT', status: 'Active' },
        { id: 2, name: 'Finance Ltd', email: 'info@financelltd.com', contact: '9876543211', city: 'Mumbai', industry: 'Finance', status: 'Active' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Company Name' },
        { key: 'email', label: 'Email' },
        { key: 'contact', label: 'Contact' },
        { key: 'city', label: 'City' },
        { key: 'industry', label: 'Industry' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'name', label: 'Company Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'contact', label: 'Contact Number', type: 'tel', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'industry', label: 'Industry', type: 'select', required: true,
            options: [
                { value: 'it', label: 'IT/Software' },
                { value: 'finance', label: 'Finance' },
                { value: 'manufacturing', label: 'Manufacturing' }
            ]
        },
        { name: 'about', label: 'About Company', type: 'textarea', required: false },
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
            setCompanies(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setCompanies(prev => [...prev, { id: Date.now(), ...formData, status: 'Active' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCompanies(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Companies Management</h1>
                <p>Manage all companies participating in the job fair</p>
            </div>

            <DataTable
                columns={columns}
                data={companies}
                title="All Companies"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Company' : 'Add New Company'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Company"
                message={`Are you sure you want to delete ${selectedRecord?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default CompaniesManagement
