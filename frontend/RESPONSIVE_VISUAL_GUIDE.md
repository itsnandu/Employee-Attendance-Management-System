# 📱 Responsive Breakpoints & Visual Guide

## Breakpoint Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCREEN SIZE REFERENCE                        │
├─────────────────────────────────────────────────────────────────┤
│ MOBILE          │ TABLET          │ DESKTOP         │ LARGE     │
│ 320-539px       │ 640-767px       │ 768-1023px      │ 1024px+   │
│                 │                 │                 │           │
│ Phones          │ Tablets         │ Laptops         │ Desktops  │
│ Portrait        │ Portrait/Land   │ Typical Use     │ Wide      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Layout Variations by Screen Size

### MOBILE (320px - 540px)
```
┌─────────────────────────┐
│  ☰  Dashboard Today     │  ← Navbar with hamburger menu
├─────────────────────────┤
│                         │
│   ┌─────────────────┐   │
│   │  Stat Card 1    │   │  ← Single column
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │  Stat Card 2    │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │  Stat Card 3    │   │
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
│ © 2026 | v1.0.0         │  ← Stacked footer
└─────────────────────────┘

Sidebar: OFF (hidden, accessible via hamburger)
Cards: 1 column
Font Size: Smaller (14px base)
Padding: 16px
Touch Target: 44x44px minimum
```

---

### TABLET (640px - 767px)
```
┌─────────────────────────────────────────┐
│  ☰  Dashboard  Today                    │  ← Hamburger visible
├─────────────────────────────────────────┤
│                                         │
│   ┌──────────────────┐ ┌──────────────┐ │
│   │   Stat Card 1    │ │ Stat Card 2  │ │  ← Two columns
│   └──────────────────┘ └──────────────┘ │
│                                         │
│   ┌──────────────────┐ ┌──────────────┐ │
│   │   Stat Card 3    │ │ Stat Card 4  │ │
│   └──────────────────┘ └──────────────┘ │
│                                         │
│   ┌──────────────────┐                   │
│   │  Dept Overview   │ ┌──────────────┐ │
│   │                  │ │   Activity   │ │
│   │                  │ │               │ │
│   └──────────────────┘ └──────────────┘ │
│                                         │
└─────────────────────────────────────────┘
│ © 2026 | v1.0.0                         │
└─────────────────────────────────────────┘

Sidebar: Hidden (can be toggled)
Cards: 2 columns
Font Size: Medium (14px base)
Padding: 20px
Touch Target: 40x40px
```

---

### DESKTOP (768px - 1023px)
```
┌──────────────────────────────────────────────────────────────┐
│  ☰  Dashboard  📋 Today          🔔 @                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────┐  ┌──────────────┐ ┌──────────────┐    │
│   │  Stat Card 1    │  │ Stat Card 2  │ │ Stat Card 3  │    │  ← Desktop: 2-3 cols
│   └─────────────────┘  └──────────────┘ └──────────────┘    │
│                                                              │
│   ┌─────────────────────────────┐  ┌──────────────────────┐  │
│   │   Dept Overview             │  │   Recent Activity    │  │  ← 2 columns
│   │                             │  │                      │  │
│   └─────────────────────────────┘  └──────────────────────┘  │
│                                                              │
│   ┌─────────────────┐  ┌──────────────┐ ┌──────────────┐    │
│   │ Quick Action 1  │  │ Action 2     │ │ Action 3     │    │  ← Quick actions
│   └─────────────────┘  └──────────────┘ └──────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
│ © 2026 | v1.0.0                                              │
└──────────────────────────────────────────────────────────────┘

Sidebar: Hidden (hidden)
Cards: 2-3 columns
Font Size: Medium (14px base)
Padding: 24px
Touch Target: 36x36px
```

---

