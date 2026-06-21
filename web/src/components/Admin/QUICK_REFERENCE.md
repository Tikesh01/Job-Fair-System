# Admin Panel - Quick Reference Guide

## 🎯 Quick Navigation

### URLs
| Page | URL |
|------|-----|
| Admin Login | `http://localhost:3000/admin/login` |
| Dashboard | `http://localhost:3000/admin/dashboard/overview` |
| Candidates | `http://localhost:3000/admin/dashboard/candidates` |
| Companies | `http://localhost:3000/admin/dashboard/companies` |
| Universities | `http://localhost:3000/admin/dashboard/universities` |
| Job Roles | `http://localhost:3000/admin/dashboard/jobroles` |
| Applications | `http://localhost:3000/admin/dashboard/jobapplications` |
| HR Managers | `http://localhost:3000/admin/dashboard/hrs` |
| System Managers | `http://localhost:3000/admin/dashboard/managers` |
| Volunteers | `http://localhost:3000/admin/dashboard/volunteers` |
| Workshops | `http://localhost:3000/admin/dashboard/workshops` |
| Job Fair Dates | `http://localhost:3000/admin/dashboard/jobfairdates` |
| Feedback | `http://localhost:3000/admin/dashboard/feedback` |

## 📁 File Locations

```
web/src/components/Admin/
├── AdminLogin.jsx               (Login page)
├── AdminDashboard.jsx           (Main layout)
├── components/                  (Reusable)
│   ├── AdminSidebar.jsx
│   ├── AdminHeader.jsx
│   ├── DataTable.jsx
│   ├── FormModal.jsx
│   ├── ConfirmDialog.jsx
│   └── ProtectedRoute.jsx
├── pages/                       (Management modules)
│   ├── DashboardOverview.jsx
│   ├── CandidatesManagement.jsx
│   ├── CompaniesManagement.jsx
│   ├── UniversitiesManagement.jsx
│   ├── JobRolesManagement.jsx
│   ├── JobApplicationsManagement.jsx
│   ├── HRsManagement.jsx
│   ├── ManagersManagement.jsx
│   ├── VolunteersManagement.jsx
│   ├── WorkshopsManagement.jsx
│   ├── JobFairDatesManagement.jsx
│   └── FeedbackManagement.jsx
├── README.md                    (Documentation)
└── SETUP_GUIDE.md               (Integration guide)
```

## 🛠️ Common Tasks

### 1. Adding a New Management Module

**Step 1**: Create new file in `/pages/` directory

```bash
cp YourModuleManagement.jsx /web/src/components/Admin/pages/
```

**Step 2**: Copy template structure from existing management page

```javascript
import { useState } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import './CRUD.css'

function YourModuleManagement() {
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [data, setData] = useState([
        // Add mock data here
    ])

    const columns = [
        // Define table columns
    ]

    const formFields = [
        // Define form fields
    ]

    // ... rest of handlers and JSX
}

export default YourModuleManagement
```

**Step 3**: Add route to `App.jsx`

```javascript
import YourModuleManagement from './components/Admin/pages/YourModuleManagement';

// In Routes:
<Route path='/admin/dashboard/yourmodule' element={<YourModuleManagement />} />
```

**Step 4**: Add menu item to `AdminSidebar.jsx`

```javascript
{
    label: 'Your Module',
    path: '/admin/dashboard/yourmodule',
    icon: <FaYourIcon />,
    exact: true
}
```

### 2. Replacing Mock Data with API

**Current (Mock)**:
```javascript
const [candidates, setCandidates] = useState([
    { id: 1, name: 'John', email: 'john@example.com' }
])
```

**After (API)**:
```javascript
useEffect(() => {
    fetchCandidates()
}, [])

const fetchCandidates = async () => {
    try {
        setLoading(true)
        const response = await api.get('/admin/candidates')
        setCandidates(response.data.data)
    } catch (error) {
        notify('Error fetching candidates', 'error')
    } finally {
        setLoading(false)
    }
}
```

### 3. Customizing Colors

Edit CSS files:

```css
/* Primary color change */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);

/* Or single color */
background: #YOUR_COLOR;
```

### 4. Adding Form Validation

```javascript
const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
        newErrors.email = "Email is required"
    }
    
    if (!formData.phone || formData.phone.length !== 10) {
        newErrors.phone = "Enter valid 10-digit phone"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
}
```

### 5. Adding Status Badges

```javascript
// Column definition
{
    key: 'status',
    label: 'Status',
    render: (value) => <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
}

// CSS classes in CRUD.css
.badge-active { background: #dcfce7; color: #166534; }
.badge-inactive { background: #f3f4f6; color: #6b7280; }
.badge-pending { background: #fef3c7; color: #92400e; }
```

## 🔌 API Integration Patterns

### List Data
```javascript
const response = await api.get('/admin/candidates?skip=0&limit=10')
// Returns: { success: true, data: [...], message: "..." }
setCandidates(response.data.data)
```

