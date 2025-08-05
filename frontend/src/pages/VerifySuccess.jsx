import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const VerifySuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyAndLogin } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleVerification = async () => {
      if (token) {
        try {
          const result = await verifyAndLogin(token);
          setSuccess(result.success);
        } catch (error) {
          console.error('Verification failed:', error);
          setSuccess(false);
        } finally {
          setVerifying(false);
        }
      } else {
        setVerifying(false);
        setSuccess(false);
      }
    };

    handleVerification();
  }, [token, verifyAndLogin]);

  if (!verifying && success) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!verifying && !success) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center"
      >
        {verifying ? (
          <>
            <Loader className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying your email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your account...
            </p>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Verified Successfully
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your account has been verified! Redirecting you to dashboard...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-red-600 flex items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an issue verifying your account. Please try logging in again.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifySuccess;