import { Tool, ToolHistory, ToolHistoryEvent } from '../types/toolHistory';

// Mock tools data
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Impact Drill',
    model: 'DeWalt DCD996',
    serialNumber: 'DW001234',
    category: 'Power Tools',
    procurementPrice: 450.00,
    currentStatus: 'Available'
  },
  {
    id: '2',
    name: 'Digital Multimeter',
    model: 'Fluke 117',
    serialNumber: 'FL567890',
    category: 'Electrical Tools',
    procurementPrice: 280.00,
    currentStatus: 'Borrowed'
  },
  {
    id: '3',
    name: 'Hydraulic Jack',
    model: 'Craftsman 3-Ton',
    serialNumber: 'CR112233',
    category: 'Heavy Equipment',
    procurementPrice: 120.00,
    currentStatus: 'Under Repair'
  },
  {
    id: '4',
    name: 'Laser Level',
    model: 'Bosch GLL3-300',
    serialNumber: 'BS445566',
    category: 'Measuring Tools',
    procurementPrice: 350.00,
    currentStatus: 'Out of Service'
  },
  {
    id: '5',
    name: 'Angle Grinder',
    model: 'Makita GA4530R',
    serialNumber: 'MK778899',
    category: 'Power Tools',
    procurementPrice: 180.00,
    currentStatus: 'Available'
  },
  {
    id: '6',
    name: 'Torque Wrench',
    model: 'Snap-on TQR250E',
    serialNumber: 'SO334455',
    category: 'Hand Tools',
    procurementPrice: 520.00,
    currentStatus: 'Under Repair'
  },
  {
    id: '7',
    name: 'Oscilloscope',
    model: 'Tektronix TBS1052B',
    serialNumber: 'TEK123789',
    category: 'Testing Equipment',
    procurementPrice: 850.00,
    currentStatus: 'Available'
  },
  {
    id: '8',
    name: 'Pneumatic Compressor',
    model: 'Porter Cable C2002',
    serialNumber: 'PC445577',
    category: 'Pneumatic Tools',
    procurementPrice: 320.00,
    currentStatus: 'Out of Service'
  }
];