### DESKTOP LARGE (1024px+)
```
┌─────────────┬──────────────────────────────────────────────────────────┐
│  E         │  Dashboard  📋 Today          🔔 @                        │
│  EAMS      │                                                           │
│  ──────────┼──────────────────────────────────────────────────────────┤
│            │                                                           │
│ Dashboard  │   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ Employees  │   │ Present: 45  │ │ Absent: 5    │ │ Late: 8      │    │  ← 4 columns
│ Attendance │   └──────────────┘ └──────────────┘ └──────────────┘    │
│ Leaves     │                                                           │
│ Reports    │   ┌──────────────────────────────┐ ┌──────────────────┐ │
│ Holidays   │   │   Department Overview        │ │  Recent Activity │ │  ← 2 wide
│ Announc.   │   │                              │ │                  │ │
│ Settings   │   └──────────────────────────────┘ └──────────────────┘ │
│            │                                                           │
│ [User]     │   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ [Logout]   │   │Add Employee  │ │Mark Attend.  │ │Approve Leave │    │  ← 4 actions
│ [Toggle]   │   └──────────────┘ └──────────────┘ └──────────────┘    │
│            │                                                           │
└─────────────┴──────────────────────────────────────────────────────────┘
│ © 2026 | v1.0.0           Built with React + Vite                    │
└────────────────────────────────────────────────────────────────────────┘

Sidebar: VISIBLE 260px (or collapsed 72px)
Cards: 4 columns
Font Size: Large (14-16px base)
Padding: 24-32px
Touch Target: 36x36px
*/
Hover Effects: ENABLED
```

---

## 🎨 Component Changes by Breakpoint

### Navigation Bar
```
MOBILE (< 768px):
┌────────────────────────────┐
│ ☰  Dashboard   Today  🔔 @ │
├────────────────────────────┤

TABLET (768px - 1023px):
┌────────────────────────────────────────┐
│ ☰  Dashboard   📋  Today    🔔 @ 👤   │
├────────────────────────────────────────┤

DESKTOP (1024px+):
┌────────────────────────────────────────────┐
│ ☰  Dashboard  [Search...]  🔔 @ 👤       │
├────────────────────────────────────────────┤
(Search bar visible on desktop only)
```

---

### Sidebar
```
MOBILE (< 640px):
[HAMBURGER - Overlay]
┌──────────────┐
│ ☰ close btn  │
│              │
│ • Dashboard  │
│ • Employees  │
│ • Attendance │
│ • Leave Mgmt │
│              │
│ [Logout]     │
└──────────────┘

TABLET (640px - 1023px):
[COLLAPSIBLE]
┌────────┐
│ [Logo] │
│        │
│━━━━━━━━│
│ • Dash │
│ • Emp  │
│ • Att  │
│        │
│  [◄►]  │
└────────┘

DESKTOP (1024px+):
[FIXED/COLLAPSIBLE]
┌──────────────┐
│ E            │
│ EAMS         │
│ ENTERPRISE   │
│──────────────│
│ Dashboard    │
│ Employees    │
│ Attendance   │
│ Leave Mgmt   │
│ Reports      │
│ Holidays     │
│ Announcements│
│              │
│ [User] [◄►]  │
└──────────────┘
```

---

### Stats Cards Grid
```
MOBILE (1 column):           TABLET (2 columns):      DESKTOP (4 columns):
┌──────────────┐             ┌──────────┐             ┌─────┐ ┌─────┐
│ Present: 45  │             │ Present  │             │  45 │ │  5  │
└──────────────┘             │   45     │             └─────┘ └─────┘
┌──────────────┐             └──────────┘             ┌─────┐ ┌─────┐
│  Absent: 5   │             ┌──────────┐             │  8  │ │ 120 │
└──────────────┘             │ Absent   │             └─────┘ └─────┘
┌──────────────┐             │    5     │
│   Late: 8    │             └──────────┘
└──────────────┘             ┌──────────┐
┌──────────────┐             │  Late: 8 │
│ Active: 120  │             └──────────┘
└──────────────┘             ┌──────────┐
                              │Active:120│
                              └──────────┘
```

---

### Content Section
```
MOBILE (1 column):           DESKTOP (2 columns):

┌──────────────┐             ┌────────────┐ ┌────────────┐
│ Dept Overview│             │Dept Privw │ │Activity    │
│              │             │            │ │            │
│              │             │            │ │            │
└──────────────┘             └────────────┘ └────────────┘
┌──────────────┐             
│ Activity     │             
│              │             
│              │             
└──────────────┘             
```

