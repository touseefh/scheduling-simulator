import React from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../store/simulationStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ComparisonView = () => {
  const results = useSimulationStore((state) => state.results);

  if (results.length === 0) {
    return null;
  }

  const chartData = {
    labels: results.map(r => r.algorithmName),
    datasets: [
      {
        label: 'Average Waiting Time',
        data: results.map(r => r.averages.waitingTime),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Average Turnaround Time',
        data: results.map(r => r.averages.turnaroundTime),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Average Response Time',
        data: results.map(r => r.averages.responseTime),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Algorithm Performance Comparison',
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md mt-8"
    >
      <h2 className="text-xl font-bold mb-4">Algorithm Comparison</h2>
      <div className="h-[400px]">
        <Bar options={options} data={chartData} />
      </div>
    </motion.div>
  );
};