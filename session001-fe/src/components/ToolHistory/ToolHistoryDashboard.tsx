import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Search, Download, Calendar, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Tool,
  ToolHistory,
  EventType,
  BorrowingAnalytics,
  RepairAnalytics,
  UsabilityDecision,
} from '../../types/toolHistory';
import { toolHistoryAPI } from '../../services/toolHistoryAPI';
import { ToolTimeline } from './ToolTimeline';
import { AnalyticsCards } from './AnalyticsCards';
import { UsabilityBadge } from './UsabilityBadge';
import { PDFExportContent } from './PDFExportContent';
import { usePDFExport } from '../../hooks/usePDFExport';

export const ToolHistoryDashboard: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolHistory, setToolHistory] = useState<ToolHistory | null>(null);
  const [borrowingAnalytics, setBorrowingAnalytics] = useState<BorrowingAnalytics | null>(null);
  const [repairAnalytics, setRepairAnalytics] = useState<RepairAnalytics | null>(null);
  const [usabilityDecision, setUsabilityDecision] = useState<UsabilityDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | 'all'>('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const loadTools = async () => {
      try {
        const toolList = await toolHistoryAPI.getTools();
        setTools(toolList);
      } catch (error) {
        console.error('Failed to load tools:', error);
      }
    };

    loadTools();
  }, []);

  useEffect(() => {
    if (selectedToolId == null) {
      return;
    }

    const fetchToolHistory = async () => {
      setLoading(true);
      try {
        const data = await toolHistoryAPI.getToolHistory(selectedToolId);
        setSelectedTool(data.toolHistory.tool);
        setTools((previous) =>
          previous.map((item) => (item.id === data.toolHistory.tool.id ? data.toolHistory.tool : item))
        );
        setToolHistory(data.toolHistory);
        setBorrowingAnalytics(data.borrowingAnalytics);
        setRepairAnalytics(data.repairAnalytics);
        setUsabilityDecision(data.usabilityDecision);
      } catch (error) {
        console.error('Failed to load tool history:', error);
        setToolHistory(null);
        setBorrowingAnalytics(null);
        setRepairAnalytics(null);
        setUsabilityDecision(null);
      } finally {
        setLoading(false);
      }
    };

    fetchToolHistory();
  }, [selectedToolId]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }

    const query = searchQuery.toLowerCase();
    return tools.filter((toolItem) =>
      toolItem.name.toLowerCase().includes(query) ||
      toolItem.toolNumber.toLowerCase().includes(query) ||
      (toolItem.serialNumber ?? '').toLowerCase().includes(query)
    );
  }, [tools, searchQuery]);

  const pdfExport = useMemo(() => {
    if (!selectedTool || !toolHistory || !borrowingAnalytics || !repairAnalytics || !usabilityDecision) {
      return null;
    }

    return {
      tool: selectedTool,
      toolHistory,
      borrowingAnalytics,
      repairAnalytics,
      usabilityDecision,
    };
  }, [selectedTool, toolHistory, borrowingAnalytics, repairAnalytics, usabilityDecision]);

  const { printComponentRef, exportToPDF } = usePDFExport(
    pdfExport ?? {
      tool: {
        id: 0,
        name: '',
        toolNumber: '',
        procurementPrice: 0,
        procurementDate: '',
        currentStatus: 'Available',
        isUsable: true,
        lastQCDate: null,
        lastQCPassed: null,
        totalRepairCost: 0,
        totalRepairCount: 0,
        totalBorrowCount: 0,
        overdueCount: 0,
        lastBorrowedDate: null,
        createdDate: '',
        modifiedDate: '',
      } as Tool,
      toolHistory: { tool: {} as Tool, events: [] } as ToolHistory,
      borrowingAnalytics: {
        totalBorrows: 0,
        lastBorrowedDate: null,
        overdueCount: 0,
        currentlyBorrowed: false,
        averageBorrowDuration: 0,
      } as BorrowingAnalytics,
      repairAnalytics: {
        totalRepairs: 0,
        cumulativeRepairCost: 0,
        lastRepairStatus: null,
        lastRepairDate: null,
        repairToValueRatio: 0,
      } as RepairAnalytics,
      usabilityDecision: {
        status: 'Usable',
        reasons: [],
        confidence: 'Medium',
      } as UsabilityDecision,
    }
  );

  const handleToolSelection = (value: string) => {
    if (!value) {
      setSelectedToolId(null);
      setSelectedTool(null);
      setToolHistory(null);
      setBorrowingAnalytics(null);
      setRepairAnalytics(null);
      setUsabilityDecision(null);
      return;
    }

    const parsedId = Number(value);
    setSelectedToolId(Number.isNaN(parsedId) ? null : parsedId);
  };

  const handleExportPDF = async () => {
    if (!selectedTool) {
      alert('Please select a tool before exporting.');
      return;
    }

    try {
      await toolHistoryAPI.downloadToolHistoryPdf(selectedTool.id, `${selectedTool.name}-${selectedTool.toolNumber}`);
    } catch (error) {
      console.error('Failed to download PDF from backend. Falling back to client export.', error);
      if (pdfExport) {
        exportToPDF();
      } else {
        alert('Unable to export the report at this time.');
      }
    }
  };

  const hasDashboardData =
    selectedTool &&
    toolHistory &&
    borrowingAnalytics &&
    repairAnalytics &&
    usabilityDecision;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tool History Dashboard</h1>
            <p className="text-gray-600">Track the complete lifecycle with analytics, decisions, and exportable reports.</p>
          </div>

          <div className="flex items-center gap-3">
            {selectedTool && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm">
                <CheckCircle className="w-4 h-4" /> Last sync {moment(selectedTool.modifiedDate).fromNow()}
              </div>
            )}
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tools by name or number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <select
                value={selectedToolId ?? ''}
                onChange={(event) => handleToolSelection(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a tool</option>
                {filteredTools.map((toolItem) => (
                  <option key={toolItem.id} value={toolItem.id}>
                    {toolItem.name} · {toolItem.toolNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {hasDashboardData ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedTool!.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">Tool Number:</span> {selectedTool!.toolNumber}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Procurement Price:</span> ${selectedTool!.procurementPrice.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Procurement Date:</span> {moment(selectedTool!.procurementDate).format('MMM DD, YYYY')}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Repairs:</span> {selectedTool!.totalRepairCount}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Borrows:</span> {selectedTool!.totalBorrowCount}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Borrowed:</span>{' '}
                      {borrowingAnalytics!.lastBorrowedDate
                        ? moment(borrowingAnalytics!.lastBorrowedDate).fromNow()
                        : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTool!.currentStatus.toLowerCase().includes('usable')
                        ? 'bg-green-100 text-green-800'
                        : selectedTool!.currentStatus.toLowerCase().includes('repair')
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedTool!.currentStatus}
                  </span>
                  {usabilityDecision && <UsabilityBadge decision={usabilityDecision} />}
                </div>
              </div>
            </div>

            {borrowingAnalytics && repairAnalytics && selectedTool && (
              <AnalyticsCards
                borrowingAnalytics={borrowingAnalytics}
                repairAnalytics={repairAnalytics}
                tool={selectedTool}
              />
            )}

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>

                <select
                  value={eventTypeFilter}
                  onChange={(event) => setEventTypeFilter(event.target.value as EventType | 'all')}
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

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(event) => setDateRange((previous) => ({ ...previous, startDate: event.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(event) => setDateRange((previous) => ({ ...previous, endDate: event.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>

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

            <ToolTimeline
              events={toolHistory!.events}
              eventTypeFilter={eventTypeFilter}
              dateRange={dateRange}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tool history...</p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tool selected</h3>
                <p className="text-gray-600">Use the search and selector above to view a tool&apos;s timeline.</p>
              </>
            )}
          </div>
        )}

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
    </div>
  );
};
