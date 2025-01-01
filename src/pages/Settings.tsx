import React from 'react';
import { motion } from 'framer-motion';

export const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-gray-600">Configure simulation parameters and preferences.</p>
        
        {/* Add settings options here */}
      </motion.div>
    </div>
  );
};