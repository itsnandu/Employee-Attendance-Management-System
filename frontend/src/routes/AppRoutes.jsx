import React, { useState } from 'react'
import Layout from '../components/Layout'
import Dashboard      from '../pages/Dashboard'
import Employees      from '../pages/Employees'
import Attendance     from '../pages/Attendance'
import LeaveManagement from '../pages/LeaveManagement'
import Reports        from '../pages/Reports'
import Holidays       from '../pages/Holidays'
import Announcments   from '../pages/Announcments'
import UserManagement from '../pages/Usermanagement'

const PAGES = {
  dashboard:      (p) => <Dashboard {...p}/>,
  employees:       () => <Employees/>,
  attendance:      () => <Attendance/>,
  leave:           () => <LeaveManagement/>,
  reports:         () => <Reports/>,
  holidays:        () => <Holidays/>,
  announcements:   () => <Announcments/>,
  usermanagement:  () => <UserManagement/>,
}

export default function AppRoutes() {
  const [page, setPage] = useState('dashboard')

  return (
    <Layout page={page} setPage={setPage}>
      {PAGES[page]?.({ setPage }) ?? <div>404</div>}
    </Layout>
  )
}