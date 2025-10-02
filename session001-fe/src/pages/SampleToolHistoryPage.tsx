import React from 'react';
import { SimpleToolHistoryDashboard } from '../components/ToolHistory/SimpleToolHistoryDashboard';
import { 
  Wrench, 
  BarChart3, 
  Calendar, 
  Download,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const SampleToolHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tool History Dashboard Demo</h1>
              <p className="text-gray-600 mt-1">Complete tool lifecycle tracking and analytics</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Demo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Complete History</h3>
                <p className="text-sm text-gray-600">Track entire tool lifecycle</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Borrowing & repair insights</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Timeline View</h3>
                <p className="text-sm text-gray-600">Chronological events</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">PDF Export</h3>
                <p className="text-sm text-gray-600">Detailed reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use This Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Select a tool from the dropdown below to view its complete history</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Use filters to view specific event types or date ranges</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Review analytics cards for borrowing and repair insights</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Click "Export PDF" to download a detailed report</span>
            </div>
          </div>
        </div>

        {/* Sample Tools Overview */}
        <div className="bg-white rounded-lg p-4 border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Tools Available (8 Tools with Detailed Histories)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">Impact Drill</span>
              </div>
              <p className="text-xs text-gray-600">DeWalt DCD996 • Available</p>
              <p className="text-xs text-green-700">Usable - Good condition</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">Digital Multimeter</span>
              </div>
              <p className="text-xs text-gray-600">Fluke 117 • Borrowed</p>
              <p className="text-xs text-blue-700">Usable - Currently in use</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-sm">Hydraulic Jack</span>
              </div>
              <p className="text-xs text-gray-600">Craftsman 3-Ton • Under Repair</p>
              <p className="text-xs text-red-700">Not Usable - High repair costs</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-sm">Laser Level</span>
              </div>
              <p className="text-xs text-gray-600">Bosch GLL3-300 • Out of Service</p>
              <p className="text-xs text-red-700">Not Usable - End of life</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">Angle Grinder</span>
              </div>
              <p className="text-xs text-gray-600">Makita GA4530R • Available</p>
              <p className="text-xs text-green-700">Usable - Well maintained</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-sm">Torque Wrench</span>
              </div>
              <p className="text-xs text-gray-600">Snap-on TQR250E • Under Repair</p>
              <p className="text-xs text-red-700">Not Usable - Precision issues</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">Oscilloscope</span>
              </div>
              <p className="text-xs text-gray-600">Tektronix TBS1052B • Available</p>
              <p className="text-xs text-green-700">Usable - Excellent condition</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-sm">Pneumatic Compressor</span>
              </div>
              <p className="text-xs text-gray-600">Porter Cable C2002 • Out of Service</p>
              <p className="text-xs text-red-700">Not Usable - Safety concerns</p>
            </div>
          </div>

          {/* Detailed Examples */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🔍 Try These Examples for Detailed Analysis:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div>
                <strong>• Torque Wrench:</strong> High-value precision tool with calibration issues and expensive repairs
              </div>
              <div>
                <strong>• Pneumatic Compressor:</strong> Multiple safety failures and motor issues - clear EOL case
              </div>
              <div>
                <strong>• Angle Grinder:</strong> Moderate usage with successful repairs - good maintenance example
              </div>
              <div>
                <strong>• Oscilloscope:</strong> High-value equipment with excellent maintenance record
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Component */}
      <SimpleToolHistoryDashboard />
    </div>
  );
};

export default SampleToolHistoryPage;