import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Calendar, 
  Eye, 
  Trash2, 
  Search,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const History = () => {
  const { user } = useAuth();
  const [transformations, setTransformations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/history');
      setTransformations(response.data.transformations || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load transformation history');
      // For demo purposes, set some mock data
      setTransformations([
        {
          id: 1,
          input: "buy groceries milk bread eggs, call mom tomorrow, finish project report by friday, dentist appointment next week",
          output: "🛒 Buy groceries (milk, bread, eggs)\n📞 Call mom tomorrow\n📋 Finish project report (Due: Friday)\n🦷 Schedule dentist appointment",
          created_at: "2024-12-20T10:30:00Z"
        },
        {
          id: 2,
          input: "workout 3x this week, meal prep sunday, pay bills due 15th, birthday gift for sarah",
          output: "💪 Workout 3x this week\n🍽️ Meal prep on Sunday\n💳 Pay bills (Due: 15th)\n🎁 Buy birthday gift for Sarah",
          created_at: "2024-12-19T15:45:00Z"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransformations = transformations.filter(item =>
    item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.output.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
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
        </motion.div>

        {/* Transformations List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredTransformations.length === 0 ? (
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
                  {searchTerm ? 'No matching transformations found' : 'No transformations yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Start by transforming your first messy task list!'
                  }
                </p>
                {!searchTerm && (
                  <a
                    href="/transform"
                    className="btn-primary inline-flex items-center"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Transform Tasks
                  </a>
                )}
              </motion.div>
            ) : (
              filteredTransformations.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {expandedItems.has(item.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Input */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Original Input
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {expandedItems.has(item.id) ? item.input : truncateText(item.input)}
                        </p>
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Organized Tasks
                      </h4>
                      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                        <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap font-sans">
                          {expandedItems.has(item.id) ? item.output : truncateText(item.output)}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigator.clipboard.writeText(item.output);
                          toast.success('Result copied to clipboard!');
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Copy result"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        {transformations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-6 bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {transformations.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Transformations
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {transformations.reduce((acc, item) => acc + item.output.split('\n').length, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tasks Organized
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;
