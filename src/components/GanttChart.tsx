import React from 'react';
import { GanttChartItem } from '../types/scheduler';
import { motion } from 'framer-motion';

interface GanttChartProps {
  data: GanttChartItem[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ data }) => {
  // Sort the processes by start time to ensure they are rendered in the correct order
  const sortedData = [...data].sort((a, b) => a.startTime - b.startTime);

  const totalDuration = sortedData[sortedData.length - 1]?.endTime || 0;

  const colors = {
    'idle': 'bg-gray-100 hover:bg-gray-200',
    'process': [
      'bg-rose-100 hover:bg-rose-200 border-rose-300',
      'bg-emerald-100 hover:bg-emerald-200 border-emerald-300',
      'bg-violet-100 hover:bg-violet-200 border-violet-300',
      'bg-amber-100 hover:bg-amber-200 border-amber-300',
      'bg-cyan-100 hover:bg-cyan-200 border-cyan-300',
    ]
  };

  const getProcessColor = (processId: string, index: number) => {
    return processId === 'idle' ? colors.idle : colors.process[index % colors.process.length];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Process Timeline (Gantt Chart)</h3>
      <div className="relative min-h-[160px]">
        <div className="flex absolute top-0 left-0 right-0 h-20">
          {sortedData.map((item, index) => (
            <motion.div
              key={`${item.processId}-${item.startTime}`}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative border flex flex-col items-center justify-center ${getProcessColor(item.processId, index)} transition-all duration-300 ease-in-out group`}
              style={{ width: `${((item.endTime - item.startTime) / totalDuration) * 100}%` }}
            >
              <span className="text-sm font-medium">{item.processName}</span>
              <span className="text-xs text-gray-600">
                {item.endTime - item.startTime}ms
              </span>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute invisible group-hover:visible bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 left-1/2 transform -translate-x-1/2"
              >
                <p>Process: {item.processName}</p>
                <p>Start: {item.startTime}ms</p>
                <p>End: {item.endTime}ms</p>
                <p>Duration: {item.endTime - item.startTime}ms</p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-gray-300">
          <div className="flex">
            {sortedData.map((item, index) => (
              <motion.div
                key={`timeline-${item.processId}-${item.startTime}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center justify-start"
                style={{
                  width: `${((item.endTime - item.startTime) / totalDuration) * 100}%`,
                }}
              >
                <div className="absolute -top-1 left-0 w-px h-2 bg-gray-300"></div>
                <span className="absolute top-2 left-0 text-xs text-gray-600 transform -translate-x-1/2">
                  {item.startTime}
                </span>
                {index === sortedData.length - 1 && (
                  <>
                    <div className="absolute -top-1 right-0 w-px h-2 bg-gray-300"></div>
                    <span className="absolute top-2 right-0 text-xs text-gray-600 transform translate-x-1/2">
                      {item.endTime}
                    </span>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
