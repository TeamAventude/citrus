import { axiosInstance } from '../config';
import {
  Tool,
  ToolHistory,
  ToolHistoryEvent,
  EventType,
  BorrowingAnalytics,
  RepairAnalytics,
  UsabilityDecision,
  ToolHistoryData,
} from '../types/toolHistory';

interface ToolDto {
  id: number;
  name: string;
  toolNumber: string;
  procurementPrice: number;
  procurementDate: string;
  currentStatus: string;
  isUsable: boolean;
  lastQcDate?: string | null;
  lastQCDate?: string | null;
  lastQCPassed?: boolean | null;
  lastQcPassed?: boolean | null;
  totalRepairCost: number;
  totalRepairCount: number;
  totalBorrowCount: number;
  overdueCount: number;
  lastBorrowedDate?: string | null;
  createdDate: string;
  modifiedDate: string;
}

interface ToolHistoryDto {
  id: number;
  eventType: string;
  eventDate: string;
  userId: string;
  userName: string;
  projectNumber?: string | null;
  purchaseOrderNumber?: string | null;
  cost?: number | null;
  notes?: string | null;
  qcPassed?: boolean | null;
  repairPassed?: boolean | null;
  dueDate?: string | null;
  isOverdue: boolean;
}

interface BorrowingHistoryDto {
  totalBorrowCount: number;
  lastBorrowedDate?: string | null;
  overdueCount: number;
}

interface RepairHistoryDto {
  totalRepairCount: number;
  totalRepairCost: number;
  lastRepairStatus?: boolean | null;
  repairCostPercentage: number;
}

interface ToolAnalyticsDto {
  borrowingHistory: BorrowingHistoryDto;
  repairHistory: RepairHistoryDto;
  isUsable: boolean;
  usabilityReason: string;
}

interface ToolHistoryResponseDto {
  tool: ToolDto;
  history?: ToolHistoryDto[];
  History?: ToolHistoryDto[];
  analytics?: ToolAnalyticsDto;
  Analytics?: ToolAnalyticsDto;
}

const EVENT_TYPE_MAP: Record<string, EventType> = {
  procurement: 'procurement',
  Procurement: 'procurement',
  borrowing: 'borrowing',
  Borrowing: 'borrowing',
  return: 'return',
  Return: 'return',
  qc: 'qc',
  QC: 'qc',
  qualitycontrol: 'qc',
  QualityControl: 'qc',
  repair: 'repair',
  Repair: 'repair',
  billing: 'billing',
  Billing: 'billing',
  eol: 'eol',
  EOL: 'eol',
  endoflife: 'eol',
  EndOfLife: 'eol',
};

const normalizeEventType = (value: string): EventType => {
  const normalizedKey = value?.trim();
  if (!normalizedKey) {
    return 'procurement';
  }

  return EVENT_TYPE_MAP[normalizedKey] ?? EVENT_TYPE_MAP[normalizedKey.toLowerCase()] ?? 'procurement';
};

const mapTool = (dto: ToolDto): Tool => ({
  id: dto.id,
  name: dto.name,
  toolNumber: dto.toolNumber,
  procurementPrice: dto.procurementPrice,
  procurementDate: dto.procurementDate,
  currentStatus: dto.currentStatus,
  isUsable: dto.isUsable,
  lastQCDate: dto.lastQcDate ?? dto.lastQCDate ?? null,
  lastQCPassed: dto.lastQcPassed ?? dto.lastQCPassed ?? null,
  totalRepairCost: dto.totalRepairCost,
  totalRepairCount: dto.totalRepairCount,
  totalBorrowCount: dto.totalBorrowCount,
  overdueCount: dto.overdueCount,
  lastBorrowedDate: dto.lastBorrowedDate ?? null,
  createdDate: dto.createdDate,
  modifiedDate: dto.modifiedDate,
  model: null,
  serialNumber: dto.toolNumber,
  category: null,
});

