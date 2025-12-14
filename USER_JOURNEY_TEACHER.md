# Teacher User Journey - SkillScan Platform

## Overview
Teachers use SkillScan to screen multiple students for dyslexia and dyscalculia, track results over time, and generate professional reports for parents and educational support teams.

---

## Journey Map

### 1. DISCOVERY & LANDING
**Goal:** Understand what SkillScan offers for teachers

**Current Flow:**
- Land on homepage
- See general information

**Optimized Flow:**
  - Manage class/school assessments
  - Professional reports for parents and SENCO

**Friction Points to Address:**
- Need clear differentiation at entry point
- Teachers need to see classroom-scale benefits

### 2. REGISTRATION
**Goal:** Quick sign-up with teacher-specific information
- Generic user account created

  - School name
  - Year groups taught
  - Optional: School license key (for bulk discounts)
- Email verification
- Welcome email with teacher quick-start guide

---


**Optimized Flow:**
  - Button: "Start First Assessment"
  - How to view results
  - Where to generate reports
  - How to add more students

**Teacher-Specific Guidance:**
  - Can pause and resume
  - Student works independently while teacher supervises

---

### 4. STARTING AN ASSESSMENT
**Goal:** Quickly set up a new student screening

**Current Flow:**
**Optimized Flow for Teachers:**
- Quick-start form:
  - **Student identifier** (first name or code for privacy)
  - **Assessment type** (Dyslexia / Dyscalculia / Both)
  - **Year level** (S1-S5 with age guidance: S1=12yrs, etc.)
  - Optional: Class/group tag
- Option: "Bulk add students" (CSV upload for multiple students)

**Teacher Workflow Options:**
- **Option A:** Start assessment immediately (teacher supervises student)
- **Option C:** Generate unique student link (for remote/homework assessment)

**Friction Points to Address:**
- Reduce clicks from dashboard to assessment start
- Allow batch creation of cases
- Privacy-first: use codes instead of full names if preferred
### 5. DURING ASSESSMENT (Teacher Supervision)
**Goal:** Student completes independently, teacher monitors progress
- Elapsed time tracker
- Notes field for teacher observations
- Student can't navigate backward (prevents answer changing)

**Student Experience (teacher-supervised):**
- Clean, distraction-free interface
**Friction Points to Address:**
- Ensure no distractions (hide navigation during assessment)
---
### 6. COMPLETING ASSESSMENT
**Goal:** Immediate feedback and next steps

**Current Flow:**
- Complete final question
- Redirect to overview page
- See results

**Optimized Flow for Teachers:**
- Complete final question
- Success message: "Assessment Complete! ✓"
- Automatic redirect to overview (3 seconds)
- Overview page shows:
  - Overall risk classification (color-coded)
  - Section-by-section breakdown
  - Quick interpretation guide
  - "Generate Report" button (prominent)
  - "Add Teacher Notes" field

**Teacher-Specific Actions:**
- Add contextual notes (observed behaviors, student feedback)
- Generate SENCO/support team summary
- Mark student for follow-up
- Schedule next assessment (6-month review)

**Teacher Dashboard Features:**
- List of all screened students
  - By class/group
- Quick actions per student:

**Report Options:**
**Friction Points to Address:**
- Teachers need to generate reports quickly (one-click)

**Goal:** Manage multiple students efficiently over time

**Teacher Power Features:**
- **Class View:** See all students from one class
- **Cohort Tracking:** Year-group trends
- **Bulk Actions:** Generate multiple reports at once
- **Reminders:** Follow-up assessments (6-12 month intervals)
- **Export:** CSV of all results for school records
- **Comparison:** Track individual student progress over time
**Subscription Model for Teachers:**
- **Free Trial:** 3 students
- **Individual Teacher:** £X/month for unlimited students
- **School License:** £Y/year for whole school (multiple teachers)

### High Priority:
5. **Evidence:** Results must be defensible for SENCO/support referrals

9. **Progress Tracking:** Compare results over time


---

## Teacher-Specific UI Enhancements Needed

### 1. Dashboard
- [ ] Add "Teacher View" with class/student management
- [ ] Student list with filtering and search
- [ ] Bulk action checkboxes
- [ ] "Screen New Student" prominent CTA
- [ ] Quick stats: Total screened, high-risk count, pending reports

### 2. Assessment Creation
- [ ] Quick-add student form (minimal fields)
- [ ] Bulk student upload (CSV template)
- [ ] Generate student assessment links
- [ ] Class/group tagging

### 3. Results Management
- [ ] One-click report generation
- [ ] Teacher notes field (visible to teacher only)
- [ ] Follow-up reminders
- [ ] Print-friendly view

### 4. Reports
- [ ] Parent report (accessible language, no jargon)
- [ ] SENCO report (technical detail, recommendations)
- [ ] School records export (CSV/Excel)
- [ ] Letter templates for parents

### 5. Account Settings
- [ ] School information
- [ ] Billing (individual vs school license)
- [ ] Team management (if school license)
- [ ] Data retention settings

---

## Success Metrics for Teachers

1. **Time to First Assessment:** < 3 minutes from registration
2. **Assessment Completion Rate:** > 95%
3. **Report Generation:** < 30 seconds
4. **Teacher Satisfaction:** Can manage 30+ students easily
5. **Return Usage:** Teachers come back for whole class (not just one student)

---

## Next Steps for Development

### Phase 1 (Immediate):
- [ ] Add user type selection at registration
- [ ] Create teacher-specific dashboard view
- [ ] Add student identifier field to cases
- [ ] Improve report generation speed

### Phase 2 (Short-term):
- [ ] Bulk student creation
- [ ] Teacher notes field
- [ ] Follow-up reminders
- [ ] Multiple report formats

### Phase 3 (Medium-term):
- [ ] Class/group management
- [ ] School license model
- [ ] Bulk report generation
- [ ] Progress tracking over time

### Phase 4 (Long-term):
- [ ] Team collaboration features
- [ ] School-wide analytics
- [ ] MIS integration
- [ ] Parent communication templates
