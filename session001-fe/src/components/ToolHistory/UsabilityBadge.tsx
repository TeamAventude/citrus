import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { UsabilityDecision } from '../../types/toolHistory';

interface UsabilityBadgeProps {
  decision: UsabilityDecision;
}

export const UsabilityBadge: React.FC<UsabilityBadgeProps> = ({ decision }) => {
  const getStatusIcon = () => {
    if (decision.status === 'Usable') {
      return <CheckCircle className="w-4 h-4" />;
    }
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getStatusClasses = () => {
    if (decision.status === 'Usable') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceClasses = () => {
    switch (decision.confidence) {
      case 'High':
        return 'bg-blue-100 text-blue-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Main Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-medium ${getStatusClasses()}`}>
        {getStatusIcon()}
        <span className="font-semibold">{decision.status}</span>
      </div>

      {/* Confidence Badge */}
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getConfidenceClasses()}`}>
        <Info className="w-3 h-3" />
        <span>{decision.confidence} Confidence</span>
      </div>

      {/* Reasons Tooltip/Details */}
      <div className="text-xs text-gray-600 max-w-xs">
        <div className="font-medium mb-1">Assessment based on:</div>
        <ul className="list-disc list-inside space-y-0.5">
          {decision.reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};