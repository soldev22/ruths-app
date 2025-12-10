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
- Land on homepage with clear "I'm a Teacher" / "I'm a Parent/Individual" choice
- Click "I'm a Teacher" → Redirected to teacher-specific landing page
- See teacher benefits:
  - Screen multiple students
  - Manage class/school assessments
  - Professional reports for parents and SENCO
  - Track student progress over time
  - Bulk assessment management

**Friction Points to Address:**
- Need clear differentiation at entry point
- Teachers need to see classroom-scale benefits

---

### 2. REGISTRATION
**Goal:** Quick sign-up with teacher-specific information

**Current Flow:**
- Register with email/password
- Generic user account created

**Optimized Flow:**
- Register with "Teacher" account type selection
- Collect additional fields:
  - School name
  - Role (Class Teacher, SENCO, Learning Support, etc.)
  - Year groups taught
  - Optional: School license key (for bulk discounts)
- Email verification
- Welcome email with teacher quick-start guide

**Friction Points to Address:**
- Keep form short (under 8 fields)
- Offer "complete profile later" option
- Pre-fill school if license key provided

---

### 3. ONBOARDING
**Goal:** Get first assessment started quickly

**Current Flow:**
- Login → Dashboard (empty state)
- Manual navigation to start assessment

**Optimized Flow:**
- First login → Welcome modal:
  - "Let's screen your first student"
  - Quick video (30 seconds): How to administer assessment
  - Button: "Start First Assessment"
- Dashboard tour (skippable):
  - How to view results
  - Where to generate reports
  - How to add more students

**Teacher-Specific Guidance:**
- Tips for conducting assessments:
  - Quiet environment recommended
  - 15-20 minutes per section
  - Can pause and resume
  - Student works independently while teacher supervises
- Best practices:
  - Morning sessions preferred
  - Avoid right after lunch or PE
  - Have paper available for calculations

---

### 4. STARTING AN ASSESSMENT
**Goal:** Quickly set up a new student screening

**Current Flow:**
- Dashboard → "New Case" button
- Select screening type (Dyslexia/Dyscalculia)
- Select year level (S1-S5)
- Start assessment

**Optimized Flow for Teachers:**
- Dashboard → "Screen New Student" (prominent button)
- Quick-start form:
  - **Student identifier** (first name or code for privacy)
  - **Assessment type** (Dyslexia / Dyscalculia / Both)
  - **Year level** (S1-S5 with age guidance: S1=12yrs, etc.)
  - Optional: Class/group tag
  - Optional: Previous concerns/notes
- Save → Start immediately OR "Add to queue"
- Option: "Bulk add students" (CSV upload for multiple students)

**Teacher Workflow Options:**
- **Option A:** Start assessment immediately (teacher supervises student)
- **Option B:** Save for later (generate list, conduct multiple in one session)
- **Option C:** Generate unique student link (for remote/homework assessment)

**Friction Points to Address:**
- Reduce clicks from dashboard to assessment start
- Allow batch creation of cases
- Privacy-first: use codes instead of full names if preferred

---

### 5. DURING ASSESSMENT (Teacher Supervision)
**Goal:** Student completes independently, teacher monitors progress

**Teacher View Features:**
- Live progress indicator (which section, how many questions remaining)
- Elapsed time tracker
- "Pause & Save" button (highly visible)
- Notes field for teacher observations
- Student can't navigate backward (prevents answer changing)

**Student Experience (teacher-supervised):**
- Clean, distraction-free interface
- One question at a time
- Clear answer buttons
- Progress bar at top
- Encouragement messages between sections
- Auto-save every answer

**Friction Points to Address:**
- Ensure no distractions (hide navigation during assessment)
- Make pause/resume seamless
- Handle internet disconnections gracefully

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
- Generate professional report for parents
- Generate SENCO/support team summary
- Mark student for follow-up
- Schedule next assessment (6-month review)

---

### 7. VIEWING RESULTS & REPORTS
**Goal:** Understand results and take appropriate action

**Teacher Dashboard Features:**
- List of all screened students
- Filters:
  - By assessment type (Dyslexia/Dyscalculia)
  - By risk level (High/Moderate/Low)
  - By date range
  - By class/group
- Quick actions per student:
  - View full results
  - Generate report
  - Add notes
  - Schedule follow-up

**Report Options:**
- **Parent Report** (AI-generated, professional, accessible language)
- **SENCO Report** (detailed technical breakdown)
- **Basic Export** (all responses, for records)

**Friction Points to Address:**
- Teachers need to generate reports quickly (one-click)
- Reports should be professional and parent-friendly
- Easy to track which students need follow-up

---

### 8. ONGOING USE
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

---

## Key Teacher Pain Points to Solve

### High Priority:
1. **Speed:** Teachers need to screen 20-30 students efficiently
2. **Privacy:** Student data must be protected (GDPR compliant)
3. **Professional Reports:** Parents expect high-quality documentation
4. **Tracking:** Who's been screened, who needs follow-up
5. **Evidence:** Results must be defensible for SENCO/support referrals

### Medium Priority:
6. **Bulk Operations:** Add multiple students, generate multiple reports
7. **Integration:** Export to school MIS systems
8. **Collaboration:** Share results with SENCO/leadership
9. **Progress Tracking:** Compare results over time

### Lower Priority:
10. **Analytics:** School-wide trends and insights
11. **Training Materials:** How to interpret results
12. **Parent Communication Templates:** Letters and meeting guides

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