// Mock events data
const mockEvents: Record<string, ToolHistoryEvent[]> = {
  '1': [
    {
      id: 'e1',
      type: 'procurement',
      date: '2024-01-15T09:00:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2024-001',
        procurementPrice: 450.00,
        supplier: 'Tool Supply Co.'
      }
    },
    {
      id: 'e2',
      type: 'qc',
      date: '2024-01-16T14:30:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e3',
      type: 'borrowing',
      date: '2024-02-01T08:00:00Z',
      user: 'Mike Johnson',
      details: {
        borrower: 'Mike Johnson',
        project: 'Construction Site A'
      }
    },
    {
      id: 'e4',
      type: 'return',
      date: '2024-02-05T17:00:00Z',
      user: 'Mike Johnson',
      details: {
        returnCondition: 'Good',
        project: 'Construction Site A'
      }
    },
    {
      id: 'e5',
      type: 'borrowing',
      date: '2024-03-10T09:30:00Z',
      user: 'Sarah Davis',
      details: {
        borrower: 'Sarah Davis',
        project: 'Renovation Project B'
      }
    },
    {
      id: 'e6',
      type: 'return',
      date: '2024-03-15T16:45:00Z',
      user: 'Sarah Davis',
      details: {
        returnCondition: 'Minor wear',
        project: 'Renovation Project B'
      }
    },
    {
      id: 'e7',
      type: 'repair',
      date: '2024-04-01T10:00:00Z',
      user: 'Repair Technician',
      details: {
        repairNote: 'Replaced worn chuck',
        cost: 45.00,
        status: 'Pass'
      }
    }
  ],
  '2': [
    {
      id: 'e8',
      type: 'procurement',
      date: '2023-11-10T10:00:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2023-045',
        procurementPrice: 280.00,
        supplier: 'Electrical Supply Inc.'
      }
    },
    {
      id: 'e9',
      type: 'qc',
      date: '2023-11-11T11:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e10',
      type: 'borrowing',
      date: '2024-01-20T08:30:00Z',
      user: 'Alex Wilson',
      details: {
        borrower: 'Alex Wilson',
        project: 'Electrical Maintenance'
      }
    },
    {
      id: 'e11',
      type: 'return',
      date: '2024-01-25T18:00:00Z',
      user: 'Alex Wilson',
      details: {
        returnCondition: 'Excellent',
        project: 'Electrical Maintenance',
        overdueBy: 2
      }
    },
    {
      id: 'e12',
      type: 'borrowing',
      date: '2024-09-15T07:45:00Z',
      user: 'Emma Brown',
      details: {
        borrower: 'Emma Brown',
        project: 'Circuit Testing Phase 2'
      }
    }
  ],
  '3': [
    {
      id: 'e13',
      type: 'procurement',
      date: '2023-08-01T09:00:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2023-028',
        procurementPrice: 120.00,
        supplier: 'Heavy Equipment Ltd.'
      }
    },
    {
      id: 'e14',
      type: 'qc',
      date: '2023-08-02T14:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e15',
      type: 'borrowing',
      date: '2023-09-10T08:00:00Z',
      user: 'Tom Anderson',
      details: {
        borrower: 'Tom Anderson',
        project: 'Vehicle Maintenance'
      }
    },
    {
      id: 'e16',
      type: 'return',
      date: '2023-09-12T17:30:00Z',
      user: 'Tom Anderson',
      details: {
        returnCondition: 'Damaged - hydraulic leak',
        project: 'Vehicle Maintenance'
      }
    },
    {
      id: 'e17',
      type: 'repair',
      date: '2023-10-01T10:00:00Z',
      user: 'Repair Technician',
      details: {
        repairNote: 'Replaced hydraulic seals',
        cost: 85.00,
        status: 'Pass'
      }
    },
    {
      id: 'e18',
      type: 'borrowing',
      date: '2024-01-05T09:00:00Z',
      user: 'Lisa Garcia',
      details: {
        borrower: 'Lisa Garcia',
        project: 'Equipment Upgrade'
      }
    },
    {
      id: 'e19',
      type: 'return',
      date: '2024-01-08T16:00:00Z',
      user: 'Lisa Garcia',
      details: {
        returnCondition: 'Mechanical failure',
        project: 'Equipment Upgrade'
      }
    },
    {
      id: 'e20',
      type: 'repair',
      date: '2024-02-01T11:00:00Z',
      user: 'Repair Technician',
      details: {
        repairNote: 'Replaced pump assembly',
        cost: 95.00,
        status: 'Fail'
      }
    },
    {
      id: 'e21',
      type: 'repair',
      date: '2024-03-15T09:30:00Z',
      user: 'Senior Technician',
      details: {
        repairNote: 'Complete rebuild required',
        cost: 150.00,
        status: 'Fail'
      }
    },
    {
      id: 'e22',
      type: 'repair',
      date: '2024-05-01T10:00:00Z',
      user: 'External Repair Service',
      details: {
        repairNote: 'Professional overhaul',
        cost: 200.00,
        status: 'Pass'
      }
    }
  ],
  '4': [
    {
      id: 'e23',
      type: 'procurement',
      date: '2023-05-15T10:30:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2023-015',
        procurementPrice: 350.00,
        supplier: 'Precision Tools Corp.'
      }
    },
    {
      id: 'e24',
      type: 'qc',
      date: '2023-05-16T15:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e25',
      type: 'borrowing',
      date: '2023-07-01T08:00:00Z',
      user: 'David Lee',
      details: {
        borrower: 'David Lee',
        project: 'Foundation Survey'
      }
    },
    {
      id: 'e26',
      type: 'return',
      date: '2023-07-05T17:00:00Z',
      user: 'David Lee',
      details: {
        returnCondition: 'Damaged - dropped from height',
        project: 'Foundation Survey'
      }
    },
    {
      id: 'e27',
      type: 'repair',
      date: '2023-08-01T09:00:00Z',
      user: 'Repair Technician',
      details: {
        repairNote: 'Laser alignment calibration failed',
        cost: 120.00,
        status: 'Fail'
      }
    },
    {
      id: 'e28',
      type: 'repair',
      date: '2023-09-15T10:30:00Z',
      user: 'Specialist Technician',
      details: {
        repairNote: 'Attempted laser module replacement',
        cost: 180.00,
        status: 'Fail'
      }
    },
    {
      id: 'e29',
      type: 'eol',
      date: '2024-01-20T14:00:00Z',
      user: 'Asset Manager',
      details: {
        eolReason: 'Irreparable laser damage, exceeds 70% of procurement value in repair costs',
        status: 'Fail'
      }
    }
  ],
  '5': [
    // Angle Grinder - Moderate usage with successful repairs
    {
      id: 'e30',
      type: 'procurement',
      date: '2023-03-10T09:00:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2023-008',
        procurementPrice: 180.00,
        supplier: 'Power Tools Direct'
      }
    },
    {
      id: 'e31',
      type: 'qc',
      date: '2023-03-11T10:30:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e32',
      type: 'borrowing',
      date: '2023-04-15T08:00:00Z',
      user: 'Carlos Rodriguez',
      details: {
        borrower: 'Carlos Rodriguez',
        project: 'Metal Fabrication Workshop'
      }
    },
    {
      id: 'e33',
      type: 'return',
      date: '2023-04-18T17:30:00Z',
      user: 'Carlos Rodriguez',
      details: {
        returnCondition: 'Heavy wear on grinding wheel',
        project: 'Metal Fabrication Workshop'
      }
    },
    {
      id: 'e34',
      type: 'repair',
      date: '2023-05-01T09:00:00Z',
      user: 'Maintenance Team',
      details: {
        repairNote: 'Replaced grinding wheel and guard',
        cost: 25.00,
        status: 'Pass'
      }
    },
    {
      id: 'e35',
      type: 'borrowing',
      date: '2023-07-20T09:15:00Z',
      user: 'Jenny Wu',
      details: {
        borrower: 'Jenny Wu',
        project: 'Construction Site C'
      }
    },
    {
      id: 'e36',
      type: 'return',
      date: '2023-07-25T16:00:00Z',
      user: 'Jenny Wu',
      details: {
        returnCondition: 'Motor making unusual noise',
        project: 'Construction Site C'
      }
    },
    {
      id: 'e37',
      type: 'repair',
      date: '2023-08-05T11:00:00Z',
      user: 'Specialist Technician',
      details: {
        repairNote: 'Cleaned motor brushes and replaced bearings',
        cost: 40.00,
        status: 'Pass'
      }
    },
    {
      id: 'e38',
      type: 'qc',
      date: '2024-01-15T14:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e39',
      type: 'borrowing',
      date: '2024-08-10T08:30:00Z',
      user: 'Mark Thompson',
      details: {
        borrower: 'Mark Thompson',
        project: 'Equipment Maintenance'
      }
    },
    {
      id: 'e40',
      type: 'return',
      date: '2024-08-12T17:00:00Z',
      user: 'Mark Thompson',
      details: {
        returnCondition: 'Good condition',
        project: 'Equipment Maintenance'
      }
    }
  ],
  '6': [
    // Torque Wrench - High-value tool with precision issues
    {
      id: 'e41',
      type: 'procurement',
      date: '2022-11-01T10:00:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2022-067',
        procurementPrice: 520.00,
        supplier: 'Snap-on Industrial'
      }
    },
    {
      id: 'e42',
      type: 'qc',
      date: '2022-11-02T15:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e43',
      type: 'borrowing',
      date: '2023-01-10T08:00:00Z',
      user: 'Michael Chen',
      details: {
        borrower: 'Michael Chen',
        project: 'Engine Assembly Line'
      }
    },
    {
      id: 'e44',
      type: 'return',
      date: '2023-01-15T18:00:00Z',
      user: 'Michael Chen',
      details: {
        returnCondition: 'Calibration seems off',
        project: 'Engine Assembly Line'
      }
    },
    {
      id: 'e45',
      type: 'repair',
      date: '2023-02-01T10:00:00Z',
      user: 'Calibration Specialist',
      details: {
        repairNote: 'Recalibrated torque settings - precision restored',
        cost: 85.00,
        status: 'Pass'
      }
    },
    {
      id: 'e46',
      type: 'borrowing',
      date: '2023-06-20T09:00:00Z',
      user: 'Sarah Kim',
      details: {
        borrower: 'Sarah Kim',
        project: 'Aircraft Maintenance'
      }
    },
    {
      id: 'e47',
      type: 'return',
      date: '2023-06-25T17:30:00Z',
      user: 'Sarah Kim',
      details: {
        returnCondition: 'Ratchet mechanism sticking',
        project: 'Aircraft Maintenance'
      }
    },
    {
      id: 'e48',
      type: 'repair',
      date: '2023-07-10T11:30:00Z',
      user: 'Precision Tool Repair',
      details: {
        repairNote: 'Replaced ratchet mechanism - expensive part',
        cost: 180.00,
        status: 'Pass'
      }
    },
    {
      id: 'e49',
      type: 'borrowing',
      date: '2024-03-15T08:45:00Z',
      user: 'Robert Martinez',
      details: {
        borrower: 'Robert Martinez',
        project: 'Critical Assembly Project'
      }
    },
    {
      id: 'e50',
      type: 'return',
      date: '2024-03-20T16:15:00Z',
      user: 'Robert Martinez',
      details: {
        returnCondition: 'Accuracy inconsistent - readings vary',
        project: 'Critical Assembly Project'
      }
    },
    {
      id: 'e51',
      type: 'repair',
      date: '2024-04-01T09:00:00Z',
      user: 'Factory Authorized Service',
      details: {
        repairNote: 'Internal mechanism wear - attempted rebuild',
        cost: 220.00,
        status: 'Fail'
      }
    },
    {
      id: 'e52',
      type: 'qc',
      date: '2024-09-15T14:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Fail',
        qcResult: 'Fail'
      }
    }
  ],
  '7': [
    // Oscilloscope - High-value precision instrument, well maintained
    {
      id: 'e53',
      type: 'procurement',
      date: '2023-01-20T11:00:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2023-003',
        procurementPrice: 850.00,
        supplier: 'Tektronix Inc.'
      }
    },
    {
      id: 'e54',
      type: 'qc',
      date: '2023-01-21T16:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e55',
      type: 'borrowing',
      date: '2023-03-01T09:00:00Z',
      user: 'Dr. Amanda Foster',
      details: {
        borrower: 'Dr. Amanda Foster',
        project: 'Circuit Analysis Research'
      }
    },
    {
      id: 'e56',
      type: 'return',
      date: '2023-03-30T17:00:00Z',
      user: 'Dr. Amanda Foster',
      details: {
        returnCondition: 'Excellent - well cared for',
        project: 'Circuit Analysis Research'
      }
    },
    {
      id: 'e57',
      type: 'borrowing',
      date: '2023-08-15T08:30:00Z',
      user: 'Tech Support Team',
      details: {
        borrower: 'Tech Support Team',
        project: 'Product Development Testing'
      }
    },
    {
      id: 'e58',
      type: 'return',
      date: '2023-08-25T18:30:00Z',
      user: 'Tech Support Team',
      details: {
        returnCondition: 'Perfect working order',
        project: 'Product Development Testing'
      }
    },
    {
      id: 'e59',
      type: 'qc',
      date: '2024-01-15T15:30:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e60',
      type: 'borrowing',
      date: '2024-06-10T09:15:00Z',
      user: 'Engineering Team',
      details: {
        borrower: 'Engineering Team',
        project: 'Signal Integrity Analysis'
      }
    },
    {
      id: 'e61',
      type: 'return',
      date: '2024-06-20T16:45:00Z',
      user: 'Engineering Team',
      details: {
        returnCondition: 'Excellent condition',
        project: 'Signal Integrity Analysis'
      }
    }
  ],
  '8': [
    // Pneumatic Compressor - Multiple failures, safety concerns
    {
      id: 'e62',
      type: 'procurement',
      date: '2022-08-01T10:30:00Z',
      user: 'John Smith',
      details: {
        poNumber: 'PO-2022-042',
        procurementPrice: 320.00,
        supplier: 'Porter Cable Direct'
      }
    },
    {
      id: 'e63',
      type: 'qc',
      date: '2022-08-02T14:00:00Z',
      user: 'QC Team',
      details: {
        status: 'Pass',
        qcResult: 'Pass'
      }
    },
    {
      id: 'e64',
      type: 'borrowing',
      date: '2022-09-15T08:00:00Z',
      user: 'Workshop Team A',
      details: {
        borrower: 'Workshop Team A',
        project: 'Pneumatic Tools Operation'
      }
    },
    {
      id: 'e65',
      type: 'return',
      date: '2022-09-20T17:00:00Z',
      user: 'Workshop Team A',
      details: {
        returnCondition: 'Pressure regulator malfunctioning',
        project: 'Pneumatic Tools Operation'
      }
    },
    {
      id: 'e66',
      type: 'repair',
      date: '2022-10-01T10:00:00Z',
      user: 'Pneumatic Specialist',
      details: {
        repairNote: 'Replaced pressure regulator and safety valve',
        cost: 120.00,
        status: 'Pass'
      }
    },
    {
      id: 'e67',
      type: 'borrowing',
      date: '2023-01-10T09:00:00Z',
      user: 'Maintenance Crew',
      details: {
        borrower: 'Maintenance Crew',
        project: 'Facility Maintenance'
      }
    },
    {
      id: 'e68',
      type: 'return',
      date: '2023-01-15T16:30:00Z',
      user: 'Maintenance Crew',
      details: {
        returnCondition: 'Oil leak from compressor tank',
        project: 'Facility Maintenance'
      }
    },
    {
      id: 'e69',
      type: 'repair',
      date: '2023-02-01T11:00:00Z',
      user: 'Compressor Repair Co.',
      details: {
        repairNote: 'Tank seal replacement - major repair',
        cost: 150.00,
        status: 'Pass'
      }
    },
    {
      id: 'e70',
      type: 'borrowing',
      date: '2023-05-20T08:30:00Z',
      user: 'Production Line B',
      details: {
        borrower: 'Production Line B',
        project: 'Assembly Line Support'
      }
    },
    {
      id: 'e71',
      type: 'return',
      date: '2023-05-22T17:45:00Z',
      user: 'Production Line B',
      details: {
        returnCondition: 'Motor overheating - safety concern',
        project: 'Assembly Line Support'
      }
    },
    {
      id: 'e72',
      type: 'repair',
      date: '2023-06-10T09:30:00Z',
      user: 'Motor Specialists Inc.',
      details: {
        repairNote: 'Motor replacement required - critical failure',
        cost: 180.00,
        status: 'Fail'
      }
    },
    {
      id: 'e73',
      type: 'repair',
      date: '2023-08-15T10:00:00Z',
      user: 'Factory Authorized Repair',
      details: {
        repairNote: 'Complete motor rebuild attempted',
        cost: 200.00,
        status: 'Fail'
      }
    },
    {
      id: 'e74',
      type: 'eol',
      date: '2024-01-30T15:00:00Z',
      user: 'Safety Manager',
      details: {
        eolReason: 'Repeated motor failures pose safety risk - repair costs exceed tool value',
        status: 'Fail'
      }
    }
  ]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const toolHistoryAPI = {
  // Get all available tools for selection
  getTools: async (): Promise<Tool[]> => {
    await delay(300);
    return mockTools;
  },

  // Get tool history by tool ID
  getToolHistory: async (toolId: string): Promise<ToolHistory | null> => {
    await delay(500);
    
    const tool = mockTools.find(t => t.id === toolId);
    const events = mockEvents[toolId] || [];
    
    if (!tool) return null;
    
    return {
      tool,
      events: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  },

  // Search tools by name or model
  searchTools: async (query: string): Promise<Tool[]> => {
    await delay(200);
    
    const lowercaseQuery = query.toLowerCase();
    return mockTools.filter(tool => 
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.model.toLowerCase().includes(lowercaseQuery) ||
      tool.serialNumber.toLowerCase().includes(lowercaseQuery)
    );
  }
};