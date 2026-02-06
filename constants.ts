import { RequestStatus, RequestType, VehicleRequest } from './types';

export const INITIAL_REQUESTS: VehicleRequest[] = [
  {
    id: 'REQ-001',
    createdAt: new Date().toISOString(),
    clientName: 'Empresa ABC Lda',
    clientContact: '912345678',
    requestType: RequestType.RENTAL,
    pickupLocation: 'Aeroporto',
    dropoffLocation: 'Aeroporto',
    pickupDate: '2026-02-10T10:00',
    returnDate: '2026-02-15T10:00',
    vehicleGroup: 'Grupo C (Compacto)',
    operatorName: 'João Silva',
    status: RequestStatus.PENDING,
    notes: 'Cliente VIP'
  },
  {
    id: 'REQ-002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    clientName: 'Hotel Solar',
    clientContact: '210000000',
    requestType: RequestType.TRANSFER,
    pickupLocation: 'Hotel Solar',
    dropoffLocation: 'Centro de Congressos',
    pickupDate: '2026-02-08T09:00',
    returnDate: '2026-02-08T09:45',
    vehicleGroup: 'Van 9 Lugares',
    assignedDriver: 'Carlos Motorista',
    operatorName: 'Ana Sousa',
    status: RequestStatus.CONFIRMED,
  }
];

export const STATUS_COLORS = {
  [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [RequestStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [RequestStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800 border-purple-200',
  [RequestStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [RequestStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
};