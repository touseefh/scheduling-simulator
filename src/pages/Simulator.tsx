import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProcessForm } from '../components/ProcessForm';
import { ProcessList } from '../components/ProcessList';
import { AnimatedGanttChart } from '../components/AnimatedGanttChart';
import { AnimatedResults } from '../components/AnimatedResults';
import { PrioritySelector } from '../components/PrioritySelector';
import { ComparisonView } from '../components/ComparisonView';
import { Process, AlgorithmType } from '../types/scheduler';
import { useSimulationStore } from '../store/simulationStore';
import {
  calculateFCFS,
  calculateSJFNonPreemptive,
  calculateSJFPreemptive,
  calculatePriorityNonPreemptive,
  calculatePriorityPreemptive,
  calculateRoundRobin
} from '../utils/schedulingAlgorithms';

export const Simulator = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('fcfs');
  const [simulationResult, setSimulationResult] = useState<{
    processes: Process[];
    ganttChart: any[];
  } | null>(null);
  const [timeQuantum, setTimeQuantum] = useState(4);
  const [usePriority, setUsePriority] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const addResult = useSimulationStore((state) => state.addResult);
  const clearResults = useSimulationStore((state) => state.clearResults);

  const handleAddProcess = (process: Process) => {
    setProcesses([...processes, process]);
  };

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const handleUpdateProcess = (updatedProcess: Process) => {
    setProcesses(processes.map(p => p.id === updatedProcess.id ? updatedProcess : p));
  };

  const calculateAverages = (processes: Process[]) => {
    const sum = processes.reduce(
      (acc, process) => ({
        waitingTime: acc.waitingTime + (process.waitingTime || 0),
        turnaroundTime: acc.turnaroundTime + (process.turnaroundTime || 0),
        responseTime: acc.responseTime + (process.responseTime || 0),
      }),
      { waitingTime: 0, turnaroundTime: 0, responseTime: 0 }
    );

    return {
      waitingTime: sum.waitingTime / processes.length,
      turnaroundTime: sum.turnaroundTime / processes.length,
      responseTime: sum.responseTime / processes.length,
    };
  };

  const handleSimulate = async () => {
    if (processes.length === 0 || isSimulating) return;

    setIsSimulating(true);
    setSimulationResult(null);

    let result;
    const algorithmName = selectedAlgorithm.toUpperCase();

    // Simulate delay for visualization
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (selectedAlgorithm) {
      case 'fcfs':
        result = calculateFCFS(processes);
        break;
      case 'sjf-nonpreemptive':
        result = calculateSJFNonPreemptive(processes);
        break;
      case 'sjf-preemptive':
        result = calculateSJFPreemptive(processes);
        break;
      case 'priority-nonpreemptive':
        result = calculatePriorityNonPreemptive(processes);
        break;
      case 'priority-preemptive':
        result = calculatePriorityPreemptive(processes);
        break;
      case 'rr':
        result = calculateRoundRobin(processes, timeQuantum);
        break;
      default:
        result = calculateFCFS(processes);
    }

    // Store result for comparison
    addResult({
      algorithmName,
      processes: result.processes,
      ganttChart: result.ganttChart,
      averages: calculateAverages(result.processes)
    });

    setSimulationResult(result);
    setIsSimulating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Algorithm Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Algorithm Selection</h2>
          <div className="space-y-4">
            <select
              value={selectedAlgorithm}
              onChange={(e) => {
                setSelectedAlgorithm(e.target.value as AlgorithmType);
                setSimulationResult(null);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="fcfs">First Come First Serve (FCFS)</option>
              <option value="sjf-nonpreemptive">Shortest Job First (Non-preemptive)</option>
              <option value="sjf-preemptive">Shortest Job First (Preemptive)</option>
              <option value="priority-nonpreemptive">Priority (Non-preemptive)</option>
              <option value="priority-preemptive">Priority (Preemptive)</option>
              <option value="rr">Round Robin (RR)</option>
            </select>

            {selectedAlgorithm === 'rr' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Time Quantum
                </label>
                <input
                  type="number"
                  min="1"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}

            <button
              onClick={clearResults}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear Comparison Data
            </button>
          </div>
        </div>

        <PrioritySelector onPriorityEnabled={setUsePriority} />
        <ProcessForm onAddProcess={handleAddProcess} showPriority={usePriority} />

        {processes.length > 0 && (
          <>
            <ProcessList
              processes={processes}
              onRemoveProcess={handleRemoveProcess}
              onUpdateProcess={handleUpdateProcess}
              showPriority={usePriority}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSimulate}
              disabled={isSimulating}
              className={`w-full px-6 py-3 rounded-md shadow-md transition-colors ${
                isSimulating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isSimulating ? 'Simulating...' : 'Simulate'}
            </motion.button>
          </>
        )}

        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <AnimatedGanttChart data={simulationResult.ganttChart} />
            <AnimatedResults processes={simulationResult.processes} />
          </motion.div>
        )}

        <ComparisonView />
      </motion.div>
    </div>
  );
};