import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  Search,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, deleteTask, updateTaskStatus } from '../services/api';
import toast from 'react-hot-toast';

const History = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('date'); // 'date', 'priority'
  const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'High', 'Medium', 'Low'

  useEffect(() => {
    const lastTransformTime = localStorage.getItem('lastTransformTime');
    fetchTasks();
    
    // Set up interval to check for updates less frequently (every 30 seconds)
    const intervalId = setInterval(fetchTasks, 500000);
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [user?.id]); // Only re-run if user ID changes

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleMarkAsDone = async (taskId) => {
    try {
      await updateTaskStatus(taskId, 'done');
      toast.success('Task marked as done');
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const filterAndSortTasks = () => {
    let filtered = tasks.filter(task => {
      const matchesSearch = 
        task.original_task.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.smart_task.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = 
        filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesPriority;
    });

    // Sort tasks
    const sortTasks = (tasks) => {
      return tasks.sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === 'priority') {
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
      });
    };

    // Separate and sort active and completed tasks
    const activeTasks = sortTasks(filtered.filter(task => task.status !== 'done'));
    const completedTasks = sortTasks(filtered.filter(task => task.status === 'done'));

    return { activeTasks, completedTasks };
  };

  const filteredTasks = filterAndSortTasks();

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your transformation history...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <HistoryIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Transformation History
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            View all your past AI-powered task transformations and revisit your organized lists.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your transformations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Priority Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filterPriority !== 'all' || sortBy !== 'date') && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filterPriority !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                  Priority: {filterPriority}
                  <button
                    onClick={() => setFilterPriority('all')}
                    className="ml-2 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              )}
              {sortBy !== 'date' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                  Sorted by: {sortBy}
                  <button
                    onClick={() => setSortBy('date')}
                    className="ml-2 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-8">
          <AnimatePresence>
            {filteredTasks.activeTasks.length === 0 && filteredTasks.completedTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'No matching tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Start by adding your first task!'
                  }
                </p>
                {!searchTerm && (
                  <a
                    href="/transform"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Transform Tasks
                  </a>
                )}
              </motion.div>
            ) : (
              <>
                {/* Active Tasks Section */}
                {filteredTasks.activeTasks.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Active Tasks
                    </h2>
                    <div className="space-y-4">
                      {filteredTasks.activeTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(task.created_at)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'done'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        }`}>
                          {task.status === 'done' ? 'Completed' : 'Active'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.status !== 'done' && (
                          <button
                            onClick={() => handleMarkAsDone(task.id)}
                            className="p-1 text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                            title="Mark as done"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          title="Delete task"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleExpanded(task.id)}
                          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          {expandedItems.has(task.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Original Task
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {expandedItems.has(task.id)
                            ? task.original_task
                            : truncateText(task.original_task)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          SMART Task
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {expandedItems.has(task.id)
                            ? task.smart_task
                            : truncateText(task.smart_task)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks Section */}
        {filteredTasks.completedTasks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Completed Tasks
            </h2>
            <div className="space-y-4">
              {filteredTasks.completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-200 dark:border-green-700 overflow-hidden opacity-75"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(task.created_at)}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Completed
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          title="Delete task"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleExpanded(task.id)}
                          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          {expandedItems.has(task.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Original Task
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {expandedItems.has(task.id)
                            ? task.original_task
                            : truncateText(task.original_task)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          SMART Task
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {expandedItems.has(task.id)
                            ? task.smart_task
                            : truncateText(task.smart_task)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </AnimatePresence>
</div>
      </div>
    </div>
  );
};

export default History;
