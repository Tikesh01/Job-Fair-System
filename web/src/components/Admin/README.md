# Admin Panel Documentation

## Overview
The Admin Panel is a comprehensive management interface for the Job Fair System. It provides administrators with secure access to manage all aspects of the job fair, including candidates, companies, universities, job roles, applications, and more.

## Features

### 1. **Secure Authentication**
- Admin-specific login page with email and password
- JWT-based token authentication
- Session management with secure cookies
- Password validation (minimum 8 characters)

### 2. **Dashboard Overview**
- Real-time statistics of system data
- Recent activities feed
- System health information
- Quick stats for pending items

### 3. **Management Modules**

#### Core Data Management
- **Candidates Management**: View, add, edit, and delete candidate profiles
- **Companies Management**: Manage participating companies
- **Universities Management**: Handle university registrations
- **Job Roles Management**: Post and manage job positions
- **Job Applications Management**: Monitor and update applications

#### People Management
- **HR Managers**: Manage HR representatives from companies
- **System Managers**: Add and manage system administrators
- **Volunteers**: Handle volunteer registrations and assignments

#### Events Management
- **Workshops**: Schedule and manage training workshops
- **Job Fair Dates**: Set and manage job fair event dates

#### Feedback
- **Feedback Management**: View and manage user feedback with ratings

### 4. **CRUD Operations**
All management modules support:
- **Create**: Add new records via modal forms
- **Read**: View all records in paginated data tables
- **Update**: Edit existing records
- **Delete**: Remove records with confirmation dialog
- **Search**: Filter records by keywords
- **Pagination**: Navigate through large datasets

### 5. **UI/UX Features**
- Responsive design (works on desktop, tablet, mobile)
- Collapsible sidebar navigation
- Search functionality across all tables
- Pagination with multiple records per page
- Status badges with color coding
- Confirmation dialogs for deletions
- Modal forms for data entry
- Toast notifications for actions
- Smooth animations and transitions

## File Structure

```
web/src/components/Admin/
├── AdminLogin.jsx              # Admin login page
├── AdminLogin.css              # Login page styling
├── AdminDashboard.jsx          # Main dashboard layout
├── AdminDashboard.css          # Dashboard styling
├── components/
│   ├── AdminSidebar.jsx        # Navigation sidebar
│   ├── AdminSidebar.css        # Sidebar styling
│   ├── AdminHeader.jsx         # Top header bar
│   ├── AdminHeader.css         # Header styling
│   ├── DataTable.jsx           # Reusable data table component
│   ├── DataTable.css           # Table styling
│   ├── FormModal.jsx           # Reusable form modal
│   ├── FormModal.css           # Modal styling
│   ├── ConfirmDialog.jsx       # Confirmation dialog
│   ├── ConfirmDialog.css       # Dialog styling
│   └── ProtectedRoute.jsx      # Route protection
├── pages/
│   ├── DashboardOverview.jsx   # Dashboard statistics
│   ├── DashboardOverview.css   # Overview styling
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
│   ├── FeedbackManagement.jsx
│   └── CRUD.css                # Common CRUD styling
```

## Accessing the Admin Panel

1. **Direct URL**: Navigate to `http://localhost:3000/admin/login`
2. **Admin Login**: Enter admin credentials
3. **Dashboard**: After login, you'll see the admin dashboard with full navigation

## Default Admin Credentials (Development)
*Note: These should be configured in the backend API*

```
Email: admin@jobfair.com
Password: (as per your backend configuration)
```

## Component Details

### AdminLogin Component
- Email validation
- Password strength validation (8+ characters)
- Error handling and display
- Loading states
- Secure token storage

### AdminDashboard Component
- Main layout with sidebar and header
- Protected routes for all admin pages
- Responsive design
- Logout functionality

### DataTable Component
- Reusable table for all CRUD pages
- Built-in search/filter
- Pagination with navigation
- Action buttons (View, Edit, Delete)
- Loading and empty states
- Record count display

