import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function JobFairDatesManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [dates, setDates] = useState([
        { id: 1, date: '2024-06-20', day: 'Wednesday', eventName: 'Opening Ceremony & Company Presentations', status: 'Scheduled' },
        { id: 2, date: '2024-06-21', day: 'Thursday', eventName: 'Interviews Round 1', status: 'Scheduled' },
        { id: 3, date: '2024-06-22', day: 'Friday', eventName: 'Interviews Round 2 & Workshops', status: 'Scheduled' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Date' },
        { key: 'day', label: 'Day' },
        { key: 'eventName', label: 'Event' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
        }
    ]

    const formFields = [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'eventName', label: 'Event Name', type: 'text', required: true },
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
            setDates(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, ...formData } : item))
        } else {
            const d = new Date(formData.date)
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            setDates(prev => [...prev, { id: Date.now(), ...formData, day: days[d.getDay()], status: 'Scheduled' }])
        }
        setShowModal(false)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setDates(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Job Fair Dates Management</h1>
                <p>Manage job fair event dates and schedules</p>
            </div>

            <DataTable
                columns={columns}
                data={dates}
                title="All Job Fair Dates"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleEdit}
            />

            <FormModal
                isOpen={showModal}
                title={selectedRecord ? 'Edit Job Fair Date' : 'Add New Job Fair Date'}
                fields={formFields}
                onSubmit={handleFormSubmit}
                onClose={() => setShowModal(false)}
                submitText={selectedRecord ? 'Update' : 'Add'}
                initialData={selectedRecord || {}}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Job Fair Date"
                message={`Are you sure you want to delete this date? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                type="warning"
            />
        </div>
    )
}

export default JobFairDatesManagement
