import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Mail, Phone } from 'lucide-react'
import employeeService from '../services/employeeService'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { getInitials, getStatusColor, currency, formatDate } from '../utils/helpers'

const EMPTY = { name:'', email:'', role:'', department:'', phone:'', salary:'', status:'active', joined:'' }

export default function Employees() {
  const [data, setData]     = useState([])
  const [q, setQ]           = useState('')
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [del, setDel]       = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { employeeService.getAll().then(setData) }, [])

  const filtered = data.filter(e =>
    e.name.toLowerCase().includes(q.toLowerCase()) ||
    e.department.toLowerCase().includes(q.toLowerCase()) ||
    e.role.toLowerCase().includes(q.toLowerCase())
  )

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (e) => { setEditing(e); setForm(e); setModal(true) }

  const save = async () => {
    setLoading(true);
    try {
      if (editing) {
        const updated = await employeeService.update(editing.id, form);
        if (updated?.error) throw new Error(updated.error);
        setData((d) => d.map((e) => (e.id === editing.id ? { ...e, ...updated } : e)));
      } else {
        const created = await employeeService.create(form);
        if (created?.error) throw new Error(created.error);
        setData((d) => [...(d || []), created]);
      }
      setModal(false);
    } catch (err) {
      alert(err.message || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  const destroy = async () => {
    try {
      await employeeService.delete(del.id);
      setData((d) => d.filter((e) => e.id !== del.id));
      setDel(null);
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  }

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ position:'relative' }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search employees…"
            style={{
              paddingLeft:38, paddingRight:14, paddingTop:9, paddingBottom:9,
              border:'1.5px solid var(--border)', borderRadius:10, fontSize:14,
              fontFamily:'DM Sans,sans-serif', width:260, outline:'none', background:'var(--surface)',
            }}
          />
        </div>
        <Button icon={<Plus size={16}/>} onClick={openAdd}>Add Employee</Button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {filtered.map(emp => (
          <div key={emp.id} style={{
            background:'var(--surface)', borderRadius:16, padding:20,
            boxShadow:'var(--shadow)', border:'1px solid var(--border)',
            transition:'transform .2s,box-shadow .2s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
          onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow)' }}
          >
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{
                  width:46, height:46, borderRadius:12,
                  background:'linear-gradient(135deg,var(--primary),var(--accent))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', fontWeight:700, fontSize:15,
                }}>{getInitials(emp.name)}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{emp.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{emp.role}</div>
                </div>
              </div>
              <span style={{
                padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600,
                background:`${getStatusColor(emp.status)}18`, color:getStatusColor(emp.status),
              }}>{emp.status}</span>
            </div>
            <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, color:'var(--text-muted)' }}>
                <Mail size={14}/><span>{emp.email}</span>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, color:'var(--text-muted)' }}>
                <Phone size={14}/><span>{emp.phone}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{
                  padding:'4px 10px', background:'var(--primary-light)', color:'var(--primary)',
                  borderRadius:99, fontSize:12, fontWeight:600,
                }}>{emp.department}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--success)' }}>{currency(emp.salary)}/mo</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:16, borderTop:'1px solid var(--border)', paddingTop:14 }}>
              <Button variant="ghost" size="sm" icon={<Pencil size={13}/>} onClick={()=>openEdit(emp)} style={{ flex:1, justifyContent:'center' }}>Edit</Button>
              <Button variant="danger" size="sm" icon={<Trash2 size={13}/>} onClick={()=>setDel(emp)} style={{ flex:1, justifyContent:'center' }}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Edit Employee':'Add Employee'}
        footer={<><Button variant="ghost" onClick={()=>setModal(false)}>Cancel</Button><Button loading={loading} onClick={save}>{editing?'Save Changes':'Add Employee'}</Button></>}
      >
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Input label="Full Name"   name="name"       value={form.name}       onChange={handle} required style={{ gridColumn:'1/-1' }}/>
          <Input label="Email"       name="email"      value={form.email}      onChange={handle} type="email"/>
          <Input label="Phone"       name="phone"      value={form.phone}      onChange={handle}/>
          <Input label="Role/Title"  name="role"       value={form.role}       onChange={handle}/>
          <Input label="Department"  name="department" value={form.department} onChange={handle}/>
          <Input label="Salary (₹)"  name="salary"     value={form.salary}     onChange={handle} type="number"/>
          <Input label="Joined Date" name="joined"     value={form.joined}     onChange={handle} type="date"/>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:6 }}>Status</label>
            <select name="status" value={form.status} onChange={handle} style={{
              width:'100%', padding:'10px 14px', border:'1.5px solid var(--border)',
              borderRadius:10, fontSize:14, fontFamily:'DM Sans,sans-serif', outline:'none',
            }}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!del} onClose={()=>setDel(null)} title="Confirm Delete" size="sm"
        footer={<><Button variant="ghost" onClick={()=>setDel(null)}>Cancel</Button><Button variant="danger" onClick={destroy}>Delete</Button></>}
      >
        <p style={{ fontSize:14 }}>Are you sure you want to delete <strong>{del?.name}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}