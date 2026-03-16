import React, { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar  from '../components/layout/Navbar'
import Footer  from '../components/layout/Footer'
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
  const [collapsed, setCollapsed] = useState(false)
  const sw = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div style={{
        marginLeft:sw, flex:1, display:'flex', flexDirection:'column',
        minWidth:0, transition:'margin-left .3s cubic-bezier(.4,0,.2,1)',
      }}>
        <Navbar page={page} collapsed={collapsed} setCollapsed={setCollapsed}/>
        <main style={{ flex:1, padding:24, overflowY:'auto' }}>
          {PAGES[page]?.({ setPage }) ?? <div>404</div>}
        </main>
        <Footer/>
      </div>
    </div>
  )
}