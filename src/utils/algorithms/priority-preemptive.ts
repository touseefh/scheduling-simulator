import { Process, GanttChartItem } from '../../types/scheduler';

export const calculatePriorityPreemptive = (processes: Process[]): {
  processes: Process[];
  ganttChart: GanttChartItem[];
} => {
  // Prepare the processes with additional properties for tracking
  const processQueue = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    firstResponse: -1,
    completed: false
  }));

  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  let completedProcesses = 0;

  while (completedProcesses < processes.length) {
    let selectedProcess = null;
    let highestPriority = Number.MAX_VALUE;

    // Find the process with the highest priority that can be executed
    for (const process of processQueue) {
      if (
        !process.completed &&
        process.arrivalTime <= currentTime &&
        (process.priority || Number.MAX_VALUE) < highestPriority
      ) {
        selectedProcess = process;
        highestPriority = process.priority || Number.MAX_VALUE;
      }
    }

    if (selectedProcess === null) {
      // No process is available; advance time to the next arrival
      const nextArrival = Math.min(
        ...processQueue
          .filter(p => !p.completed)
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

    // Record first response time for the selected process
    if (selectedProcess.firstResponse === -1) {
      selectedProcess.firstResponse = currentTime;
      selectedProcess.responseTime = currentTime - selectedProcess.arrivalTime;
    }

    // Determine the duration of execution
    const nextEventTime = Math.min(
      ...processQueue
        .filter(p => !p.completed && p.arrivalTime > currentTime)
        .map(p => p.arrivalTime)
        .concat([currentTime + selectedProcess.remainingTime])
    );

    const executedTime = nextEventTime - currentTime;

    // Update the Gantt chart
    ganttChart.push({
      processId: selectedProcess.id,
      processName: selectedProcess.name,
      startTime: currentTime,
      endTime: nextEventTime
    });

    // Update the process's remaining time and current time
    selectedProcess.remainingTime -= executedTime;
    currentTime = nextEventTime;

    // Mark process as completed if remaining time is zero
    if (selectedProcess.remainingTime === 0) {
      selectedProcess.completed = true;
      selectedProcess.completionTime = currentTime;
      selectedProcess.turnaroundTime = selectedProcess.completionTime - selectedProcess.arrivalTime;
      selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime;
      completedProcesses++;
    }
  }

  return {
    processes: processQueue.map(({ remainingTime, firstResponse, completed, ...process }) => process),
    ganttChart
  };
};
