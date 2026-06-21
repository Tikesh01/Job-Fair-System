import { useState } from 'react'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function FeedbackManagement() {
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [feedback, setFeedback] = useState([
        { id: 1, senderName: 'Rajesh Kumar', senderEmail: 'rajesh@student.com', message: 'Great job fair experience!', rating: 5, date: '2024-06-15' },
        { id: 2, senderName: 'Priya Singh', senderEmail: 'priya@student.com', message: 'Good event, could improve logistics', rating: 4, date: '2024-06-14' },
        { id: 3, senderName: 'Amit Sharma', senderEmail: 'amit@company.com', message: 'Excellent candidates pool', rating: 5, date: '2024-06-13' },
    ])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'senderName', label: 'Name' },
        { key: 'senderEmail', label: 'Email' },
        {
            key: 'rating',
            label: 'Rating',
            render: (value) => (
                <span className={`rating rating-${value}`}>
                    {'⭐'.repeat(value)} {value}/5
                </span>
            )
        },
        { key: 'date', label: 'Date' },
        {
            key: 'message',
            label: 'Message',
            render: (value) => (
                <span title={value} className="truncate">
                    {value.substring(0, 50)}...
                </span>
            )
        }
    ]

    const handleDelete = (record) => {
        setSelectedRecord(record)
        setShowConfirm(true)
    }

    const handleConfirmDelete = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setFeedback(prev => prev.filter(item => item.id !== selectedRecord.id))
        setShowConfirm(false)
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <h1>Feedback Management</h1>
                <p>View and manage user feedback from the job fair</p>
            </div>

            <DataTable
                columns={columns}
                data={feedback}
                title="All Feedback"
                onDelete={handleDelete}
                onView={(record) => {
                    alert(`Feedback from ${record.senderName}:\n\n${record.message}`)
                }}
            />

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Feedback"
                message={`Are you sure you want to delete this feedback? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                confirmText="Delete"
                type="warning"
            />

            <style>{`
                .truncate {
                    display: inline-block;
                    max-width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .rating {
                    font-size: 13px;
                    font-weight: 600;
                }

                .rating-5 {
                    color: #48bb78;
                }

                .rating-4 {
                    color: #ed8936;
                }

                .rating-3 {
                    color: #ecc94b;
                }

                .rating-2 {
                    color: #fc8181;
                }

                .rating-1 {
                    color: #f56565;
                }
            `}</style>
        </div>
    )
}

export default FeedbackManagement
