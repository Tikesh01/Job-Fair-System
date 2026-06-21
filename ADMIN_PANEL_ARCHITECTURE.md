# Admin Panel Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL INTERFACE                        │
└─────────────────────────────────────────────────────────────────┘

                        /admin/login
                           │
                           ▼
                   ┌──────────────────┐
                   │  AdminLogin.jsx  │
                   │  (Secure Form)   │
                   └────────┬─────────┘
                            │
                      Token Stored ✓
                            │
                            ▼
        ┌────────────────────────────────────────┐
        │      /admin/dashboard/[route]          │
        │      AdminDashboard.jsx Layout         │
        ├────────────────────────────────────────┤
        │  ┌────────────┐    ┌──────────────────┐│
        │  │  Sidebar   │    │    Header        ││
        │  │            │    │                  ││
        │  │ Navigation │    │  Notifications   ││
        │  │            │    │  Profile Menu    ││
        │  │ - Overview │    │                  ││
        │  │ - Module 1 │    │                  ││
        │  │ - Module 2 │    └──────────────────┘│
        │  │ ...        │                        │
        │  └────────────┘                        │
        │                                        │
        │    ┌──────────────────────────────┐    │
        │    │      Main Content Area       │    │
        │    │  (Outlet for current page)   │    │
        │    │                              │    │
        │    │  ┌────────────────────────┐  │    │
        │    │  │ Management Module      │  │    │
        │    │  │ (12 options)           │  │    │
        │    │  │                        │  │    │
        │    │  │ ┌──────────────────┐   │  │    │
        │    │  │ │   DataTable      │   │  │    │
        │    │  │ │ - Search         │   │  │    │
        │    │  │ │ - Pagination     │   │  │    │
        │    │  │ │ - CRUD Buttons   │   │  │    │
        │    │  │ └──────────────────┘   │  │    │
        │    │  │                        │  │    │
        │    │  │ ┌──────────────────┐   │  │    │
        │    │  │ │  FormModal       │   │  │    │
        │    │  │ │ (Create/Update)  │   │  │    │
        │    │  │ └──────────────────┘   │  │    │
        │    │  │                        │  │    │
        │    │  │ ┌──────────────────┐   │  │    │
        │    │  │ │ConfirmDialog     │   │  │    │
        │    │  │ │ (Delete)         │   │  │    │
        │    │  │ └──────────────────┘   │  │    │
        │    │  └────────────────────────┘  │    │
        │    │                              │    │
        │    └──────────────────────────────┘    │
        │                                        │
        │    ┌──────────────────────────────┐    │
        │    │       Footer                 │    │
        │    └──────────────────────────────┘    │
        └────────────────────────────────────────┘
```

## 📊 Component Hierarchy

```
App (Root)
├── Routes
│   └── Route: /admin/login
│       └── AdminLogin
│   └── Route: /admin/dashboard
│       └── AdminDashboard
│           ├── AdminSidebar
│           │   ├── Menu Items
│           │   └── Logout Button
│           ├── AdminHeader
│           │   ├── Notifications
│           │   └── Profile Menu
│           ├── Outlet (for child routes)
│           │   ├── DashboardOverview
│           │   ├── CandidatesManagement
│           │   │   ├── DataTable
│           │   │   │   └── Columns & Actions
│           │   │   ├── FormModal
│           │   │   └── ConfirmDialog
│           │   ├── CompaniesManagement
│           │   ├── UniversitiesManagement
│           │   ├── JobRolesManagement
│           │   ├── JobApplicationsManagement
│           │   ├── HRsManagement
│           │   ├── ManagersManagement
│           │   ├── VolunteersManagement
│           │   ├── WorkshopsManagement
│           │   ├── JobFairDatesManagement
│           │   └── FeedbackManagement
│           └── Footer
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────────┐  ┌──────────────────┐
            │ Click "Add New"  │  │ Click "Edit"     │
            └────────┬─────────┘  └────────┬─────────┘
                     │                     │
                     └─────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │  FormModal Opens     │
                    ├──────────────────────┤
                    │ - User fills form    │
                    │ - Validation runs    │
                    │ - Submit handler     │
                    └─────────┬────────────┘
                              ▼
                    ┌──────────────────────┐
                    │  API Call (TODO)     │
                    │  POST/PUT request    │
                    └─────────┬────────────┘
                              ▼
                    ┌──────────────────────┐
                    │  Update State        │
                    │  - Refresh data      │
                    │  - Show notification │
                    │  - Close modal       │
                    └─────────┬────────────┘
                              ▼
                    ┌──────────────────────┐
                    │  Re-render DataTable │
                    │  with updated data   │
                    └──────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    DELETE OPERATION FLOW                         │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
            ┌──────────────────┐  ┌───────────────────┐
            │ Click Delete     │  │ ConfirmDialog     │
            │ button           │  │ opens             │
            └────────┬─────────┘  └────────┬──────────┘
                     │                     │
                     └─────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │ User confirms        │
                    └─────────┬────────────┘
                              ▼
                    ┌──────────────────────┐
                    │ API Call (TODO)      │
                    │ DELETE request       │
                    └─────────┬────────────┘
                              ▼
                    ┌──────────────────────┐
                    │ Update State         │
                    │ - Remove from list   │
                    │ - Show success msg   │
                    │ - Close dialog       │
                    └─────────┬────────────┘
                              ▼
                    ┌──────────────────────┐
                    │ Re-render DataTable  │
                    │ (without deleted row)│
                    └──────────────────────┘
