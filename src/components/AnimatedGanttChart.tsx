import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GanttChartItem } from '../types/scheduler';

interface AnimatedGanttChartProps {
  data: GanttChartItem[];
}

export const AnimatedGanttChart: React.FC<AnimatedGanttChartProps> = ({ data }) => {
  const totalDuration = data[data.length - 1]?.endTime || 0;

  const colors = {
    idle: 'bg-gray-100',
    process: [
      'bg-rose-100 border-rose-300',
      'bg-emerald-100 border-emerald-300',
      'bg-violet-100 border-violet-300',
      'bg-amber-100 border-amber-300',
      'bg-cyan-100 border-cyan-300',
    ],
  };

  const getProcessColor = (processId: string, index: number) => {
    return processId === 'idle' ? colors.idle : colors.process[index % colors.process.length];
  };

  // To track the completion of each process
  const [activeProcessIndex, setActiveProcessIndex] = useState(0);
  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    // Logic to activate the next process after the previous one completes
    const interval = setInterval(() => {
      if (activeProcessIndex < data.length - 1) {
        setActiveProcessIndex(activeProcessIndex + 1);
      }
    }, 1000); // Check every second (adjust as necessary for your case)
    return () => clearInterval(interval);
  }, [activeProcessIndex]);

  // Function to calculate the delay for the animation based on previous process end time
  const calculateDelay = (index: number) => {
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += data[i].endTime - data[i].startTime; // Add up previous durations
    }
    return delay / 1000; // Convert to seconds for framer-motion delay
  };

  // Function to calculate the position for each process, ensuring no overlap
  const calculatePosition = (index: number) => {
    let position = 0;
    for (let i = 0; i < index; i++) {
      position += data[i].endTime - data[i].startTime;
    }
    return (position / totalDuration ); // Convert to percentage
  };

  return (
    <div className="w-full overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Process Timeline (Gantt Chart)</h3>
      <div className="relative min-h-[160px]">
        <AnimatePresence>
          <div className="flex absolute top-0 left-0 right-0 h-20">
            {data.map((item, index) => {
              // If the process is not yet activated, don't show it
              if (index > activeProcessIndex) return null;

              // Calculate the left position of each process based on the cumulative time of previous processes
              const leftPosition = calculatePosition(index);

              return (
                <motion.div
                  key={`${item.processId}-${item.startTime}`}
                  initial={{ x: '-100%' }} // Start off-screen to the left
                  animate={{
                    x: 0, // Move to position based on timeline
                    transition: {
                      duration: item.endTime - item.startTime,
                      ease: 'easeInOut',
                      delay: calculateDelay(index), // Delay the animation based on previous process
                    },
                  }}
                  exit={{ x: '100%' }} // Exit off-screen to the right
                  className={`relative border flex flex-col items-center justify-center ${getProcessColor(item.processId, index)}`}
                  style={{
                    width: `${((item.endTime - item.startTime) / totalDuration) * 100}%`,
                    left: `${leftPosition}%`, // Set the left position to ensure no overlap
                    originX: 0,
                  }}
                >
                  <span className="text-sm font-medium">{item.processName}</span>
                  <span className="text-xs text-gray-600">
                    {item.endTime - item.startTime}ms
                  </span>

                  <motion.div
                    className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <p>Process: {item.processName}</p>
                    <p>Start: {item.startTime}ms</p>
                    <p>End: {item.endTime}ms</p>
                    <p>Duration: {item.endTime - item.startTime}ms</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Timeline to visualize the overall progress */}
        <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-gray-300">
          <AnimatePresence>
            {data.map((item, index) => (
              <motion.div
                key={`timeline-${item.processId}-${item.startTime}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative inline-flex items-center justify-start"
                style={{
                  width: `${((item.endTime - item.startTime) / totalDuration) * 100}%`,
                }}
              >
                <div className="absolute -top-1 left-0 w-px h-2 bg-gray-300"></div>
                <motion.span
                  className="absolute top-2 left-0 text-xs text-gray-600 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {item.startTime}
                </motion.span>
                {index === data.length - 1 && (
                  <>
                    <div className="absolute -top-1 right-0 w-px h-2 bg-gray-300"></div>
                    <motion.span
                      className="absolute top-2 right-0 text-xs text-gray-600 transform translate-x-1/2"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {item.endTime}
                    </motion.span>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
