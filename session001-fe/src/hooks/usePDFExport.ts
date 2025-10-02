import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Tool, ToolHistory, BorrowingAnalytics, RepairAnalytics, UsabilityDecision } from '../types/toolHistory';

interface UsePDFExportProps {
  tool: Tool;
  toolHistory: ToolHistory;
  borrowingAnalytics: BorrowingAnalytics;
  repairAnalytics: RepairAnalytics;
  usabilityDecision: UsabilityDecision;
}

export const usePDFExport = ({
  tool,
  toolHistory,
  borrowingAnalytics,
  repairAnalytics,
  usabilityDecision
}: UsePDFExportProps) => {
  const printComponentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: `Tool_History_Report_${tool.name.replace(/\s+/g, '_')}_${tool.serialNumber}`,
  });

  const exportToPDF = () => {
    if (!tool || !toolHistory || !borrowingAnalytics || !repairAnalytics || !usabilityDecision) {
      console.error('Missing required data for PDF export');
      return;
    }

    handlePrint();
  };

  return {
    printComponentRef,
    exportToPDF
  };
};