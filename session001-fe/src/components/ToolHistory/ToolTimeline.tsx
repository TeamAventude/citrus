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
  Clock
} from 'lucide-react';
import { ToolHistoryEvent, EventType } from '../../types/toolHistory';
import moment from 'moment';

interface ToolTimelineProps {
  events: ToolHistoryEvent[];
  eventTypeFilter: EventType | 'all';
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export const ToolTimeline: React.FC<ToolTimelineProps> = ({ 
  events, 
  eventTypeFilter, 
  dateRange 
}) => {
  // Filter events based on filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by event type
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === eventTypeFilter);
    }

    // Filter by date range
    if (dateRange.startDate) {
      filtered = filtered.filter(event => 
        new Date(event.date) >= new Date(dateRange.startDate)
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(event => 
        new Date(event.date) <= new Date(dateRange.endDate)
      );
    }

    // Sort chronologically (newest first for timeline display)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, eventTypeFilter, dateRange]);

  const getEventIcon = (eventType: EventType) => {
    const iconClasses = "w-5 h-5";
    switch (eventType) {
      case 'procurement':
        return <ShoppingCart className={iconClasses} />;
      case 'borrowing':
        return <Users className={iconClasses} />;
      case 'return':
        return <RotateCcw className={iconClasses} />;
      case 'qc':
        return <CheckSquare className={iconClasses} />;
      case 'repair':
        return <Wrench className={iconClasses} />;
      case 'billing':
        return <DollarSign className={iconClasses} />;
      case 'eol':
        return <Skull className={iconClasses} />;
      default:
        return <FileText className={iconClasses} />;
    }
  };

  const getEventColor = (eventType: EventType) => {
    switch (eventType) {
      case 'procurement':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'borrowing':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'return':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'qc':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'repair':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'billing':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'eol':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getEventTitle = (eventType: EventType) => {
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

  const formatEventDetails = (event: ToolHistoryEvent) => {
    const details = [];
    const { type, details: eventDetails } = event;

    switch (type) {
      case 'procurement':
        if (eventDetails.poNumber) details.push(`PO: ${eventDetails.poNumber}`);
        if (eventDetails.supplier) details.push(`Supplier: ${eventDetails.supplier}`);
        if (eventDetails.procurementPrice) details.push(`Price: $${eventDetails.procurementPrice.toFixed(2)}`);
        break;
      
      case 'borrowing':
        if (eventDetails.borrower) details.push(`Borrower: ${eventDetails.borrower}`);
        if (eventDetails.project) details.push(`Project: ${eventDetails.project}`);
        break;
      
      case 'return':
        if (eventDetails.returnCondition) details.push(`Condition: ${eventDetails.returnCondition}`);
        if (eventDetails.project) details.push(`Project: ${eventDetails.project}`);
        if (eventDetails.overdueBy && eventDetails.overdueBy > 0) {
          details.push(`Overdue by: ${eventDetails.overdueBy} days`);
        }
        break;
      
      case 'qc':
        if (eventDetails.qcResult) details.push(`Result: ${eventDetails.qcResult}`);
        if (eventDetails.status) details.push(`Status: ${eventDetails.status}`);
        break;
      
      case 'repair':
        if (eventDetails.repairNote) details.push(`Note: ${eventDetails.repairNote}`);
        if (eventDetails.cost) details.push(`Cost: $${eventDetails.cost.toFixed(2)}`);
        if (eventDetails.status) details.push(`Status: ${eventDetails.status}`);
        break;
      
      case 'billing':
        if (eventDetails.billingAmount) details.push(`Amount: $${eventDetails.billingAmount.toFixed(2)}`);
        if (eventDetails.project) details.push(`Project: ${eventDetails.project}`);
        break;
      
      case 'eol':
        if (eventDetails.eolReason) details.push(`Reason: ${eventDetails.eolReason}`);
        if (eventDetails.status) details.push(`Status: ${eventDetails.status}`);
        break;
    }

    return details;
  };

  const getStatusIndicator = (event: ToolHistoryEvent) => {
    if (event.details.status) {
      const status = event.details.status;
      if (status === 'Pass') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Pass</span>;
      } else if (status === 'Fail') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Fail</span>;
      } else if (status === 'Pending') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      }
    }
    return null;
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
        <p className="text-gray-600">
          {eventTypeFilter !== 'all' || dateRange.startDate || dateRange.endDate
            ? 'No events match the current filters. Try adjusting your filter criteria.'
            : 'No history events found for this tool.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Event Timeline</h3>
        <p className="text-sm text-gray-600 mt-1">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} 
          {eventTypeFilter !== 'all' && ` (${getEventTitle(eventTypeFilter)} only)`}
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline Line */}
              {index < filteredEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
              )}

              {/* Event Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Event Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {getEventTitle(event.type)}
                      </h4>
                      {getStatusIndicator(event)}
                    </div>

                    {/* Event Meta */}
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

                    {/* Event Details */}
                    <div className="space-y-1">
                      {formatEventDetails(event).map((detail, detailIndex) => (
                        <div key={detailIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <FileText className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Special Indicators */}
                    {event.details.overdueBy && event.details.overdueBy > 0 && (
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ⚠️ Overdue Return
                      </div>
                    )}
                  </div>

                  {/* Relative Time */}
                  <div className="text-xs text-gray-500">
                    {moment(event.date).fromNow()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline End Marker */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-sm text-gray-500">Timeline complete</span>
        </div>
      </div>
    </div>
  );
};