import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Target, Clock, Shield, Brain } from 'lucide-react';

const Features = () => {
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
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your data is encrypted and securely stored. We use JWT-based authentication.',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Sparkles,
      title: 'Beautiful Results',
      description: 'Tasks are presented with intuitive formatting, emojis, and clear organization.',
      color: 'from-teal-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full mb-8 shadow-lg"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              SortIQ combines powerful AI with an intuitive interface to transform your productivity.
              Discover what makes our platform unique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
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
              <a href="/transform" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Try It Now
              </a>
              <a href="/signup" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                Create Account
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;