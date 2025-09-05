import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings2, LockKeyhole, Workflow } from 'lucide-react';
import { SiFastapi, SiPython, SiRedis, SiCelery } from 'react-icons/si';
import { RiRobot2Line } from 'react-icons/ri';
import { LuTarget, LuBrain, LuSend, LuLayoutDashboard } from 'react-icons/lu';
import appIcon from '../components/icon.png';

const About = () => {
  return (
    <div className="min-h-screen py-10 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 space-y-16">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
              <Sparkles className="w-4 h-4" /> AI-powered to-do list
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Not just another To-Do List. Meet <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SortIQ</span>.
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Most devs start with a to-do list. I overthought mine and gave it an AI brain.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
      <div className="relative h-56 sm:h-64 md:h-72 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950/30 flex items-center justify-center shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.15),transparent_40%)] rounded-2xl" />
              <div className="relative text-center">
        <img src={appIcon} alt="SortIQ icon" className="w-20 h-20 mx-auto rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">SortIQ brand</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Project Story */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">Why I built SortIQ</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              I’m a student developer who did what devs do best—overthink. A simple to-do list became a playground for ideas: SMART goals, prioritization, reminders, email summaries, and a personal dashboard. SortIQ is my take on making productivity less boring and more intelligent.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="h-56 sm:h-64 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
              <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="sr-only">Project story illustration placeholder</span>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white text-center">What SortIQ does for you</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: LuTarget, title: 'SMART Goal Transformation', desc: 'Turns vague tasks into clear, achievable goals.' },
              { icon: LuBrain, title: 'AI Prioritization', desc: 'Automatically sorts tasks into High, Medium, or Low priority.' },
              { icon: LuSend, title: 'Email/Download', desc: 'Get your sorted list emailed or downloaded instantly.' },
              { icon: LuLayoutDashboard, title: 'Personal Dashboard', desc: 'Track task history, progress, and manage saved tasks.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white text-center">Tech Stack</h2>
          <div className="mt-8 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <SiFastapi className="text-5xl text-teal-500" />
                <div className="mt-3 font-medium text-gray-900 dark:text-white">FastAPI</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <SiPython className="text-5xl text-yellow-500" />
                <div className="mt-3 font-medium text-gray-900 dark:text-white">Python</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <SiRedis className="text-5xl text-red-500" />
                <div className="mt-3 font-medium text-gray-900 dark:text-white">Redis</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <SiCelery className="text-5xl text-green-500" />
                <div className="mt-3 font-medium text-gray-900 dark:text-white">Celery</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <RiRobot2Line className="text-5xl text-indigo-500" />
                <div className="mt-3 font-medium text-gray-900 dark:text-white">Z.AI GLM 4.5 Air</div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Plans */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white text-center">Future Plans</h2>
          <div className="mt-8 w-full">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Workflow, title: 'Background tasks', desc: 'Process heavy AI jobs and emails via queue workers.' },
                { icon: LockKeyhole, title: 'Password reset', desc: 'Secure reset flows with email and 2FA options.' },
                { icon: Settings2, title: 'More AI features', desc: 'Better parsing, summaries, and smarter prioritization.' },
              ].map((p) => (
                <div key={p.title} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-3">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">{p.title}</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-10 text-white text-center shadow-md">
            <h3 className="text-2xl font-bold">Want to explore SortIQ? Check out the code.</h3>
            <p className="mt-2 text-blue-100">Dive into the repo and see how the AI-powered productivity engine works under the hood.</p>
            <div className="mt-6">
              <a
                href="https://lnkd.in/gVqzG4Ms"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 hover:bg-blue-50 shadow"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
