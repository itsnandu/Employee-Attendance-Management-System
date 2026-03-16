/**
 * Returns the current employee from EmployeeContext.
 * Must be used inside EmployeeProvider (wraps EmpRoutes).
 * Fetches GET /employees/ once and shares across all employee pages.
 */
export { default } from "../context/EmployeeContext";
