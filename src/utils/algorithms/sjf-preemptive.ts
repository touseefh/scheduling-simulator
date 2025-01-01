import { Process, GanttChartItem } from '../../types/scheduler';

export const calculateSJFPreemptive = (processes: Process[]): {
  processes: Process[];
  ganttChart: GanttChartItem[];
} => {
  const processQueue = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    firstResponse: -1,
    completed: false
  }));

  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  let completedProcesses = 0;
  let previousProcessId: string | null = null;

  while (completedProcesses < processes.length) {
    // Find process with the shortest remaining time that has arrived
    const selectedProcess = processQueue
      .filter(p => !p.completed && p.arrivalTime <= currentTime)
      .reduce((shortest, current) => 
        current.remainingTime < (shortest?.remainingTime ?? Number.MAX_VALUE) 
          ? current 
          : shortest, 
        null as typeof processQueue[number] | null
      );

    if (selectedProcess === null) {
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

    // Record response time for the first execution of the selected process
    if (selectedProcess.firstResponse === -1) {
      selectedProcess.firstResponse = currentTime;
      selectedProcess.responseTime = currentTime - selectedProcess.arrivalTime;
    }

    // Determine next event time
    const nextEvent = Math.min(
      ...processQueue
        .filter(p => !p.completed && p.arrivalTime > currentTime)
        .map(p => p.arrivalTime)
        .concat([currentTime + selectedProcess.remainingTime])
    );

    // Update Gantt chart
    if (previousProcessId !== selectedProcess.id) {
      ganttChart.push({
        processId: selectedProcess.id,
        processName: selectedProcess.name,
        startTime: currentTime,
        endTime: nextEvent
      });
    } else {
      // Extend the last Gantt chart entry for the same process
      ganttChart[ganttChart.length - 1].endTime = nextEvent;
    }

    // Update process's remaining time and current time
    const executedTime = nextEvent - currentTime;
    selectedProcess.remainingTime -= executedTime;
    currentTime = nextEvent;

    // Mark the process as completed if remaining time is zero
    if (selectedProcess.remainingTime === 0) {
      selectedProcess.completed = true;
      selectedProcess.completionTime = currentTime;
      selectedProcess.turnaroundTime =
        selectedProcess.completionTime - selectedProcess.arrivalTime;
      selectedProcess.waitingTime =
        selectedProcess.turnaroundTime - selectedProcess.burstTime;
      completedProcesses++;
    }

    previousProcessId = selectedProcess.id;
  }

  return {
    processes: processQueue.map(({ remainingTime, firstResponse, completed, ...process }) => process),
    ganttChart
  };
};
