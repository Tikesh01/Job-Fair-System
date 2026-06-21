import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import './FormModal.css'

function FormModal({ 
    isOpen, 
    title, 
    fields, 
    onSubmit, 
    onClose, 
    submitText = 'Save',
    initialData = {} 
}) {
    const [formData, setFormData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }))
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`
            }
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)
            await onSubmit(formData)
            setFormData({})
            onClose()
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-fields">
                        {fields.map(field => (
                            <div key={field.name} className="form-field">
                                <label htmlFor={field.name}>
                                    {field.label}
                                    {field.required && <span className="required">*</span>}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={field.rows || 4}
                                        className={errors[field.name] ? 'error' : ''}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        id={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        className={errors[field.name] ? 'error' : ''}
                                    >
                                        <option value="">Select {field.label.toLowerCase()}</option>
                                        {field.options && field.options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field.name}
                                        type={field.type || 'text'}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={errors[field.name] ? 'error' : ''}
                                    />
                                )}

                                {errors[field.name] && (
                                    <span className="error-message">{errors[field.name]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormModal
