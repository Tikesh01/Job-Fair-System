import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function WorkshopsManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [workshops, setWorkshops] = useState([
        { id: 1, title: 'AI & Machine Learning', guestName: 'Dr. Rajesh Kumar', date: '2024-06-20', mode: 'Online', status: 'Scheduled' },
        { id: 2, title: 'Web Development Trends', guestName: 'Priya Verma', date: '2024-06-21', mode: 'Offline', status: 'Scheduled' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Workshop Title' },
        { key: 'guestName', label: 'Guest Name' },
        { key: 'date', label: 'Date' },
        { key: 'mode', label: 'Mode' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'title', label: 'Workshop Title', type: 'text', required: true },
        { name: 'guestName', label: 'Guest Speaker Name', type: 'text', required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'time', label: 'Time', type: 'time', required: true },
        { name: 'mode', label: 'Mode', type: 'select', required: true,
            options: [
                { value: 'online', label: 'Online' },
                { value: 'offline', label: 'Offline' }
            ]
        },
        { name: 'location', label: 'Location', type: 'text', required: false },
        { name: 'description', label: 'Description', type: 'textarea', required: false },
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
            setWorkshops(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            setWorkshops(prev => [...prev, { id: Date.now(), ...formData, status: 'Scheduled' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setWorkshops(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Workshops Management</h1>
                <p>Manage workshops and training sessions</p>
            </div>

            <DataTable
                columns={columns}
                data={workshops}
                title="All Workshops"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Workshop' : 'Add New Workshop'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Workshop"
                message={`Are you sure you want to delete this workshop? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default WorkshopsManagement
