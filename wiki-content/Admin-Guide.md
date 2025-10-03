# Admin Guide

Complete guide for administrators managing the Student Report System, including user management, system configuration, and advanced features.

---

## 📖 Table of Contents

1. [Admin Access](#admin-access)
2. [User Management](#user-management)
3. [Student Management](#student-management)
4. [Report Management](#report-management)
5. [System Settings](#system-settings)
6. [Data Management](#data-management)
7. [Security & Permissions](#security--permissions)
8. [Monitoring & Analytics](#monitoring--analytics)

---

## 🔐 Admin Access

### Admin Credentials

**Default Admin Account:**
```
Email: admin@example.com
Password: admin123
```

⚠️ **IMPORTANT:** Change default password immediately after first login!

### Admin Dashboard

After logging in as admin, you have access to:
- **All user accounts** management
- **Create/Edit/Delete** students and reports
- **System settings** configuration
- **Analytics dashboard** with detailed statistics
- **Audit logs** for security monitoring

### Admin vs Regular User

| Feature | Regular User | Admin |
|---------|--------------|-------|
| View Students | ✅ | ✅ |
| View Reports | ✅ | ✅ |
| Create Students | ❌ | ✅ |
| Edit Students | ❌ | ✅ |
| Delete Students | ❌ | ✅ |
| Create Reports | ❌ | ✅ |
| Edit Reports | ❌ | ✅ |
| Delete Reports | ❌ | ✅ |
| User Management | ❌ | ✅ |
| System Settings | ❌ | ✅ |
| View Audit Logs | ❌ | ✅ |

---

## 👥 User Management

### Viewing All Users

**Access:** Dashboard → Users → View All

**URL:** `/admin/users`

### User List Features

- **Search users** by name, email, role
- **Filter by role** (Admin, Teacher, Student)
- **Filter by status** (Active, Inactive, Suspended)
- **Sort** by name, registration date, last login

### Creating New Users

1. Navigate to Users page
2. Click **"Add New User"** button
3. Fill in the form:

```
Required Fields:
├── Full Name
├── Email Address
├── Password (auto-generated or custom)
├── Role (Admin, Teacher, Student)
└── Status (Active/Inactive)

Optional Fields:
├── Phone Number
├── Department
├── Profile Picture
└── Additional Notes
```

4. Click **"Create User"**
5. User receives email with credentials

### Editing User Information

1. Find user in list
2. Click **"Edit"** button
3. Modify fields:
   - Personal information
   - Email address
   - Role and permissions
   - Status (Active/Inactive)
4. Click **"Save Changes"**

### Resetting User Passwords

**Method 1: Admin Reset**
1. Go to user profile
2. Click **"Reset Password"**
3. Generate new password or enter custom one
4. User receives email with new password

**Method 2: User Self-Reset**
- User clicks "Forgot Password" on login page
- Receives reset link via email
- Sets new password

### Suspending/Deleting Users

**Suspend User:**
1. Navigate to user profile
2. Click **"Suspend Account"**
3. Provide reason (optional)
4. Confirm action
5. User cannot login until reactivated

**Delete User:**
1. Navigate to user profile
2. Click **"Delete Account"**
3. ⚠️ Warning: This action cannot be undone
4. Type "DELETE" to confirm
5. User and associated data removed

**Best Practice:** Suspend instead of delete to preserve data history.

### User Roles and Permissions

#### Admin Role
- Full system access
- User management
- System configuration
- All CRUD operations

#### Teacher Role
- View all students and reports
- Create reports for assigned students
- Edit own reports
- Cannot delete students/reports

#### Student Role (Future)
- View own profile
- View own reports
- Cannot edit or create

---

## 👨‍🎓 Student Management

### Creating New Students

**Access:** Students page → "Add New Student" button

**Form Fields:**

```
Personal Information:
├── First Name *
├── Last Name *
├── Date of Birth *
├── Gender *
└── Profile Photo (optional)

Academic Information:
├── Student ID * (auto-generated or custom)
├── Grade Level *
├── Class/Section *
├── Enrollment Date *
└── Status (Active/Inactive/Graduated) *

Contact Information:
├── Email Address
├── Phone Number
├── Parent/Guardian Name *
├── Parent/Guardian Phone *
└── Address

Additional Information:
├── Emergency Contact
├── Medical Information
└── Special Notes

* Required fields
```

**Workflow:**
1. Click **"Add New Student"**
2. Fill in all required fields
3. Upload profile photo (optional)
4. Click **"Save Student"**
5. Student appears in list immediately

**Student ID Generation:**
- **Auto-generated:** STU[YYYY][0001-9999]
  - Example: STU20240001, STU20240002
- **Custom:** Enter your own format
  - Must be unique

### Editing Student Information

1. Navigate to Students page
2. Click student card or search for student
3. Click **"Edit"** button on student detail page
4. Modify any field
5. Click **"Save Changes"**

**Tracked Changes:**
- All edits are logged
- View edit history on student profile
- Shows: Who, What, When

### Managing Student Status

#### Status Types

| Status | Description | When to Use |
|--------|-------------|-------------|
| **Active** | Currently enrolled | Default for new students |
| **Inactive** | Temporarily not attending | Medical leave, suspension |
| **Graduated** | Completed program | After graduation |
| **Transferred** | Moved to another school | When transferring out |
| **Withdrawn** | Permanently left | Dropped out or removed |

#### Changing Status
1. Go to student profile
2. Click **"Change Status"**
3. Select new status
4. Provide reason and effective date
5. Confirm change

### Bulk Operations

Perform actions on multiple students:

**Bulk Import:**
1. Click **"Import Students"**
2. Download CSV template
3. Fill in student data
4. Upload completed CSV
5. Review and confirm import

**CSV Format:**
```csv
firstName,lastName,dateOfBirth,gender,gradeLevel,email,phone
John,Doe,2008-05-15,Male,10,john.doe@email.com,555-0101
Jane,Smith,2008-08-22,Female,10,jane.smith@email.com,555-0102
```

**Bulk Export:**
1. Click **"Export Students"**
2. Select fields to include
3. Choose format (CSV, Excel, PDF)
4. Download file

**Bulk Update:**
1. Select multiple students (checkboxes)
2. Click **"Bulk Actions"**
3. Choose action:
   - Update grade level
   - Change status
   - Assign to class
   - Send notification
4. Confirm changes

### Deleting Students

⚠️ **Warning:** Deleting a student removes all associated data!

**What gets deleted:**
- Student profile
- All reports for that student
- Enrollment records
- Attendance data

**Deletion Process:**
1. Navigate to student profile
2. Click **"Delete Student"**
3. Review warning message
4. Type student name to confirm
5. Provide deletion reason
6. Click **"Permanently Delete"**

**Best Practice:** Archive students instead of deleting for data retention.

---

## 📝 Report Management

### Creating New Reports

**Access:** Reports page → "Generate New Report" button

**Report Creation Workflow:**

```
Step 1: Select Student
├── Search by name or ID
└── Select from dropdown

Step 2: Report Details
├── Academic Term (Fall/Spring/Summer)
├── Academic Year (2024)
├── Report Type (Progress/Final/Midterm)
└── Report Date

Step 3: Grades Entry
├── Subject: Grade
├── Subject: Grade
├── Overall GPA (calculated)
└── Class Rank (optional)

Step 4: Performance Analysis
├── Strengths (text area)
├── Areas for Improvement (text area)
└── Recommendations (text area)

Step 5: Attendance
├── Days Present
├── Days Absent
├── Total Days
└── Attendance Rate (calculated)

Step 6: Comments
├── Teacher Comments (text area)
├── Principal Comments (text area)
└── Additional Notes (optional)

Step 7: Review & Publish
├── Preview report
├── Save as Draft or Publish
└── Send notification to student/parent
```

**Quick Report:**
- Use template with pre-filled common sections
- Customize only grades and comments
- Faster for bulk report generation

### Editing Reports

**Draft Reports:**
- Can be freely edited
- No restrictions
- Not visible to students

**Published Reports:**
- Can be edited with version tracking
- Old versions archived
- Students see latest version

**Edit Process:**
1. Navigate to report
2. Click **"Edit Report"**
3. Modify fields
4. Add edit note (why editing)
5. Save changes

### Report Templates

Create templates for faster report generation:

1. Go to Reports → Templates
2. Click **"Create Template"**
3. Define template:
   - Name (e.g., "Grade 10 Final Report")
   - Grade level
   - Standard subjects
   - Comment templates
4. Save template

**Using Templates:**
1. Click "New Report"
2. Select **"Use Template"**
3. Choose template
4. Customize for specific student
5. Generate report

### Bulk Report Generation

Generate reports for multiple students:

1. Click **"Bulk Generate Reports"**
2. Select students:
   - By class/section
   - By grade level
   - Custom selection
3. Choose template
4. Set academic term and year
5. Enter bulk data:
   - Upload grades CSV
   - Or enter manually
6. Preview reports
7. Generate all

### Report Status Management

| Status | Description | Actions Available |
|--------|-------------|-------------------|
| **Draft** | Work in progress | Edit, Delete, Publish |
| **Pending Review** | Awaiting approval | Edit, Approve, Reject |
| **Published** | Finalized and visible | View, Edit (tracked), Archive |
| **Archived** | Old report version | View only, Restore |

### Deleting Reports

**Draft Reports:**
- Can be deleted without confirmation
- Removed immediately

**Published Reports:**
1. Click **"Delete Report"**
2. Provide reason
3. Type report title to confirm
4. Report archived (not permanently deleted)
5. Can be restored from archive

---

## ⚙️ System Settings

**Access:** Dashboard → Settings (gear icon)

### General Settings

```
System Configuration:
├── School Name
├── School Logo
├── Academic Year (e.g., 2024-2025)
├── Current Term (Fall/Spring/Summer)
├── Default Language
└── Timezone

Grading System:
├── Grading Scale (A-F, 0-100, etc.)
├── Passing Grade
├── GPA Calculation Method
└── Grade Weights

Notification Settings:
├── Email Notifications (On/Off)
├── Report Published Alerts
├── New User Welcome Email
└── Password Reset Email

Security Settings:
├── Session Timeout (minutes)
├── Password Requirements
│   ├── Minimum Length
│   ├── Require Special Characters
│   └── Password Expiry (days)
├── Two-Factor Authentication
└── IP Whitelist (optional)
```

### Appearance Settings

**Theme Configuration:**
- Primary color
- Secondary color
- Logo upload
- Favicon

**Layout Options:**
- Card view or list view default
- Items per page
- Date format
- Number format

### Email Configuration

**SMTP Settings:**
```
SMTP Server: smtp.gmail.com
SMTP Port: 587
Username: your-email@gmail.com
Password: your-app-password
From Name: Student Report System
From Email: noreply@example.com
```

**Email Templates:**
- Welcome email
- Password reset
- Report published
- Account suspended

### Database Maintenance

**Access:** Settings → Database

**Operations:**

1. **Backup Database**
   - Click "Create Backup"
   - Download backup file
   - Store securely off-site

2. **Restore Database**
   - Upload backup file
   - Select restore point
   - Confirm restoration

3. **Optimize Database**
   - Run monthly
   - Clears cache
   - Rebuilds indexes

4. **Data Cleanup**
   - Remove old sessions
   - Archive old reports
   - Clean up unused files

---

## 💾 Data Management

### Data Import

**Supported Formats:**
- CSV
- Excel (.xlsx)
- JSON

**Import Types:**

**1. Student Import**
```csv
firstName,lastName,dateOfBirth,gender,gradeLevel,studentID,email
John,Doe,2008-05-15,Male,10,STU001,john@email.com
```

**2. Report Import**
```csv
studentID,term,year,subject,grade,comments
STU001,Fall,2024,Math,A,Excellent work
```

**Import Process:**
1. Download template
2. Fill in data
3. Upload file
4. Review validation errors
5. Confirm import

### Data Export

**Export Options:**

**1. Complete Backup**
- All students
- All reports
- All users
- System settings

**2. Selective Export**
- Choose specific tables
- Date range filter
- Status filter
- Format selection

**Export Formats:**
- **CSV** - For spreadsheets
- **JSON** - For developers
- **PDF** - For printing
- **Excel** - For analysis

**Scheduled Exports:**
- Set up automatic daily/weekly backups
- Email backup to admin
- Upload to cloud storage

### Data Migration

**Moving to Production:**

1. Export data from development
2. Review for sensitive information
3. Import to production database
4. Verify data integrity
5. Test functionality

**From Other Systems:**

1. Prepare mapping document
2. Transform data to match schema
3. Run test import
4. Validate results
5. Perform full import

---

## 🔒 Security & Permissions

### Access Control

**Permission Levels:**

```
Super Admin:
└── Full system access

Admin:
├── User management
├── All CRUD operations
├── System settings
└── View audit logs

Teacher:
├── View students
├── Create/edit reports
├── View analytics
└── Cannot delete data

Student (Future):
├── View own profile
├── View own reports
└── Cannot edit anything
```

### Audit Logs

**Access:** Dashboard → Security → Audit Logs

**Logged Events:**
- User login/logout
- User creation/deletion
- Student creation/editing/deletion
- Report creation/editing/deletion
- Settings changes
- Failed login attempts
- Permission changes

**Log Details:**
```
Event: Student Deleted
User: admin@example.com
Action: DELETE
Resource: Student ID STU001 (John Doe)
IP Address: 192.168.1.100
Timestamp: 2024-01-15 14:30:25
Status: Success
Details: Deleted via bulk action
```

**Filtering Logs:**
- By user
- By action type
- By date range
- By resource type
- By IP address

### Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix uppercase, lowercase, numbers, symbols
   - Change quarterly

2. **Enable Two-Factor Authentication**
   - For all admin accounts
   - Use authenticator app

3. **Regular Security Audits**
   - Review audit logs weekly
   - Check for suspicious activity
   - Update permissions regularly

4. **Data Backups**
   - Daily automatic backups
   - Store off-site
   - Test restoration monthly

5. **Session Management**
   - Set reasonable timeout (30-60 minutes)
   - Force logout on public computers
   - Monitor active sessions

---

## 📊 Monitoring & Analytics

### System Dashboard

**Access:** Dashboard → Analytics

**Key Metrics:**

```
User Statistics:
├── Total Users (by role)
├── Active Sessions
├── New Registrations (this month)
└── Login Activity (7-day chart)

Student Statistics:
├── Total Students (by status)
├── Students by Grade Level
├── New Enrollments (this month)
└── Graduation Rate

Report Statistics:
├── Total Reports
├── Reports by Term
├── Reports by Status (Draft/Published)
└── Report Generation Trend

System Health:
├── Server Status
├── Database Status
├── Storage Usage
└── API Response Time
```

### Reports & Analytics

**Available Reports:**

1. **Enrollment Report**
   - Students by grade
   - Enrollment trends
   - Demographics

2. **Academic Performance**
   - Average grades by subject
   - Grade distribution
   - Top performers

3. **User Activity Report**
   - Login frequency
   - Feature usage
   - Session duration

4. **System Usage**
   - Most accessed pages
   - Peak usage times
   - API call statistics

**Generating Custom Reports:**
1. Go to Analytics → Custom Reports
2. Select metrics
3. Choose date range
4. Apply filters
5. Generate report
6. Export or schedule

### Performance Monitoring

**Database Performance:**
- Query execution time
- Slow query log
- Connection pool usage

**API Performance:**
- Response times by endpoint
- Error rates
- Request volume

**Frontend Performance:**
- Page load times
- User interactions
- Browser compatibility

### Alerts & Notifications

**Set Up Alerts:**
1. Go to Settings → Alerts
2. Create new alert
3. Define conditions:
   - Failed login attempts > 5
   - Server response time > 2s
   - Disk usage > 80%
4. Set notification method:
   - Email
   - SMS
   - Slack/Discord webhook
5. Save alert

---

## 🛠️ Advanced Administration

### Command Line Access

For advanced operations, use the admin CLI:

```bash
# Access admin console
npm run admin:console

# Common commands
admin:user:list                    # List all users
admin:user:create <email> <role>   # Create user
admin:user:reset-password <email>  # Reset password
admin:backup:create                # Create backup
admin:backup:restore <file>        # Restore backup
admin:cleanup:sessions             # Clear old sessions
admin:optimize:database            # Optimize database
```

### Database Console

**Access Prisma Studio:**
```bash
npx prisma studio
```

**Direct SQL Access:**
```bash
# Enter Prisma console
npx prisma db execute --stdin
```

⚠️ **Warning:** Direct database access can corrupt data. Use with caution!

### API Access

**Admin API Endpoints:**

```
GET  /api/admin/users              # List all users
POST /api/admin/users              # Create user
PUT  /api/admin/users/:id          # Update user
DEL  /api/admin/users/:id          # Delete user

GET  /api/admin/audit-logs         # Get audit logs
GET  /api/admin/analytics          # Get analytics
POST /api/admin/backup             # Create backup
POST /api/admin/restore            # Restore backup
```

**Authentication:**
```bash
# Include admin token in requests
curl -H "Authorization: Bearer <admin_token>" \
     https://your-domain.com/api/admin/users
```

---

## ✅ Admin Checklist

### Daily Tasks
- [ ] Check audit logs for suspicious activity
- [ ] Review new user registrations
- [ ] Monitor system performance
- [ ] Respond to support requests

### Weekly Tasks
- [ ] Review and approve pending reports
- [ ] Check database backups
- [ ] Update student statuses
- [ ] Generate weekly analytics report

### Monthly Tasks
- [ ] Run database optimization
- [ ] Review user permissions
- [ ] Archive old reports
- [ ] Generate monthly analytics
- [ ] Update system documentation

### Quarterly Tasks
- [ ] Force password resets for admins
- [ ] Security audit
- [ ] Performance optimization
- [ ] User training sessions

---

## 🆘 Admin Support

### Getting Help

1. **Documentation** - Check [Developer Guide](Developer-Guide)
2. **Troubleshooting** - See [Troubleshooting](Troubleshooting)
3. **GitHub Issues** - Report bugs
4. **Email Support** - developer@example.com

### Emergency Contacts

**System Down:**
- Contact hosting provider
- Check [Deployment Guide](Deployment-Guide)

**Data Breach:**
1. Immediately suspend all accounts
2. Change all passwords
3. Review audit logs
4. Contact authorities if needed

**Data Loss:**
1. Stop all operations
2. Restore from latest backup
3. Verify data integrity
4. Inform affected users

---

## 📚 Related Documentation

- **[User Guide](User-Guide)** - For regular users
- **[Developer Guide](Developer-Guide)** - Technical details
- **[API Documentation](API-Documentation)** - API reference
- **[Database Schema](Database-Schema)** - Database structure
- **[Deployment Guide](Deployment-Guide)** - Deployment instructions

---

*Need more help? Contact system administrator at admin@example.com*