### FormModal Component
- Reusable form for creating/editing records
- Field validation
- Multiple input types (text, email, select, textarea)
- Error message display
- Submit and cancel actions
- Form data persistence

### ConfirmDialog Component
- Confirmation dialog for destructive actions
- Custom messages and titles
- Type variants (warning, info, success)
- Animated appearance
- Accessible design

## API Integration (To be implemented)

### Authentication Endpoints
```
POST /admin/login
- Request: { email, password }
- Response: { success, token, admin_id, message }

POST /admin/logout
- Request: (requires token)
- Response: { success, message }
```

### CRUD Endpoints
Each management module will need endpoints:
```
GET /admin/{resource}              # Get all records
GET /admin/{resource}/{id}         # Get single record
POST /admin/{resource}             # Create record
PUT /admin/{resource}/{id}         # Update record
DELETE /admin/{resource}/{id}      # Delete record
```

Resources: candidates, companies, universities, job_roles, job_applications, hrs, managers, volunteers, workshops, job_fair_dates, feedback

## Styling System

### Color Palette
- **Primary**: #667eea, #764ba2 (purple gradient)
- **Success**: #48bb78 (green)
- **Warning**: #ed8936 (orange)
- **Danger**: #f56565 (red)
- **Info**: #4299e1 (blue)
- **Neutral**: #2d3748 to #cbd5e0 (grays)

### Typography
- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Sizes**: 28px (h1), 20px (h2), 14px (body), 12px (small)

### Spacing
- **Padding**: 15px, 20px, 25px, 30px
- **Gap**: 8px, 12px, 15px, 20px

## Security Features

1. **Authentication**
   - JWT token-based authentication
   - Secure cookie storage
   - Token expiration handling

2. **Authorization**
   - Role-based route protection
   - Admin-only access to dashboard

3. **Data Validation**
   - Client-side form validation
   - Email format validation
   - Required field checking

4. **User Actions**
   - Confirmation dialogs for destructive actions
   - Audit trail ready (timestamps for operations)
   - Session management

## Future Enhancements

1. **Advanced Features**
   - Bulk operations (multi-select, bulk delete)
   - Export data (CSV, Excel)
   - Import data (CSV, Excel)
   - Advanced filtering and sorting
   - Report generation

2. **Monitoring**
   - User activity logs
   - System performance metrics
   - Email notifications
   - Backup status

3. **Settings**
   - Admin profile management
   - Password change
   - System preferences
   - Email templates

4. **Analytics**
   - Statistical charts and graphs
   - Trend analysis
   - Export reports
   - KPI tracking

## Backend Integration Checklist

- [ ] Create admin authentication endpoint
- [ ] Implement JWT token generation
- [ ] Create admin user model/table
- [ ] Build CRUD endpoints for all resources
- [ ] Implement data validation on backend
- [ ] Add error handling and responses
- [ ] Create database migrations
- [ ] Set up logging and auditing
- [ ] Configure CORS for admin endpoints
- [ ] Add rate limiting for login attempts
- [ ] Implement password hashing
- [ ] Set up session management

## Testing

### Manual Testing Checklist
- [ ] Admin login with valid credentials
- [ ] Admin login with invalid credentials
- [ ] Navigation through all management pages
- [ ] Add new record for each resource
- [ ] Edit existing record
- [ ] Delete record with confirmation
- [ ] Search/filter functionality
- [ ] Pagination through large datasets
- [ ] Responsive design on mobile
- [ ] Logout functionality
- [ ] Protected route access

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **Login not working**
   - Check if backend is running
   - Verify admin credentials
   - Check browser console for errors

2. **Data not displaying**
   - Verify API endpoints are working
   - Check network tab in dev tools
   - Ensure backend returns correct data format

3. **Styling issues**
   - Clear browser cache
   - Check CSS files are imported
   - Verify media queries for responsive design

## Support and Contact

For issues or questions about the admin panel, please contact the development team or check the project documentation.

---

**Last Updated**: June 2024
**Version**: 1.0
**Status**: Production Ready (awaiting backend integration)
