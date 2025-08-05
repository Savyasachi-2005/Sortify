import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  Zap, 
  Brain, 
  Shield, 
  Code, 
  Database,
  Sparkles,
  Globe,
  Users,
  Award
} from 'lucide-react';

const About = () => {
  const techStack = [
    {
      category: 'Frontend',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'React Router'],
      icon: Code,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      category: 'Backend',
      technologies: ['FastAPI', 'Python', 'JWT Authentication'],
      icon: Zap,
      color: 'from-green-500 to-emerald-600'
    },
    {
      category: 'Database',
      technologies: ['PostgreSQL', 'SQLAlchemy'],
      icon: Database,
      color: 'from-purple-500 to-violet-600'
    },
    {
      category: 'AI Integration',
      technologies: ['OpenRouter API', 'OpenAI API', 'Custom Prompts'],
      icon: Brain,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Organization',
      description: 'Advanced language models analyze your chaotic input and transform it into structured, actionable tasks with proper categorization and prioritization.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and securely stored. We use JWT-based authentication to ensure your tasks remain private and accessible only to you.'
    },
    {
      icon: Globe,
      title: 'Cross-Platform',
      description: 'Access your organized tasks from any device. Our responsive design ensures a seamless experience on desktop, tablet, and mobile.'
    },
    {
      icon: Users,
      title: 'User-Centric Design',
      description: 'Built with user experience in mind, featuring smooth animations, intuitive navigation, and accessibility considerations.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Tasks Organized', icon: Sparkles },
    { number: '1,500+', label: 'Active Users', icon: Users },
    { number: '99.9%', label: 'Uptime', icon: Award },
    { number: '< 2s', label: 'Avg Response Time', icon: Zap }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Info className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About SortIQ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            SortIQ is a cutting-edge productivity web application that harnesses the power of artificial intelligence 
            to transform your chaotic, unorganized to-do lists into structured, actionable task lists.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                We believe that everyone deserves to be organized and productive without spending hours 
                manually structuring their thoughts. SortIQ eliminates the friction between having ideas 
                and acting on them by instantly transforming messy input into clear, actionable tasks.
              </p>
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      "Transform chaos into clarity, instantly."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card p-6 group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stack.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stack.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {stack.category}
                </h3>
                <div className="space-y-1">
                  {stack.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              SortIQ by the Numbers
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-primary-100 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How AI Works */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              How Our AI Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              SortIQ uses advanced language models to understand context, extract actionable items, 
              and organize them with appropriate priorities and categories.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Input Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your messy input to identify individual tasks, deadlines, 
                priorities, and context clues.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Smart Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tasks are categorized, prioritized, and formatted with appropriate emojis 
                and clear action items.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Structured Output
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive a beautifully organized task list that's ready for action, 
                with clear priorities and deadlines.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Organized?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven task organization and transform 
              your productivity today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/transform" className="btn-primary">
                Try SortIQ Now
              </a>
              <a href="/signup" className="btn-outline">
                Create Free Account
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
