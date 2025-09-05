import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Brain,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SiFastapi, SiReact, SiTailwindcss } from 'react-icons/si';
import appIcon from '../components/icon.png';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI transforms your chaotic thoughts into structured, actionable task lists.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Smart Organization',
      description: 'Automatically categorizes and prioritizes tasks based on context and importance.',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get organized in seconds, not hours. Transform messy notes into clear action items.',
      color: 'from-yellow-500 to-red-600'
    },
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'Stop wasting time organizing manually. Focus on what matters most.',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const steps = [
    {
      icon: Lightbulb,
      title: 'Input Your Ideas',
      description: 'Paste your messy to-do list, random thoughts, or project notes.',
    },
    {
      icon: Sparkles,
      title: 'AI Transformation',
      description: 'Our AI analyzes and restructures your input into clear, actionable tasks.',
    },
    {
      icon: Rocket,
      title: 'Get Organized',
      description: 'Receive a beautifully structured task list ready for action.',
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>
        <div className="relative container max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
              <Sparkles className="w-4 h-4" /> AI-powered to-do list
            </div>
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              src={appIcon}
              alt="SortIQ icon"
              className="inline-block w-16 h-16 rounded-2xl mb-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700"
            />
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Chaos into{' '}
              <span className="gradient-text">Clarity</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Turn your messy, unorganized to-do lists into structured, actionable tasks 
              using the power of AI. Get organized in seconds, not hours.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/transform" className="btn-primary group">
                Try Now for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {!isAuthenticated && (
                <Link to="/signup" className="btn-outline">
                  Create Account
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 ring-1 ring-transparent hover:ring-purple-400/40 transition">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Before: Messy Input
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300">
                    buy groceries, call mom tomorrow, finish project report by friday, 
                    dentist appointment next week, review budget, clean garage, 
                    book vacation flights...
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    After: Structured Tasks
                  </h3>
                  <div className="space-y-2">
                    {[
                      '🛒 Buy groceries',
                      '📞 Call mom tomorrow',
                      '📋 Finish project report (Due: Friday)',
                      '🦷 Schedule dentist appointment',
                      '💰 Review monthly budget'
                    ].map((task, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {task}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trusted by */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 opacity-80">
            {['Developers', 'Students', 'Makers', 'Teams'].map((t) => (
              <div key={t} className="px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                Trusted by {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="container max-w-7xl mx-auto w-full">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose SortIQ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the power of AI-driven task organization with features designed for modern productivity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card p-6 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto w-full">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your productivity in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center relative"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-6 shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 transform -translate-x-8 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built With */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="container max-w-7xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Developer-friendly</h2>
            <p className="text-gray-600 dark:text-gray-300">Built with modern tools you love</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm flex flex-col items-center">
              <SiFastapi className="text-4xl text-emerald-500" />
              <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white">FastAPI</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm flex flex-col items-center">
              <SiReact className="text-4xl text-sky-500" />
              <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white">React</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm flex flex-col items-center">
              <SiTailwindcss className="text-4xl text-cyan-500" />
              <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Tailwind CSS</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container max-w-7xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already revolutionized their task management with AI-powered organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/transform" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Get Started Free
              </Link>
              {!isAuthenticated && (
                <Link to="/signup" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Create Account
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src={appIcon} alt="SortIQ icon" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold gradient-text">SortIQ</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Transform your chaotic to-do lists into structured, actionable tasks using the power of AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/transform" className="hover:text-white transition-colors">Transform</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                {isAuthenticated && (
                  <li><Link to="/history" className="hover:text-white transition-colors">History</Link></li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SortIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
