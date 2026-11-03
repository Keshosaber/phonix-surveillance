export interface Camera {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'recording';
  location: string;
  lastActive: Date;
}

export interface AIDetection {
  id: string;
  cameraId: string;
  type: 'person' | 'vehicle' | 'weapon' | 'intrusion' | 'fire' | 'other';
  confidence: number;
  timestamp: Date;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Alert {
  id: string;
  detectionId: string;
  cameraId: string;
  cameraName: string;
  type: AIDetection['type'];
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  description: string;
}

export interface DetectionSlot {
  id: string;
  name: string;
  enabled: boolean;
  filters: {
    types: AIDetection['type'][];
    minConfidence: number;
    cameras: string[];
  };
}

// Store data in memory (in production, use a database)
let cameras: Camera[] = [
  { id: 'cam1', name: 'Main Entrance', status: 'offline', location: 'Front Gate', lastActive: new Date() },
  { id: 'cam2', name: 'Parking Lot', status: 'offline', location: 'North Side', lastActive: new Date() },
  { id: 'cam3', name: 'Loading Dock', status: 'offline', location: 'Rear Entrance', lastActive: new Date() },
  { id: 'cam4', name: 'Server Room', status: 'offline', location: 'Building B', lastActive: new Date() },
];

let alerts: Alert[] = [];
let detectionSlots: DetectionSlot[] = [
  {
    id: 'slot1',
    name: 'Perimeter Security',
    enabled: false,
    filters: {
      types: ['person', 'intrusion'],
      minConfidence: 0.7,
      cameras: ['cam1', 'cam2'],
    },
  },
  {
    id: 'slot2',
    name: 'Vehicle Detection',
    enabled: false,
    filters: {
      types: ['vehicle'],
      minConfidence: 0.8,
      cameras: ['cam2'],
    },
  },
  {
    id: 'slot3',
    name: 'Critical Alert',
    enabled: false,
    filters: {
      types: ['weapon', 'fire'],
      minConfidence: 0.6,
      cameras: ['cam1', 'cam2', 'cam3', 'cam4'],
    },
  },
];

export function getCameras(): Camera[] {
  return cameras;
}

export function getAlerts(): Alert[] {
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getDetectionSlots(): DetectionSlot[] {
  return detectionSlots;
}

export function addAlert(alert: Omit<Alert, 'id'>): Alert {
  const newAlert: Alert = {
    ...alert,
    id: crypto.randomUUID(),
  };
  alerts.push(newAlert);
  return newAlert;
}

export function acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
  const alert = alerts.find((a) => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();
  }
}

export function updateDetectionSlot(slotId: string, updates: Partial<DetectionSlot>): void {
  const slot = detectionSlots.find((s) => s.id === slotId);
  if (slot) {
    Object.assign(slot, updates);
  }
}

export function getUnacknowledgedAlerts(): Alert[] {
  return alerts.filter((a) => !a.acknowledged);
}

export function getCriticalAlerts(): Alert[] {
  return alerts.filter((a) => a.severity === 'critical' && !a.acknowledged);
}
