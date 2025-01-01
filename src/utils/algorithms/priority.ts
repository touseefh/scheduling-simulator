import { Process, GanttChartItem } from '../../types/scheduler';

export const calculatePriorityNonPreemptive = (processes: Process[]): {
  processes: Process[];
  ganttChart: GanttChartItem[];
} => {
  // Prepare process queue with initial properties
  const processQueue = processes.map(p => ({ ...p, completed: false }));
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  let completedProcesses = 0;

  while (completedProcesses < processes.length) {
    // Filter processes that are ready for execution
    const readyProcesses = processQueue.filter(
      p => !p.completed && p.arrivalTime <= currentTime
    );

    if (readyProcesses.length === 0) {
      // No process is ready, add idle time until the next arrival
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

    // Select the process with the highest priority (lowest priority number)
    const selectedProcess = readyProcesses.reduce(
      (highest, current) =>
        (current.priority || Number.MAX_VALUE) < (highest.priority || Number.MAX_VALUE)
          ? current
          : highest,
      readyProcesses[0]
    );

    // Execute the selected process
    ganttChart.push({
      processId: selectedProcess.id,
      processName: selectedProcess.name,
      startTime: currentTime,
      endTime: currentTime + selectedProcess.burstTime
    });

    // Update process metrics
    selectedProcess.completionTime = currentTime + selectedProcess.burstTime;
    selectedProcess.turnaroundTime = selectedProcess.completionTime - selectedProcess.arrivalTime;
    selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime;
    selectedProcess.responseTime = currentTime - selectedProcess.arrivalTime;
    selectedProcess.completed = true;

    // Advance current time and increment completed processes count
    currentTime += selectedProcess.burstTime;
    completedProcesses++;
  }

  // Return final metrics and Gantt chart
  return {
    processes: processQueue.map(({ completed, ...process }) => process),
    ganttChart
  };
};
