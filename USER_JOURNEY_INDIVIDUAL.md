# Individual/Parent User Journey - SkillScan Platform

## Overview
Parents and individuals use SkillScan to screen their child (or themselves) for dyslexia and dyscalculia, understand the results, and get actionable recommendations.

---

## Journey Map

### 1. DISCOVERY & LANDING
**Goal:** Find help for learning difficulties concerns

**User Context:**
- Parent notices child struggling with reading/math
- Adult suspects they may have undiagnosed dyslexia/dyscalculia
- Looking for affordable alternative to expensive private assessments (£300-800)
- Wants quick answers and clear guidance

**Current Flow:**
- Land on homepage
- See general information

**Optimized Flow:**
- Land on homepage with clear "I'm a Teacher" / "I'm a Parent/Individual" choice
- Click "I'm a Parent/Individual" → Redirected to parent-specific landing page
- See parent/individual benefits:
  - **Affordable:** Fraction of the cost of private assessment
  - **Quick:** Results in 20-30 minutes
  - **Professional:** AI-generated report with recommendations
  - **Private:** Complete at home, on your schedule
  - **Evidence-based:** Aligned with educational standards
- Emotional reassurance:
  - "You're taking the right first step"
  - "Early identification leads to better outcomes"
  - "Not a diagnosis, but a helpful screening tool"

**Key Messages:**
- This is a screening, not a formal diagnosis
- Results can help you decide if professional assessment needed
- Understand your child's strengths and challenges
- Get specific recommendations to help at home

---

### 2. PRE-REGISTRATION (Education Phase)
**Goal:** Understand what the assessment involves before committing

**Landing Page Content:**
- **What is this assessment?**
  - 50 questions across 10 skill areas
  - Takes 15-20 minutes
  - Can pause and resume
  - Age-appropriate questions (12-16 years)
  
- **What will I learn?**
  - Risk classification (High/Moderate/Low)
  - Specific strengths and weaknesses
  - Practical recommendations
  - Whether further professional assessment recommended
  
- **What this is NOT:**
  - Not a medical diagnosis
  - Not a replacement for educational psychologist
  - A screening tool to guide next steps
  
- **Pricing:**
  - Single assessment: £X
  - Both assessments (Dyslexia + Dyscalculia): £Y (save 20%)
  - Pay once, access results forever
  
- **Sample Report Preview:** Show redacted example

**Call to Action:**
- "Start Free Preview" (first 5 questions free)
- "See Sample Report"
- "Start Assessment" (requires registration)

---

### 3. REGISTRATION
**Goal:** Quick sign-up to begin assessment

**Current Flow:**
- Register with email/password
- Generic user account created

**Optimized Flow:**
- Register with "Parent/Individual" account type selection
- Minimal required fields:
  - Email
  - Password
  - "I am assessing:" [My child / Myself / Other]
- Optional fields (can skip):
  - Child's age
  - Country (for tailored recommendations)
- Email verification (send code, not separate link)
- Skip payment initially (payment gate before viewing full results)

**Friction Points to Address:**
- Reduce fields to bare minimum
- Social login options (Google, Microsoft)
- Clear privacy statement ("We never share your data")
- Can start assessment before email verification

---

### 4. ONBOARDING
**Goal:** Feel confident and prepared to begin

**Current Flow:**
- Login → Dashboard (empty state)
- Manual navigation to start assessment

**Optimized Flow:**
- First login → Welcome screen:
  - "Let's get started with your assessment"
  - Brief guidance (3 key points):
    - Find a quiet space
    - Have paper and pencil ready
    - Can pause anytime
  - Assessment type selection:
    - [ ] Dyslexia Screening
    - [ ] Dyscalculia Screening  
    - [ ] Both (recommended if unsure)
  - Age/year level selection (with guidance)
  - Button: "Begin Assessment"

**Parent-Specific Guidance:**
- **If assessing a child:**
  - Sit nearby but let them work independently
  - Don't help with answers (affects accuracy)
  - Encourage them to try their best
  - It's okay if they don't know all answers
  - Take breaks if needed
  
- **If self-assessing:**
  - Work through at your own pace
  - Answer honestly (no "right" way to perform)
  - Some questions may seem easy, others harder - this is normal
  - Your results are completely private

---

### 5. STARTING AN ASSESSMENT
**Goal:** Begin with confidence and clarity

**Current Flow:**
- Dashboard → "New Case" button
- Select screening type
- Select year level
- Start assessment

**Optimized Flow for Individuals:**
- Onboarding → Smooth transition to first question
- Brief overview screen:
  - "You'll answer 50 questions across 10 sections"
  - "Estimated time: 15-20 minutes"
  - "Progress is automatically saved"
  - "You can pause and return anytime"
- Option to enter participant name (optional, for records)
- Start immediately

