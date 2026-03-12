export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })

export const formatTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

export const getStatusColor = (status) => ({
  present:  'var(--success)',
  absent:   'var(--danger)',
  late:     'var(--warning)',
  approved: 'var(--success)',
  pending:  'var(--warning)',
  rejected: 'var(--danger)',
  active:   'var(--success)',
  inactive: 'var(--text-muted)',
}[status?.toLowerCase()] ?? 'var(--text-muted)')

export const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n)

export const cls = (...args) => args.filter(Boolean).join(' ')
