import React from 'react';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  Wrench,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { BorrowingAnalytics, RepairAnalytics, Tool } from '../../types/toolHistory';
import moment from 'moment';

interface AnalyticsCardsProps {
  borrowingAnalytics: BorrowingAnalytics;
  repairAnalytics: RepairAnalytics;
  tool: Tool;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  borrowingAnalytics,
  repairAnalytics,
  tool
}) => {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Borrowing History Analytics */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Borrowing History</h3>
                <p className="text-sm text-gray-600">Usage and return patterns</p>
              </div>
            </div>
            {borrowingAnalytics.currentlyBorrowed && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Currently Borrowed
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Borrows */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Borrows</p>
                  <p className="text-2xl font-bold text-gray-900">{borrowingAnalytics.totalBorrows}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Overdue Count */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
                  <p className="text-2xl font-bold text-gray-900">{borrowingAnalytics.overdueCount}</p>
                </div>
                {borrowingAnalytics.overdueCount > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Average Borrow Duration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {borrowingAnalytics.averageBorrowDuration}
                    <span className="text-sm font-normal text-gray-600 ml-1">days</span>
                  </p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Last Borrowed */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Borrowed</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {borrowingAnalytics.lastBorrowedDate 
                      ? moment(borrowingAnalytics.lastBorrowedDate).fromNow()
                      : 'Never'
                    }
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Usage Status Indicator */}
          <div className="mt-4 p-3 rounded-lg border-l-4 border-green-400 bg-green-50">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {borrowingAnalytics.totalBorrows === 0 
                  ? 'Tool has never been borrowed'
                  : borrowingAnalytics.currentlyBorrowed
                    ? 'Tool is currently in use'
                    : `Last returned ${moment(borrowingAnalytics.lastBorrowedDate).fromNow()}`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Repair History Analytics */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Repair History</h3>
                <p className="text-sm text-gray-600">Maintenance and cost analysis</p>
              </div>
            </div>
            {repairAnalytics.lastRepairStatus && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                repairAnalytics.lastRepairStatus === 'Pass' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Last Repair: {repairAnalytics.lastRepairStatus}
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Repairs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Repairs</p>
                  <p className="text-2xl font-bold text-gray-900">{repairAnalytics.totalRepairs}</p>
                </div>
                <Wrench className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Cumulative Cost */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Repair Costs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(repairAnalytics.cumulativeRepairCost)}
                  </p>
                </div>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Cost to Value Ratio */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPercentage(repairAnalytics.repairToValueRatio)}
                  </p>
                  <p className="text-xs text-gray-500">of tool value</p>
                </div>
                {repairAnalytics.repairToValueRatio > 0.7 ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : repairAnalytics.repairToValueRatio > 0.5 ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Last Repair */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Repair</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {repairAnalytics.lastRepairDate 
                      ? moment(repairAnalytics.lastRepairDate).fromNow()
                      : 'Never'
                    }
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="mt-4 space-y-2">
            {/* Procurement Price Reference */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Original Tool Value:</span>
              <span className="font-medium text-gray-900">{formatCurrency(tool.procurementPrice)}</span>
            </div>
            
            {/* Cost Threshold Warning */}
            {repairAnalytics.repairToValueRatio > 0.5 && (
              <div className={`p-3 rounded-lg border-l-4 ${
                repairAnalytics.repairToValueRatio > 0.7 
                  ? 'border-red-400 bg-red-50'
                  : 'border-yellow-400 bg-yellow-50'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    repairAnalytics.repairToValueRatio > 0.7 ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    repairAnalytics.repairToValueRatio > 0.7 ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {repairAnalytics.repairToValueRatio > 0.7 
                      ? 'High repair costs - consider replacement'
                      : 'Moderate repair costs - monitor closely'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Success Indicator */}
            {repairAnalytics.totalRepairs === 0 && (
              <div className="p-3 rounded-lg border-l-4 border-green-400 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    No repairs needed - tool in excellent condition
                  </span>
                </div>
              </div>
            )}

            {repairAnalytics.totalRepairs > 0 && repairAnalytics.repairToValueRatio <= 0.3 && (
              <div className="p-3 rounded-lg border-l-4 border-green-400 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Low repair costs - tool well maintained
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};