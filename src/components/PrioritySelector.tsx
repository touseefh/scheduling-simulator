import React from 'react';
import { motion } from 'framer-motion';

interface PrioritySelectorProps {
  onPriorityEnabled: (enabled: boolean) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ onPriorityEnabled }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-4">Priority Configuration</h3>
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="priority"
            onChange={() => onPriorityEnabled(true)}
            className="form-radio h-4 w-4 text-indigo-600"
          />
          <span className="ml-2">Use Priority</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="priority"
            onChange={() => onPriorityEnabled(false)}
            defaultChecked
            className="form-radio h-4 w-4 text-indigo-600"
          />
          <span className="ml-2">No Priority</span>
        </label>
      </div>
    </motion.div>
  );
};