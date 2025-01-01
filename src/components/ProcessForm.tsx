import React, { useState } from 'react';
import { Process } from '../types/scheduler';
import { PlusCircle } from 'lucide-react';

interface ProcessFormProps {
  onAddProcess: (process: Process) => void;
  showPriority: boolean;
}

export const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess, showPriority }) => {
  const [process, setProcess] = useState({
    name: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcess({
      ...process,
      id: crypto.randomUUID(),
      remainingTime: process.burstTime,
    });
    setProcess({
      name: '',
      arrivalTime: 0,
      burstTime: 1,
      priority: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Process Name</label>
          <input
            type="text"
            required
            value={process.name}
            onChange={(e) => setProcess({ ...process, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
          <input
            type="number"
            min="0"
            value={process.arrivalTime}
            onChange={(e) => setProcess({ ...process, arrivalTime: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Burst Time</label>
          <input
            type="number"
            min="1"
            value={process.burstTime}
            onChange={(e) => setProcess({ ...process, burstTime: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {showPriority && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <input
              type="number"
              min="1"
              value={process.priority}
              onChange={(e) => setProcess({ ...process, priority: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Process
      </button>
    </form>
  );
};