import { create } from 'zustand';
import { Process } from '../types/scheduler';

interface SimulationResult {
  algorithmName: string;
  processes: Process[];
  ganttChart: any[];
  averages: {
    waitingTime: number;
    turnaroundTime: number;
    responseTime: number;
  };
}

interface SimulationStore {
  results: SimulationResult[];
  addResult: (result: SimulationResult) => void;
  clearResults: () => void;
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  results: [],
  addResult: (result) => set((state) => ({ 
    results: [...state.results, result] 
  })),
  clearResults: () => set({ results: [] }),
}));