### Create Record
```javascript
const response = await api.post('/admin/candidates', formData)
// Returns: { success: true, data: {...}, message: "..." }
setCandidates(prev => [...prev, response.data.data])
```

### Update Record
```javascript
const response = await api.put(`/admin/candidates/${recordId}`, formData)
setCandidates(prev => prev.map(item => 
    item.id === recordId ? response.data.data : item
))
```

### Delete Record
```javascript
const response = await api.delete(`/admin/candidates/${recordId}`)
setCandidates(prev => prev.filter(item => item.id !== recordId))
```

## 🎨 Component Props

### DataTable
```javascript
<DataTable
    columns={columns}           // Array of column definitions
    data={data}                // Array of data rows
    title="Title"              // Table title
    onAdd={handleAdd}          // Add button callback
    onEdit={handleEdit}        // Edit button callback
    onDelete={handleDelete}    // Delete button callback
    onView={handleView}        // View button callback
    loading={false}            // Loading state
/>
```

### FormModal
```javascript
<FormModal
    isOpen={showModal}         // Modal visibility
    title="Form Title"         // Modal title
    fields={formFields}        // Array of field definitions
    onSubmit={handleSubmit}    // Form submission callback
    onClose={handleClose}      // Close button callback
    submitText="Save"          // Submit button text
    initialData={{}}           // Initial form data
/>
```

### ConfirmDialog
```javascript
<ConfirmDialog
    isOpen={showConfirm}       // Dialog visibility
    title="Confirm Delete"     // Dialog title
    message="Are you sure?"    // Confirmation message
    onConfirm={handleConfirm}  // Confirm callback
    onCancel={handleCancel}    // Cancel callback
    confirmText="Delete"       // Confirm button text
    type="warning"             // Dialog type
/>
```

## 📊 Column Definition Format

```javascript
{
    key: 'fieldName',           // Data key
    label: 'Display Label',     // Column header
    render: (value, row) => (   // Optional custom rendering
        <span className="custom">{value}</span>
    )
}
```

## 📝 Form Field Definition Format

```javascript
{
    name: 'fieldName',
    label: 'Field Label',
    type: 'text',               // text, email, password, date, select, textarea
    required: true,
    placeholder: 'Enter value',
    options: [                  // For select type
        { value: 'val1', label: 'Label 1' },
        { value: 'val2', label: 'Label 2' }
    ]
}
```

## 🔍 Debugging Tips

### Check Login Token
```javascript
console.log('Token:', getCookie('token'))
console.log('Role:', getCookie('role'))
```

### Verify API Connection
```javascript
// In browser console
api.get('/admin/candidates')
    .then(res => console.log(res.data))
    .catch(err => console.error(err.message))
```

### Inspect Component State
```javascript
// Add console logs in handlers
const handleAdd = () => {
    console.log('Adding record...')
    console.log('Current data:', candidates)
    setShowModal(true)
}
```

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Small Mobile */
@media (max-width: 480px) { }
```

## ⚡ Performance Optimization

### Enable Pagination
```javascript
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10
const startIndex = (currentPage - 1) * itemsPerPage
const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)
```

### Debounce Search
```javascript
import { useCallback } from 'react'

const handleSearch = useCallback((term) => {
    setSearchTerm(term)
    setCurrentPage(1)
}, [])
```

### Lazy Load Images (Future)
```javascript
<img 
    src={imageUrl} 
    loading="lazy"
    alt="description"
/>
```

## 🚨 Error Handling

```javascript
try {
    const response = await api.post('/admin/candidates', formData)
    if (response.data.success) {
        setCandidates(prev => [...prev, response.data.data])
        notify('Success!', 'success')
    }
} catch (error) {
    const errorMsg = error.response?.data?.message || 'Operation failed'
    notify(errorMsg, 'error')
    console.error('Error:', error)
}
```

## 🔐 Security Notes

- ✅ Tokens stored in HTTP-only cookies (browser handles)
- ✅ Routes protected by ProtectedRoute component
- ✅ Form inputs validated client-side
- ✅ Confirmation required for deletions
- ⚠️ Backend must validate all inputs
- ⚠️ Backend must verify user permissions

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Login not working | Check backend is running, verify CORS |
| Data not loading | Check API endpoint, network tab in dev tools |
| Styling broken | Clear cache (Ctrl+Shift+Del), check CSS imports |
| Form not submitting | Check required fields, browser console errors |
| Mobile layout wrong | Verify media queries, check viewport meta tag |

## 📚 Resources

- MDN React Hooks: https://react.dev/reference/react
- Axios Documentation: https://axios-http.com/docs/intro
- CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout
- FastAPI: https://fastapi.tiangolo.com/

---

**Last Updated**: June 2024
**Version**: 1.0
**For**: Admin Panel Development
