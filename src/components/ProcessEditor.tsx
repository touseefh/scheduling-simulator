import React, { useState } from 'react';
import { Process } from '../types/scheduler';
import { X } from 'lucide-react';

interface ProcessEditorProps {
  process: Process;
  onSave: (updatedProcess: Process) => void;
  onCancel: () => void;
  showPriority?: boolean;
}

export const ProcessEditor: React.FC<ProcessEditorProps> = ({
  process,
  onSave,
  onCancel,
  showPriority = false,
}) => {
  const [editedProcess, setEditedProcess] = useState<Process>({ ...process });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProcess);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Process</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Process Name
            </label>
            <input
              type="text"
              value={editedProcess.name}
              onChange={(e) =>
                setEditedProcess({ ...editedProcess, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Arrival Time
            </label>
            <input
              type="number"
              min="0"
              value={editedProcess.arrivalTime}
              onChange={(e) =>
                setEditedProcess({
                  ...editedProcess,
                  arrivalTime: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Burst Time
            </label>
            <input
              type="number"
              min="1"
              value={editedProcess.burstTime}
              onChange={(e) =>
                setEditedProcess({
                  ...editedProcess,
                  burstTime: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {showPriority && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <input
                type="number"
                min="1"
                value={editedProcess.priority}
                onChange={(e) =>
                  setEditedProcess({
                    ...editedProcess,
                    priority: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};