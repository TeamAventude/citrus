export type EventType =
  | 'procurement'
  | 'borrowing'
  | 'return'
  | 'qc'
  | 'repair'
  | 'billing'
  | 'eol';

export interface Tool {
  id: number;
  name: string;
  toolNumber: string;
  procurementPrice: number;
  procurementDate: string;
  currentStatus: string;
  isUsable: boolean;
  lastQCDate: string | null;
  lastQCPassed: boolean | null;
  totalRepairCost: number;
  totalRepairCount: number;
  totalBorrowCount: number;
  overdueCount: number;
  lastBorrowedDate: string | null;
  createdDate: string;
  modifiedDate: string;
  model?: string | null;
  serialNumber?: string | null;
  category?: string | null;
}

export interface ToolHistoryEventDetails {
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
  overdueBy?: number;
  isOverdue?: boolean;
  qcResult?: 'Pass' | 'Fail';
  eolReason?: string;
  dueDate?: string;
  notes?: string;
}

export interface ToolHistoryEvent {
  id: string;
  type: EventType;
  date: string;
  user: string;
  details: ToolHistoryEventDetails;
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
  averageBorrowDuration: number;
}

export interface RepairAnalytics {
  totalRepairs: number;
  cumulativeRepairCost: number;
  lastRepairStatus: 'Pass' | 'Fail' | null;
  lastRepairDate: string | null;
  repairToValueRatio: number;
}

export interface UsabilityDecision {
  status: 'Usable' | 'Not Usable';
  reasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ToolHistoryData {
  toolHistory: ToolHistory;
  borrowingAnalytics: BorrowingAnalytics;
  repairAnalytics: RepairAnalytics;
  usabilityDecision: UsabilityDecision;
}
