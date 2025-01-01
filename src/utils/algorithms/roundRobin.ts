import { Process, GanttChartItem } from '../../types/scheduler';

export const calculateRoundRobin = (
  processes: Process[],
  timeQuantum: number
): {
  processes: Process[];
  ganttChart: GanttChartItem[];
} => {
  const processQueue = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    firstResponse: -1 // To track the first time the process starts execution
  }));

  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0; // Keeps track of the current time in the system
  let completedProcesses = 0; // Counts how many processes are completed
  const readyQueue: typeof processQueue = []; // Queue to hold processes ready for execution

  while (completedProcesses < processes.length) {
    // Enqueue new arrivals at the current time
    processQueue.forEach(p => {
      if (p.arrivalTime <= currentTime && !readyQueue.includes(p) && p.remainingTime > 0) {
        readyQueue.push(p);
      }
    });

    // If no process is ready, CPU remains idle
    if (readyQueue.length === 0) {
      const nextArrival = Math.min(
        ...processQueue
          .filter(p => p.remainingTime > 0)
          .map(p => p.arrivalTime)
      );

      ganttChart.push({
        processId: 'idle',
        processName: 'Idle',
        startTime: currentTime,
        endTime: nextArrival
      });

      currentTime = nextArrival;
      continue;
    }

    // Process execution
    const currentProcess = readyQueue.shift()!;

    // Record response time if this is the first execution
    if (currentProcess.firstResponse === -1) {
      currentProcess.firstResponse = currentTime;
      currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    }

    // Execute the process for the time quantum or until completion
    const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);
    ganttChart.push({
      processId: currentProcess.id,
      processName: currentProcess.name,
      startTime: currentTime,
      endTime: currentTime + executeTime
    });

    currentProcess.remainingTime -= executeTime;
    currentTime += executeTime;

    // Check if the process is completed
    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime =
        currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime =
        currentProcess.turnaroundTime - currentProcess.burstTime;
      completedProcesses++;
    } else {
      // If not completed, add it back to the ready queue
      readyQueue.push(currentProcess);
    }
  }

  // Return the processes with calculated metrics and the Gantt chart
  return {
    processes: processQueue.map(({ remainingTime, firstResponse, ...process }) => process),
    ganttChart
  };
};
