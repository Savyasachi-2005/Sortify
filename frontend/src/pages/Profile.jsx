import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, MapPin, Link as LinkIcon, 
  Briefcase, Edit, Image, Shield, AlertCircle, Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Additional user info (you can fetch this from backend or set defaults)
  const [userProfile, setUserProfile] = useState({
    bio: 'No bio provided',
    location: 'Not specified',
    website: '',
    company: '',
    joinDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/users/me');
        setUser(response.data);

        // In a real application, you might want to fetch additional profile data
        // const profileResponse = await axios.get('/api/users/profile');
        // setUserProfile(profileResponse.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        toast.error('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-2 sm:px-4 lg:px-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex-1 flex flex-col"
      >
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8 w-full">
          {/* Cover Photo */}
          <div className="h-40 bg-gradient-to-r from-primary-500 to-purple-600 relative">
            {/* Edit Button - Top Right */}
            <button 
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Edit profile"
              onClick={() => toast.success('Edit profile feature coming soon!')}
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
          
          {/* Profile Content */}
          <div className="px-4 sm:px-8 pb-8 -mt-16 relative z-10 flex flex-col items-center">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-4xl font-bold text-primary-600 dark:text-primary-300">
                {getInitials(user?.full_name || user?.username)}
              </div>
            </div>
            
            {/* Name and Username */}
            <div className="text-center mt-4 break-words w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words max-w-full">
                {user?.full_name || 'No Name Provided'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg break-words max-w-full">
                @{user?.username || 'username'}
              </p>
              
              {/* User Status */}
              <div className="flex items-center justify-center mt-2">
                <Shield className={`w-4 h-4 ${user?.is_active ? 'text-green-500' : 'text-yellow-500'} mr-1`} />
                <span className={`text-sm ${user?.is_active ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {user?.is_active ? 'Verified Account' : 'Account Pending Verification'}
                </span>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="mt-6 text-center max-w-2xl mx-auto w-full overflow-x-auto">
              <p className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
                {userProfile.bio || 'No bio provided.'}
              </p>
            </div>
            
            {/* User Details Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
              {/* Email */}
              <div className="flex items-start space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                  <p className="text-gray-900 dark:text-white font-medium break-all">
                    {user?.email || 'No email provided'}
                  </p>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-start space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                  <p className="text-gray-900 dark:text-white font-medium truncate">
                    {userProfile.location || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {/* Website */}
              <div className="flex items-start space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h3>
                  <p className="text-gray-900 dark:text-white font-medium truncate">
                    {userProfile.website ? (
                      <a 
                        href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {userProfile.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
              </div>
              
              {/* Company */}
              <div className="flex items-start space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h3>
                  <p className="text-gray-900 dark:text-white font-medium truncate">
                    {userProfile.company || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {/* Join Date */}
              <div className="flex items-start space-x-3 md:col-span-2 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userProfile.joinDate}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full">
              <button 
                className="btn-primary flex items-center justify-center"
                onClick={() => toast.success('Edit profile feature coming soon!')}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
              
              <button 
                className="btn-outline flex items-center justify-center"
                onClick={() => toast.success('Change avatar feature coming soon!')}
              >
                <Image className="w-5 h-5 mr-2" />
                Change Avatar
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Section (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full overflow-x-auto"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>No recent activity to display.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;