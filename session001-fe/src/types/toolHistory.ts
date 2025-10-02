export type EventType = 
  | 'procurement' 
  | 'borrowing' 
  | 'return' 
  | 'qc' 
  | 'repair' 
  | 'billing'
  | 'eol';

export interface ToolHistoryEvent {
  id: string;
  type: EventType;
  date: string;
  user: string;
  details: {
    poNumber?: string;
    project?: string;
    repairNote?: string;
    cost?: number;
    status?: 'Pass' | 'Fail' | 'Pending';
    borrower?: string;
    returnCondition?: string;
    billingAmount?: number;
    procurementPrice?: number;
    supplier?: string;
    overdueBy?: number; // days
    qcResult?: 'Pass' | 'Fail';
    eolReason?: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  category: string;
  procurementPrice: number;
  currentStatus: 'Available' | 'Borrowed' | 'Under Repair' | 'Out of Service';
}

export interface ToolHistory {
  tool: Tool;
  events: ToolHistoryEvent[];
}

export interface BorrowingAnalytics {
  totalBorrows: number;
  lastBorrowedDate: string | null;
  overdueCount: number;
  currentlyBorrowed: boolean;
  averageBorrowDuration: number; // days
}

export interface RepairAnalytics {
  totalRepairs: number;
  cumulativeRepairCost: number;
  lastRepairStatus: 'Pass' | 'Fail' | null;
  lastRepairDate: string | null;
  repairToValueRatio: number; // repair cost / procurement price
}

export interface UsabilityDecision {
  status: 'Usable' | 'Not Usable';
  reasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
}