import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Process } from '../types/scheduler';

interface AnimatedResultsProps {
  processes: Process[];
}

export const AnimatedResults: React.FC<AnimatedResultsProps> = ({ processes }) => {
  const calculateAverages = () => {
    const sum = processes.reduce(
      (acc, process) => ({
        waitingTime: acc.waitingTime + (process.waitingTime || 0),
        turnaroundTime: acc.turnaroundTime + (process.turnaroundTime || 0),
        responseTime: acc.responseTime + (process.responseTime || 0),
      }),
      { waitingTime: 0, turnaroundTime: 0, responseTime: 0 }
    );

    return {
      avgWaitingTime: sum.waitingTime / processes.length,
      avgTurnaroundTime: sum.turnaroundTime / processes.length,
      avgResponseTime: sum.responseTime / processes.length,
    };
  };

  const averages = calculateAverages();

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg"
          >
            <h4 className="text-sm font-medium text-blue-900">Average Waiting Time</h4>
            <motion.p 
              className="text-2xl font-bold text-blue-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {averages.avgWaitingTime.toFixed(2)}ms
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg"
          >
            <h4 className="text-sm font-medium text-green-900">Average Turnaround Time</h4>
            <motion.p 
              className="text-2xl font-bold text-green-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {averages.avgTurnaroundTime.toFixed(2)}ms
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg"
          >
            <h4 className="text-sm font-medium text-purple-900">Average Response Time</h4>
            <motion.p 
              className="text-2xl font-bold text-purple-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {averages.avgResponseTime.toFixed(2)}ms
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 overflow-x-auto"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {processes.map((process, index) => (
                <motion.tr 
                  key={process.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {process.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.completionTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.turnaroundTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.waitingTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.responseTime}ms
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};