// src/pages/WFHManagement.jsx  — Admin side WFH request manager
// src/pages/WFHManagement.jsx  — Admin side WFH request manager
import React, { useState, useEffect, useMemo } from 'react'
import { CheckCircle, XCircle, Clock, Search, RefreshCw, Home, X } from 'lucide-react'
import { getWFH, approveWFH, rejectWFH } from '../services/wfhService'
import employeeService from '../services/employeeService'
import { getInitials } from '../utils/helpers'

const COLORS = ['#4f46e5','#06b6d4','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6']

if (typeof document !== 'undefined' && !document.getElementById('wfh-spin')) { const s = document.createElement('style'); s.id = 'wfh-spin'; s.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'; document.head.appendChild(s); }

const STATUS_META = {
  approved: { label: 'Approved', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  pending:  { label: 'Pending',  bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
}

function fmt(ds) {
  if (!ds) return '—'
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function Avatar({ name, id, size = 36 }) {
  const color = COLORS[(id || 0) % COLORS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color + '22', color, border: `1.5px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36,
    }}>{getInitials(name || '?')}</div>
  )
}

function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
      background: m.bg, color: m.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, display: 'inline-block' }} />
      {m.label}
    </span>
  )
}

// ── Reject confirmation modal ─────────────────────────────────
const REJECT_REASONS = [
  'Policy limit reached (2 days/week)',
  'Team availability conflict',
  'Client meeting / on-site required',
  'Insufficient notice period',
  'Manager discretion',
  'Other',
]

function RejectModal({ request, onConfirm, onCancel }) {
  const [selected, setSelected] = useState('')
  const [custom, setCustom]     = useState('')
  const [error, setError]       = useState('')

  function handleConfirm() {
    if (!selected) { setError('Please select a reason.'); return }
    if (selected === 'Other' && !custom.trim()) { setError('Please provide a reason.'); return }
    onConfirm(selected === 'Other' ? custom.trim() : selected)
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onCancel()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: 'var(--surface)', borderRadius: 20, width: 460, maxWidth: '92vw',
        boxShadow: '0 24px 64px rgba(0,0,0,.22)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Reject WFH Request</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', marginTop: 2 }}>
              {request?.employee_name || 'Employee'} · {fmt(request?.date)}
            </div>
          </div>
          <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.8)', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Select a reason for rejection:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {REJECT_REASONS.map(r => (
              <label key={r} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 10, border: `1.5px solid ${selected === r ? '#ef4444' : 'var(--border)'}`,
                cursor: 'pointer', background: selected === r ? '#fff0f0' : 'var(--surface2)',
                transition: 'all .15s',
              }}>
                <input type="radio" name="reject-reason" value={r}
                  checked={selected === r} onChange={() => { setSelected(r); setError('') }}
                  style={{ accentColor: '#ef4444' }}
                />
                <span style={{ fontSize: 13, fontWeight: selected === r ? 600 : 400, color: selected === r ? '#ef4444' : 'var(--text)' }}>{r}</span>
              </label>
            ))}
          </div>

          {selected === 'Other' && (
            <textarea
              value={custom}
              onChange={e => setCustom(e.target.value)}
              placeholder="Describe the reason…"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                fontSize: 13, fontFamily: 'DM Sans,sans-serif', color: 'var(--text)',
                background: 'var(--surface2)', outline: 'none', resize: 'vertical', marginBottom: 12,
              }}
            />
          )}

          {error && (
            <div style={{ fontSize: 12, color: '#ef4444', background: '#fff0f0', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onCancel} style={{
              padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
            }}>Cancel</button>
            <button onClick={handleConfirm} style={{
              padding: '10px 24px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
              boxShadow: '0 4px 14px rgba(239,68,68,.3)',
            }}>Confirm Reject</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Detail / preview drawer ───────────────────────────────────
function DetailModal({ request, onClose, onApprove, onReject }) {
  if (!request) return null
  const meta = STATUS_META[request.status] || STATUS_META.pending
  const isPending = request.status === 'pending'

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999, backdropFilter: 'blur(3px)',
      }}
    >
      <div style={{
        background: 'var(--surface)', borderRadius: 20, width: 480, maxWidth: '92vw',
        boxShadow: '0 24px 64px rgba(0,0,0,.18)', overflow: 'hidden',
      }}>
        {/* Top banner */}
        <div style={{
          background: 'linear-gradient(135deg,#0061f2,#0052cc)',
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>WFH Request Detail</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', marginTop: 2 }}>ID #{request.id}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.8)', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Employee info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'var(--surface2)', marginBottom: 16 }}>
            <Avatar name={request.employee_name} id={request.employee_id} size={48} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{request.employee_name || 'Unknown Employee'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {request.department || 'General'} · ID {request.employee_id}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Badge status={request.status} />
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'WFH Date',    value: fmt(request.date) },
              { label: 'Submitted',   value: fmt(request.created_at || request.date) },
              { label: 'Day of Week', value: request.date ? new Date(request.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long' }) : '—' },
              { label: 'Status',      value: <Badge status={request.status} /> },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Reason */}
          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--surface2)', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>Reason</div>
            <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{request.reason || '—'}</div>
          </div>

          {/* Actions */}
          {isPending && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { onReject(request); onClose() }} style={{
                flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid #ef4444',
                background: '#fff0f0', color: '#ef4444', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <XCircle size={15} /> Reject
              </button>
              <button onClick={() => { onApprove(request.id); onClose() }} style={{
                flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 4px 14px rgba(16,185,129,.3)',
              }}>
                <CheckCircle size={15} /> Approve
              </button>
            </div>
          )}
          {!isPending && (
            <button onClick={onClose} style={{
              width: '100%', padding: '11px 0', borderRadius: 10, border: '1.5px solid var(--border)',
              background: 'var(--surface2)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
            }}>Close</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main admin WFH page ───────────────────────────────────────
export default function WFHManagement() {
  const [requests, setRequests]   = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const [wfh, emps] = await Promise.all([
        getWFH(),
        employeeService.getAll(),
      ])
      const empList = Array.isArray(emps) ? emps : []
      const empMap  = {}
      empList.forEach(e => { empMap[e.id] = e })

      const enriched = (Array.isArray(wfh) ? wfh : []).map(w => ({
        ...w,
        employee_name: empMap[w.employee_id]?.name || w.employee_name || `Employee #${w.employee_id}`,
        department:    empMap[w.employee_id]?.department || empMap[w.employee_id]?.dept || '—',
      }))

      setRequests(enriched.sort((a, b) => {
        // Pending first, then by date descending
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (b.status === 'pending' && a.status !== 'pending') return 1
        return (b.date || '').localeCompare(a.date || '')
      }))
      setEmployees(empList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleApprove(id) {
    setActionLoading(id)
    try {
      await approveWFH(id)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
      showToast('✓ WFH request approved', 'success')
    } catch {
      showToast('Failed to approve. Please retry.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRejectConfirm(reason) {
    const id = rejectTarget.id
    setRejectTarget(null)
    setActionLoading(id)
    try {
      await rejectWFH(id)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', reject_reason: reason } : r))
      showToast('WFH request rejected', 'info')
    } catch {
      showToast('Failed to reject. Please retry.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // Stats
  const total    = requests.length
  const pending  = requests.filter(r => r.status === 'pending').length
  const approved = requests.filter(r => r.status === 'approved').length
  const rejected = requests.filter(r => r.status === 'rejected').length

  // Filtered list
  const filtered = useMemo(() => {
    return requests
      .filter(r => filter === 'all' || r.status === filter)
      .filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          (r.employee_name || '').toLowerCase().includes(q) ||
          (r.department    || '').toLowerCase().includes(q) ||
          (r.reason        || '').toLowerCase().includes(q) ||
          (r.date          || '').includes(q)
        )
      })
  }, [requests, filter, search])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'DM Sans,sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 28, zIndex: 999,
          padding: '12px 22px', borderRadius: 12, fontWeight: 600, fontSize: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          background: toast.type === 'success' ? '#d1fae5' : toast.type === 'error' ? '#fee2e2' : '#dbeafe',
          color:      toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1e40af',
          animation: 'fadeIn .2s ease',
        }}>{toast.msg}</div>
      )}

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg,#0061f2 0%,#0052cc 55%,#0284c7 100%)',
        borderRadius: 16, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0,97,242,.28)', position: 'relative', overflow: 'hidden',
      }}>
        {[[-20,-20,180],[60,-60,120]].map(([r,t,s],i) => (
          <div key={i} style={{ position:'absolute', right:r, top:t, width:s, height:s, borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
        ))}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginBottom: 4, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase' }}>
            Admin · HR Management
          </div>
          <div style={{ fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Home size={26} /> WFH Requests
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.8)' }}>
            <strong style={{ color: '#fff' }}>{pending}</strong> pending approval · <strong style={{ color: '#fff' }}>{total}</strong> total requests
          </div>
        </div>
        <button
          onClick={load}
          style={{
            background: 'rgba(255,255,255,.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,.3)',
            borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'DM Sans,sans-serif',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: 'Total Requests', value: total,    svgKey: 'clipboard', iconBg: '#dbeafe', iconColor: '#0061f2' },
          { label: 'Pending',        value: pending,  svgKey: 'clock',     iconBg: '#fef3c7', iconColor: '#f59e0b', highlight: pending > 0 },
          { label: 'Approved',       value: approved, svgKey: 'check',     iconBg: '#d1fae5', iconColor: '#10b981' },
          { label: 'Rejected',       value: rejected, svgKey: 'xcircle',   iconBg: '#fee2e2', iconColor: '#ef4444' },
        ].map(c => (
          <div key={c.label} style={{
            background: 'var(--surface)', borderRadius: 14, padding: '16px 20px',
            border: c.highlight ? '1.5px solid #f59e0b' : '1px solid var(--border)',
            boxShadow: c.highlight ? '0 0 0 3px rgba(245,158,11,.12)' : 'var(--shadow)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: c.iconBg, color: c.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.svgKey === 'clipboard' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>}
              {c.svgKey === 'clock'     && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              {c.svgKey === 'check'     && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>}
              {c.svgKey === 'xcircle'   && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: 240, flex: 1, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, department, reason…"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '9px 36px 9px 34px', border: '1.5px solid var(--border)',
              borderRadius: 10, fontSize: 13, outline: 'none',
              background: 'var(--surface)', color: 'var(--text)',
              fontFamily: 'DM Sans,sans-serif', transition: 'border-color .2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border)'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','All'], ['pending','Pending'], ['approved','Approved'], ['rejected','Rejected']].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: '8px 16px', borderRadius: 99, border: '1.5px solid',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background:   filter === val ? 'var(--primary)' : 'var(--surface)',
              color:        filter === val ? '#fff' : 'var(--text-muted)',
              borderColor:  filter === val ? 'var(--primary)' : 'var(--border)',
              fontFamily: 'DM Sans,sans-serif', transition: 'all .2s',
            }}>
              {lbl}{val !== 'all' && requests.filter(r => r.status === val).length > 0 && (
                <span style={{ marginLeft: 6, background: filter === val ? 'rgba(255,255,255,.25)' : 'var(--surface2)', borderRadius: 99, padding: '1px 7px', fontSize: 11 }}>
                  {requests.filter(r => r.status === val).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {(search || filter !== 'all') && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0061f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div>
            <div style={{ fontWeight: 600 }}>Loading requests…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12, color:'#cbd5e1' }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>No WFH requests found</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              {filter !== 'all' || search ? 'Try adjusting your filters.' : 'Employees haven\'t submitted any WFH requests yet.'}
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Employee', 'Department', 'WFH Date', 'Day', 'Reason', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: 11,
                    fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.6px',
                    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const isPending = r.status === 'pending'
                const isLoading = actionLoading === r.id
                const dayOfWeek = r.date ? new Date(r.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' }) : '—'
                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: isPending ? 'rgba(245,158,11,.03)' : i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(8,101,240,.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = isPending ? 'rgba(245,158,11,.03)' : i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)'}
                  >
                    {/* Employee */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={r.employee_name} id={r.employee_id} />
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                          {r.employee_name}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{r.department}</td>

                    {/* Date */}
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--text)' }}>
                      {r.date || '—'}
                    </td>

                    {/* Day */}
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{dayOfWeek}</td>

                    {/* Reason */}
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', maxWidth: 220 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.reason || '—'}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge status={r.status} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {/* View detail button */}
                        <button
                          onClick={() => setDetailTarget(r)}
                          style={{
                            padding: '6px 10px', borderRadius: 8,
                            border: '1.5px solid var(--border)', background: 'var(--surface2)',
                            color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            fontFamily: 'DM Sans,sans-serif', transition: 'all .15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                        >
                          View
                        </button>

                        {isPending && (
                          <>
                            {/* Approve */}
                            <button
                              onClick={() => handleApprove(r.id)}
                              disabled={isLoading}
                              title="Approve"
                              style={{
                                padding: '6px 10px', borderRadius: 8,
                                border: '1.5px solid #10b981',
                                background: isLoading ? '#e2e8f0' : '#d1fae5',
                                color: isLoading ? '#94a3b8' : '#065f46',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: 12, fontWeight: 700,
                                fontFamily: 'DM Sans,sans-serif', transition: 'all .15s',
                              }}
                              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff' }}
                              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = '#d1fae5'; e.currentTarget.style.color = '#065f46' } }}
                            >
                              <CheckCircle size={13} />
                              {isLoading ? '…' : 'Approve'}
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() => setRejectTarget(r)}
                              disabled={isLoading}
                              title="Reject"
                              style={{
                                padding: '6px 10px', borderRadius: 8,
                                border: '1.5px solid #ef4444',
                                background: isLoading ? '#e2e8f0' : '#fff0f0',
                                color: isLoading ? '#94a3b8' : '#991b1b',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: 12, fontWeight: 700,
                                fontFamily: 'DM Sans,sans-serif', transition: 'all .15s',
                              }}
                              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' } }}
                              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = '#fff0f0'; e.currentTarget.style.color = '#991b1b' } }}
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {rejectTarget && (
        <RejectModal
          request={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {detailTarget && (
        <DetailModal
          request={detailTarget}
          onClose={() => setDetailTarget(null)}
          onApprove={(id) => { handleApprove(id); setDetailTarget(null) }}
          onReject={(req) => { setDetailTarget(null); setRejectTarget(req) }}
        />
      )}
    </div>
  )
}

