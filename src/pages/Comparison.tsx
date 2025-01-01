import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Process } from '../types/scheduler';
import { calculateFCFS, calculateSJFNonPreemptive, calculateRoundRobin } from '../utils/schedulingAlgorithms';
import { AlgorithmComparison } from '../components/AlgorithmComparison';
import { ProcessForm } from '../components/ProcessForm';
import { ProcessList } from '../components/ProcessList';

export const Comparison = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);

  const handleAddProcess = (process: Process) => {
    setProcesses([...processes, process]);
  };

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const handleUpdateProcess = (updatedProcess: Process) => {
    setProcesses(processes.map(p => p.id === updatedProcess.id ? updatedProcess : p));
  };

  const handleCompare = () => {
    if (processes.length === 0) return;

    const fcfsResult = calculateFCFS(processes);
    const sjfResult = calculateSJFNonPreemptive(processes);
    const rrResult = calculateRoundRobin(processes, 4);

    setComparisonResults([
      { name: 'FCFS', processes: fcfsResult.processes },
      { name: 'SJF', processes: sjfResult.processes },
      { name: 'Round Robin', processes: rrResult.processes },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <ProcessForm onAddProcess={handleAddProcess} showPriority={false} />

        {processes.length > 0 && (
          <>
            <ProcessList
              processes={processes}
              onRemoveProcess={handleRemoveProcess}
              onUpdateProcess={handleUpdateProcess}
              showPriority={false}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompare}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 transition-colors"
            >
              Compare Algorithms
            </motion.button>
          </>
        )}

        {comparisonResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlgorithmComparison algorithms={comparisonResults} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};