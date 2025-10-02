# Tool History Dashboard

A comprehensive React dashboard component for tracking complete tool lifecycle from procurement to end-of-life.

## Features

- **Tool Selection**: Search and select tools from dropdown
- **Complete Timeline**: View chronological history of all tool events
- **Analytics Panels**: 
  - Borrowing history analytics (total borrows, overdue count, average duration)
  - Repair history analytics (total repairs, costs, repair-to-value ratio)
- **Usability Assessment**: Automatic determination of tool usability based on:
  - Repair threshold (>3 repairs or >70% repair cost ratio)
  - Latest QC/EoL assessment status
  - Latest repair attempt status
- **Event Filtering**: Filter by event type and date range
- **PDF Export**: Download complete tool history report

## Event Types Supported

- **Procurement**: Initial tool purchase with PO details
- **Borrowing**: Tool checkout with borrower and project info
- **Return**: Tool return with condition assessment
- **QC**: Quality control assessments
- **Repair**: Maintenance work with costs and status
- **Billing**: Cost allocations to projects
- **EoL**: End-of-life assessments

## Usage

### Basic Implementation
```tsx
import { ToolHistoryDashboard } from './components/ToolHistory';

function App() {
  return <ToolHistoryDashboard />;
}
```

### Sample Page
```tsx
import SampleToolHistoryPage from './pages/SampleToolHistoryPage';

function Demo() {
  return <SampleToolHistoryPage />;
}
```

## Components Structure

- `ToolHistoryDashboard` - Main dashboard component
- `ToolTimeline` - Event timeline with filtering
- `AnalyticsCards` - Borrowing and repair analytics
- `UsabilityBadge` - Tool usability assessment display
- `PDFExportContent` - PDF export content renderer

## Mock Data

The component includes comprehensive mock data with:
- 4 sample tools with different statuses
- Complete event histories for each tool
- Various event types and edge cases (overdue returns, failed repairs, etc.)

## Dependencies

- React 18+
- Tailwind CSS for styling
- Lucide React for icons
- Moment.js for date formatting
- react-to-print for PDF export

## Routes

The sample page is available at `/tool-history` when integrated with the router.

## Demo Instructions

1. Select a tool from the dropdown (try "Hydraulic Jack" for complex repair history)
2. Use filters to view specific events or date ranges
3. Review analytics cards for insights
4. Click "Export PDF" to generate a report

## File Structure

```
src/
├── components/ToolHistory/
│   ├── ToolHistoryDashboard.tsx
│   ├── ToolTimeline.tsx
│   ├── AnalyticsCards.tsx
│   ├── UsabilityBadge.tsx
│   ├── PDFExportContent.tsx
│   └── index.ts
├── pages/
│   ├── SampleToolHistoryPage.tsx
│   └── ToolHistory/
├── services/
│   └── toolHistoryAPI.ts
├── types/
│   └── toolHistory.ts
└── hooks/
    └── usePDFExport.ts
```