import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTimetable } from '../../context/TimetableContext';
import { Bell, Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const EMPTY = { title: '', description: '', date: '' };

const NotificationForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date) {
      toast.error('Please fill all fields');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
      <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Bell size={15} className="text-indigo-600" />
        {initial.id ? 'Edit Notification' : 'New Notification'}
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Notification title..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Write notification details..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={onCancel} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <X size={14} /> Cancel
        </button>
        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
          <Save size={14} /> Save
        </button>
      </div>
    </form>
  );
};

const AdminNotifications = () => {
  const { notifications, addNotification, updateNotification, deleteNotification } = useTimetable();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = async (data) => {
    try {
      await addNotification({ ...data, id: Date.now().toString(), createdAt: new Date().toISOString() });
      toast.success('Notification added!');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to add notification');
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateNotification(data.id, data);
      toast.success('Notification updated!');
      setEditing(null);
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await deleteNotification(id);
        toast.success('Notification deleted');
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">Manage announcements for students</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {showForm && !editing && (
        <NotificationForm
          initial={{ ...EMPTY }}
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <NotificationForm
          initial={editing}
          onSave={handleEdit}
          onCancel={() => setEditing(null)}
        />
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-500 text-sm">No notifications yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{n.description}</p>
                  <p className="text-slate-400 text-xs mt-2">{n.date}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setEditing(n); setShowForm(false); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
