import {EmergencyIncidentStatus, EmergencyIncidentType} from '../../services/driverApi';

export const INCIDENT_TYPE_OPTIONS: {value: EmergencyIncidentType; label: string}[] = [
  {value: 'accident', label: 'Accident or injury'},
  {value: 'medical', label: 'Medical emergency'},
  {value: 'harassment', label: 'Harassment or threat'},
  {value: 'theft', label: 'Theft or robbery'},
  {value: 'vehicle_breakdown', label: 'Vehicle breakdown'},
  {value: 'other', label: 'Other safety concern'},
];

const TYPE_LABELS: Record<EmergencyIncidentType, string> = {
  accident: 'Accident or injury',
  medical: 'Medical emergency',
  harassment: 'Harassment or threat',
  theft: 'Theft or robbery',
  vehicle_breakdown: 'Vehicle breakdown',
  other: 'Other safety concern',
};

const STATUS_LABELS: Record<EmergencyIncidentStatus, string> = {
  notified: 'Safety team notified',
  reviewing: 'Under review',
  follow_up_scheduled: 'Follow-up scheduled',
  resolved: 'Resolved',
};

export function incidentTypeLabel(type: EmergencyIncidentType): string {
  return TYPE_LABELS[type] ?? type;
}

export function incidentStatusLabel(status: EmergencyIncidentStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return `${d.toLocaleDateString([], {month: 'short', day: 'numeric'})}, ${d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
}

export function shortIncidentId(id: string): string {
  return id.length > 8 ? id.slice(-8).toUpperCase() : id.toUpperCase();
}
