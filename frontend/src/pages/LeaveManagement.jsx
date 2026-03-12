// src/pages/LeaveManagement.jsx
import React, { useState } from 'react'
import { CheckCircle, XCircle, Calendar, AlertTriangle } from 'lucide-react'
import Button from '../components/common/Button'
import { formatDate, getInitials } from '../utils/helpers'

const MOCK_LEAVES = [
  { id:1, name:'Sneha Patel',  type:'Sick Leave',     from:'2026-03-05', to:'2026-03-07', days:3, reason:'Fever and rest', status:'pending'  },
  { id:2, name:'Rahul Verma',  type:'Casual Leave',   from:'2026-03-10', to:'2026-03-11', days:2, reason:'Personal work', status:'pending'  },
  { id:3, name:'Priya Sharma', type:'Annual Leave',   from:'2026-03-20', to:'2026-03-25', days:6, reason:'Vacation',      status:'approved' },
  { id:4, name:'Arjun Mehta',  type:'Work From Home', from:'2026-03-06', to:'2026-03-06', days:1, reason:'Home repairs',  status:'rejected' },
  { id:5, name:'Kavya Nair',   type:'Sick Leave',     from:'2026-03-08', to:'2026-03-09', days:2, reason:'Doctor visit',  status:'pending'  },
]

const STATUS_COLOR = {
  pending:  'var(--warning)',
  approved: 'var(--success)',
  rejected: 'var(--danger)',
}

const REJECT_REASONS = [
  'Insufficient leave balance',
  'Critical project deadline',
  'Team already on leave',
  'Incomplete documentation',
  'Overlapping with company event',
  'Other',
]

