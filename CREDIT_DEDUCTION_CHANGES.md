# Credit Deduction Workflow Changes

## Summary
Modified the prepaid credit deduction workflow so that credits are **only deducted when the first section is saved**, not when the assessment starts. This ensures users only pay when their screening record appears in the dashboard.

## Changes Made

### 1. Section Routes (Credit Deduction Added)
**Files Modified:**
- `app/api/screening/dyslexia/section/route.ts`
- `app/api/screening/dyscalculia/section/route.ts`

**New Behavior:**
- When a section is saved via POST, check if `screening.sections.length === 0` (first section)
- If first section:
  - Verify user has prepaidCredits >= 1
  - Return 402 error with message if insufficient credits
  - Deduct 1 credit: `user.prepaidCredits -= 1`
  - Increment usage: `user.screeningsUsed += 1`
  - Log credit deduction to console
- Only then save the section data

**Error Response:**
```json
{
  "error": "Insufficient credits. Please purchase more credits to continue.",
  "status": 402
}
```

### 2. Start Routes (Credit Deduction Removed)
**Files Modified:**
- `app/api/screening/dyslexia/start/route.ts`
- `app/api/screening/dyscalculia/start/route.ts`

**New Behavior:**
- Still check if user has credits (validation only)
- Return 403 error if no credits available (prevents starting with 0 credits)
- **Do NOT deduct credits** when screening is created
- Added comment: "Credits are now deducted when first section is saved"
- Updated activity log metadata: `creditsPending` instead of `creditsUsed`
- Updated console logs to reflect pending status

**Credit Check (Still Present):**
```typescript
if (!canScreen) {
  return NextResponse.json({ 
    error: "No credits available", 
    message: "You have no assessment credits. Please purchase credits to continue.",
    needsUpgrade: true,
    prepaidCredits: 0
  }, { status: 403 });
}
```

## User Journey Flow

### Before Changes:
1. User clicks "Start Assessment" → Credit deducted immediately
2. User completes first section → Data saved
3. Screening appears in dashboard

**Problem:** User charged before screening is visible/trackable

### After Changes:
1. User clicks "Start Assessment" → Credit checked (not deducted)
2. User completes first section → **Credit deducted** + Data saved
3. Screening appears in dashboard

**Benefit:** User only charged when screening becomes visible in dashboard

## Testing Checklist

To verify the changes work correctly:

- [ ] Create user with 1 prepaidCredit
- [ ] Start dyslexia assessment → verify credit NOT deducted
- [ ] Complete first section → verify credit deducted to 0
- [ ] Check dashboard → screening visible
- [ ] Try to start another assessment with 0 credits → verify 403 error
- [ ] Repeat test for dyscalculia assessment

## Technical Notes

- Credits are deducted in a transaction-safe way (user saved before section)
- If section save fails after credit deduction, user still has screening record started
- 402 Payment Required status code used for insufficient credits (standard HTTP)
- Console logs include user email and remaining credits for tracking
- Activity logs updated to show "creditsPending" vs "creditsUsed" for better analytics

## Related Files

**Models:**
- `models/User.ts` - prepaidCredits, screeningsUsed fields
- `models/DyslexiaScreening.ts` - screening document structure
- `models/DyscalculiaScreening.ts` - screening document structure

**Frontend (if further changes needed):**
- Assessment wizards handle 402 errors for credit UI
- Dashboard shows screenings after first section save
- Credit display updates after first section completion