const mapEvent = (dto: ToolHistoryDto): ToolHistoryEvent => {
  const type = normalizeEventType(dto.eventType);

  const base: ToolHistoryEvent = {
    id: dto.id.toString(),
    type,
    date: dto.eventDate,
    user: dto.userName || dto.userId,
    details: {},
  };

  switch (type) {
    case 'procurement': {
      base.details.poNumber = dto.purchaseOrderNumber ?? undefined;
      base.details.procurementPrice = dto.cost ?? undefined;
      base.details.status = dto.qcPassed == null ? undefined : dto.qcPassed ? 'Pass' : 'Fail';
      base.details.notes = dto.notes ?? undefined;
      break;
    }
    case 'borrowing': {
      base.details.borrower = dto.userName || dto.userId;
      base.details.project = dto.projectNumber ?? undefined;
      base.details.dueDate = dto.dueDate ?? undefined;
      base.details.notes = dto.notes ?? undefined;
      break;
    }
    case 'return': {
      base.details.project = dto.projectNumber ?? undefined;
      base.details.returnCondition = dto.notes ?? undefined;
      base.details.dueDate = dto.dueDate ?? undefined;
      base.details.isOverdue = dto.isOverdue || false;

      if (dto.dueDate) {
        const dueDate = new Date(dto.dueDate).getTime();
        const actualDate = new Date(dto.eventDate).getTime();
        const overdueDays = Math.ceil((actualDate - dueDate) / (1000 * 60 * 60 * 24));
        if (overdueDays > 0) {
          base.details.overdueBy = overdueDays;
        }
      }

      break;
    }
    case 'qc': {
      if (dto.qcPassed != null) {
        base.details.status = dto.qcPassed ? 'Pass' : 'Fail';
        base.details.qcResult = dto.qcPassed ? 'Pass' : 'Fail';
      }
      base.details.notes = dto.notes ?? undefined;
      break;
    }
    case 'repair': {
      if (dto.repairPassed != null) {
        base.details.status = dto.repairPassed ? 'Pass' : 'Fail';
      }
      base.details.repairNote = dto.notes ?? undefined;
      base.details.cost = dto.cost ?? undefined;
      break;
    }
    case 'billing': {
      base.details.billingAmount = dto.cost ?? undefined;
      base.details.project = dto.projectNumber ?? undefined;
      base.details.notes = dto.notes ?? undefined;
      break;
    }
    case 'eol': {
      base.details.status = dto.qcPassed == null ? undefined : dto.qcPassed ? 'Pass' : 'Fail';
      base.details.eolReason = dto.notes ?? undefined;
      break;
    }
    default: {
      base.details.notes = dto.notes ?? undefined;
    }
  }

  return base;
};

