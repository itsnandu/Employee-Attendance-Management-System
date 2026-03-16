import React, { createContext, useState, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";
import employeeService from "../services/employeeService";

export const EmployeeContext = createContext(null);

/**
 * Fetches current employee once by matching user email to employee email.
 * Shares result across all employee portal pages - avoids repeated GET /employees/ on every page.
 */
export function EmployeeProvider({ children }) {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setEmployee(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    let done = false;
    const finish = () => { if (!done) { done = true; setLoading(false); } };
    // Prefer /employees/me (JWT-based) - more reliable than fetching all and matching
    employeeService
      .getMe()
      .then((emp) => { setEmployee(emp || null); finish(); })
      .catch(() => {
        // Fallback: fetch all and match by email (for backwards compat / no token)
        employeeService
          .getAll()
          .then((list) => {
            const found = Array.isArray(list)
              ? list.find((e) => (e.email || "").toLowerCase() === (user.email || "").toLowerCase())
              : null;
            setEmployee(found || null);
          })
          .catch(() => setEmployee(null))
          .finally(finish);
      });
  }, [user?.email]);

  const value = {
    employee,
    loading,
    employeeId: employee?.id,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export default function useCurrentEmployee() {
  const ctx = useContext(EmployeeContext);
  if (ctx) return ctx;
  // Fallback when used outside EmployeeProvider (e.g. admin pages) - return empty
  return { employee: null, loading: false, employeeId: null };
}
