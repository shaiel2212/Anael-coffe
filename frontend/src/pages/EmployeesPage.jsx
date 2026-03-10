import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Clock, BarChart2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { format } from 'date-fns';

function EmployeeForm({ employee, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: employee?.name || '',
    phone: employee?.phone || '',
    email: employee?.email || '',
    role: employee?.role || '',
    hourly_rate: employee?.hourly_rate || '',
    start_date: employee?.start_date || '',
    is_active: employee?.is_active !== false,
  });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.name')}</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rustic-input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.phone')}</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rustic-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.role')}</label>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="ברמן, מלצר..."
            className="w-full px-3 py-2 rustic-input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.hourlyRate')} (₪)</label>
          <input type="number" step="0.01" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
            className="w-full px-3 py-2 rustic-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.startDate')}</label>
          <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full px-3 py-2 rustic-input" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-rustic-ink">{t('common.active')}</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-rustic-sand rounded-xl text-rustic-inkSoft hover:bg-rustic-sand/20">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 rustic-btn-primary">{t('common.save')}</button>
      </div>
    </form>
  );
}

function WorkHourForm({ employees, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    employee_id: employees[0]?.id || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    clock_in: '',
    clock_out: '',
    notes: '',
  });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-rustic-ink mb-1">עובד</label>
        <select value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          className="w-full px-3 py-2 rustic-input" required>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.date')}</label>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full px-3 py-2 rustic-input" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.clockIn')}</label>
          <input type="time" value={form.clock_in} onChange={(e) => setForm({ ...form, clock_in: e.target.value })}
            className="w-full px-3 py-2 rustic-input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-rustic-ink mb-1">{t('employees.clockOut')}</label>
          <input type="time" value={form.clock_out} onChange={(e) => setForm({ ...form, clock_out: e.target.value })}
            className="w-full px-3 py-2 rustic-input" />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-rustic-sand rounded-xl text-rustic-inkSoft hover:bg-rustic-sand/20">{t('common.cancel')}</button>
        <button type="submit" className="px-4 py-2 rustic-btn-primary">{t('common.save')}</button>
      </div>
    </form>
  );
}

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('employees');
  const [workHours, setWorkHours] = useState([]);
  const [salary, setSalary] = useState([]);
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');

  const loadData = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch { toast.error(t('common.error')); }
    finally { setLoading(false); }
  };

  const loadWorkHours = async () => {
    try {
      const { data } = await api.get(`/employees/work-hours?from=${monthStart}&to=${today}`);
      setWorkHours(data);
    } catch { console.error('work hours error'); }
  };

  const loadSalary = async () => {
    try {
      const { data } = await api.get(`/employees/salary-summary?from=${monthStart}&to=${today}`);
      setSalary(data);
    } catch { console.error('salary error'); }
  };

  useEffect(() => { loadData(); loadWorkHours(); loadSalary(); }, []);

  const handleEmployeeSubmit = async (form) => {
    try {
      if (modal.data) {
        await api.put(`/employees/${modal.data.id}`, form);
        toast.success('עובד עודכן');
      } else {
        await api.post('/employees', form);
        toast.success('עובד נוסף');
      }
      setModal({ open: false, type: null, data: null });
      loadData();
    } catch { toast.error(t('common.error')); }
  };

  const handleWorkHourSubmit = async (form) => {
    try {
      await api.post('/employees/work-hours', form);
      toast.success('שעות נרשמו');
      setModal({ open: false, type: null, data: null });
      loadWorkHours();
      loadSalary();
    } catch { toast.error(t('common.error')); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${deleteDialog.id}`);
      toast.success('עובד נמחק');
      setDeleteDialog({ open: false, id: null });
      loadData();
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-rustic-ink">{t('employees.title')}</h1>
      </div>

      <div className="flex gap-2 bg-rustic-sand/30 p-1 rounded-xl w-fit">
        {['employees', 'workHours', 'salary'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-rustic-linen shadow-rustic text-rustic-ink' : 'text-rustic-inkSoft hover:text-rustic-ink'}`}>
            {tab === 'employees' ? t('employees.title') : tab === 'workHours' ? t('employees.workHours') : t('employees.salarySummary')}
          </button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <div className="rustic-card">
          <div className="p-5 border-b border-rustic-sand/40 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-rustic-ink">{t('employees.title')}</h2>
            <button onClick={() => setModal({ open: true, type: 'employee', data: null })}
              className="flex items-center gap-2 rustic-btn-primary text-sm px-4 py-2">
              <Plus className="w-4 h-4" /> {t('employees.addEmployee')}
            </button>
          </div>
          <div className="divide-y divide-rustic-sand/40">
            {loading ? <div className="p-8 text-center text-rustic-inkSoft">{t('common.loading')}</div> :
              employees.length === 0 ? <div className="p-8 text-center text-rustic-inkSoft">אין עובדים</div> :
                employees.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-4 hover:bg-rustic-sand/20">
                    <div>
                      <p className="font-medium text-rustic-ink">{emp.name}</p>
                      <p className="text-sm text-gray-500">{emp.role} {emp.phone && `· ${emp.phone}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {emp.hourly_rate && <span className="text-sm font-medium text-rustic-wood">₪{parseFloat(emp.hourly_rate).toFixed(2)}/שעה</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${emp.is_active ? 'bg-green-100 text-green-700' : 'bg-rustic-sand/40 text-rustic-inkSoft'}`}>
                        {emp.is_active ? t('common.active') : t('common.inactive')}
                      </span>
                      <button onClick={() => setModal({ open: true, type: 'employee', data: emp })} className="p-2 hover:bg-rustic-sand/30 rounded-lg text-gray-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteDialog({ open: true, id: emp.id })} className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {activeTab === 'workHours' && (
        <div className="rustic-card">
          <div className="p-5 border-b border-rustic-sand/40 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-rustic-ink">{t('employees.workHours')} - החודש</h2>
            <button onClick={() => setModal({ open: true, type: 'workHour', data: null })}
              className="flex items-center gap-2 rustic-btn-primary text-sm px-4 py-2">
              <Plus className="w-4 h-4" /> {t('employees.addWorkHour')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-rustic-sand/20">
                <tr>
                  {['עובד', t('employees.date'), t('employees.clockIn'), t('employees.clockOut'), t('employees.hoursWorked')].map(h => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rustic-sand/40">
                {workHours.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-rustic-inkSoft">אין רשומות</td></tr>
                ) : workHours.map(wh => (
                  <tr key={wh.id} className="hover:bg-rustic-sand/20">
                    <td className="px-4 py-3 font-medium text-rustic-ink">{wh.employee?.name}</td>
                    <td className="px-4 py-3 text-rustic-inkSoft text-sm">{wh.date}</td>
                    <td className="px-4 py-3 text-rustic-inkSoft text-sm">{wh.clock_in}</td>
                    <td className="px-4 py-3 text-rustic-inkSoft text-sm">{wh.clock_out || '-'}</td>
                    <td className="px-4 py-3 font-medium text-rustic-wood">{wh.hours_worked ? `${parseFloat(wh.hours_worked).toFixed(1)} שעות` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="rustic-card">
          <div className="p-5 border-b border-rustic-sand/40">
            <h2 className="font-heading font-semibold text-rustic-ink">{t('employees.salarySummary')} - החודש</h2>
          </div>
          <div className="divide-y divide-rustic-sand/40">
            {salary.length === 0 ? <div className="p-8 text-center text-rustic-inkSoft">אין נתונים</div> :
              salary.map(s => (
                <div key={s.employee.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-rustic-ink">{s.employee.name}</p>
                    <p className="text-sm text-gray-500">{s.work_days} ימי עבודה · {s.total_hours} שעות</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-rustic-wood">₪{s.total_salary.toFixed(2)}</p>
                    <p className="text-xs text-rustic-inkSoft">₪{parseFloat(s.employee.hourly_rate || 0).toFixed(2)}/שעה</p>
                  </div>
                </div>
              ))}
          </div>
          {salary.length > 0 && (
            <div className="p-4 bg-rustic-sand/30 rounded-b-2xl flex items-center justify-between">
              <span className="font-heading font-semibold text-rustic-ink">סה"כ לתשלום</span>
              <span className="font-bold text-xl text-rustic-wood">
                ₪{salary.reduce((sum, s) => sum + s.total_salary, 0).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modal.open && modal.type === 'employee'} onClose={() => setModal({ open: false, type: null, data: null })}
        title={modal.data ? 'ערוך עובד' : t('employees.addEmployee')}>
        <EmployeeForm employee={modal.data} onSubmit={handleEmployeeSubmit} onCancel={() => setModal({ open: false, type: null, data: null })} />
      </Modal>

      <Modal isOpen={modal.open && modal.type === 'workHour'} onClose={() => setModal({ open: false, type: null, data: null })}
        title={t('employees.addWorkHour')} size="sm">
        <WorkHourForm employees={employees.filter(e => e.is_active)} onSubmit={handleWorkHourSubmit} onCancel={() => setModal({ open: false, type: null, data: null })} />
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete} title="אישור מחיקה" message="האם אתה בטוח שברצונך למחוק עובד זה?" />
    </div>
  );
}
