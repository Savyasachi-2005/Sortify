import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ListTodo,
  History as HistoryIcon,
  Settings,
  LogOut,
  Plus,
  X,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Check,
  ChevronDown,
  Trash2,
  UserCircle,
} from 'lucide-react';
import api, { deleteTask, getTasks, saveTask, updateTaskStatus, updateApiKey } from '../services/api';
import appIcon from '../components/icon.png';

const priorityStyles = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const statusStyles = {
  done: 'text-emerald-600 dark:text-emerald-400',
  active: 'text-amber-600 dark:text-amber-400',
};

const Sidebar = ({ onLogout, current }) => (
  <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
    <div className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
  <img src={appIcon} alt="SortIQ" className="w-8 h-8 rounded-lg" />
        <span className="font-bold text-lg text-gray-900 dark:text-white">SortIQ</span>
      </div>
    </div>
    <nav className="p-4 space-y-1">
      {[
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
        { key: 'tasks', label: 'Tasks', icon: ListTodo, to: '/transform' },
        { key: 'history', label: 'History', icon: HistoryIcon, to: '/history' },
        { key: 'settings', label: 'Settings', icon: Settings, to: '/profile' },
      ].map((item) => (
        <Link
          key={item.key}
          to={item.to}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            current === item.key
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
      <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800" />
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </nav>
  </aside>
);

const Topbar = ({ onOpenModal, onLogout, user, onOpenApiKey }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Productivity Dashboard</h1>
        <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">AI-powered</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onOpenModal} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md text-sm">
          <Plus className="w-4 h-4" /> Add Task
        </button>
        <button onClick={onOpenApiKey} className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
          <Settings className="w-4 h-4" /> API Key
        </button>
        <div className="relative">
          <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <UserCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-2"
              >
                <div className="px-2 py-2 text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">{user?.username}</div>
                  <div className="text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
                </div>
                <button onClick={onOpenApiKey} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Settings className="w-4 h-4" /> Manage API Key
                </button>
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const OverviewCards = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const pending = total - completed;
  const high = tasks.filter((t) => t.priority === 'High').length;
  const cards = [
    { title: 'Total Tasks', value: total, icon: LayoutDashboard, color: 'from-blue-500 to-indigo-500' },
    { title: 'Completed', value: completed, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
    { title: 'Pending', value: pending, icon: Clock3, color: 'from-amber-500 to-orange-500' },
    { title: 'High Priority', value: high, icon: AlertTriangle, color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${c.color} text-white flex items-center justify-center mb-3`}>
            <c.icon className="w-5 h-5" />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{c.title}</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
};

const TaskTable = ({ tasks, onComplete, onDelete }) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="font-semibold text-gray-900 dark:text-white">Task List</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {tasks.map((t) => (
              <tr key={t.id} className="text-gray-900 dark:text-gray-100">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium">{t.original_task}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">{t.smart_task}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[t.priority] || ''}`}>{t.priority}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className={`flex items-center gap-1 ${statusStyles[t.status]}`}>
                    {t.status === 'done' ? <Check className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}
                    <span className="capitalize">{t.status === 'done' ? 'Completed' : 'Pending'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-gray-600 dark:text-gray-300">{t.deadline ? new Date(t.deadline).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex justify-end gap-2">
                    {t.status !== 'done' && (
                      <button onClick={() => onComplete(t)} className="px-2 py-1.5 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Mark Done</button>
                    )}
                    <button onClick={() => onDelete(t)} className="px-2 py-1.5 text-xs rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">No tasks yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HistoryTimeline = ({ tasks }) => {
  const recent = tasks
    .filter((t) => t.status === 'done')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4">
      <div className="font-semibold text-gray-900 dark:text-white mb-3">Recent History</div>
      <ol className="relative border-l border-gray-200 dark:border-gray-800 pl-4">
        {recent.map((t) => (
          <li key={t.id} className="mb-4 ml-2">
            <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-emerald-500" />
            <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">{t.original_task}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.created_at).toLocaleString()}</div>
          </li>
        ))}
        {recent.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">No recent completed tasks.</div>
        )}
      </ol>
    </div>
  );
};

const AddTaskModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      original_task: name.trim(),
      smart_task: name.trim(), // using same field for manual entry
      priority,
      deadline: deadline || null,
    });
    setName('');
    setPriority('Medium');
    setDeadline('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="font-semibold text-gray-900 dark:text-white">Add Task</div>
              <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Task Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Finish project brief" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Deadline</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
                <button type="submit" className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md">Create</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeySaving, setApiKeySaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data || []);
    } catch (e) {
      console.error('Failed to load tasks', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open API key modal and prefill from /api/users/me
  const openApiKeyModal = async () => {
    try {
      const res = await api.get('/api/users/me');
      setApiKey(res.data?.api_key || '');
    } catch {}
    setApiKeyOpen(true);
  };

  const handleCreate = async (task) => {
    try {
      // Backend schema doesn't have deadline column, but we keep it in UI state only
      const { original_task, smart_task, priority } = task;
      const res = await saveTask({ original_task, smart_task, priority });
      setTasks((prev) => [{ ...res.data, deadline: task.deadline || null }, ...prev]);
    } catch (e) {
      console.error('Failed to create task', e);
    }
  };

  const handleComplete = async (task) => {
    try {
      await updateTaskStatus(task.id, 'done');
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'done' } : t)));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDelete = async (task) => {
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      console.error('Failed to delete task', e);
    }
  };

  const grouped = useMemo(() => ({
    active: tasks.filter((t) => t.status !== 'done'),
    done: tasks.filter((t) => t.status === 'done'),
  }), [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-950 dark:to-indigo-950/30">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex">
          <Sidebar current="dashboard" onLogout={logout} />
          <main className="flex-1 min-h-screen">
            <Topbar user={user} onOpenModal={() => setOpenModal(true)} onLogout={logout} onOpenApiKey={openApiKeyModal} />
            <div className="p-4 md:p-6 space-y-6">
              <OverviewCards tasks={tasks} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TaskTable tasks={grouped.active} onComplete={handleComplete} onDelete={handleDelete} />
                </div>
                <div>
                  <HistoryTimeline tasks={tasks} />
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-3">Completed</div>
                <TaskTable tasks={grouped.done} onComplete={() => {}} onDelete={handleDelete} />
              </div>
            </div>
          </main>
        </div>
      </div>

      <AddTaskModal open={openModal} onClose={() => setOpenModal(false)} onCreate={handleCreate} />

      {/* API Key Modal */}
      <AnimatePresence>
        {apiKeyOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="font-semibold text-gray-900 dark:text-white">Manage API Key</div>
                <button onClick={() => setApiKeyOpen(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-3">
                <label className="block text-sm text-gray-600 dark:text-gray-300">OpenRouter/OpenAI API Key</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Stored securely in your profile. Used for AI transformations.</p>
              </div>
              <div className="flex justify-end gap-2 px-4 pb-4">
                <button onClick={() => setApiKeyOpen(false)} className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
                <button
                  onClick={async () => {
                    if (!apiKey.trim()) return setApiKeyOpen(false);
                    try {
                      setApiKeySaving(true);
                      await updateApiKey(apiKey.trim());
                      setApiKeyOpen(false);
                    } catch (e) {
                      // noop; could add toast if desired
                    } finally {
                      setApiKeySaving(false);
                    }
                  }}
                  disabled={apiKeySaving}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md disabled:opacity-60"
                >
                  {apiKeySaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;