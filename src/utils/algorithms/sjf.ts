import { Process, GanttChartItem } from '../../types/scheduler';

export const calculateSJFNonPreemptive = (processes: Process[]): {
  processes: Process[];
  ganttChart: GanttChartItem[];
} => {
  const processQueue = processes.map(p => ({ ...p, completed: false }));
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  let completedProcesses = 0;

  while (completedProcesses < processes.length) {
    // Find ready processes
    const readyProcesses = processQueue.filter(
      p => !p.completed && p.arrivalTime <= currentTime
    );

    if (readyProcesses.length === 0) {
      // No process is ready; CPU remains idle
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

    // Select process with the shortest burst time
    const selectedProcess = readyProcesses.reduce(
      (shortest, current) =>
        current.burstTime < shortest.burstTime ? current : shortest,
      readyProcesses[0]
    );

    // Update Gantt chart
    ganttChart.push({
      processId: selectedProcess.id,
      processName: selectedProcess.name,
      startTime: currentTime,
      endTime: currentTime + selectedProcess.burstTime
    });

    // Update process metrics
    selectedProcess.completionTime = currentTime + selectedProcess.burstTime;
    selectedProcess.turnaroundTime =
      selectedProcess.completionTime - selectedProcess.arrivalTime;
    selectedProcess.waitingTime =
      selectedProcess.turnaroundTime - selectedProcess.burstTime;

    // Record response time (only the first time a process is executed)
    if (selectedProcess.responseTime === undefined) {
      selectedProcess.responseTime =
        currentTime - selectedProcess.arrivalTime;
    }

    selectedProcess.completed = true;

    // Update current time and increment completed processes count
    currentTime += selectedProcess.burstTime;
    completedProcesses++;
  }

  return {
    processes: processQueue.map(({ completed, ...process }) => process),
    ganttChart
  };
};