**Assessment Type Selection Helper:**
- "Not sure which assessment to take?"
- Quick questionnaire:
  - Struggling with reading/spelling? → Dyslexia
  - Struggling with numbers/math? → Dyscalculia
  - Both or unsure? → Take both (bundled price)

---

### 6. DURING ASSESSMENT (Individual Experience)
**Goal:** Complete assessment with minimal stress

**User Experience:**
- Clean, calm interface (no clutter)
- One question at a time
- Large, clear answer buttons
- Progress indicator: "Section 3 of 10 | Question 24 of 50"
- Timer (optional, can hide): Shows time spent
- Encourage messages between sections:
  - "Great progress! Take a break if you need one"
  - "You're halfway there!"
  - "Almost done! Just 2 more sections"

**Key Features:**
- Pause button (always visible)
- Questions can't be skipped (but can mark "I don't know")
- No time pressure (but track time for context)
- Clear visual feedback when answer selected
- Auto-save every answer
- Handle interruptions gracefully

**Emotional Support:**
- Positive, encouraging tone
- "There's no pass or fail"
- Normalize difficulty: "Some questions are meant to be challenging"
- Celebrate completion

---

### 7. COMPLETING ASSESSMENT
**Goal:** Feel accomplished and eager to see results

**Current Flow:**
- Complete final question
- Redirect to overview page
- See results

**Optimized Flow:**
- Complete final question
- Celebration screen:
  - "Well done! Assessment complete! 🎉"
  - "Your results are being prepared..."
  - Brief loading (shows AI generating report - builds anticipation)
  - "Results ready! View now"

**Payment Gate (if not paid yet):**
- Show teaser results:
  - Overall risk classification (blurred detail)
  - Number of sections with concerns
  - "Unlock full results and professional report"
- Pricing options:
  - Full report: £X
  - Add second assessment (Dyslexia OR Dyscalculia): +£Y
- Payment: Stripe checkout
- After payment: Instant access to full results

---

### 8. VIEWING RESULTS
**Goal:** Understand results and know what to do next

**Results Page - Parent/Individual View:**

**Section 1: Overall Summary**
- Risk classification badge (High/Moderate/Low risk)
- Clear explanation:
  - What this means
  - This is a screening, not a diagnosis
  - Recommended next steps
- Emotional reassurance based on results:
  - High risk: "These results suggest further assessment is recommended"
  - Moderate: "Some indicators present - monitoring and support advised"
  - Low: "No significant concerns detected at this time"

**Section 2: Detailed Breakdown**
- Section-by-section results (10 sections)
- Traffic light colors (Red/Amber/Green)
- Brief explanation of each section
- Specific questions missed (if helpful)

**Section 3: Strengths**
- Highlight areas where they performed well
- Positive framing
- "Build on these strengths"

**Section 4: Areas of Concern**
- Specific challenges identified
- Plain language explanations
- No jargon or technical terms

**Section 5: Recommendations**
- **Immediate actions:** What you can do today
  - Books/resources
  - Activities at home
  - Apps and tools
- **School/support:** How to talk to teachers
  - Sample email template
  - What to ask for (e.g., extra time, different seating)
- **Professional help:** When to seek formal assessment
  - What to look for in an educational psychologist
  - Typical costs
  - Questions to ask

**Section 6: Download Report**
- Professional PDF report
- Formatted for sharing with school/professionals
- Include summary, all sections, recommendations
- Optional: AI-enhanced detailed report (premium feature)

---

### 9. NEXT STEPS & SUPPORT
**Goal:** Feel supported and know how to proceed

**Follow-up Actions:**
- Email with results summary and resources
- Access to resource library:
  - Articles on dyslexia/dyscalculia
  - Parenting tips
  - School advocacy guides
- Option to book follow-up consultation (if you offer this)
- Community forum or support group links

**Dashboard (Ongoing):**
- View past assessments
- Track progress over time
- Re-screen in 6-12 months (recommended)
- Access resources anytime

---

## Key Individual/Parent Pain Points to Solve

### High Priority:
1. **Anxiety:** Parents are worried - need reassurance and clarity
2. **Cost:** Must be affordable (much less than £300-800 private assessment)
3. **Speed:** Want answers quickly, not wait weeks for appointments
4. **Understanding:** Results must be in plain language, not technical jargon
5. **Action:** "What do I do now?" - need clear next steps

### Medium Priority:
6. **Privacy:** Assurance that data is secure and never shared
7. **Legitimacy:** Is this assessment credible and evidence-based?
8. **Self-service:** Want to do this at home, on own schedule
9. **Support:** Access to help if questions arise

### Lower Priority:
10. **Community:** Connect with other parents in similar situations
11. **Progress Tracking:** Re-assess over time to see improvement
12. **Professional Access:** Find qualified specialists in their area