```

## 📁 Module Organization

```
Each Management Module Structure:
├── Local State Management
│   ├── Data array (mock)
│   ├── Modal visibility
│   ├── Confirm dialog visibility
│   ├── Selected record
│   └── Loading state
│
├── Data Definitions
│   ├── Mock data
│   ├── Column definitions
│   └── Form field definitions
│
├── Event Handlers
│   ├── handleAdd()
│   ├── handleEdit(record)
│   ├── handleDelete(record)
│   ├── handleFormSubmit(formData)
│   ├── handleConfirmDelete()
│   └── handlePageChange(page)
│
└── JSX Rendering
    ├── CRUD Header
    ├── DataTable Component
    ├── FormModal Component
    └── ConfirmDialog Component
```

## 🗄️ Data Model Mapping

```
Database Tables → Admin Modules

Candidate                → CandidatesManagement
├── candidate_id
├── email
├── name
├── contact
├── university_name
├── branch
├── status

Company                 → CompaniesManagement
├── company_id
├── name
├── email
├── contact
├── city
├── industry
├── status

Job_Role               → JobRolesManagement
├── job_role_id
├── title
├── company
├── location
├── salary
├── type
├── vacancies

Job_Application       → JobApplicationsManagement
├── application_id
├── candidate_name
├── job_title
├── company
├── applied_date
├── status

HR                    → HRsManagement
├── id
├── name
├── email
├── contact
├── company
├── designation
├── status

Manager               → ManagersManagement
├── manager_id
├── name
├── email
├── contact
├── role
├── status

University            → UniversitiesManagement
├── university_id
├── name
├── email
├── contact
├── city
├── state
├── status

Volunteer             → VolunteersManagement
├── volunteer_id
├── name
├── email
├── contact
├── university
├── department
├── status

Workshop              → WorkshopsManagement
├── workshop_id
├── title
├── guest_name
├── date
├── mode
├── status

Job_Fair_Dates        → JobFairDatesManagement
├── date_id
├── date
├── day
├── event_name
├── status

Feedback              → FeedbackManagement
├── id
├── sender_name
├── sender_email
├── message
├── rating
├── date
```

## 🔌 API Integration Points

```
Current State: MOCK DATA
Future State: API INTEGRATION

For each module:
├── On Mount:
│   └── fetch data from GET /admin/{resource}
│
├── On Add:
│   └── POST /admin/{resource} with formData
│
├── On Edit:
│   └── PUT /admin/{resource}/{id} with formData
│
└── On Delete:
    └── DELETE /admin/{resource}/{id}
```

## 🎯 User Journey

```
New User
  │
  ├─→ Visit /admin/login
  │   │
  │   ├─→ Enter email
  │   ├─→ Enter password
  │   └─→ Click Login
  │       │
  │       ├─ Validation ✓
  │       ├─ API Call ✓
  │       └─→ Redirect to /admin/dashboard/overview
  │
  └─→ Admin Dashboard
      │
      ├─→ View Statistics
      │   └─ Overview of all data
      │
      ├─→ Navigate to Module
      │   │
      │   ├─→ View All Records
      │   ├─→ Search Records
      │   ├─→ Paginate Records
      │   │
      │   ├─→ Add New Record
      │   │   ├─ Fill Form
      │   │   └─ Submit
      │   │
      │   ├─→ Edit Record
      │   │   ├─ Open Form
      │   │   ├─ Modify Data
      │   │   └─ Submit
      │   │
      │   └─→ Delete Record
      │       ├─ Confirm
      │       └─ Remove
      │
      └─→ Logout
          └─ Clear Session
```

## 🎨 Styling Hierarchy

```
Root Level (CSS Variables/Colors)
├── Primary: #667eea → #764ba2 (gradient)
├── Success: #48bb78
├── Warning: #ed8936
├── Danger: #f56565
├── Info: #4299e1
└── Neutral: #1a202c → #cbd5e0

Component Styles
├── Layout Components
│   ├── AdminLogin.css (standalone)
│   ├── AdminDashboard.css (grid layout)
│   ├── AdminSidebar.css (fixed sidebar)
│   └── AdminHeader.css (fixed header)
│
├── Feature Components
│   ├── DataTable.css (table + pagination)
│   ├── FormModal.css (modal + form)
│   └── ConfirmDialog.css (dialog)
│
└── Page Styles
    ├── DashboardOverview.css (stats)
    ├── CRUD.css (common for management)
    └── Inline styles (badges, status)

Responsive Breakpoints
├── Desktop: 1200px+
├── Tablet: 768px - 1024px
├── Mobile: 480px - 768px
└── Small Mobile: < 480px
```

## 🔐 Authentication Flow

```
┌──────────────────────┐
│  User enters email   │
│  and password        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Client-side         │
│  validation          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Send to API         │
│  POST /admin/login   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Backend validates   │
│  credentials (TODO)  │
└──────────┬───────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
    ✓ Valid   ✗ Invalid
      │          │
      │          └─→ Error Response
      │
      ▼
┌──────────────────────┐
│  Generate JWT token  │
│  (TODO)              │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Store in cookie     │
│  with token & role   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Redirect to         │
│  /admin/dashboard    │
└──────────────────────┘
```

---

**Created**: June 2024
**Version**: 1.0
**Status**: Architecture Complete - Ready for Implementation