---

## 📊 Typography Scale

```
┌─────────────────┬──────────┬────────────┬──────────┐
│ Element         │ Mobile   │ Tablet     │ Desktop  │
├─────────────────┼──────────┼────────────┼──────────┤
│ Page Title      │ 22px     │ 24px       │ 28px     │
│ Section Header  │ 15px     │ 16px       │ 18px     │
│ Body Text       │ 14px     │ 14px       │ 15px     │
│ Small Text      │ 12px     │ 12px       │ 12px     │
│ Button Text     │ 13px     │ 14px       │ 14px     │
│ Label           │ 11px     │ 12px       │ 13px     │
└─────────────────┴──────────┴────────────┴──────────┘
```

---

## 🎯 Touch Target Sizes

```
┌─────────────────┬──────────┬────────────┬──────────┐
│ Element         │ Mobile   │ Tablet     │ Desktop  │
├─────────────────┼──────────┼────────────┼──────────┤
│ Button          │ 44x44px  │ 40x40px    │ 36x40px  │
│ Icon Button     │ 40x40px  │ 36x36px    │ 32x32px  │
│ Link            │ 44px H   │ 40px H     │ 36px H   │
│ Checkbox        │ 24x24px  │ 20x20px    │ 18x18px  │
│ Input Field     │ 44px H   │ 40px H     │ 36px H   │
└─────────────────┴──────────┴────────────┴──────────┘
```

---

## 🎨 Spacing Scale

```
┌──────────┬─────────┬────────────┬──────────┐
│ Spacing  │ Mobile  │ Tablet     │ Desktop  │
├──────────┼─────────┼────────────┼──────────┤
│ Container│ 16px    │ 20px       │ 24px     │
│ Section  │ 16px    │ 20px       │ 24px     │
│ Card     │ 16px    │ 20px       │ 24px     │
│ Gap      │ 12px    │ 16px       │ 20px     │
│ Margin   │ 8px     │ 12px       │ 16px     │
└──────────┴─────────┴────────────┴──────────┘
```

---

## 🔄 Responsive Transitions

All elements use smooth transitions:
```
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
```

This means:
- Layout changes smoothly
- Colors fade in/out
- Shadows animate
- Sizes scale gracefully

---

## 📱 Mobile Specific Features

1. **Hamburger Menu** - Sidebar opens as overlay
2. **Single Column** - All content stacks vertically
3. **Full Width** - Content spans entire screen
4. **Large Touch Areas** - 44px minimum buttons
5. **No Hover States** - Hover effects disabled
6. **Optimized Forms** - Full width inputs
7. **Simplified Nav** - Hidden search, small icons

---

## 💻 Desktop Specific Features

1. **Fixed Sidebar** - Always visible or collapsible
2. **Multi Column** - 3-4 column grids
3. **Search Bar** - Visible in navbar
4. **Hover Effects** - Interactive feedback
5. **Keyboard Navigation** - Tab through controls
6. **Wider Layout** - More content on screen

---

## 🎬 Animation Timeline

```
Component Load:    fadeSlide 0.35s
Hover Effect:      all 0.2s
Modal Appear:      fadeIn 0.2s
Page Transition:   fadeSlide 0.35s
Sidebar Toggle:    transform 0.3s
```

---

## ✅ Testing Scenarios

### Mobile Portrait (375px)
- ☑️ Sidebar toggles
- ☑️ Single column layout
- ☑️ All buttons touchable
- ☑️ No horizontal scroll

### Mobile Landscape (667px)
- ☑️ Content fits screen
- ☑️ Still single column
- ☑️ Sidebar accessible

### Tablet Portrait (768px)
- ☑️ Two column layout
- ☑️ Sidebar optional
- ☑️ Good spacing

### Tablet Landscape (1024px)
- ☑️ Full layout visible
- ☑️ Sidebar fixed
- ☑️ 4 columns work

### Desktop (1280px+)
- ☑️ All features visible
- ☑️ Search bar shown
- ☑️ Hover effects work

---

This visual guide helps understand how layouts change across different screen sizes!
