import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Clock, BarChart2, Settings } from 'lucide-react';

export const Home = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'CPU Scheduling Algorithms',
      description: 'Simulate various CPU scheduling algorithms including FCFS, SJF, Priority, and Round Robin.',
      link: '/simulator'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Real-time Visualization',
      description: 'Watch processes execute in real-time with interactive Gantt charts.',
      link: '/simulator'
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: 'Performance Analysis',
      description: 'Compare different algorithms with detailed performance metrics.',
      link: '/comparison'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Custom Configuration',
      description: 'Configure process parameters and scheduling settings.',
      link: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CPU Scheduling Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize and understand CPU scheduling algorithms with interactive simulations
            and real-time performance analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={feature.link}
                className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-indigo-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link
            to="/simulator"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Simulation
          </Link>
        </motion.div>
      </div>
    </div>
  );
};