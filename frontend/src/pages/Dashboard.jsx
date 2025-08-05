import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-2 sm:px-4 lg:px-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex-1 flex flex-col"
      >
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 w-full">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 truncate">
                Welcome back, <span className="break-all">{user?.username}</span>!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You have successfully logged into SortIQ. Here's your account information:
              </p>
            </div>

            {/* User Info Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 min-w-0"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">Username</h3>
                    <p className="text-gray-600 dark:text-gray-400 break-all">{user?.username}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 min-w-0"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400 break-all">{user?.email}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 min-w-0"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">Account Status</h3>
                    <p className={`${user?.is_active ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {user?.is_active ? 'Active' : 'Pending Verification'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Features Section */}
            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Available Features
              </h3>
              <div className="grid md:grid-cols-2 gap-6 w-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 min-w-0">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Algorithm Visualization
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Visualize and understand various sorting algorithms with interactive demonstrations.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 min-w-0">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Performance Analysis
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Compare algorithm performance and analyze time complexity with detailed charts.
                  </p>
                </div>
              </div>
            </div>

            {!user?.is_active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 w-full"
              >
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Email Verification Pending
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        Please check your email and click the verification link to activate your account.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;