// ── Reject Confirmation Modal ──────────────────────────────────
function RejectModal({ leave, onConfirm, onCancel }) {
  const [selected, setSelected] = useState('')
  const [custom,   setCustom]   = useState('')
  const [error,    setError]    = useState('')

  const finalReason = selected === 'Other' ? custom.trim() : selected

  function handleConfirm() {
    if (!selected)                        { setError('Please select a reason.'); return }
    if (selected === 'Other' && !custom.trim()) { setError('Please enter a reason.'); return }
    onConfirm(finalReason)
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onCancel()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)',
        animation: 'fadeIn .18s ease',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: 460, maxWidth: '92vw',
        boxShadow: '0 24px 64px rgba(0,0,0,.22)',
        overflow: 'hidden',
        animation: 'slideUp .2s ease',
      }}>

        {/* ── Top danger strip ── */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          padding: '22px 28px 20px',
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'rgba(255,255,255,.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 4 }}>
              Reject Leave Request
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', lineHeight: 1.5 }}>
              You're rejecting <strong style={{ color: '#fff' }}>{leave.name}</strong>'s{' '}
              <strong style={{ color: '#fff' }}>{leave.type}</strong> ({leave.days} day{leave.days > 1 ? 's' : ''})
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px 28px 28px' }}>

          {/* Leave summary pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
          }}>
            <Calendar size={14} color="#ef4444" />
            <span style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500 }}>
              {formatDate(leave.from)} — {formatDate(leave.to)} · Reason: "{leave.reason}"
            </span>
          </div>

          {/* Reason selector */}
          <div style={{ marginBottom: 6 }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: '#64748b',
              textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 10,
            }}>
              Rejection Reason *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {REJECT_REASONS.map(r => (
                <label key={r} onClick={() => { setSelected(r); setError('') }} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                  border: `1.5px solid ${selected === r ? '#ef4444' : '#e2e8f0'}`,
                  background: selected === r ? '#fef2f2' : '#f8fafc',
                  transition: 'all .15s',
                }}>
                  {/* Custom radio */}
                  <div style={{
                    width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${selected === r ? '#ef4444' : '#cbd5e1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .15s',
                  }}>
                    {selected === r && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: selected === r ? 600 : 400,
                    color: selected === r ? '#b91c1c' : '#374151',
                    fontFamily: 'DM Sans,sans-serif',
                  }}>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom text input shown when "Other" selected */}
          {selected === 'Other' && (
            <div style={{ marginTop: 10 }}>
              <textarea
                value={custom}
                onChange={e => { setCustom(e.target.value); setError('') }}
                placeholder="Describe the reason for rejection..."
                rows={3}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  padding: '10px 14px', fontSize: 13, color: '#0f172a',
                  fontFamily: 'DM Sans,sans-serif', resize: 'vertical', outline: 'none',
                  transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = '#ef4444'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 10, fontSize: 12, color: '#dc2626',
              background: '#fef2f2', borderRadius: 8,
              padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <AlertTriangle size={13} /> {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>
            <button onClick={onCancel} style={{
              padding: '10px 22px', borderRadius: 10,
              border: '1.5px solid #e2e8f0', background: '#f8fafc',
              color: '#64748b', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0' }}
            >
              Cancel
            </button>
            <button onClick={handleConfirm} style={{
              padding: '10px 24px', borderRadius: 10,
              border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
              display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 4px 12px rgba(239,68,68,.35)',
              transition: 'all .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 18px rgba(239,68,68,.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,.35)'}
            >
              <XCircle size={15} />
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0}           to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function LeaveManagement() {
  const [leaves,   setLeaves]   = useState(MOCK_LEAVES)
  const [filter,   setFilter]   = useState('all')
  const [rejectTarget, setRejectTarget] = useState(null) // leave being rejected

  function handleApprove(id) {
    setLeaves(l => l.map(x => x.id === id ? { ...x, status: 'approved' } : x))
  }

  function handleRejectConfirm(reason) {
    setLeaves(l => l.map(x => x.id === rejectTarget.id
      ? { ...x, status: 'rejected', rejectionReason: reason }
      : x
    ))
    setRejectTarget(null)
  }

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter)
  const pending  = leaves.filter(l => l.status === 'pending').length

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Pending',  value: leaves.filter(l => l.status === 'pending').length,  color: 'var(--warning)' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: 'var(--success)' },
          { label: 'Rejected', value: leaves.filter(l => l.status === 'rejected').length, color: 'var(--danger)'  },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', borderRadius: 14, padding: '20px',
            border: `1px solid ${s.color}30`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne,sans-serif', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label} Requests</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all .2s',
            background: filter === f ? 'var(--primary)' : 'var(--surface)',
            color:      filter === f ? '#fff'           : 'var(--text-muted)',
            border:     filter === f ? 'none'           : '1.5px solid var(--border)',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pending > 0 ? ` (${pending})` : ''}
          </button>
        ))}
      </div>

      {/* Leave cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(leave => (
          <div key={leave.id} style={{
            background: 'var(--surface)', borderRadius: 16, padding: 20,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, minWidth: 44,
              background: 'linear-gradient(135deg,var(--primary),var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14,
            }}>{getInitials(leave.name)}</div>

            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{leave.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {leave.type} · {leave.days} day{leave.days > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 12 }}>
                <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <Calendar size={12} />{formatDate(leave.from)} — {formatDate(leave.to)}
                </span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Reason</div>
              <div style={{ fontSize: 13 }}>{leave.reason}</div>
              {/* Show rejection reason if rejected */}
              {leave.status === 'rejected' && leave.rejectionReason && (
                <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, fontStyle: 'italic' }}>
                  Rejected: {leave.rejectionReason}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: `${STATUS_COLOR[leave.status]}18`, color: STATUS_COLOR[leave.status],
              }}>{leave.status}</span>

              {leave.status === 'pending' && (
                <>
                  <Button
                    variant="success" size="sm"
                    icon={<CheckCircle size={14} />}
                    onClick={() => handleApprove(leave.id)}
                  >Approve</Button>
                  <Button
                    variant="danger" size="sm"
                    icon={<XCircle size={14} />}
                    onClick={() => setRejectTarget(leave)}
                  >Reject</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Reject Modal ── */}
      {rejectTarget && (
        <RejectModal
          leave={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  )
}