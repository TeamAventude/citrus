import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Calendar, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tool, ToolHistory, EventType, UsabilityDecision, BorrowingAnalytics, RepairAnalytics } from '../../types/toolHistory';
import { toolHistoryAPI } from '../../services/toolHistoryAPI';
import { ToolTimeline } from './ToolTimeline';
import { AnalyticsCards } from './AnalyticsCards';
import { UsabilityBadge } from './UsabilityBadge';
import { PDFExportContent } from './PDFExportContent';
import { usePDFExport } from '../../hooks/usePDFExport';

export const ToolHistoryDashboard: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolHistory, setToolHistory] = useState<ToolHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | 'all'>('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Load all tools on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        const toolsData = await toolHistoryAPI.getTools();
        setTools(toolsData);
      } catch (error) {
        console.error('Failed to load tools:', error);
      }
    };
    loadTools();
  }, []);

  // Load tool history when a tool is selected
  useEffect(() => {
    if (selectedTool) {
      loadToolHistory(selectedTool.id);
    }
  }, [selectedTool]);

  const loadToolHistory = async (toolId: string) => {
    setLoading(true);
    try {
      const history = await toolHistoryAPI.getToolHistory(toolId);
      setToolHistory(history);
    } catch (error) {
      console.error('Failed to load tool history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.model.toLowerCase().includes(query) ||
      tool.serialNumber.toLowerCase().includes(query)
    );
  }, [tools, searchQuery]);

  // Calculate analytics
  const borrowingAnalytics = useMemo((): BorrowingAnalytics | null => {
    if (!toolHistory) return null;

    const borrowEvents = toolHistory.events.filter(e => e.type === 'borrowing');
    const returnEvents = toolHistory.events.filter(e => e.type === 'return');
    const overdueCount = returnEvents.filter(e => e.details.overdueBy && e.details.overdueBy > 0).length;
    
    const lastBorrowEvent = borrowEvents[borrowEvents.length - 1];
    const lastReturnEvent = returnEvents[returnEvents.length - 1];
    
    // Check if currently borrowed (last borrow is after last return)
    const currentlyBorrowed = lastBorrowEvent && 
      (!lastReturnEvent || new Date(lastBorrowEvent.date) > new Date(lastReturnEvent.date));

    // Calculate average borrow duration
    const completedBorrows = borrowEvents.filter(borrowEvent => {
      const returnEvent = returnEvents.find(returnEvent => 
        new Date(returnEvent.date) > new Date(borrowEvent.date)
      );
      return returnEvent;
    });

    const avgDuration = completedBorrows.length > 0 
      ? completedBorrows.reduce((sum, borrowEvent) => {
          const returnEvent = returnEvents.find(returnEvent => 
            new Date(returnEvent.date) > new Date(borrowEvent.date)
          );
          if (returnEvent) {
            const borrowDate = new Date(borrowEvent.date);
            const returnDate = new Date(returnEvent.date);
            const duration = Math.ceil((returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + duration;
          }
          return sum;
        }, 0) / completedBorrows.length
      : 0;

    return {
      totalBorrows: borrowEvents.length,
      lastBorrowedDate: lastBorrowEvent ? lastBorrowEvent.date : null,
      overdueCount,
      currentlyBorrowed: !!currentlyBorrowed,
      averageBorrowDuration: Math.round(avgDuration)
    };
  }, [toolHistory]);

  const repairAnalytics = useMemo((): RepairAnalytics | null => {
    if (!toolHistory) return null;

    const repairEvents = toolHistory.events.filter(e => e.type === 'repair');
    const totalCost = repairEvents.reduce((sum, event) => sum + (event.details.cost || 0), 0);
    const lastRepair = repairEvents[repairEvents.length - 1];
    const repairToValueRatio = toolHistory.tool.procurementPrice > 0 
      ? totalCost / toolHistory.tool.procurementPrice 
      : 0;

    return {
      totalRepairs: repairEvents.length,
      cumulativeRepairCost: totalCost,
      lastRepairStatus: lastRepair ? (lastRepair.details.status as 'Pass' | 'Fail') : null,
      lastRepairDate: lastRepair ? lastRepair.date : null,
      repairToValueRatio
    };
  }, [toolHistory]);

  // Calculate usability decision
  const usabilityDecision = useMemo((): UsabilityDecision | null => {
    if (!toolHistory || !repairAnalytics) return null;

    const reasons: string[] = [];
    let status: 'Usable' | 'Not Usable' = 'Usable';

    // Check repair threshold
    if (repairAnalytics.totalRepairs > 3) {
      reasons.push(`Excessive repairs (${repairAnalytics.totalRepairs} repairs)`);
      status = 'Not Usable';
    }

    // Check repair cost ratio
    if (repairAnalytics.repairToValueRatio > 0.7) {
      reasons.push(`Repair costs exceed 70% of tool value (${Math.round(repairAnalytics.repairToValueRatio * 100)}%)`);
      status = 'Not Usable';
    }

    // Check latest QC status
    const qcEvents = toolHistory.events.filter(e => e.type === 'qc' || e.type === 'eol');
    const latestQC = qcEvents[qcEvents.length - 1];
    if (latestQC && latestQC.details.status === 'Fail') {
      reasons.push('Latest QC/EoL assessment failed');
      status = 'Not Usable';
    }

    // Check latest repair status
    if (repairAnalytics.lastRepairStatus === 'Fail') {
      reasons.push('Latest repair attempt failed');
      status = 'Not Usable';
    }

    if (status === 'Usable') {
      reasons.push('All checks passed');
    }

    return {
      status,
      reasons,
      confidence: reasons.length === 1 ? 'High' : reasons.length <= 3 ? 'Medium' : 'Low'
    };
  }, [toolHistory, repairAnalytics]);

  // PDF Export functionality - only initialize when all data is available
  const pdfExport = useMemo(() => {
    if (!selectedTool || !toolHistory || !borrowingAnalytics || !repairAnalytics || !usabilityDecision) {
      return null;
    }
    return {
      tool: selectedTool,
      toolHistory,
      borrowingAnalytics,
      repairAnalytics,
      usabilityDecision
    };
  }, [selectedTool, toolHistory, borrowingAnalytics, repairAnalytics, usabilityDecision]);

  const { printComponentRef, exportToPDF } = usePDFExport(
    pdfExport || {
      tool: { id: '', name: '', model: '', serialNumber: '', category: '', procurementPrice: 0, currentStatus: 'Available' } as Tool,
      toolHistory: { tool: {} as Tool, events: [] } as ToolHistory,
      borrowingAnalytics: { totalBorrows: 0, lastBorrowedDate: null, overdueCount: 0, currentlyBorrowed: false, averageBorrowDuration: 0 } as BorrowingAnalytics,
      repairAnalytics: { totalRepairs: 0, cumulativeRepairCost: 0, lastRepairStatus: null, lastRepairDate: null, repairToValueRatio: 0 } as RepairAnalytics,
      usabilityDecision: { status: 'Usable', reasons: [], confidence: 'High' } as UsabilityDecision
    }
  );

  const handleExportPDF = () => {
    if (!pdfExport) {
      alert('Please ensure a tool is selected and all data is loaded before exporting.');
      return;
    }
    exportToPDF();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tool History Dashboard</h1>
          <p className="text-gray-600">Track complete tool lifecycle from procurement to end-of-life</p>
        </div>

        {/* Tool Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools by name, model, or serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tool Selection Dropdown */}
            <div className="md:w-80">
              <select
                value={selectedTool?.id || ''}
                onChange={(e) => {
                  const tool = tools.find(t => t.id === e.target.value);
                  setSelectedTool(tool || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a tool...</option>
                {filteredTools.map(tool => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name} - {tool.model} ({tool.serialNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {selectedTool && (
          <>
            {/* Tool Info & Usability Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedTool.name}</h2>
                  <p className="text-gray-600">
                    {selectedTool.model} • Serial: {selectedTool.serialNumber} • ${selectedTool.procurementPrice.toFixed(2)}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    selectedTool.currentStatus === 'Available' ? 'bg-green-100 text-green-800' :
                    selectedTool.currentStatus === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                    selectedTool.currentStatus === 'Under Repair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedTool.currentStatus}
                  </span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                  {usabilityDecision && (
                    <UsabilityBadge decision={usabilityDecision} />
                  )}
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tool history...</p>
              </div>
            ) : toolHistory ? (
              <>
                {/* Analytics Cards */}
                {borrowingAnalytics && repairAnalytics && (
                  <AnalyticsCards
                    borrowingAnalytics={borrowingAnalytics}
                    repairAnalytics={repairAnalytics}
                    tool={selectedTool}
                  />
                )}

                {/* Timeline Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>
                    
                    {/* Event Type Filter */}
                    <select
                      value={eventTypeFilter}
                      onChange={(e) => setEventTypeFilter(e.target.value as EventType | 'all')}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Events</option>
                      <option value="procurement">Procurement</option>
                      <option value="borrowing">Borrowing</option>
                      <option value="return">Returns</option>
                      <option value="qc">Quality Control</option>
                      <option value="repair">Repairs</option>
                      <option value="billing">Billing</option>
                      <option value="eol">End of Life</option>
                    </select>

                    {/* Date Range Filters */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="Start date"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="End date"
                      />
                    </div>

                    {/* Clear Filters */}
                    {(eventTypeFilter !== 'all' || dateRange.startDate || dateRange.endDate) && (
                      <button
                        onClick={() => {
                          setEventTypeFilter('all');
                          setDateRange({ startDate: '', endDate: '' });
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <ToolTimeline
                  events={toolHistory.events}
                  eventTypeFilter={eventTypeFilter}
                  dateRange={dateRange}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No history found for this tool</p>
              </div>
            )}
          </>
        )}

        {!selectedTool && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tool</h3>
            <p className="text-gray-600">Choose a tool from the dropdown above to view its complete history</p>
          </div>
        )}
      </div>

      {/* Hidden PDF Export Content */}
      {pdfExport && (
        <div style={{ display: 'none' }}>
          <PDFExportContent
            ref={printComponentRef}
            tool={pdfExport.tool}
            toolHistory={pdfExport.toolHistory}
            borrowingAnalytics={pdfExport.borrowingAnalytics}
            repairAnalytics={pdfExport.repairAnalytics}
            usabilityDecision={pdfExport.usabilityDecision}
          />
        </div>
      )}
    </div>
  );
};