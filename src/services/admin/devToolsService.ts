import { httpClient } from '@/services/http/httpClient';

export interface AdvanceBillingResult {
  advanced: number;
  skipped: number;
  errors: { tenant: string; error: string }[];
}

export interface GenerateOverageInvoicesResult {
  billed: number;
  skipped: number;
  errors: number;
}

export interface SeedTenantDataResult {
  tenantId: string;
  adminUser: { email: string; password: string; created: boolean };
  vehicles: { created: number; reused: number };
  drivers: { created: number; reused: number };
  warehouses: { created: number; reused: number };
  customers: { created: number; reused: number };
  ordersAppended: number;
  schedulesAppended: number;
  warnings: string[];
}

export interface PurgeTenantSeedDataResult {
  tenantId: string;
  tours: number;
  assignmentSuggestions: number;
  driverLocations: number;
  driverSchedules: number;
  orders: number;
  orderAddresses: number;
  deliveryPrestations: number;
  pricingConfigs: number;
  organizations: number;
  organizationAddresses: number;
  warehouses: number;
  vehicles: number;
  userTenants: number;
  users: number;
}

export interface DriverSimulationJob {
  id: string;
  tenantId: string;
  status: 'running' | 'stopped';
  startedAt: string;
  stoppedAt: string | null;
  lastTickAt: string | null;
  lastTickMessage: string | null;
}

export interface DriverSimulationStatusResult {
  job: DriverSimulationJob | null;
}

export interface DriverSimulationStartResult {
  jobId: string;
  alreadyRunning: boolean;
}

export interface DriverSimulationStopResult {
  stopped: boolean;
}

export interface DriverSimulationDeviationResult {
  driverName: string;
  tourId: string;
  liveRerouteEnabled: boolean;
  rerouteTriggered: boolean;
  position: { latitude: number; longitude: number };
}

export const devToolsService = {
  advanceBilling: (token: string) =>
    httpClient.post<AdvanceBillingResult>('/dev-tools/advance-billing', {}, { token }),
  generateOverageInvoices: (token: string) =>
    httpClient.post<GenerateOverageInvoicesResult>(
      '/dev-tools/generate-overage-invoices',
      {},
      { token },
    ),
  seedTenantData: (token: string, tenantId: string) =>
    httpClient.post<SeedTenantDataResult>(
      `/dev-tools/seed-tenant-data/${tenantId}`,
      {},
      { token },
    ),
  purgeTenantSeedData: (token: string, tenantId: string) =>
    httpClient.delete<PurgeTenantSeedDataResult>(
      `/dev-tools/seed-tenant-data/${tenantId}`,
      { token },
    ),
  getDriverSimulationStatus: (token: string, tenantId: string) =>
    httpClient.get<DriverSimulationStatusResult>(
      `/dev-tools/driver-simulation/${tenantId}`,
      { token },
    ),
  startDriverSimulation: (token: string, tenantId: string) =>
    httpClient.post<DriverSimulationStartResult>(
      `/dev-tools/driver-simulation/${tenantId}/start`,
      {},
      { token },
    ),
  stopDriverSimulation: (token: string, tenantId: string) =>
    httpClient.post<DriverSimulationStopResult>(
      `/dev-tools/driver-simulation/${tenantId}/stop`,
      {},
      { token },
    ),
  simulateDriverDeviation: (token: string, tenantId: string) =>
    httpClient.post<DriverSimulationDeviationResult>(
      `/dev-tools/driver-simulation/${tenantId}/deviate`,
      {},
      { token },
    ),
};
