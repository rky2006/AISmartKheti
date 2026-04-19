import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Activity {
  id: string;
  type: string;
  crop: string;
  date: string;
  area: string;
  notes: string;
}

const ACTIVITY_TYPES = ['Planting', 'Spraying', 'Harvesting', 'Irrigation', 'Fertilizing', 'Weeding', 'Pruning', 'Soil Preparation', 'Market Visit'];
const ACTIVITY_ICONS: Record<string, string> = {
  Planting: '🌱', Spraying: '💦', Harvesting: '🌾', Irrigation: '💧',
  Fertilizing: '🌿', Weeding: '🪴', Pruning: '✂️', 'Soil Preparation': '🚜', 'Market Visit': '🏪',
};

export default function FarmActivityLog() {
  const { t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>(() => {
    const stored = localStorage.getItem('farmActivities');
    return stored ? JSON.parse(stored) : [
      { id: '1', type: 'Planting', crop: 'Tomato', date: '2024-01-15', area: '2', notes: 'Used hybrid seeds F1 variety' },
      { id: '2', type: 'Irrigation', crop: 'Wheat', date: '2024-01-17', area: '5', notes: 'Drip irrigation, 45 minutes' },
      { id: '3', type: 'Spraying', crop: 'Cotton', date: '2024-01-19', area: '3', notes: 'Neem oil spray for aphid control' },
    ];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: '', crop: '', date: new Date().toISOString().split('T')[0], area: '', notes: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    localStorage.setItem('farmActivities', JSON.stringify(activities));
  }, [activities]);

  const handleSave = () => {
    if (!form.type || !form.crop || !form.date) return;
    if (editId) {
      setActivities(acts => acts.map(a => a.id === editId ? { ...form, id: editId } : a));
      setEditId(null);
    } else {
      setActivities(acts => [{ ...form, id: Date.now().toString() }, ...acts]);
    }
    setForm({ type: '', crop: '', date: new Date().toISOString().split('T')[0], area: '', notes: '' });
    setShowForm(false);
  };

  const handleEdit = (activity: Activity) => {
    setForm(activity);
    setEditId(activity.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setActivities(acts => acts.filter(a => a.id !== id));
  };

  const filtered = filterType
    ? activities.filter(a => a.type === filterType)
    : activities;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📝 {t.activityLogTitle}</h1>
        <p>{t.activityLogSubtitle}</p>
      </div>

      <div className="activity-controls">
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm({ type: '', crop: '', date: new Date().toISOString().split('T')[0], area: '', notes: '' }); }}>
          + {t.addActivity}
        </button>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="filter-select">
          <option value="">All Types</option>
          {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="activity-stats">
        {ACTIVITY_TYPES.slice(0, 5).map(type => {
          const count = activities.filter(a => a.type === type).length;
          return count > 0 ? (
            <div key={type} className="stat-badge" onClick={() => setFilterType(filterType === type ? '' : type)}>
              {ACTIVITY_ICONS[type]} {type}: <strong>{count}</strong>
            </div>
          ) : null;
        })}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>{editId ? t.edit : t.addActivity}</h3>
            <div className="form-group">
              <label>{t.activityType}</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="">Select type</option>
                {ACTIVITY_TYPES.map(at => <option key={at} value={at}>{ACTIVITY_ICONS[at]} {at}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t.activityCrop}</label>
              <input value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))} placeholder="e.g. Tomato, Wheat" />
            </div>
            <div className="form-group">
              <label>{t.activityDate}</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t.activityArea} (acres)</label>
              <input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="e.g. 2.5" />
            </div>
            <div className="form-group">
              <label>{t.activityNotes}</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Additional notes..." />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSave}>{t.saveActivity}</button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>📋</span>
          <p>{t.noActivities}</p>
        </div>
      ) : (
        <div className="activity-list">
          {filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-icon">{ACTIVITY_ICONS[activity.type] || '📌'}</div>
              <div className="activity-info">
                <div className="activity-header">
                  <span className="activity-type">{activity.type}</span>
                  <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="activity-crop">🌱 {activity.crop} {activity.area && `• ${activity.area} acres`}</div>
                {activity.notes && <div className="activity-notes">{activity.notes}</div>}
              </div>
              <div className="activity-actions">
                <button className="btn-icon" onClick={() => handleEdit(activity)}>✏️</button>
                <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(activity.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
