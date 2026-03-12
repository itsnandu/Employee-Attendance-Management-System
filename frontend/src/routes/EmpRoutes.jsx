// // src/routes/EmpRoutes.jsx
// import { useState } from "react";
// import EmpLayout     from "../components/employee/EmpLayout";
// import EmpDashboard  from "../pages/employee/EmpDashboard";
// import EmpAttendance from "../pages/employee/EmpAttendance";
// import EmpLeaves     from "../pages/employee/EmpLeaves";
// import EmpHolidays   from "../pages/employee/EmpHolidays";
// import EmpPayroll    from "../pages/employee/EmpPayroll";
// import EmpProfile    from "../pages/employee/EmpProfile";
// import EmpNotices    from "../pages/employee/EmpNotices";

// export default function EmpRoutes() {
//   const [page, setPage] = useState("dashboard");

//   const pages = {
//     dashboard:  <EmpDashboard  setPage={setPage} />,
//     attendance: <EmpAttendance />,
//     leaves:     <EmpLeaves />,
//     holidays:   <EmpHolidays />,
//     payroll:    <EmpPayroll />,
//     profile:    <EmpProfile />,
//     notices:    <EmpNotices />,
//   };

//   return (
//     <EmpLayout page={page} setPage={setPage}>
//       <div className="page-enter" key={page}>
//         {pages[page] || pages.dashboard}
//       </div>
//     </EmpLayout>
//   );
// }

// src/routes/EmpRoutes.jsx
import { useState } from "react";
import EmpLayout     from "../components/employee/EmpLayout";
import EmpDashboard  from "../pages/employee/EmpDashboard";
import EmpAttendance from "../pages/employee/EmpAttendance";
import EmpLeaves     from "../pages/employee/EmpLeaves";
import EmpWfh        from "../pages/employee/EmpWfh";
import EmpHolidays   from "../pages/employee/EmpHolidays";
import EmpPayroll    from "../pages/employee/EmpPayroll";
import EmpProfile    from "../pages/employee/EmpProfile";
import EmpNotices    from "../pages/employee/EmpNotices";

export default function EmpRoutes() {
  const [page, setPage] = useState("dashboard");

  const pages = {
    dashboard:  <EmpDashboard  setPage={setPage} />,
    attendance: <EmpAttendance />,
    leaves:     <EmpLeaves />,
    wfh:        <EmpWfh />,
    holidays:   <EmpHolidays />,
    payroll:    <EmpPayroll />,
    profile:    <EmpProfile />,
    notices:    <EmpNotices />,
  };

  return (
    <EmpLayout page={page} setPage={setPage}>
      <div className="page-enter" key={page}>
        {pages[page] || pages.dashboard}
      </div>
    </EmpLayout>
  );
}