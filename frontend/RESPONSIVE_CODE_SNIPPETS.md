# Responsive Design Code Snippets

Copy and use these snippets in your React components for responsive design patterns.

---

## 1. Responsive State Hook

Add this to the top of your component:

```javascript
import React, { useEffect, useState } from 'react'

export default function MyComponent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    // Your component JSX
  )
}
```

---

## 2. Responsive Grid Layouts

### One column on mobile, two on tablet, four on desktop:

```javascript
style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
  gap: isMobile ? '12px' : '16px',
}}
```

### Two columns on mobile, three on tablet, four on desktop:

```javascript
style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
  gap: isMobile ? '12px' : '16px',
}}
```

### Single column on mobile, two columns on desktop:

```javascript
style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: isMobile ? '16px' : '24px',
}}
```

---

## 3. Responsive Typography

### Responsive heading:

```javascript
style={{
  fontSize: isMobile ? '22px' : '28px',
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: isMobile ? '8px' : '12px',
}}
```

### Responsive body text:

```javascript
style={{
  fontSize: isMobile ? '14px' : '16px',
  lineHeight: 1.6,
}}
```

### Responsive label:

```javascript
style={{
  fontSize: isMobile ? '12px' : '13px',
  fontWeight: 600,
  color: 'var(--text-muted)',
}}
```

---

## 4. Responsive Spacing & Padding

### Container with responsive padding:

```javascript
style={{
  padding: isMobile ? '16px' : '24px',
  gap: isMobile ? '12px' : '24px',
}}
```

### Card with responsive padding:

```javascript
style={{
  background: 'var(--surface)',
  borderRadius: 16,
  padding: isMobile ? '16px' : '24px',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border)',
}}
```

### Flex container with responsive gap:

```javascript
style={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: isMobile ? '12px' : '20px',
  padding: isMobile ? '12px' : '16px',
}}
```

---

## 5. Responsive Buttons

### Primary button:

```javascript
style={{
  padding: isMobile ? '12px 16px' : '10px 20px',
  borderRadius: 10,
  fontSize: isMobile ? '14px' : '15px',
  minHeight: isMobile ? '44px' : 'auto',
  background: 'var(--primary)',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.2s',
}}
```

### Icon button (mobile: 40px, desktop: 36px):

```javascript
style={{
  width: isMobile ? '40px' : '36px',
  height: isMobile ? '40px' : '36px',
  minWidth: isMobile ? '40px' : '36px',
  minHeight: isMobile ? '40px' : '36px',
  borderRadius: 10,
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}
```

---

## 6. Responsive Flexbox

### Flex row on desktop, column on mobile:

```javascript
style={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: isMobile ? 'flex-start' : 'space-between',
  alignItems: isMobile ? 'flex-start' : 'center',
  gap: isMobile ? '12px' : '16px',
}}
```

### Flex with wrap:

```javascript
style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: isMobile ? '10px' : '12px',
}}
```

---

## 7. Responsive Table/List

### Table header responsive font:

```javascript
style={{
  fontSize: isMobile ? '12px' : '13px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  padding: isMobile ? '10px 8px' : '12px 16px',
}}
```

### Table row responsive:

```javascript
style={{
  padding: isMobile ? '12px 8px' : '14px 16px',
  fontSize: isMobile ? '13px' : '14px',
  borderBottom: '1px solid var(--border)',
}}
```

---

## 8. Responsive Inputs

### Input with responsive sizing:

```javascript
style={{
  width: isMobile ? '100%' : '200px',
  padding: isMobile ? '10px 12px' : '8px 14px',
  fontSize: isMobile ? '14px' : '13px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  fontFamily: 'DM Sans, sans-serif',
}}
```

---

## 9. Responsive Modal/Overlay

### Modal with responsive padding:

```javascript
style={{
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: isMobile ? '16px' : '24px',
  zIndex: 1000,
}}
```

### Modal content:

