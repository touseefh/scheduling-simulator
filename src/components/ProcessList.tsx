import React, { useState } from 'react';
import { Process } from '../types/scheduler';
import { Trash2, Pencil } from 'lucide-react';
import { ProcessEditor } from './ProcessEditor';

interface ProcessListProps {
  processes: Process[];
  onRemoveProcess: (id: string) => void;
  onUpdateProcess: (updatedProcess: Process) => void;
  showPriority?: boolean;
}

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  onRemoveProcess,
  onUpdateProcess,
  showPriority = false,
}) => {
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  const handleEdit = (process: Process) => {
    setEditingProcess(process);
  };

  const handleSave = (updatedProcess: Process) => {
    onUpdateProcess(updatedProcess);
    setEditingProcess(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Process
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Arrival Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Burst Time
            </th>
            {showPriority && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processes.map((process) => (
            <tr
              key={process.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {process.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {process.arrivalTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {process.burstTime}
              </td>
              {showPriority && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.priority}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(process)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onRemoveProcess(process.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProcess && (
        <ProcessEditor
          process={editingProcess}
          onSave={handleSave}
          onCancel={() => setEditingProcess(null)}
          showPriority={showPriority}
        />
      )}
    </div>
  );
};