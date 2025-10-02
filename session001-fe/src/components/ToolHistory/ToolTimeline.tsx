import React, { useMemo } from 'react';
import {
  ShoppingCart,
  Users,
  RotateCcw,
  CheckSquare,
  Wrench,
  DollarSign,
  Skull,
  Calendar,
  User,
  FileText,
  Clock,
} from 'lucide-react';
import moment from 'moment';
import { ToolHistoryEvent, EventType } from '../../types/toolHistory';

interface ToolTimelineProps {
  events: ToolHistoryEvent[];
  eventTypeFilter: EventType | 'all';
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

const EVENT_COLOR_MAP: Record<EventType, string> = {
  procurement: 'bg-blue-100 text-blue-600 border-blue-200',
  borrowing: 'bg-green-100 text-green-600 border-green-200',
  return: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  qc: 'bg-purple-100 text-purple-600 border-purple-200',
  repair: 'bg-orange-100 text-orange-600 border-orange-200',
  billing: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  eol: 'bg-red-100 text-red-600 border-red-200',
};

const EVENT_ICON_MAP: Record<EventType, JSX.Element> = {
  procurement: <ShoppingCart className="w-5 h-5" />,
  borrowing: <Users className="w-5 h-5" />,
  return: <RotateCcw className="w-5 h-5" />,
  qc: <CheckSquare className="w-5 h-5" />,
  repair: <Wrench className="w-5 h-5" />,
  billing: <DollarSign className="w-5 h-5" />,
  eol: <Skull className="w-5 h-5" />,
};

const getEventTitle = (eventType: EventType): string => {
  switch (eventType) {
    case 'procurement':
      return 'Procurement';
    case 'borrowing':
      return 'Borrowed';
    case 'return':
      return 'Returned';
    case 'qc':
      return 'Quality Control';
    case 'repair':
      return 'Repair';
    case 'billing':
      return 'Billing';
    case 'eol':
      return 'End of Life';
    default:
      return 'Event';
  }
};

const renderStatus = (status?: string | null): JSX.Element | null => {
  if (!status) {
    return null;
  }

  const normalized = status.toLowerCase();

  if (normalized === 'pass') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Pass
      </span>
    );
  }

  if (normalized === 'fail') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Fail
      </span>
    );
  }

  if (normalized === 'pending') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  }

  return null;
};

const formatEventDetails = (event: ToolHistoryEvent): string[] => {
  const details: string[] = [];
  const { type, details: data } = event;

  switch (type) {
    case 'procurement':
      if (data.poNumber) details.push(`PO: ${data.poNumber}`);
      if (data.supplier) details.push(`Supplier: ${data.supplier}`);
      if (data.procurementPrice != null) details.push(`Price: $${data.procurementPrice.toFixed(2)}`);
      if (data.notes) details.push(data.notes);
      break;
    case 'borrowing':
      if (data.borrower) details.push(`Borrower: ${data.borrower}`);
      if (data.project) details.push(`Project: ${data.project}`);
      if (data.dueDate) details.push(`Due: ${moment(data.dueDate).format('MMM DD, YYYY')}`);
      break;
    case 'return':
      if (data.returnCondition) details.push(`Condition: ${data.returnCondition}`);
      if (data.project) details.push(`Project: ${data.project}`);
      if (data.dueDate) details.push(`Due: ${moment(data.dueDate).format('MMM DD, YYYY')}`);
      if (data.overdueBy && data.overdueBy > 0) details.push(`Overdue by: ${data.overdueBy} days`);
      break;
    case 'qc':
      if (data.qcResult) details.push(`Result: ${data.qcResult}`);
      if (data.notes) details.push(data.notes);
      break;
    case 'repair':
      if (data.repairNote) details.push(`Note: ${data.repairNote}`);
      if (data.cost != null) details.push(`Cost: $${data.cost.toFixed(2)}`);
      if (data.notes) details.push(data.notes);
      break;
    case 'billing':
      if (data.billingAmount != null) details.push(`Amount: $${data.billingAmount.toFixed(2)}`);
      if (data.project) details.push(`Project: ${data.project}`);
      break;
    case 'eol':
      if (data.eolReason) details.push(`Reason: ${data.eolReason}`);
      if (data.notes) details.push(data.notes);
      break;
    default:
      if (data.notes) details.push(data.notes);
  }

  return details;
};

export const ToolTimeline: React.FC<ToolTimelineProps> = ({ events, eventTypeFilter, dateRange }) => {
  const filteredEvents = useMemo(() => {
    const matchesType = (event: ToolHistoryEvent) =>
      eventTypeFilter === 'all' || event.type === eventTypeFilter;

    const matchesDate = (event: ToolHistoryEvent) => {
      const eventDate = new Date(event.date);
      if (dateRange.startDate && eventDate < new Date(dateRange.startDate)) {
        return false;
      }
      if (dateRange.endDate && eventDate > new Date(dateRange.endDate)) {
        return false;
      }
      return true;
    };

    return [...events]
      .filter((event) => matchesType(event) && matchesDate(event))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, eventTypeFilter, dateRange]);

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
        <p className="text-gray-600">
          {eventTypeFilter !== 'all' || dateRange.startDate || dateRange.endDate
            ? 'No events match the selected filters. Try adjusting your criteria.'
            : 'There are no recorded events for this tool yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Event Timeline</h3>
        <p className="text-sm text-gray-600 mt-1">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          {eventTypeFilter !== 'all' && ` (${getEventTitle(eventTypeFilter)} only)`}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {index < filteredEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
              )}

              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${EVENT_COLOR_MAP[event.type]}`}>
                {EVENT_ICON_MAP[event.type]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{getEventTitle(event.type)}</h4>
                      {renderStatus(event.details.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{moment(event.date).format('MMM DD, YYYY')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{moment(event.date).format('h:mm A')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{event.user}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {formatEventDetails(event).map((detail, detailIndex) => (
                        <div key={detailIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <FileText className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {(event.details.isOverdue || (event.details.overdueBy ?? 0) > 0) && (
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ⚠ Overdue Return
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    {moment(event.date).fromNow()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-sm text-gray-500">Timeline complete</span>
        </div>
      </div>
    </div>
  );
};