---

## Individual/Parent-Specific UI Enhancements Needed

### 1. Landing Page
- [ ] Separate "I'm a Parent/Individual" entry point
- [ ] Clear value proposition (affordable, fast, actionable)
- [ ] Sample report preview
- [ ] Testimonials from other parents
- [ ] "Not a diagnosis" disclaimer (clear, not scary)
- [ ] Free preview (first 5 questions)

### 2. Registration
- [ ] Minimal fields (email, password only)
- [ ] Social login (Google, Microsoft)
- [ ] "Assessing: My child / Myself / Other" selector
- [ ] Can start before email verification

### 3. Onboarding & Guidance
- [ ] "How to prepare" screen
- [ ] Assessment type helper ("Which one do I need?")
- [ ] Emotional reassurance messaging
- [ ] Video: How the assessment works (30 seconds)

### 4. During Assessment
- [ ] Calm, distraction-free interface
- [ ] Encouragement messages between sections
- [ ] Prominent pause button
- [ ] Hide timer option (reduce stress)
- [ ] "I don't know" option for questions

### 5. Results Page (Parent-Friendly)
- [ ] Plain language explanations (no jargon)
- [ ] Traffic light colors (intuitive)
- [ ] Highlight strengths first (positive framing)
- [ ] Clear "What to do next" section
- [ ] Downloadable PDF report
- [ ] Email template for contacting school

### 6. Payment
- [ ] Teaser results before payment
- [ ] Clear pricing (no hidden fees)
- [ ] Bundle discount (both assessments)
- [ ] Stripe checkout (secure, trusted)
- [ ] Instant access after payment

### 7. Resources & Support
- [ ] Resource library (articles, videos, tips)
- [ ] Sample letters/emails for school
- [ ] Directory of qualified professionals
- [ ] FAQ section
- [ ] Contact support option

---

## Success Metrics for Individuals/Parents

1. **Conversion Rate:** > 30% of free previews convert to paid
2. **Completion Rate:** > 90% complete assessment once started
3. **Time to Results:** < 30 seconds after completion
4. **User Satisfaction:** > 4.5/5 stars
5. **Repeat Usage:** 40% return for second assessment or re-screen

---

## Emotional Journey (Parent/Individual)

### Pre-Assessment:
- **Feeling:** Anxious, worried, overwhelmed
- **Need:** Reassurance, clarity, affordability
- **Message:** "You're taking the right step. This will help you understand and support better."

### During Assessment:
- **Feeling:** Focused, possibly stressed
- **Need:** Encouragement, ability to pause
- **Message:** "No pressure. Take your time. You're doing great."

### Post-Assessment (Before Results):
- **Feeling:** Anticipation, nervous
- **Need:** Quick results, professional presentation
- **Message:** "Results ready! Let's see what we found."

### Viewing Results (High Risk):
- **Feeling:** Concern, fear, but also relief (now I know)
- **Need:** Clear explanation, hope, next steps
- **Message:** "These results suggest challenges in some areas. Early identification is positive - here's what you can do."

### Viewing Results (Moderate):
- **Feeling:** Uncertainty, need for monitoring
- **Need:** Specific guidance, when to escalate
- **Message:** "Some indicators present. Let's monitor and provide support. Here's how."

### Viewing Results (Low Risk):
- **Feeling:** Relief, but maybe confusion (still struggling?)
- **Need:** Alternative explanations, reassurance
- **Message:** "No significant concerns detected. If struggles continue, consider other factors (anxiety, attention, etc)."

### After Results:
- **Feeling:** Empowered, ready to act
- **Need:** Resources, support, community
- **Message:** "You're not alone. Here are tools and next steps to help."

---

## Next Steps for Development

### Phase 1 (Immediate):
- [ ] Add user type selection at registration ("Teacher" vs "Parent/Individual")
- [ ] Create separate landing pages for each user type
- [ ] Add "assessing: my child / myself" field
- [ ] Simplify results page language (remove jargon)
- [ ] Add encouragement messages between sections

### Phase 2 (Short-term):
- [ ] Payment gate with teaser results
- [ ] Parent-friendly PDF report generation
- [ ] "What to do next" recommendations engine
- [ ] Email template generator (for contacting school)
- [ ] Sample report preview on landing page

### Phase 3 (Medium-term):
- [ ] Free preview (first 5 questions)
- [ ] Resource library (articles, videos, tips)
- [ ] Assessment type helper quiz
- [ ] Video tutorials (how to prepare, how to interpret results)
- [ ] Progress tracking (re-screen after 6-12 months)

### Phase 4 (Long-term):
- [ ] Community forum for parents
- [ ] Directory of qualified professionals by region
- [ ] Parent coaching/consultation bookings
- [ ] Mobile app version
- [ ] Integration with school communication platforms
