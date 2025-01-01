import React from 'react';
import { Process } from '../types/scheduler';

interface ResultsProps {
  processes: Process[];
}

export const Results: React.FC<ResultsProps> = ({ processes }) => {
  const calculateAverages = () => {
    if (processes.length === 0) {
      return {
        avgWaitingTime: 0,
        avgTurnaroundTime: 0,
        avgResponseTime: 0,
      };
    }

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

  const totalCompletionTime = processes.length
    ? Math.max(...processes.map((p) => p.completionTime || 0))
    : 0;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Results</h3>

      {/* Averages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">
            Average Waiting Time
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {averages.avgWaitingTime.toFixed(2)}ms
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">
            Average Turnaround Time
          </h4>
          <p className="text-2xl font-bold text-green-600">
            {averages.avgTurnaroundTime.toFixed(2)}ms
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-900">
            Average Response Time
          </h4>
          <p className="text-2xl font-bold text-purple-600">
            {averages.avgResponseTime.toFixed(2)}ms
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-amber-900">
            Total Completion Time
          </h4>
          <p className="text-2xl font-bold text-amber-600">
            {totalCompletionTime}ms
          </p>
        </div>
      </div>

      {/* Process Details Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Process
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turnaround Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waiting Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processes.length > 0 ? (
              processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {process.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.completionTime !== undefined
                      ? `${process.completionTime}ms`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.turnaroundTime !== undefined
                      ? `${process.turnaroundTime}ms`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.waitingTime !== undefined
                      ? `${process.waitingTime}ms`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.responseTime !== undefined
                      ? `${process.responseTime}ms`
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No processes to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
