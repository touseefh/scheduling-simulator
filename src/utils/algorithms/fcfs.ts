import { Process, GanttChartItem } from '../../types/scheduler';

export const calculateFCFS = (processes: Process[]): {
  processes: Process[];
  ganttChart: GanttChartItem[];
} => {
  // Sort processes by arrival time to maintain FCFS order
  const sortedProcesses = [...processes]
    .sort((a, b) => a.arrivalTime - b.arrivalTime)
    .map(p => ({ ...p })); // Create a copy to avoid mutating the input

  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;

  sortedProcesses.forEach(process => {
    // Handle idle time if there's a gap before the next process
    if (currentTime < process.arrivalTime) {
      ganttChart.push({
        processId: 'idle',
        processName: 'Idle',
        startTime: currentTime,
        endTime: process.arrivalTime
      });
      currentTime = process.arrivalTime;
    }

    // Start the process execution
    const startTime = currentTime;
    currentTime += process.burstTime;

    // Add the process to the Gantt chart
    ganttChart.push({
      processId: process.id,
      processName: process.name,
      startTime,
      endTime: currentTime
    });

    // Calculate metrics for the process
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    process.responseTime = startTime - process.arrivalTime;
  });

  return { processes: sortedProcesses, ganttChart };
};
