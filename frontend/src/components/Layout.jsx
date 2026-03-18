// // import React, { useState, useEffect } from 'react'
// // import { X } from 'lucide-react'
// // import Sidebar from './layout/Sidebar'
// // import Navbar from './layout/Navbar'
// // import Footer from './layout/Footer'

// // export default function Layout({ children, page = 'dashboard', setPage = () => {} }) {
// //   const [collapsed, setCollapsed] = useState(false)
// //   const [isMobile, setIsMobile] = useState(false)
// //   const [sidebarOpen, setSidebarOpen] = useState(false)

// //   // Handle responsive behavior
// //   useEffect(() => {
// //     const handleResize = () => {
// //       const mobile = window.innerWidth < 768
// //       setIsMobile(mobile)
// //       if (!mobile) {
// //         setSidebarOpen(false)
// //       }
// //     }

// //     handleResize()
// //     window.addEventListener('resize', handleResize)
// //     return () => window.removeEventListener('resize', handleResize)
// //   }, [])

// //   // Close sidebar when route changes
// //   useEffect(() => {
// //     setSidebarOpen(false)
// //   }, [page])

// //   // Close sidebar on overlay click
// //   const handleSidebarClose = () => {
// //     setSidebarOpen(false)
// //   }

// //   return (
// //     <div style={{
// //       display: 'flex',
// //       flexDirection: 'column',
// //       minHeight: '100vh',
// //       background: 'var(--bg)',
// //     }}>
// //       {/* Mobile Sidebar Overlay */}
// //       {isMobile && sidebarOpen && (
// //         <div
// //           onClick={handleSidebarClose}
// //           style={{
// //             position: 'fixed',
// //             inset: 0,
// //             background: 'rgba(0, 0, 0, 0.5)',
// //             zIndex: 150,
// //             display: 'block',
// //             animation: 'fadeIn 0.2s ease',
// //           }}
// //         />
// //       )}

// //       {/* Sidebar - Desktop Fixed, Mobile Overlay */}
// //       <div
// //         style={{
// //           position: isMobile ? 'fixed' : 'static',
// //           top: 0,
// //           left: 0,
// //           zIndex: isMobile ? 200 : 'auto',
// //           transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
// //           transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
// //           width: isMobile ? '100%' : 'auto',
// //           height: isMobile ? '100vh' : 'auto',
// //           maxWidth: isMobile ? '280px' : 'auto',
// //           display: isMobile && !sidebarOpen ? 'none' : 'block',
// //         }}
// //       >
// //         <Sidebar
// //           page={page}
// //           setPage={setPage}
// //           collapsed={collapsed}
// //           setCollapsed={setCollapsed}
// //           isMobile={isMobile}
// //           onClose={() => setSidebarOpen(false)}
// //         />
// //       </div>

// //       {/* Main Content */}
// //       <div
// //         style={{
// //           display: 'flex',
// //           flexDirection: 'column',
// //           flex: 1,
// //           marginLeft: isMobile ? 0 : collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
// //           transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
// //         }}
// //       >
// //         {/* Navbar */}
// //         <Navbar
// //           page={page}
// //           collapsed={collapsed}
// //           setCollapsed={setCollapsed}
// //           isMobile={isMobile}
// //           sidebarOpen={sidebarOpen}
// //           setSidebarOpen={setSidebarOpen}
// //         />

// //         {/* Page Content */}
// //         <main
// //           style={{
// //             flex: 1,
// //             overflowY: 'auto',
// //             overflowX: 'hidden',
// //             padding: isMobile ? '16px' : '24px',
// //             minHeight: 'calc(100vh - 64px)',
// //           }}
// //         >
// //           {children}
// //         </main>

// //         {/* Footer */}
// //         <Footer />
// //       </div>
// //     </div>
// //   )
// // }



// import React, { useState, useEffect } from 'react'
// import { X } from 'lucide-react'
// import Sidebar from './layout/Sidebar'
// import Navbar from './layout/Navbar'
// import Footer from './layout/Footer'

// export default function Layout({ children, page = 'dashboard', setPage = () => {} }) {
//   const [collapsed, setCollapsed] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   // Handle responsive behavior
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768
//       setIsMobile(mobile)
//       if (!mobile) {
//         setSidebarOpen(false)
//       }
//     }

//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Close sidebar when route changes
//   useEffect(() => {
//     setSidebarOpen(false)
//   }, [page])

//   // Close sidebar on overlay click
//   const handleSidebarClose = () => {
//     setSidebarOpen(false)
//   }

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       minHeight: '100vh',
//       background: 'var(--bg)',
//     }}>
//       {/* Mobile Sidebar Overlay */}
//       {isMobile && sidebarOpen && (
//         <div
//           onClick={handleSidebarClose}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             background: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 150,
//             display: 'block',
//             animation: 'fadeIn 0.2s ease',
//           }}
//         />
//       )}

//       {/* Sidebar - Desktop Fixed, Mobile Overlay */}
//       <div
//         style={{
//           position: isMobile ? 'fixed' : 'static',
//           top: 0,
//           left: 0,
//           zIndex: isMobile ? 200 : 'auto',
//           transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
//           transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           width: isMobile ? '100%' : 'auto',
//           height: isMobile ? '100vh' : 'auto',
//           maxWidth: isMobile ? '280px' : 'auto',
//           display: isMobile && !sidebarOpen ? 'none' : 'block',
//         }}
//       >
//         <Sidebar
//           page={page}
//           setPage={setPage}
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           isMobile={isMobile}
//           onClose={() => setSidebarOpen(false)}
//         />
//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           flex: 1,
//           marginLeft: isMobile ? 0 : collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
//           transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         }}
//       >
//         {/* Navbar */}
//         <Navbar
//           page={page}
//           setPage={setPage}
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           isMobile={isMobile}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* Page Content */}
//         <main
//           style={{
//             flex: 1,
//             overflowY: 'auto',
//             overflowX: 'hidden',
//             padding: isMobile ? '16px' : '24px',
//             minHeight: 'calc(100vh - 64px)',
//           }}
//         >
//           {children}
//         </main>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Sidebar from './layout/Sidebar'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'

export default function Layout({ children, page = 'dashboard', setPage = () => {} }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [page])

  // Close sidebar on overlay click
  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={handleSidebarClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 150,
            display: 'block',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Sidebar - Desktop Fixed, Mobile Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 200,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: isMobile ? '100%' : 'auto',
          height: '100vh',
          maxWidth: isMobile ? '280px' : 'auto',
          display: isMobile && !sidebarOpen ? 'none' : 'block',
        }}
      >
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginLeft: isMobile ? 0 : collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Navbar */}
        <Navbar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: isMobile ? '16px' : '24px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}