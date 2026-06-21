import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'
import './DataTable.css'

function DataTable({ 
    columns, 
    data, 
    title, 
    onAdd, 
    onEdit, 
    onDelete, 
    onView,
    loading = false 
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filter data based on search term
    const filteredData = data.filter(item => {
        return Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    // Paginate data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    return (
        <div className="data-table-container">
            <div className="data-table-header">
                <div className="header-left">
                    <h2>{title}</h2>
                    <span className="record-count">{filteredData.length} records</span>
                </div>
                <button className="btn btn-primary" onClick={onAdd}>
                    <FaPlus /> Add New
                </button>
            </div>

            <div className="data-table-search">
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : paginatedData.length === 0 ? (
                    <div className="empty-state">
                        <p>No data found</p>
                        <button className="btn btn-secondary" onClick={onAdd}>
                            <FaPlus /> Add the first record
                        </button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key}>{column.label}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, index) => (
                                <tr key={index} className="table-row">
                                    {columns.map((column) => (
                                        <td key={column.key}>
                                            {column.render 
                                                ? column.render(row[column.key], row)
                                                : row[column.key]
                                            }
                                        </td>
                                    ))}
                                    <td className="actions-cell">
                                        {onView && (
                                            <button 
                                                className="action-btn view-btn"
                                                title="View"
                                                onClick={() => onView(row)}
                                            >
                                                <FaEye />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button 
                                                className="action-btn edit-btn"
                                                title="Edit"
                                                onClick={() => onEdit(row)}
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button 
                                                className="action-btn delete-btn"
                                                title="Delete"
                                                onClick={() => onDelete(row)}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {paginatedData.length > 0 && (
                <div className="data-table-pagination">
                    <div className="pagination-info">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
                    </div>
                    <div className="pagination-controls">
                        <button 
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FaChevronLeft />
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            const pageNum = i + 1
                            return (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}

                        {totalPages > 5 && <span className="pagination-ellipsis">...</span>}

                        <button 
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataTable
