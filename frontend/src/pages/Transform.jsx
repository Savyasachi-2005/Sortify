import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Copy, 
  Mail, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Key,
  X,
  Settings,
  Calendar,
  Clock,
  ClipboardCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api, { updateApiKey, sendTaskResultEmail } from '../services/api';  // Use our custom API service
import toast from 'react-hot-toast';

const Transform = () => {
  const { isAuthenticated, user } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [originalTasks, setOriginalTasks] = useState([]);
  const [processedTasks, setProcessedTasks] = useState([]);
  const [isEmailing, setIsEmailing] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Fetch user profile to get stored API key
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/api/users/me');
          if (response.data.api_key) {
            setApiKey(response.data.api_key);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          setProfileLoaded(true);
        }
      } else {
        setProfileLoaded(true);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    // Show API key modal after profile loads and only if no key is set
    if (isAuthenticated && profileLoaded && !apiKey) {
      setShowApiKeyModal(true);
    } else if (apiKey || !isAuthenticated) {
      setShowApiKeyModal(false);
    }
  }, [isAuthenticated, profileLoaded, apiKey]);

  const handleTransform = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Check if user has API key set in their profile
    if (!apiKey || !apiKey.trim()) {
      setShowApiKeyModal(true);
      return;
    }

    if (!input.trim()) {
      toast.error('Please enter some text to transform');
      return;
    }

    setIsLoading(true);
    setOutput('');

    try {
      // Split input into tasks by new line or comma
      const tasks = input
        .trim()
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Store original tasks for email
      setOriginalTasks(tasks);

      console.log("Sending tasks:", tasks);
      console.log("API Key:", apiKey);
      
      // Add a custom header with the token instead of using withCredentials
      const token = localStorage.getItem('access_token');
      console.log("Token:", token);
      
      // Prepare request data - API key is stored in user profile
      const requestData = {
        tasks: tasks
      };
      
      console.log("Request data:", requestData);
      
      // Using our API service with explicit auth header
      const response = await api.post('/api/ai/transform', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Format and display the output
      if (response.data && response.data.processed_tasks) {
        const formattedOutput = formatOutput(response.data.processed_tasks);
        setOutput(formattedOutput);
        
        // Store processed tasks for email
        setProcessedTasks(response.data.processed_tasks);
        
        toast.success('Tasks transformed successfully!');
      } else {
        toast.error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Transform error:', error);
      
      let message = 'Failed to transform tasks';
      let details = '';
      
      if (error.response?.data?.detail) {
        message = error.response.data.detail;
        details = `Status: ${error.response.status}`;
        
        // Log additional details for debugging
        console.error('Full error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.status === 500) {
          // For 500 errors, try to get more specific error info
          if (typeof error.response.data === 'object') {
            details = JSON.stringify(error.response.data, null, 2);
          }
        }
      } else if (error.message) {
        message = error.message;
        if (error.config) {
          details = `Request URL: ${error.config.url}\nMethod: ${error.config.method}`;
        }
      }
      
      // Show both the main error and details
      toast.error(
        <div>
          <div>{message}</div>
          {details && (
            <div className="mt-2 text-sm opacity-75 whitespace-pre-wrap">{details}</div>
          )}
        </div>,
        { duration: 5000 } // Show for 5 seconds
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!tempApiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      // Save API key to database
      await updateApiKey(tempApiKey);
      
      // Update local state
      setApiKey(tempApiKey);
      setShowApiKeyModal(false);
      setTempApiKey('');
      toast.success('API key saved successfully!');
    } catch (error) {
      console.error('Failed to save API key:', error);
      const message = error.response?.data?.detail || 'Failed to save API key';
      toast.error(message);
    }
  };

  const handleCopyResult = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      toast.success('Result copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleEmailResult = async () => {
    if (!output || originalTasks.length === 0 || processedTasks.length === 0) {
      toast.error('No results to email. Please transform some tasks first.');
      return;
    }

    setIsEmailing(true);
    try {
      await sendTaskResultEmail(originalTasks, processedTasks);
      toast.success('Task results sent to your email!');
    } catch (error) {
      console.error('Failed to send email:', error);
      const message = error.response?.data?.detail || 'Failed to send email';
      toast.error(message);
    } finally {
      setIsEmailing(false);
    }
  };
  
  // Helper function to format processed tasks into readable text
  const formatOutput = (processedTasks) => {
    return processedTasks.map(task => (
      `📝 Original: ${task.original_task}\n` +
      `✅ SMART: ${task.smart_task}\n` +
      `🏷️ Priority: ${task.priority}\n`
    )).join('\n\n');
  };

  const exampleInputs = [
    "buy groceries milk bread eggs, call mom tomorrow important, finish project report by friday urgent, dentist appointment next week, review budget monthly, clean garage weekend, book vacation flights summer, update resume job search",
    "meeting with team monday 2pm, prepare presentation slides, send quarterly report to manager, fix bug in user login, review code changes, update documentation, schedule 1:1 with direct reports, plan sprint retrospective",
    "workout 3x this week, meal prep sunday, call dentist appointment, pay credit card bill due 15th, birthday gift for sarah, oil change car, finish online course module 3, organize closet"
  ];

  return (
    <div className="min-h-screen flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900/30 py-6 sm:py-8 lg:py-10 px-3 sm:px-6 border-b border-gray-200 dark:border-gray-700 shadow-sm w-full">
        <div className="w-full max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-lg"
            >
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
              Transform Chaos into <span className="gradient-text">Clarity</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Paste your messy to-do list below and watch AI transform it into structured, actionable tasks.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="flex-grow w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col">
        {/* API Key Warning */}
        {isAuthenticated && !apiKey && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-800/50 rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-yellow-800 dark:text-yellow-200 font-semibold text-lg">
                    API Key Required
                  </p>
                </div>
              </div>
              <div className="ml-0 sm:ml-4 flex-1 mt-1 sm:mt-0">
                <p className="text-yellow-700 dark:text-yellow-300">
                  You need to provide your OpenRouter or OpenAI API key to use the transformation feature.
                </p>
              </div>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="mt-4 sm:mt-0 w-full sm:w-auto sm:ml-6 px-5 py-2 bg-yellow-100 dark:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 font-medium rounded-lg transition-colors"
              >
                Add Key
              </button>
            </div>
          </motion.div>
        )}

        {/* Main content container with equal width columns - taking full height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full max-w-screen-2xl mx-auto flex-grow">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full min-h-[500px]"
            >
              <div className="bg-gradient-to-r from-primary-500 to-purple-600 px-4 sm:px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <span className="bg-white/20 rounded-lg p-2 mr-2 sm:mr-3">
                      <Sparkles className="w-5 h-5 text-white" />
                    </span>
                    Input Your Messy Tasks
                  </h2>
                  {isAuthenticated && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowApiKeyModal(true)}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Manage API Key"
                    >
                      <Settings className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col flex-grow h-full">
                <div className="mb-4 sm:mb-6 flex-grow relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your unorganized to-do list here... For example: buy groceries, call mom tomorrow, finish project by friday..."
                    className="w-full h-full min-h-[200px] p-4 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                    style={{ resize: "none" }}
                  />
                </div>

                {/* Example Inputs */}
                <div className="mb-5">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                    <span className="w-4 h-0.5 bg-primary-500 mr-2"></span>
                    Try these examples:
                  </h3>
                  <div className="space-y-2">
                    {exampleInputs.map((example, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setInput(example)}
                        className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
                        disabled={isLoading}
                      >
                        {example.substring(0, 70)}...
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleTransform}
                  disabled={isLoading || !input.trim()}
                  className="w-full py-3 sm:py-4 flex items-center justify-center bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-600 disabled:hover:to-purple-600 disabled:hover:shadow-md disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      <span>Transforming...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      <span>Transform Tasks</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full"
            >
              <div className="bg-gradient-to-r from-green-600 to-teal-500 px-4 sm:px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <span className="bg-white/20 rounded-lg p-2 mr-2 sm:mr-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </span>
                    Organized Tasks
                  </h2>
                  {output && (
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyResult}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5" />
                        <span className="text-xs sm:text-sm hidden sm:inline">Copy</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEmailResult}
                        disabled={isEmailing}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Email results"
                      >
                        {isEmailing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Mail className="w-5 h-5" />
                        )}
                        <span className="text-xs sm:text-sm hidden sm:inline">
                          {isEmailing ? 'Sending...' : 'Email'}
                        </span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 flex-grow flex flex-col h-full">
                <div className="flex-grow bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/70 rounded-xl p-4 sm:p-6 shadow-inner border border-gray-200 dark:border-gray-700 relative flex items-stretch overflow-y-auto min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center w-full h-full"
                      >
                        <div className="text-center">
                          <div className="relative">
                            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
                              <Loader2 className="w-7 h-7 text-primary-600 dark:text-primary-400 animate-spin" />
                            </div>
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -inset-1 bg-primary-100 dark:bg-primary-800/20 rounded-full blur-md -z-10"
                            />
                          </div>
                          <p className="mt-5 sm:mt-6 text-gray-600 dark:text-gray-400 font-medium">
                            AI is organizing your tasks...
                          </p>
                          <p className="mt-2 text-gray-500 dark:text-gray-500 text-sm">
                            Transforming chaos into clarity
                          </p>
                        </div>
                      </motion.div>
                    ) : output ? (
                      <motion.div
                        key="output"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed w-full h-full p-2"
                      >
                        {output}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center w-full h-full"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-5">
                            <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ready to organize
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
                            Your organized tasks will appear here after transformation
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
        </div>
        
        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-16 mb-8 w-full max-w-screen-2xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              What Makes Our Task Transformer Special?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              SortIQ uses advanced AI to transform your chaotic tasks into an organized system
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: "Smart Categorization",
                description: "Automatically groups similar tasks into logical categories"
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Priority Detection",
                description: "Identifies urgent items and suggests a logical order of completion"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Time Estimation",
                description: "Provides rough time estimates for completing each task"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Instant Results",
                description: "Get your organized task list in seconds, not minutes"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center h-full"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <div className="text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
  {/* Testimonials removed */}
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Login Required
                </h3>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  You need to be logged in to use the AI transformation feature. 
                  Login gives you access to save and manage your transformed tasks.
                </p>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="/login"
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">Login</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"></path>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowApiKeyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-0 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-lg p-2 mr-3">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      API Key Required
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowApiKeyModal(false)}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                    You must provide your own API key from OpenRouter (recommended) or OpenAI to use the AI transformation feature. Your API key will be securely stored in your profile and won't need to be entered again.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-5 mb-6">
                    <div className="flex items-start mb-3">
                      <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                          <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-base">Get your API key:</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <a 
                        href="https://openrouter.ai" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex flex-col items-center transition-transform hover:-translate-y-1"
                      >
                        <div className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">OpenRouter</div>
                        <div className="text-xs text-blue-500 dark:text-blue-500">Recommended</div>
                      </a>
                      
                      <a 
                        href="https://platform.openai.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex flex-col items-center transition-transform hover:-translate-y-1"
                      >
                        <div className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">OpenAI</div>
                        <div className="text-xs text-blue-500 dark:text-blue-500">Alternative</div>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter your API Key
                    </label>
                    <div className="relative">
                      <input
                        id="apiKey"
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="sk-... (your API key)"
                        className="w-full py-3 px-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {apiKey && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center"
                  >
                    <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-lg mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-green-800 dark:text-green-200 font-medium">
                      API key is currently set and ready to use
                    </span>
                  </motion.div>
                )}

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowApiKeyModal(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveApiKey}
                    disabled={!tempApiKey.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  >
                    Save API Key
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transform;