```javascript
style={{
  background: 'var(--surface)',
  borderRadius: 16,
  padding: isMobile ? '20px' : '28px',
  maxWidth: isMobile ? '95vw' : '500px',
  maxHeight: isMobile ? '90vh' : '80vh',
  overflowY: 'auto',
  boxShadow: 'var(--shadow-lg)',
}}
```

---

## 10. Responsive Conditionals

### Show/hide based on screen size:

```javascript
{isMobile && <MobileComponent />}
{!isMobile && <DesktopComponent />}
```

### Different layouts:

```javascript
{isMobile ? (
  <MobileLayout />
) : isTablet ? (
  <TabletLayout />
) : (
  <DesktopLayout />
)}
```

---

## 11. Responsive Colors (Using CSS Variables)

### Use these color variables in all components:

```javascript
style={{
  color: 'var(--primary)',        // #0865f0
  background: 'var(--surface)',   // #ffffff
  border: '1px solid var(--border)', // #e2e8f0
}}
```

### Status colors:

```javascript
statusColor: a.type === 'success' ? 'var(--success)' :
            a.type === 'danger' ? 'var(--danger)' :
            a.type === 'warning' ? 'var(--warning)' :
            'var(--accent)'
```

---

## 12. Responsive Hover States

### Only add hover on desktop:

```javascript
onMouseEnter={e => {
  if (!isMobile) {
    e.currentTarget.style.background = 'var(--primary)'
    e.currentTarget.style.color = '#fff'
  }
}}
onMouseLeave={e => {
  if (!isMobile) {
    e.currentTarget.style.background = 'var(--surface2)'
    e.currentTarget.style.color = 'var(--text)'
  }
}}
```

---

## 13. Responsive Sidebar Layout

### Main container:

```javascript
style={{
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}}
```

### Content wrapper with responsive margin:

```javascript
style={{
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  marginLeft: isMobile ? 0 : (collapsed ? '72px' : '260px'),
  transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}}
```

---

## 14. Responsive Cards Layout

### Card with responsive hover:

```javascript
style={{
  background: 'var(--surface)',
  borderRadius: 16,
  padding: isMobile ? '16px' : '24px',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border)',
  transition: 'all 0.2s',
  cursor: isMobile ? 'auto' : 'pointer',
}}
onMouseEnter={e => {
  if (!isMobile) {
    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
    e.currentTarget.style.transform = 'translateY(-2px)'
  }
}}
onMouseLeave={e => {
  if (!isMobile) {
    e.currentTarget.style.boxShadow = 'var(--shadow)'
    e.currentTarget.style.transform = 'translateY(0)'
  }
}}
```

---

## 15. Responsive Action Buttons

### Button group responsive layout:

```javascript
style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
  gap: isMobile ? '10px' : '12px',
}}
```

### Individual action button:

```javascript
style={{
  padding: isMobile ? '12px 14px' : '10px 20px',
  borderRadius: 10,
  border: `2px solid ${color}20`,
  background: `${color}10`,
  color: color,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: isMobile ? '13px' : '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all .2s',
}}
```

---

## Complete Responsive Component Example

```javascript
import React, { useState, useEffect } from 'react'

export default function ResponsiveComponent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: isMobile ? '12px' : '20px',
      padding: isMobile ? '16px' : '24px',
    }}>
      {/* Your content here */}
    </div>
  )
}
```

---

## Quick Reference

| Screen Size | Width | Breakpoint | Columns | Gap |
|-------------|-------|-----------|---------|-----|
| Mobile | < 768px | - | 1-2 | 12px |
| Tablet | 768-1023px | md | 2-3 | 16px |
| Desktop | ≥ 1024px | lg | 3-4 | 20-24px |

---

**CSS Color Variables:**
- `--primary`: #0865f0 (Blue)
- `--surface`: #ffffff (White)
- `--surface2`: #f5f7fa (Light Gray)
- `--text`: #1a1a1a (Dark)
- `--text-muted`: #666666 (Muted Gray)
- `--border`: #e2e8f0 (Border Gray)
- `--success`: #10b981 (Green)
- `--warning`: #f59e0b (Amber)
- `--danger`: #ef4444 (Red)
- `--accent`: #06b6d4 (Cyan)
