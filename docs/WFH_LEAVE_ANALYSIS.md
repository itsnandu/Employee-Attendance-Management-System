# WFH & Leave Request Analysis Report

## Summary
**Status: ROOT CAUSE IDENTIFIED**

Both WFH and Leave requests fail with no network calls because `employeeId` is `null`, causing the frontend to return early **before** any API request is made.

---

## Traceability

| Issue | Root Cause | Location | Fix |
|-------|------------|----------|-----|
| WFH "Employee not found" | `!employeeId` guard returns early, no API call | EmpWFH.jsx:113 | Ensure employeeId available + better UX |
| Leave nothing in network | `!employeeId` guard returns silently, no API call | EmpLeaves.jsx:61 | Same + show error to user |
| employeeId is null | No Employee record matches user.email, or context still loading | EmployeeContext | Add /employees/me endpoint + loading UX |

---

## Flow Analysis

### WFH Request Flow
```
User clicks "Request WFH" → handleSubmit()
  → if (!employeeId) { setFormError("Employee not found."); return; }  ← STOPS HERE
  → wfhService.requestWFH(...)  ← NEVER REACHED
```
**Result**: No POST /wfh/request in network tab.

### Leave Request Flow
```
User clicks "Submit Application" → submit()
  → if (!validate() || !employeeId) return;  ← STOPS HERE (silent)
  → leaveService.applyLeave(...)  ← NEVER REACHED
```
**Result**: No POST /leave/apply in network tab. User gets no feedback.

### Why employeeId is null
1. **EmployeeContext** fetches GET /employees/ and finds employee by `user.email === employee.email`
2. If no match → `employee = null` → `employeeId = undefined`
3. Possible causes:
   - User's email not in employees table (e.g. signed up before auto-create, or admin-created user)
   - EmployeeContext still loading
   - GET /employees/ failed (catch sets employee to null)

---

## Gaps Identified

1. **No loading state** – Pages allow submit before EmployeeContext has loaded
2. **Silent failure (Leaves)** – EmpLeaves returns without showing "Employee not found"
3. **No /employees/me** – Fetching all employees to find one is inefficient and fragile
4. **No fallback** – When employee not found, no guidance for user

---

## Recommendations

1. **Add GET /employees/me** – Backend endpoint that returns current user's employee from JWT
2. **Disable submit when loading or !employeeId** – Prevent confusing "Employee not found"
3. **Show explicit error for Leaves** – Match WFH behavior
4. **Banner when employee not found** – "Contact HR to link your account"

---

## Fixes Applied

| Fix | File(s) |
|-----|---------|
| GET /employees/me (JWT-based) | backend/app/routes/employee_routes.py, auth_deps.py |
| EmployeeContext uses /employees/me first | frontend/src/context/EmployeeContext.jsx |
| employeeService.getMe() | frontend/src/services/employeeService.js |
| Disable WFH/Leave buttons when !employeeId | EmpWFH.jsx, EmpLeaves.jsx, EmpUI.jsx (Btn disabled) |
| Banner when employee not found | EmpWFH.jsx, EmpLeaves.jsx |
| Leave submit shows error when !employeeId | EmpLeaves.jsx |