const buildBorrowingAnalytics = (
  events: ToolHistoryEvent[],
  tool: Tool,
  analytics?: BorrowingHistoryDto
): BorrowingAnalytics => {
  const borrowEvents = events.filter((event) => event.type === 'borrowing');
  const returnEvents = events.filter((event) => event.type === 'return');

  const lastBorrowEvent = borrowEvents[borrowEvents.length - 1];
  const lastReturnEvent = returnEvents[returnEvents.length - 1];

  const currentlyBorrowed = Boolean(
    lastBorrowEvent && (!lastReturnEvent || new Date(lastBorrowEvent.date) > new Date(lastReturnEvent.date))
  );

  const completedBorrows = borrowEvents.flatMap((borrowEvent) => {
    const matchingReturn = returnEvents.find((returnEvent) => new Date(returnEvent.date) > new Date(borrowEvent.date));
    return matchingReturn ? [[borrowEvent, matchingReturn] as const] : [];
  });

  const averageBorrowDuration = completedBorrows.length
    ? Math.round(
        completedBorrows.reduce((total, [borrowEvent, returnEvent]) => {
          const borrowDate = new Date(borrowEvent.date).getTime();
          const returnDate = new Date(returnEvent.date).getTime();
          const durationInDays = Math.ceil((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
          return total + durationInDays;
        }, 0) / completedBorrows.length
      )
    : 0;

  return {
    totalBorrows: analytics?.totalBorrowCount ?? borrowEvents.length,
    lastBorrowedDate: analytics?.lastBorrowedDate ?? tool.lastBorrowedDate ?? (lastBorrowEvent?.date ?? null),
    overdueCount: analytics?.overdueCount ?? returnEvents.filter((event) => event.details.isOverdue || (event.details.overdueBy ?? 0) > 0).length,
    currentlyBorrowed,
    averageBorrowDuration,
  };
};

const buildRepairAnalytics = (
  events: ToolHistoryEvent[],
  tool: Tool,
  analytics?: RepairHistoryDto
): RepairAnalytics => {
  const repairEvents = events.filter((event) => event.type === 'repair');
  const lastRepairEvent = repairEvents[repairEvents.length - 1];

  const totalRepairCost = analytics?.totalRepairCost ?? repairEvents.reduce((total, event) => total + (event.details.cost ?? 0), 0);
  const repairCostRatio = tool.procurementPrice > 0 ? totalRepairCost / tool.procurementPrice : 0;

  const lastRepairStatusFromAnalytics = analytics?.lastRepairStatus == null
    ? null
    : analytics.lastRepairStatus
      ? 'Pass'
      : 'Fail';

  return {
    totalRepairs: analytics?.totalRepairCount ?? repairEvents.length,
    cumulativeRepairCost: totalRepairCost,
    lastRepairStatus: (lastRepairEvent?.details.status as 'Pass' | 'Fail' | undefined) ?? lastRepairStatusFromAnalytics,
    lastRepairDate: lastRepairEvent?.date ?? null,
    repairToValueRatio: (analytics?.repairCostPercentage ?? repairCostRatio * 100) / 100,
  };
};

const buildUsabilityDecision = (analytics?: ToolAnalyticsDto): UsabilityDecision => {
  if (!analytics) {
    return {
      status: 'Usable',
      reasons: ['Tool is in good condition'],
      confidence: 'Medium',
    };
  }

  const reasons = analytics.usabilityReason
    .split(',')
    .map((reason) => reason.trim())
    .filter(Boolean);

  const status: UsabilityDecision['status'] = analytics.isUsable ? 'Usable' : 'Not Usable';
  const confidence: UsabilityDecision['confidence'] = !analytics.isUsable
    ? 'High'
    : reasons.length > 1
      ? 'High'
      : reasons.length === 1
        ? 'Medium'
        : 'Low';

  return {
    status,
    reasons: reasons.length ? reasons : ['Tool is in good condition'],
    confidence,
  };
};

const mapHistoryResponse = (response: ToolHistoryResponseDto): ToolHistoryData => {
  const tool = mapTool(response.tool);
  const historyDtos = response.history ?? response.History ?? [];
  const events = historyDtos.map(mapEvent).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const analytics = response.analytics ?? response.Analytics;

  const borrowingAnalytics = buildBorrowingAnalytics(events, tool, analytics?.borrowingHistory);
  const repairAnalytics = buildRepairAnalytics(events, tool, analytics?.repairHistory);
  const usabilityDecision = buildUsabilityDecision(analytics);

  const toolHistory: ToolHistory = {
    tool,
    events,
  };

  return {
    toolHistory,
    borrowingAnalytics,
    repairAnalytics,
    usabilityDecision,
  };
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const toolHistoryAPI = {
  getTools: async (search?: string): Promise<Tool[]> => {
    const { data } = await axiosInstance.get<ToolDto[]>('/tools', {
      params: search ? { search } : undefined,
    });

    return data.map(mapTool);
  },

  getToolHistory: async (
    toolId: number,
    params?: {
      startDate?: string;
      endDate?: string;
      eventType?: string;
    }
  ): Promise<ToolHistoryData> => {
    const { data } = await axiosInstance.get<ToolHistoryResponseDto>(`/tools/${toolId}/history`, {
      params,
    });

    return mapHistoryResponse(data);
  },

  searchTools: async (query: string): Promise<Tool[]> => {
    if (!query.trim()) {
      return toolHistoryAPI.getTools();
    }
    return toolHistoryAPI.getTools(query.trim());
  },

  downloadToolHistoryPdf: async (toolId: number, fileName?: string): Promise<void> => {
    const response = await axiosInstance.get<Blob>(`/tools/${toolId}/export-pdf`, {
      responseType: 'blob',
    });

    const safeFileName = fileName?.trim().replace(/\s+/g, '_') || `tool-history-${toolId}`;
    downloadBlob(response.data, `${safeFileName}.pdf`);
  },
};
