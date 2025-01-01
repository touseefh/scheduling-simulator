export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
}

export interface GanttChartItem {
  processId: string;
  processName: string;
  startTime: number;
  endTime: number;
}

export type AlgorithmType = 
  | 'fcfs' 
  | 'sjf-nonpreemptive'
  | 'sjf-preemptive'
  | 'priority-nonpreemptive'
  | 'priority-preemptive'
  | 'rr';