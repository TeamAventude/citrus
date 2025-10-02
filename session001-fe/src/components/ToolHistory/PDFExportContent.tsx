import React from 'react';
import { Tool, ToolHistory, BorrowingAnalytics, RepairAnalytics, UsabilityDecision } from '../../types/toolHistory';
import moment from 'moment';
interface PDFExportContentProps {
  tool: Tool;
  toolHistory: ToolHistory;
  borrowingAnalytics: BorrowingAnalytics;
  repairAnalytics: RepairAnalytics;
  usabilityDecision: UsabilityDecision;
}

export const PDFExportContent = React.forwardRef<HTMLDivElement, PDFExportContentProps>(
  ({ tool, toolHistory, borrowingAnalytics, repairAnalytics, usabilityDecision }, ref) => {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

    const getEventTitle = (eventType: string) => {
      switch (eventType) {
        case 'procurement': return 'Procurement';
        case 'borrowing': return 'Borrowed';
        case 'return': return 'Returned';
        case 'qc': return 'Quality Control';
        case 'repair': return 'Repair';
        case 'billing': return 'Billing';
        case 'eol': return 'End of Life';
        default: return 'Event';
      }
    };

    const formatEventDetails = (event: any) => {
      const details = [];
      const { type, details: eventDetails } = event;

      switch (type) {
        case 'procurement':
          if (eventDetails.poNumber) details.push(`PO: ${eventDetails.poNumber}`);
          if (eventDetails.supplier) details.push(`Supplier: ${eventDetails.supplier}`);
          if (eventDetails.procurementPrice) details.push(`Price: ${formatCurrency(eventDetails.procurementPrice)}`);
          break;
        case 'borrowing':
          if (eventDetails.borrower) details.push(`Borrower: ${eventDetails.borrower}`);
          if (eventDetails.project) details.push(`Project: ${eventDetails.project}`);
          if (eventDetails.dueDate) details.push(`Due: ${moment(eventDetails.dueDate).format('MMM DD, YYYY')}`);
          break;
        case 'return':
          if (eventDetails.returnCondition) details.push(`Condition: ${eventDetails.returnCondition}`);
          if (eventDetails.project) details.push(`Project: ${eventDetails.project}`);
          if (eventDetails.dueDate) details.push(`Due: ${moment(eventDetails.dueDate).format('MMM DD, YYYY')}`);
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
          if (eventDetails.cost) details.push(`Cost: ${formatCurrency(eventDetails.cost)}`);
          if (eventDetails.status) details.push(`Status: ${eventDetails.status}`);
          break;
        case 'billing':
          if (eventDetails.billingAmount) details.push(`Amount: ${formatCurrency(eventDetails.billingAmount)}`);
          if (eventDetails.project) details.push(`Project: ${eventDetails.project}`);
          if (eventDetails.dueDate) details.push(`Due: ${moment(eventDetails.dueDate).format('MMM DD, YYYY')}`);
          break;
        case 'eol':
          if (eventDetails.eolReason) details.push(`Reason: ${eventDetails.eolReason}`);
          if (eventDetails.status) details.push(`Status: ${eventDetails.status}`);
          break;
      }

      return details;
    };

    return (
      <div ref={ref} className="p-8 bg-white" style={{ minHeight: '100vh', fontSize: '12px' }}>
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tool History Report</h1>
          <p className="text-gray-600">Generated on {moment().format('MMMM DD, YYYY at h:mm A')}</p>
        </div>

        {/* Tool Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Tool Information
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Name:</strong> {tool.name}
            </div>
            <div>
              <strong>Tool Number:</strong> {tool.toolNumber}
            </div>
            <div>
              <strong>Procurement Date:</strong> {moment(tool.procurementDate).format('MMM DD, YYYY')}
            </div>
            <div>
              <strong>Procurement Price:</strong> {formatCurrency(tool.procurementPrice)}
            </div>
            <div>
              <strong>Total Borrows:</strong> {tool.totalBorrowCount}
            </div>
            <div>
              <strong>Total Repairs:</strong> {tool.totalRepairCount}
            </div>
            <div>
              <strong>Current Status:</strong> {tool.currentStatus}
            </div>
            <div>
              <strong>Last Updated:</strong> {moment(tool.modifiedDate).format('MMM DD, YYYY')}
            </div>
          </div>
        </div>

        {/* Usability Assessment */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Usability Assessment
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {usabilityDecision.status === 'Usable' ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-red-600">✗</span>
              )}
              <strong className={usabilityDecision.status === 'Usable' ? 'text-green-800' : 'text-red-800'}>
                {usabilityDecision.status}
              </strong>
              <span className="text-gray-600">({usabilityDecision.confidence} Confidence)</span>
            </div>
            <div>
              <strong>Assessment based on:</strong>
              <ul className="list-disc list-inside ml-4 mt-2">
                {usabilityDecision.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Analytics Summary
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Borrowing Analytics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Borrowing History</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Borrows:</span>
                  <strong>{borrowingAnalytics.totalBorrows}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Overdue Returns:</span>
                  <strong className={borrowingAnalytics.overdueCount > 0 ? 'text-red-600' : 'text-green-600'}>
                    {borrowingAnalytics.overdueCount}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Average Duration:</span>
                  <strong>{borrowingAnalytics.averageBorrowDuration} days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Borrowed:</span>
                  <strong>
                    {borrowingAnalytics.lastBorrowedDate 
                      ? moment(borrowingAnalytics.lastBorrowedDate).format('MMM DD, YYYY')
                      : 'Never'
                    }
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Currently Borrowed:</span>
                  <strong className={borrowingAnalytics.currentlyBorrowed ? 'text-blue-600' : 'text-green-600'}>
                    {borrowingAnalytics.currentlyBorrowed ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Repair Analytics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Repair History</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Repairs:</span>
                  <strong>{repairAnalytics.totalRepairs}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cumulative Cost:</span>
                  <strong>{formatCurrency(repairAnalytics.cumulativeRepairCost)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cost to Value Ratio:</span>
                  <strong className={repairAnalytics.repairToValueRatio > 0.7 ? 'text-red-600' : 
                    repairAnalytics.repairToValueRatio > 0.5 ? 'text-yellow-600' : 'text-green-600'}>
                    {formatPercentage(repairAnalytics.repairToValueRatio)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Repair:</span>
                  <strong>
                    {repairAnalytics.lastRepairDate 
                      ? moment(repairAnalytics.lastRepairDate).format('MMM DD, YYYY')
                      : 'Never'
                    }
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Repair Status:</span>
                  <strong className={
                    repairAnalytics.lastRepairStatus === 'Pass' ? 'text-green-600' : 
                    repairAnalytics.lastRepairStatus === 'Fail' ? 'text-red-600' : 'text-gray-600'
                  }>
                    {repairAnalytics.lastRepairStatus || 'N/A'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Event Timeline ({toolHistory.events.length} events)
          </h2>
          
          <div className="space-y-4">
            {toolHistory.events
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((event, index) => (
                <div key={event.id} className="border-l-4 border-gray-200 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <strong>{getEventTitle(event.type)}</strong>
                        {event.details.status && (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            event.details.status === 'Pass' ? 'bg-green-100 text-green-800' :
                            event.details.status === 'Fail' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.details.status}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Date:</strong> {moment(event.date).format('MMM DD, YYYY h:mm A')} • 
                        <strong> User:</strong> {event.user}
                      </div>

                      <div className="text-sm">
                        {formatEventDetails(event).map((detail, detailIndex) => (
                          <div key={detailIndex} className="text-gray-700">• {detail}</div>
                        ))}
                      </div>

                      {event.details.overdueBy && event.details.overdueBy > 0 && (
                        <div className="mt-1 text-xs text-red-600">
                          ⚠️ Overdue Return
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-300 text-xs text-gray-500">
          <p>This report was generated automatically by the Tool History Dashboard system.</p>
          <p>For questions or concerns, please contact the Asset Management team.</p>
        </div>
      </div>
    );
  }
);