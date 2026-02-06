export enum RequestType {
  RENTAL = 'Aluguer',
  TRANSFER = 'Transfer'
}

export enum RequestStatus {
  PENDING = 'Aguarda confirmação',
  CONFIRMED = 'Confirmado',
  IN_PROGRESS = 'Em Curso',
  COMPLETED = 'Concluído',
  CANCELLED = 'Cancelado'
}

export interface VehicleRequest {
  id: string;
  createdAt: string;
  clientName: string;
  clientContact: string;
  requestType: RequestType;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string; // Or dropoff time for transfer
  vehicleGroup: string;
  assignedDriver?: string;
  assignedVehiclePlate?: string;
  operatorName: string; // The user registering the request
  status: RequestStatus;
  notes?: string;
  estimatedCost?: number;
}

export interface DashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  revenue: number;
}