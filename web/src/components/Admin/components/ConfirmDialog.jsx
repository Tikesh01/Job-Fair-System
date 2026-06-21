import { FaExclamationTriangle } from 'react-icons/fa'
import './ConfirmDialog.css'

function ConfirmDialog({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    type = 'warning' 
}) {
    if (!isOpen) return null

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-content" onClick={(e) => e.stopPropagation()}>
                <div className={`confirm-icon ${type}`}>
                    <FaExclamationTriangle />
                </div>

                <h2 className="confirm-title">{title}</h2>
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`btn btn-danger`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
