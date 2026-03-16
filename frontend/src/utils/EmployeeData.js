// ─── Public & Company Holidays (fallback when API empty) ───────
export const HOLIDAYS = [
  { date: "2026-01-01", name: "New Year's Day",        type: "public" },
  { date: "2026-01-14", name: "Makar Sankranti",       type: "public" },
  { date: "2026-01-26", name: "Republic Day",          type: "public" },
  { date: "2026-03-25", name: "Holi",                  type: "public" },
  { date: "2026-04-02", name: "Ram Navami",            type: "restricted" },
  { date: "2026-04-03", name: "Good Friday",           type: "public" },
  { date: "2026-04-14", name: "Ambedkar Jayanti",      type: "public" },
  { date: "2026-05-01", name: "Maharashtra Day",       type: "public" },
  { date: "2026-05-23", name: "Buddha Purnima",        type: "restricted" },
  { date: "2026-06-19", name: "Eid ul-Adha",           type: "public" },
  { date: "2026-07-17", name: "Muharram",              type: "restricted" },
  { date: "2026-08-15", name: "Independence Day",      type: "public" },
  { date: "2026-08-26", name: "Ganesh Chaturthi",      type: "public" },
  { date: "2026-09-15", name: "Milad-un-Nabi",         type: "restricted" },
  { date: "2026-10-02", name: "Gandhi Jayanti",        type: "public" },
  { date: "2026-10-20", name: "Dussehra",              type: "public" },
  { date: "2026-10-28", name: "Diwali (Lakshmi Puja)", type: "public" },
  { date: "2026-10-29", name: "Diwali (Padwa)",        type: "public" },
  { date: "2026-10-30", name: "Bhai Dooj",             type: "restricted" },
  { date: "2026-11-15", name: "Guru Nanak Jayanti",    type: "public" },
  { date: "2026-12-25", name: "Christmas",             type: "public" },
  // Company-specific
  { date: "2026-12-31", name: "Year-End Closure",      type: "company" },
];

// Helper: returns holiday object if date is a holiday, else null (uses provided holidays map)
export function getHoliday(ds, holidaysMap = {}) {
  return holidaysMap[ds] || HOLIDAYS.find(h => h.date === ds) || null;
}

// ─── Attendance helpers ────────────────────────────────────────
export function dateStr(d) { return d.toISOString().slice(0, 10); }

/** Build month attendance from API data. attendanceList = [{date, check_in, check_out, status}], holidaysMap = { "2026-01-01": {name, type} } */
export function buildMonthAttendanceFromAPI(year, month, attendanceList = [], holidaysMap = {}) {
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const attByDate = {};
  (attendanceList || []).forEach(a => {
    const ds = (a.date || "").slice(0, 10);
    if (!attByDate[ds]) attByDate[ds] = a;
  });
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const dow = d.getDay();
    const ds = dateStr(d);
    if (dow === 0 || dow === 6) return { day: i + 1, date: d, type: "weekend" };
    const holiday = getHoliday(ds, holidaysMap);
    if (holiday) return { day: i + 1, date: d, type: "holiday", holidayName: holiday.name || holiday.title, holidayType: holiday.type || "public" };
    if (d > today) return { day: i + 1, date: d, type: "future" };
    const rec = attByDate[ds];
    if (!rec) return { day: i + 1, date: d, type: "absent", checkIn: null, checkOut: null, hours: null };
    const status = (rec.status || "present").toLowerCase();
    const cin = rec.check_in || rec.check_in_time || null;
    const cout = rec.check_out || rec.check_out_time || null;
    const cinStr = cin ? String(cin).slice(0, 5) : null;
    const coutStr = cout ? String(cout).slice(0, 5) : null;
    return { day: i + 1, date: d, type: status.includes("late") ? "late" : "present", checkIn: cinStr, checkOut: coutStr, hours: cin && cout ? "—" : null };
  });
}

export function getWeekDates(date) {
  const d = new Date(date);
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(mon);
    x.setDate(mon.getDate() + i);
    return x;
  });
}

// ─── Leave data ────────────────────────────────────────────────
export const LEAVE_BALANCE = [
  { type: "Casual Leave",  total: 12, used: 5,  color: "#4f46e5" },
  { type: "Sick Leave",    total: 10, used: 2,  color: "#06b6d4" },
  { type: "Earned Leave",  total: 15, used: 3,  color: "#10b981" },
  { type: "Comp Off",      total: 4,  used: 0,  color: "#f59e0b" },
];

export const LEAVE_HISTORY = [
  { id: 1, type: "Casual Leave",  from: "2026-01-15", to: "2026-01-15", days: 1, status: "approved", reason: "Personal work" },
  { id: 2, type: "Sick Leave",    from: "2026-02-03", to: "2026-02-04", days: 2, status: "approved", reason: "Fever & rest" },
  { id: 3, type: "Casual Leave",  from: "2026-03-20", to: "2026-03-21", days: 2, status: "pending",  reason: "Family function" },
  { id: 4, type: "Earned Leave",  from: "2026-04-10", to: "2026-04-14", days: 5, status: "pending",  reason: "Vacation trip" },
  { id: 5, type: "Casual Leave",  from: "2025-12-24", to: "2025-12-25", days: 2, status: "rejected", reason: "Christmas holiday" },
];

// ─── Payroll data ──────────────────────────────────────────────
export const PAYSLIPS = [
  { id: 1, month: "February 2026", gross: "₹1,25,000", deductions: "₹18,500", net: "₹1,06,500", status: "paid", basic: "₹62,500", hra: "₹25,000", special: "₹37,500", pf: "₹7,500", tax: "₹8,500", professional: "₹200", other: "₹2,300" },
  { id: 2, month: "January 2026",  gross: "₹1,25,000", deductions: "₹18,500", net: "₹1,06,500", status: "paid", basic: "₹62,500", hra: "₹25,000", special: "₹37,500", pf: "₹7,500", tax: "₹8,500", professional: "₹200", other: "₹2,300" },
  { id: 3, month: "December 2025", gross: "₹1,25,000", deductions: "₹18,500", net: "₹1,06,500", status: "paid", basic: "₹62,500", hra: "₹25,000", special: "₹37,500", pf: "₹7,500", tax: "₹8,500", professional: "₹200", other: "₹2,300" },
  { id: 4, month: "November 2025", gross: "₹1,25,000", deductions: "₹18,500", net: "₹1,06,500", status: "paid", basic: "₹62,500", hra: "₹25,000", special: "₹37,500", pf: "₹7,500", tax: "₹8,500", professional: "₹200", other: "₹2,300" },
];

// ─── Announcements ─────────────────────────────────────────────
export const ANNOUNCEMENTS = [
  { id: 1, title: "Q1 Performance Reviews",  date: "Mar 1, 2026",  tag: "HR",      color: "#4f46e5", msg: "Q1 appraisal cycle begins April 1st. Please complete self-assessments by March 28." },
  { id: 2, title: "Office Closed – Holi",    date: "Mar 14, 2026", tag: "Holiday", color: "#10b981", msg: "Office will remain closed on March 14th for Holi. Enjoy the festival!" },
  { id: 3, title: "New WFH Policy",          date: "Feb 20, 2026", tag: "Policy",  color: "#f59e0b", msg: "Updated WFH policy allows 2 days per week for senior staff." },
  { id: 4, title: "Health Checkup Camp",     date: "Feb 10, 2026", tag: "Wellness",color: "#06b6d4", msg: "Free health checkup camp on Feb 15th in the cafeteria, 10am–2pm." },
];

// ─── Constants ─────────────────────────────────────────────────
export const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
export const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];