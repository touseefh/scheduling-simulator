import React from 'react';
import { Process } from '../types/scheduler';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonProps {
  algorithms: {
    name: string;
    processes: Process[];
  }[];
}

export const AlgorithmComparison: React.FC<ComparisonProps> = ({ algorithms }) => {
  const getAverages = (processes: Process[]) => {
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

  const chartData = {
    labels: algorithms.map(a => a.name),
    datasets: [
      {
        label: 'Average Waiting Time',
        data: algorithms.map(a => getAverages(a.processes).avgWaitingTime),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Average Turnaround Time',
        data: algorithms.map(a => getAverages(a.processes).avgTurnaroundTime),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Average Response Time',
        data: algorithms.map(a => getAverages(a.processes).avgResponseTime),
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Algorithm Comparison</h3>
      <div className="h-[400px]">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};